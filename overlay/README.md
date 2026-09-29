# Stream overlay

Two strips down the edges of the Twitch stream, with the mGBA capture in the gap between
them. The left strip carries a feed of the agent's stated reasons for what it is doing, with a
milk carton (`public/milk.png`) in the bottom corner listing the units the agent failed to
recruit; the right strip carries the roster with levels and HP. A gravestone (`public/rip.png`)
sits bottom-middle over the game capture and lists the units that have died.

**It only reads.** It tails files the run already writes and never touches the emulator, the
MCP server, the agent or the game. It cannot break a run; if it crashes, OBS shows a
transparent layer and the stream carries on.

```
node overlay/server.mjs
```

Then point an OBS **Browser Source** at `http://localhost:8777`. Set `OVERLAY_PORT` to move
it. The same URL opens in a normal browser, which is the easy way to tune the CSS.

---

## Where each thing on screen comes from

| Panel | Source |
|---|---|
| Unrecruited units (on the milk carton), dead units (on the gravestone) | `roster.json` at the top of the playthrough folder, `{ "dead": [...], "unrecruited": [...] }`, names as strings. The agent appends to it at the end of every chapter (the runbook's "Ending the session" says how). Re-read every two seconds, so a hand edit shows up at once. Names resolve to portraits through `names.json`, falling back to `<name>.png`. Two columns on the carton, two rows on the stone, both filled left to right in the order written, shrinking to fit like the roster does. |
| Milk carton, gravestone | `public/milk.png` and `public/rip.png`, drawn as backgrounds. Sized by `--milk-width` and `--rip-width` in `overlay.css`; the `--milk-grid-*` and `--rip-grid-*` variables say where on each image the tiles sit. |
| Chapter number and title | **No longer drawn.** The server still works it out (newest filename in `states/` of the newest playthrough folder, or `chapter-override.txt`) and ships it in `/state` as `chapter`, but nothing on the page reads it. |
| Roster: name, level, HP | The `PLAYERS:` block of `fe7_state`, plus three narrower sources that keep the bars moving between full reads: the `wounded:` line and the `HP: player #N ... 15->10` deltas in `fe7_wait`, and `Self: HP 20/20` in an `fe7_act` result. |
| Reason feed | The `reason` parameter of `fe7_act` and `fe7_end_turn`, which both require it and refuse to press anything without it. Last 10, newest at the bottom. |

Everything is read from the newest `runs/playthrough-*.jsonl` in that playthrough folder, which the MCP server appends
to per call with `appendFile` — so each line hits disk the moment a tool returns. The server
re-scans every two seconds for a newer log, which is how it follows the chain onto the next
chapter when `run.sh` starts a new session.

Starting the overlay mid-chapter is fine: it replays the current log from the top, so the
panels come up populated rather than blank.

---

## Portraits

Drop PNGs into `public/portraits/`, named to match `names.json` (`lyn.png`, `kent.png`, …).
A file that is not there falls back to a placeholder tile, so you can add them one at a time.

Each one is drawn into a `--portrait-size` box with `object-fit: contain`: aspect ratio is
kept, nothing is cropped, and the files do **not** have to share dimensions. They did once
render at native size, which broke as soon as a portrait turned out to be 122x103 instead of
54x54 — that one row grew and pushed its HP bar off the edge of the strip. A transparent
background is still worth having; `lyn.png` is currently RGB with no alpha, which is fine
against a dark panel but will show its corners if the panel ever lightens.

### Names are keyed by character ID

Each PLAYERS line of `fe7_state` carries `chNN`, the unit's **character ID** — the index of its
entry in the ROM character table, `(charPtr - 0x08BDCE18) / 0x34`. It is the one identifier
that survives everything: promotion changes `clsNN` (Wallace went `cls14` → `cls16` in
Ch.10), and a death compacts the array so `rNN` shifts (`r02` was Sain in Ch.3 and Kent from
Ch.9 on). `names.json`'s `byChar` block maps every playable character's ID to a name and
portrait file, filled from the public FE7 character table and spot-checked against the ROM.

Two things worth knowing:

- **Some characters have two IDs**, one for Lyn's tale and one for the main game: Lyn is
  `03` and `2D`, Kent `17` and `2F`, Sain `18` and `30`, Wil `0D` and `2E`, Florina `1D` and
  `31`, Rath `1C` and `32`, and Nils gets a third (`29`) for the final chapter. All are listed.
- **Logs written before 2026-09-27 have no `chNN`.** For those the server falls back to the
  old `byClass` block, which is unique per character in Lyn's tale only, with `bySlot` as a
  per-slot override. Both blocks stay in `names.json` for that reason; nothing new needs adding
  to them.

A unit whose ID is missing from `byChar` shows up as `chNN` with a placeholder tile, which is
the cue to add it.

---

## Building and tuning it without a live run

Recorded chapters live in each playthrough folder's `runs/` (older ones in `archive/old_logs/`), which is better test data than anything faked.
`replay.mjs` feeds one through the same code path at whatever speed you like:

```
# terminal 1
OVERLAY_RUNS_DIR=overlay/.replay node overlay/server.mjs
# terminal 2
node overlay/replay.mjs                              # newest log, 20x
node overlay/replay.mjs playthroughs/<dir>/runs/....-s13.jsonl 50   # a specific log, faster
```

It writes into `overlay/.replay/` rather than a playthrough's `runs/`, so a rehearsal never leaves a fake run
log behind for the backlog triage to trip over.

---

## OBS

Canvas 1920×1080, two sources:

| Layer | Source | Notes |
|---|---|---|
| Top | Browser Source → `http://localhost:8777` | Width 1920, height 1080, positioned at 0,0 |
| Bottom | Window Capture → mGBA | Crop filter to trim the title bar and menu, then placed in the gap between the two strips |

Making the browser source the full canvas means page coordinates are stream coordinates: all
layout lives in the CSS and you never have to drag anything in OBS again.

**The capture has to sit exactly in the gap between the strips**, or it covers a panel. The
gap is `1920 - 2 * --col-width` wide. At the current 250px a side that is 1420x1080.

A GBA screen is 3:2, so filling 1080px of height wants 1620px of width, which does not fit in
1420. Worth knowing: **at `--col-width: 240px` the gap is exactly 1440x1080**, and a 1440x960
capture is a pixel-clean 6x GBA window — centre it vertically at y=60. Ten pixels narrower per
strip buys integer scaling, which is the difference between crisp sprites and shimmering ones.

Two settings worth knowing:

- **Uncheck "Shutdown source when not visible"**, or the overlay reconnects from scratch on
  every scene switch.
- **Check "Refresh browser when scene becomes active"** while you are editing the CSS.
  Chromium caches hard and you will otherwise swear your changes are not applying.

---

## Other knobs

- `chapter-override.txt` — create it next to `server.mjs` containing e.g.
  `10: The Distant Plains` and it wins over the filename-derived title. This is how you fix a
  slug that lost an apostrophe (`in-occupations-shadow` → `In Occupation's Shadow`), or set
  the chapter by hand if a session died before saving a state.
- `FEED_MAX` in `server.mjs` — how many reason lines stay on screen (10).
- `--col-width`, `--pad` and `--gap` at the top of `overlay.css` — the strip's width, its
  outer padding and the space between the three panels (50px).
- The roster is one column, sized by its contents, so it grows and shrinks with the number of
  units on the map. The feed sits just above the milk carton and grows upward.
- `--milk-width` and `--rip-width` — the two decorations, each keeping its own aspect ratio.
  The carton is the bottom item of the left strip, so the feed moves up with it.
- `--milk-grid-*` and `--rip-grid-*` — where the dead / unrecruited tiles sit on each image,
  as fractions of the image, so they follow the width knobs. Retune if the PNGs change.

### The roster scales itself to fit

The roster owns a whole column, so `fitRoster()` in `overlay.js` measures that column once per
render and shrinks the rows by exactly as much as it takes to fit the army — portrait and type
together, through `--portrait-size` and `--row-scale`.

Nothing shrinks while everything already fits. With 80px portraits that means no change up to
about eleven units; at eighteen it settles on 42px portraits at 0.6 scale, tested against a
synthetic roster. Two floors stop it going too far: `MIN_PORTRAIT` (24px) and `MIN_SCALE`
(0.6), below which the names stop being readable through Twitch's transcode. An army large
enough to hit those floors clips at the bottom rather than overflowing.

Because it measures rather than counts, the threshold moves on its own when you change
`--portrait-size` or the column width. Nothing to re-tune.
- `?preview` paints a dark backdrop with the game area marked, so the layout is visible in a
  normal browser — without it the page is light text on white. `/state` returns the current
  snapshot as JSON, and `?once` renders it without holding a stream open.
