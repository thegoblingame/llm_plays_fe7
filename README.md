# LLM plays Fire Emblem 7

Getting a language model to play **Fire Emblem: The Blazing Blade** (US release, `AGB-AE7E`)
in the mGBA emulator — reading the game state out of RAM, deciding what to do, and driving
the controller.

**If you are a fresh session, read this file, then `BACKLOG.md`, then `RAM.md`.**

---

## The two repos

The project lives in two directories, and this trips people up. They are separate for one
reason: `mcp-mgba` is a **fork of someone else's public project**, so it stays its own repo
and can still take upstream changes.

| Repo | What it is |
|---|---|
| `~/Desktop/repos/llm_plays_fe7` (**here**) | Knowledge and history. The RAM map, the backlog, working logs, run logs. No code that runs the game. |
| `~/Desktop/repos/mcp-mgba` | The machinery. A forked MCP server that talks to mGBA over a TCP bridge, plus `src/fe7.ts` — the Fire Emblem tool layer we wrote. |

Roughly: **this repo is what we know, that repo is what we can do.**

One more piece lives outside both — the `memory-investigator` subagent definition, at
`~/.claude/agents/memory-investigator.md`. It is user-level so it works from either repo.

---

## Files here

| File | What it is for |
|---|---|
| `BACKLOG.md` | **Start here after this file.** The ranked list of what we cannot do yet, split into memory work and tool work. |
| `RAM.md` | The canonical memory map — addresses, struct layouts, formulas, and the method notes. ~1600 lines. Every claim is tagged Confirmed / Inferred / Unverified. |
| `attempts/` | Working logs, one per investigation. Historical; the conclusions have been folded into `RAM.md`. |
| `attempts/HANDOFF.md` | **Superseded.** Written 2026-08-11, kept for history. Parts of it are now known to be wrong. Use this README and `BACKLOG.md` instead. |
| `runs/` | JSONL logs from playthroughs — see the feedback loop below. |
| `misc/` | Grant's scratch space. **Do not read it**; it is deliberately excluded (see `CLAUDE.md`). |

---

## How to actually run anything

Three things have to be true, and the second is the one people forget:

1. **mGBA is running the ROM**, with `mcp-mgba/lua/bridge.lua` loaded via Tools > Scripting.
   The bridge listens on `127.0.0.1:8765`.
2. **The MCP config points at the fork** — `~/Desktop/repos/mcp-mgba/dist/index.js`, not a
   globally installed `mcp-mgba` (there isn't one; a bare `command: "mcp-mgba"` silently
   resolves to nothing and the session ends up with zero `mgba_*` tools).
3. **The build is current.** After editing `src/fe7.ts`, run `npm run build` **and restart
   Claude Code** — the MCP server is a subprocess spawned at session start, so a running
   session keeps using the old build and your changes appear to do nothing.

Editing `bridge.lua` additionally needs mGBA restarted (the old script holds port 8765, so a
second copy fails to bind). Prefer not to touch it — all orchestration lives in TypeScript
on purpose; see below.

---

## The tools

Defined in `mcp-mgba/src/fe7.ts`. They take tile coordinates and slot numbers, and every one
of them confirms its effect by reading memory rather than assuming a button press landed.

| Tool | Does |
|---|---|
| `fe7_state` | The whole battlefield in one call — turn, phase, cursor, every unit with position, HP, stats, items. |
| `fe7_reachable` | A unit's legal destinations, drawn as a cost map with occupancy marked. |
| `fe7_act` | One unit's entire turn: select, walk, and commit `wait` / `attack` / `staff` / `item`. |
| `fe7_forecast` | Both sides' damage, blows, hit and crit for an attack you have **not** committed to. Unwinds cleanly. |
| `fe7_unstick` | Why the game appears frozen and what to press. Returns a screenshot. Call it first when confused. |
| `fe7_note` | Record something the tools could not do. See the feedback loop. |
| `fe7_end_turn` / `fe7_wait` | End the player phase, then wait through the enemy phase in resumable chunks. |

**Why the logic is in TypeScript and not Lua:** `bridge.lua`'s handlers run inside mGBA's
frame callback, so a Lua handler that waited for frames would stop frames advancing —
instant deadlock. Node is a separate process and can press, poll memory, and press again.

---

## The feedback loop

The point of a playthrough is to find out what the tool layer cannot do. That list is
recorded as it happens, in two channels, because they catch different things:

- **Every `fe7_*` call and result is logged automatically** to `runs/<date>.jsonl`. This
  catches tools *failing*.
- **`fe7_note` is called deliberately.** This catches tools *missing* — which automatic
  logging structurally cannot see, because a tool that does not exist never errors. The
  player just quietly never tries it, and the log looks clean.

Afterwards: triage the JSONL into `BACKLOG.md`, implement, run again.

---

## Standing rules

These are not style preferences; each one was learned the expensive way.

**Read game state from memory, never from screenshots.** Screenshots invite misreading
pixels; memory values are checkable and cross-validatable. The one sanctioned exception is
`fe7_unstick`, which uses a screenshot to identify *what is displayed* — dialogue text, the
objective — never to infer game state.

**Losing is fine.** Unit deaths are expected and inevitable. Softlocks, corrupted state and
destructive experiments are all explicitly permitted — Grant keeps a full backup. Never
hedge or ask permission around damaging the save. The goal is understanding, not winning.

**Correctness over speed.** There is ample time and token budget. A ~4 minute enemy phase is
the floor and is fine — battle animations are already off. Do not suggest turning them off.

**Location is not semantics.** The single most expensive mistake in this project's history,
made at least five times: establishing *where* a value lives by diffing, then asserting
*what it means* without a separate test. Each wrong claim survived two or three samples and
broke on the fourth. Confirm by effect, and get a second, different data point before
tagging anything Confirmed.

**Convert hex with a shell one-liner.** Reading the wrong address because of mental
hex-to-decimal arithmetic has happened four times. It always looks like a plausible result.

---

## Where the project is

Mid-chapter, **turn 5 of an 11-turn defend map** ("Defend Nils"), Hector mode. 11 player
units against ~50 enemies. The win condition is surviving to turn 11, not routing the map.

The RAM map is in good shape: unit structs, all three unit arrays (player, enemy, and the
green/NPC array), the movement grid, the combat forecast, and the ROM item table are all
Confirmed. The next step is a full playthrough to find out where the tools fall short.
