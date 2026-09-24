#!/usr/bin/env node
/**
 * Stream overlay server for the FE7 playthrough.
 *
 * Reads two things the run already writes, and writes nothing itself:
 *   runs/playthrough-<date>-<tag>.jsonl     every fe7_* call, appended per call
 *   playthrough/states/<s>_ch<N>_<slug>.ss  named for the chapter being played
 *
 * It is a pure reader. It cannot touch the emulator, the MCP server or the agent,
 * which is the point: a 40-minute chapter is not worth risking for an overlay.
 *
 *   node overlay/server.mjs          then point an OBS Browser Source at :8777
 *   OVERLAY_PORT=9000 node ...       to move it
 */
import { createServer } from "node:http";
import { readdir, readFile, stat, open } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE); // llm_plays_fe7
// OVERLAY_RUNS_DIR points the tailer somewhere else; replay.mjs uses it so a
// rehearsal never drops a fake run log into runs/, which gets triaged for real.
const RUNS_DIR = process.env.OVERLAY_RUNS_DIR
  ? process.env.OVERLAY_RUNS_DIR
  : join(ROOT, "runs");
const STATES_DIR = join(ROOT, "playthrough", "states");
const PUBLIC_DIR = join(HERE, "public");
const OVERRIDE_FILE = join(HERE, "chapter-override.txt");
const PORT = Number(process.env.OVERLAY_PORT || 8777);

const POLL_MS = 250; // how often to check the log for new bytes
const RESCAN_MS = 2000; // how often to look for a newer log file
const FEED_MAX = 10; // reason lines kept on screen

// ---------------------------------------------------------------- state

const state = {
  chapter: { num: null, title: null },
  units: [], // { slot, roster, cls, name, portrait, level, hp, maxHp }
  feed: [], // { id, t, tool, text }
  source: null, // which log file we are tailing
  lastEventAt: null, // ISO time of the newest log record seen
};

let names = { byClass: {}, bySlot: {} };
let feedSeq = 0;
let dirty = false;

async function loadNames() {
  try {
    const raw = JSON.parse(await readFile(join(HERE, "names.json"), "utf8"));
    names = { byClass: raw.byClass || {}, bySlot: raw.bySlot || {} };
  } catch (e) {
    console.warn("names.json unreadable, falling back to class IDs:", e.message);
  }
}

/** Identity is keyed on class, with a per-slot escape hatch. See names.json. */
function identify(slot, cls) {
  return (
    names.bySlot?.[String(slot)] ||
    names.byClass?.[cls] || { name: "cls" + cls, portrait: null }
  );
}

// ---------------------------------------------------------------- parsing
//
// Four shapes carry player HP. fe7_state is authoritative once a turn; the other
// three are what keeps the bars moving during a four-minute enemy phase.

// #0 r01 cls02 Lv8 (4,3) HP21/21 S5 ...   (full)
// #0 r01 cls02 (4,3) 21/21                (brief: no Lv, no HP prefix)
const UNIT_RE =
  /^\s*#(\d+)\s+r([0-9A-Fa-f]{2})\s+cls([0-9A-Fa-f]{2})(?:\s+Lv(\d+))?\s+\(\d+,\d+\)\s+(?:HP)?(\d+)\/(\d+)/;

/** The PLAYERS block of an fe7_state dump: a full, authoritative roster. */
function applyPlayersBlock(text) {
  const start = text.indexOf("PLAYERS:");
  if (start < 0) return false;
  const rest = text.slice(start + "PLAYERS:".length);
  const end = rest.search(/^(?:ENEMIES|GREEN):/m);
  const block = end < 0 ? rest : rest.slice(0, end);

  const units = [];
  for (const line of block.split("\n")) {
    const m = UNIT_RE.exec(line);
    if (!m) continue;
    const slot = Number(m[1]);
    const cls = m[3].toUpperCase();
    const prev = state.units.find((u) => u.slot === slot);
    const id = identify(slot, cls);
    units.push({
      slot,
      roster: m[2].toUpperCase(),
      cls,
      name: id.name,
      portrait: id.portrait,
      // brief mode omits the level; keep the last one we knew rather than blanking it
      level: m[4] ? Number(m[4]) : prev?.level ?? null,
      hp: Number(m[5]),
      maxHp: Number(m[6]),
    });
  }
  if (!units.length) return false;
  state.units = units;
  return true;
}

/**
 * The summary block shared by fe7_wait and fe7_end_turn:
 *
 *   players 9 alive, FALLEN: #3 cls32; enemies 11; green 0
 *   wounded: #0 10/19, #22 5/18
 *
 * "wounded" lists every deployed survivor below full HP, so anyone alive and NOT
 * listed is at full, which makes this a complete refresh rather than a patch.
 */
function applySummary(text) {
  const head = /players\s+(\d+)\s+alive(?:,\s*FALLEN:\s*([^;\n]*))?;/.exec(text);
  if (!head) return false;

  const fallen = new Set();
  if (head[2]) for (const m of head[2].matchAll(/#(\d+)/g)) fallen.add(Number(m[1]));
  if (fallen.size) state.units = state.units.filter((u) => !fallen.has(u.slot));

  const wounded = /^wounded:\s*(.+)$/m.exec(text);
  const hurt = new Map();
  if (wounded) {
    for (const m of wounded[1].matchAll(/#(\d+)\s+(\d+)\/(\d+)/g)) {
      hurt.set(Number(m[1]), { hp: Number(m[2]), maxHp: Number(m[3]) });
    }
  }
  for (const u of state.units) {
    const h = hurt.get(u.slot);
    if (h) {
      u.hp = h.hp;
      u.maxHp = h.maxHp;
    } else {
      u.hp = u.maxHp;
    }
  }
  return true;
}

/** "HP: player #0 cls03 15->10 (-5)" inside a fe7_wait report. Enemies are skipped. */
function applyHpDeltas(text) {
  let hit = false;
  for (const m of text.matchAll(/player\s+#(\d+)\s+cls[0-9A-Fa-f]{2}\s+(\d+)->(\d+)/g)) {
    const u = state.units.find((x) => x.slot === Number(m[1]));
    if (u) {
      u.hp = Number(m[3]);
      hit = true;
    }
  }
  return hit;
}

/** "Unit #6 attacked from (4,10). ... Self: HP 20/20" -- the actor's HP after acting. */
function applyActSelf(text) {
  const m = /Unit\s+#(\d+)\b[\s\S]{0,400}?Self:\s*HP\s*(\d+)\/(\d+)/.exec(text);
  if (!m) return false;
  const u = state.units.find((x) => x.slot === Number(m[1]));
  if (!u) return false;
  u.hp = Number(m[2]);
  u.maxHp = Number(m[3]);
  return true;
}

function pushFeed(t, tool, text) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (!clean) return;
  const last = state.feed[state.feed.length - 1];
  if (last && last.text === clean) return; // a retried call repeats its reason
  state.feed.push({ id: ++feedSeq, t, tool, text: clean });
  if (state.feed.length > FEED_MAX) state.feed.splice(0, state.feed.length - FEED_MAX);
}

/** One line of the run log. Anything unrecognised is ignored on purpose. */
function ingest(rec) {
  if (!rec || typeof rec !== "object") return;
  if (rec.t) state.lastEventAt = rec.t;

  if (rec.params?.reason && (rec.tool === "fe7_act" || rec.tool === "fe7_end_turn")) {
    pushFeed(rec.t, rec.tool, rec.params.reason);
    dirty = true;
  }

  const result = typeof rec.result === "string" ? rec.result : null;
  if (result) {
    // A full roster wins; otherwise take whatever the result can tell us.
    if (applyPlayersBlock(result)) dirty = true;
    else if (applySummary(result)) dirty = true;
    if (applyHpDeltas(result)) dirty = true;
    if (applyActSelf(result)) dirty = true;
  }
}

// ---------------------------------------------------------------- chapter

function titleCase(slug) {
  const small = new Set(["of", "the", "a", "an", "in", "and", "to", "from"]);
  return slug
    .split("-")
    .filter(Boolean)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function setChapter(num, title) {
  if (state.chapter.num === num && state.chapter.title === title) return;
  state.chapter = { num, title };
  dirty = true;
}

/**
 * The newest save state names the chapter being played right now: the runbook has
 * the agent save only AFTER pressing into the next chapter, as
 * <session>_ch<N>_<slug>.ss. No OCR and no memory read, since RAM.md has no
 * chapter ID. chapter-override.txt ("10: The Distant Plains") wins if present,
 * which is how you fix a slug that lost an apostrophe.
 */
async function refreshChapter() {
  if (existsSync(OVERRIDE_FILE)) {
    try {
      const raw = (await readFile(OVERRIDE_FILE, "utf8")).trim();
      const m = /^([^:]+):\s*(.+)$/.exec(raw);
      if (m) {
        setChapter(m[1].trim(), m[2].trim());
        return;
      }
    } catch {
      /* fall through to the state files */
    }
  }
  try {
    const files = (await readdir(STATES_DIR)).filter((f) => f.endsWith(".ss"));
    if (!files.length) return;
    const stamped = await Promise.all(
      files.map(async (f) => ({ f, mtime: (await stat(join(STATES_DIR, f))).mtimeMs })),
    );
    stamped.sort((a, b) => b.mtime - a.mtime);
    // s12_ch10_the-distant-plains.ss -> 10 / The Distant Plains  (ch07x stays 7x)
    const m = /^s\d+_ch(\d+x?)_(.+)\.ss$/i.exec(stamped[0].f);
    if (m) setChapter(m[1].replace(/^0+(?=\d)/, ""), titleCase(m[2]));
  } catch {
    /* states/ may not exist yet on a fresh clone */
  }
}

// ---------------------------------------------------------------- tailing

let current = null; // { path, offset, buffer }

async function newestLog() {
  try {
    const files = (await readdir(RUNS_DIR)).filter((f) => /^playthrough-.*\.jsonl$/.test(f));
    if (!files.length) return null;
    const stamped = await Promise.all(
      files.map(async (f) => ({ f, mtime: (await stat(join(RUNS_DIR, f))).mtimeMs })),
    );
    stamped.sort((a, b) => b.mtime - a.mtime);
    return join(RUNS_DIR, stamped[0].f);
  } catch {
    return null;
  }
}

/**
 * Attach to a log and replay it from the top, so starting the overlay mid-chapter
 * shows the chapter already in progress rather than an empty panel.
 */
function attach(path) {
  console.log("tailing " + path);
  current = { path, offset: 0, buffer: "" };
  state.source = path;
  state.units = [];
  state.feed = [];
  dirty = true;
}

async function pump() {
  if (!current) return;
  let size;
  try {
    size = (await stat(current.path)).size;
  } catch {
    return;
  }

  if (size < current.offset) {
    current.offset = 0;
    current.buffer = "";
  }
  if (size === current.offset) return;

  const fh = await open(current.path, "r");
  try {
    const len = size - current.offset;
    const buf = Buffer.alloc(len);
    await fh.read(buf, 0, len, current.offset);
    current.offset = size;
    current.buffer += buf.toString("utf8");
  } finally {
    await fh.close();
  }

  const lines = current.buffer.split("\n");
  current.buffer = lines.pop() ?? ""; // keep the partial trailing line
  for (const line of lines) {
    const s = line.trim();
    if (!s) continue;
    try {
      ingest(JSON.parse(s));
    } catch {
      /* a half-flushed line; the next pass picks it up */
    }
  }
}

async function rescan() {
  const newest = await newestLog();
  if (newest && newest !== current?.path) attach(newest);
  await refreshChapter();
}

// ---------------------------------------------------------------- serving

const clients = new Set();

function broadcast() {
  const payload = "data: " + JSON.stringify(state) + "\n\n";
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      clients.delete(res);
    }
  }
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("data: " + JSON.stringify(state) + "\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  // One-shot snapshot. Handy for debugging, and it lets the page render without
  // holding a stream open, which is what ?once uses.
  if (url.pathname === "/state") {
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(state));
    return;
  }

  // Everything else comes from public/. No traversal: resolve, then check the prefix.
  const rel = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const file = join(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end("no");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});

await loadNames();
await rescan();
await pump();

setInterval(() => {
  pump().catch(() => {});
}, POLL_MS);
setInterval(() => {
  rescan().catch(() => {});
}, RESCAN_MS);
setInterval(() => {
  if (dirty) {
    dirty = false;
    broadcast();
  }
}, POLL_MS);

server.listen(PORT, "127.0.0.1", () => {
  console.log("overlay on http://localhost:" + PORT + "  (point an OBS Browser Source at it)");
  console.log("watching " + RUNS_DIR);
});
