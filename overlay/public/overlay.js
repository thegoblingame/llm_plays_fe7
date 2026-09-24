/*
 * Renders whatever the server last knew. Deliberately dumb: no state of its own
 * beyond "what did I draw last time", so a reconnect repaints correctly.
 *
 * EventSource reconnects on its own, and we keep the last painted frame on
 * screen when the connection drops. A frozen panel reads as fine on stream; a
 * panel that blanks reads as broken.
 */

const el = {
  chapterNum: document.getElementById("chapter-num"),
  chapterTitle: document.getElementById("chapter-title"),
  roster: document.getElementById("roster"),
  feed: document.getElementById("feed"),
};

// ------------------------------------------------------------ chapter

function renderChapter(ch) {
  const num = ch?.num;
  el.chapterNum.textContent = num ? "Chapter " + num : "Chapter";
  el.chapterTitle.textContent = ch?.title || "—";
}

// ------------------------------------------------------------ roster

function hpClass(ratio) {
  if (ratio <= 0.25) return "bad";
  if (ratio <= 0.5) return "warn";
  return "";
}

function portraitNode(unit) {
  if (unit.portrait) {
    const img = document.createElement("img");
    img.className = "portrait";
    img.src = "/portraits/" + unit.portrait;
    img.alt = unit.name;
    // No portrait file yet: fall back rather than showing a broken image.
    img.addEventListener(
      "error",
      () => img.replaceWith(placeholderNode(unit)),
      { once: true },
    );
    return img;
  }
  return placeholderNode(unit);
}

function placeholderNode(unit) {
  const div = document.createElement("div");
  div.className = "portrait placeholder";
  const named = unit.name && !unit.name.startsWith("cls");
  div.textContent = named ? unit.name.slice(0, 2) : unit.cls;
  div.title = "cls" + unit.cls;
  return div;
}

/*
 * Shrink the rows just enough that the whole army fits the column.
 *
 * The roster owns a fixed-height column, so its height does not depend on what
 * we put in it and there is no feedback loop: measure once after rendering,
 * work out how much room each row may have, and scale the portrait and the type
 * to match. Nothing shrinks while the army still fits -- with 80px portraits
 * that means no change until about twelve units, and the threshold moves on its
 * own if --portrait-size changes.
 */
const MIN_PORTRAIT = 24; // below this a face is not worth drawing
const MIN_SCALE = 0.6; // below this the names stop being readable on stream

function fitRoster(count) {
  if (!count) return;
  const cs = getComputedStyle(el.roster);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const gap = parseFloat(cs.rowGap) || 0;
  const avail = el.roster.clientHeight - padY - gap * (count - 1);
  if (!(avail > 0)) return;

  const base =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--portrait-size"),
    ) || 80;

  // .unit's own vertical padding, which every row pays on top of its content.
  const rowPad = 6;
  const perRow = avail / count - rowPad;

  const portrait = Math.max(MIN_PORTRAIT, Math.min(base, Math.floor(perRow)));
  const scale = Math.max(MIN_SCALE, Math.min(1, portrait / base));

  el.roster.style.setProperty("--portrait-size", portrait + "px");
  el.roster.style.setProperty("--row-scale", scale.toFixed(3));
}

function renderRoster(units) {
  el.roster.replaceChildren();

  if (!units || !units.length) {
    el.roster.style.removeProperty("--portrait-size");
    el.roster.style.removeProperty("--row-scale");
    const p = document.createElement("div");
    p.className = "empty";
    p.textContent = "waiting for the next fe7_state…";
    el.roster.append(p);
    return;
  }

  for (const u of units) {
    const row = document.createElement("div");
    row.className = "unit";

    const body = document.createElement("div");
    body.className = "unit-body";

    const name = document.createElement("span");
    name.className = "unit-name";
    name.textContent = u.name;

    const lv = document.createElement("span");
    lv.className = "unit-lv";
    lv.textContent = u.level == null ? "" : "Lv " + u.level;

    const track = document.createElement("div");
    track.className = "hp-track";

    const ratio = u.maxHp > 0 ? Math.max(0, Math.min(1, u.hp / u.maxHp)) : 0;
    const fill = document.createElement("div");
    fill.className = "hp-fill " + hpClass(ratio);
    fill.style.width = (ratio * 100).toFixed(1) + "%";

    const num = document.createElement("span");
    num.className = "hp-num";
    num.textContent = u.hp + "/" + u.maxHp;

    track.append(fill, num);

    body.append(name, lv, track);
    row.append(portraitNode(u), body);
    el.roster.append(row);
  }

  fitRoster(units.length);
}

// ------------------------------------------------------------ feed

let drawnIds = [];

function renderFeed(feed) {
  const items = feed || [];
  const ids = items.map((f) => f.id);
  // Repainting identical content would restart the arrival animation every push.
  if (ids.length === drawnIds.length && ids.every((v, i) => v === drawnIds[i]))
    return;
  drawnIds = ids;

  el.feed.replaceChildren();
  items.forEach((f, i) => {
    const age = items.length - 1 - i;
    const div = document.createElement("div");
    div.className = "line age-" + Math.min(age, 9);
    if (age === 0) div.classList.add("newest");
    if (f.tool === "fe7_end_turn") div.classList.add("end-turn");
    div.textContent = f.text;
    el.feed.append(div);
  });
}

// ------------------------------------------------------------ wiring

function render(state) {
  renderChapter(state.chapter);
  renderRoster(state.units);
  renderFeed(state.feed);
}

function connect() {
  const src = new EventSource("/events");
  src.addEventListener("message", (e) => {
    try {
      render(JSON.parse(e.data));
    } catch (err) {
      console.error("bad frame", err);
    }
  });
  // EventSource retries by itself; the last painted frame stays up meanwhile.
  src.addEventListener("error", () => {});
}

// ?preview paints a dark backdrop so the layout is visible outside OBS.
if (location.search.includes("preview")) document.body.classList.add("preview");

// ?once renders a single snapshot and holds no connection, so a headless
// screenshot terminates instead of waiting on the stream forever.
if (location.search.includes("once")) {
  fetch("/state")
    .then((r) => r.json())
    .then(render)
    .catch((e) => console.error(e));
} else {
  connect();
}

