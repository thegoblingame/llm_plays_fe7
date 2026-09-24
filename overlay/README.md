# Stream overlay

Two strips down the edges of the Twitch stream, with the mGBA capture in the gap between
them. The left strip carries the current chapter and a feed of the agent's stated reasons for
what it is doing; the right strip carries the roster with levels and HP.

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
| Chapter number and title | The newest filename in `playthrough/states/`. The runbook has the agent save a state only *after* pressing into the next chapter, as `<session>_ch<N>_<slug>.ss`, so the newest one names the chapter being played now. |
| Roster: name, level, HP | The `PLAYERS:` block of `fe7_state`, plus three narrower sources that keep the bars moving between full reads: the `wounded:` line and the `HP: player #N ... 15->10` deltas in `fe7_wait`, and `Self: HP 20/20` in an `fe7_act` result. |
| Reason feed | The `reason` parameter of `fe7_act` and `fe7_end_turn`, which both require it and refuse to press anything without it. Last 10, newest at the bottom. |

Everything is read from the newest `runs/playthrough-*.jsonl`, which the MCP server appends
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

### Names are keyed by class, and here is why

`fe7_state` prints `rNN`, which is the roster **array position** (`b[o + 0x0b]`), not a
character identity — `RAM.md` flags this explicitly, and the logs bear it out: `r02` was Sain
in Ch.3 and is Kent from Ch.9 on, because the array compacted when Sain died. So the mapping
is keyed on **class ID**, which is unique per character in Lyn's tale with one exception:
`cls28` is both Kent and Sain, and Sain died in Ch.4.

Two things will eventually break that, both fixable by editing `names.json`:

- **Promotion changes the class ID.** Wallace went `cls14` → `cls16` when he used the Knight
  Crest in Ch.10, so he has two entries. Anyone who promotes needs the new class adding.
- **Two player units sharing a class** would collide. Use the `bySlot` block to override a
  specific array slot when that happens.

The proper fix, if this ever becomes annoying: the character struct holds a stable name text
ID at offset `0x00`, but `fe7_state` does not expose it. Adding that to `fe7.ts` means a
rebuild and a session restart, which is not worth doing mid-run.

---

## Building and tuning it without a live run

There are twelve recorded chapters in `runs/`, which is better test data than anything faked.
`replay.mjs` feeds one through the same code path at whatever speed you like:

```
# terminal 1
OVERLAY_RUNS_DIR=overlay/.replay node overlay/server.mjs
# terminal 2
node overlay/replay.mjs                              # newest log, 20x
node overlay/replay.mjs runs/....-s13.jsonl 50       # a specific log, faster
```

It writes into `overlay/.replay/` rather than `runs/`, so a rehearsal never leaves a fake run
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
  units on the map. The feed is pinned to the bottom of the strip and grows upward.

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
