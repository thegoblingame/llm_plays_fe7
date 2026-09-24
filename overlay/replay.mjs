#!/usr/bin/env node
/**
 * Replays a recorded run log so the overlay can be built and tuned without the
 * emulator, without OBS and without a live session. Twelve real chapters are
 * already on disk in runs/, which is far better test data than anything faked.
 *
 *   # terminal 1
 *   OVERLAY_RUNS_DIR=overlay/.replay node overlay/server.mjs
 *   # terminal 2
 *   node overlay/replay.mjs                       newest log, 20x speed
 *   node overlay/replay.mjs runs/....jsonl 50     a specific log, faster
 *
 * It writes into overlay/.replay/ rather than runs/, so a rehearsal never leaves
 * a fake run log behind for the backlog triage to trip over.
 */
import { readdir, readFile, stat, mkdir, writeFile, appendFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const OUT_DIR = join(HERE, ".replay");
const OUT_FILE = join(OUT_DIR, "playthrough-replay.jsonl");

const MAX_GAP_MS = 2500; // a long think or a slow enemy phase should not stall the rehearsal

async function newestLog() {
  const dir = join(ROOT, "runs");
  const files = (await readdir(dir)).filter((f) => /^playthrough-.*\.jsonl$/.test(f));
  if (!files.length) throw new Error("no playthrough logs in " + dir);
  const stamped = await Promise.all(
    files.map(async (f) => ({ f, mtime: (await stat(join(dir, f))).mtimeMs })),
  );
  stamped.sort((a, b) => b.mtime - a.mtime);
  return join(dir, stamped[0].f);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const src = process.argv[2] ? resolve(process.argv[2]) : await newestLog();
const speed = Number(process.argv[3] || 20);

const lines = (await readFile(src, "utf8")).split("\n").filter((l) => l.trim());
await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_FILE, "");

console.log("replaying " + lines.length + " records from " + src);
console.log("  at " + speed + "x into " + OUT_FILE);
console.log("  server must be running with OVERLAY_RUNS_DIR=" + OUT_DIR);

let prev = null;
for (let i = 0; i < lines.length; i++) {
  let rec = null;
  try {
    rec = JSON.parse(lines[i]);
  } catch {
    /* pass the malformed line through anyway -- the server has to survive them */
  }
  const t = rec?.t ? new Date(rec.t).getTime() : null;
  if (prev != null && t != null) {
    await sleep(Math.min(Math.max(t - prev, 0) / speed, MAX_GAP_MS));
  }
  if (t != null) prev = t;

  await appendFile(OUT_FILE, lines[i] + "\n");
  if ((i + 1) % 25 === 0) console.log("  " + (i + 1) + "/" + lines.length);
}

console.log("done.");
