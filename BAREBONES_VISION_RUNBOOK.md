# Vision Runbook

**Read this before playing. It is self-contained — you do not need to read anything else to
start.**

This is the playbook for **playing through the entire game by sight**, one chapter per
session. Your ultimate goal is beating the game.

## The one rule: two tools, nothing else

You play this game the way a person does: by looking at the screen and pressing buttons.
You have exactly two tools for the game:

- **`mgba_screenshot`** is how you see. It is the **only** way you find out anything about
  the game: where your units and the enemies are, HP, the objective, menus, dialogue,
  forecasts, what happened during the enemy phase. Use it to figure out what to do. It is
  the only thing it is for.
- **`mgba_press_sequence`** is how you act. It is the **only** way you navigate the game:
  moving the cursor, selecting units, choosing menu entries, attacking, ending the turn,
  advancing dialogue, waiting out the enemy phase.

  In other words, you are forbidden from doing things like directly reading the memory of the game or running cheats, for example.

**Use no other game tool, ever**, This is a clone of another repository, which had some tools. I have removed all references to those tools. Even if you manage to find references to them, do not use those tools under any circumstance. If something cannot be done with a
screenshot and a press sequence, it is not done. However, you may still read and write the files in your
playthrough folder (`run_state.json`, `CURRENT_RUN_STRATEGY.md`) with your ordinary file
tools; Those usages are considered bookkeeping and therefore are 100% permitted.

## The shape of the run

You are **one session in a chain**. The chain works like this:

- A loop script (`playthroughs/run.sh`) starts a **fresh Claude session for every chapter**.
  Each session gets this runbook, a session tag (`s01`, `s02`, …) and the path of its
  **playthrough folder** (see "Your playthrough folder" below), and nothing else.
- Your session's job is **the chapter that is loaded right now**. Beat it, and exit. The loop reads
  your result and starts the next session on the next chapter.
- **Nothing carries between sessions except the game itself and two files in the
  playthrough folder.** No conversation history, no scratch notes.
  - **`run_state.json`** is the run's state: which chapter is being played, how many attempts
    have been made at it, which chapters are done, who has died.
    It is small, it is JSON, and it is the first thing you read. The loop creates it with
    the chapter the human loaded; you keep it current (see "`run_state.json`" below).
  - **`CURRENT_RUN_STRATEGY.md`** is the run's memory in prose. It starts as a copy of
    `BAREBONES_STRATEGY_TEMPLATE.md` at the repo root: Every session reads it before playing and
    writes into it, so what you write there is the only memory the next session has of your
    chapter — and the only memory a session on a **later attempt at the same chapter** has
    of yours.
- **You might be starting mid-chapter.** If the previous session died before finishing —
  crashed, hit a limit, timed out — the loop starts a new one on the same chapter, wherever
  the game was left. Take a screenshot and treat what it shows as your starting point.
  `run_state.json` still names the chapter, and its `attempts` already counts the attempt
  in progress.

The human is not watching in real time. There is no one to ask. Decide, act, and report.

---

## What your job actually is

1. **Beat the chapter**.
2. **Hand over cleanly.** When the chapter is won, press through the ending events until the
   next chapter has loaded, update `run_state.json`.

Losing a chapter can happen. A loss is not shameful and it does not end the run: get back into the chapter And attempt to beat it again. For more details see "When the chapter is lost" section below.

---

## Your playthrough folder

A **playthrough** is one launch of the loop: one or more chapters played in a single
sequence. Every playthrough has its own folder under `playthroughs/`, named for the date and
time it started, and **everything a session writes goes inside that folder**:

```
C:/Users/khaaa/Desktop/fe7_llm_experiments/llm_plays_fe7/playthroughs/<YYYY-MM-DD_HH-MM>/
  run_state.json            current chapter, attempts at it, chapters done, which characters are dead
  CURRENT_RUN_STRATEGY.md   strategy and per-chapter notes in prose
  screenshots/   every screenshot you take
  sessions/      transcripts and MCP configs (written by the loop, not by you)
  runs/          the MCP server's log (written by the MCP server, not by you)
  usage.tsv      token usage per session (written by the loop, not by you)
```

**Which folder is yours:**

- **Started by the loop:** the one-line header above this runbook names your playthrough
  folder. It already exists with `run_state.json`, `CURRENT_RUN_STRATEGY.md` and the
  subfolders inside. Use it and nothing else.
  Never create a second folder, and never write into another playthrough's folder.
- **Started by hand, with no folder named in your prompt:** you are the first session of a
  new playthrough. **Create the folder yourself before anything else**, named for the
  current date and time in the form `YYYY-MM-DD_HH-MM` (24-hour clock, no colons), with
  `screenshots/` inside it, **copy the template**
  `llm_plays_fe7/PLAYTHROUGH_STRATEGY_TEMPLATE.md` or `llm_plays_fe7/BAREBONES_STRATEGY_TEMPLATE.md`, whichever is selected, into it as `CURRENT_RUN_STRATEGY.md`, and
  write a `run_state.json` (format below) whose `current_chapter` is the heading of the
  chapter the game has loaded, with `attempts` 0 and the lists empty. Then continue as
  below.

### example `run_state.json`

```json
{
  "model": "fable",
  "effort": "medium",
  "mode": "hector",
  "current_chapter": "Chapter 13 — In Search of Truth",
  "attempts": 1,
  "completed": [
    {
      "chapter": "Chapter 12 — Birds of a Feather",
      "attempts": 1,
      "session": "s02"
    }
  ],
  "dead": ["Sain"]
}
```

| Key               | Meaning                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| `model`           | The model this launch of the loop runs on. Set by the loop each launch; never edit it.                                                                                   |
| `effort`          | The reasoning effort this launch runs at. Set by the loop each launch; never edit it.                                                                                    |
| `mode`            | `lyn`, `eliwood`, or `hector`. Set by the loop; never changes.                                                                                                           |
| `current_chapter` | The chapter being played, **verbatim** as its `### ` heading reads in `CURRENT_RUN_STRATEGY.md`. That heading is how you find your section: search for the exact string. |
| `attempts`        | Attempts made at `current_chapter`, **including the one in progress**. You add 1 at the start of every attempt. 0 means nobody has started it yet.                       |
| `completed`       | One entry per chapter won, in order, with the attempts it took and the session tag that won it. Appended at handover.                                                    |
| `dead`            | Your units that have died, in the order they fell. Names as the game shows them.                                                                                         |     |

Edit it in place with small, exact changes, and keep it valid JSON — the overlay and the
next session both read it, and a file that does not parse is a file nobody can read. Never
remove or reorder entries in the three lists.

Everywhere this runbook says "the playthrough folder", it means this folder. Old playthroughs
live under `archive/`; never read from or write to them.

---

## Before you start

1. **Read `run_state.json` in the playthrough folder.** `current_chapter` is the chapter
   you are playing, `attempts` is how many times it has been tried.
   **Then add 1 to `attempts`**, and save the file. Do this for **every attempt on a
   chapter**: each time you are about to play it from its start, open `run_state.json` and
   add 1. That means once now, and once more every time you restart the chapter during this
   session. The one case that is not a new attempt is picking up a chapter mid-way (turn 2
   or later) where a previous session left it: that attempt was already counted.

2. **Read `CURRENT_RUN_STRATEGY.md` in the playthrough folder.**
3. **Take an opening screenshot** (see "Screenshots" below) so the run's record starts with
   what the screen actually showed — the objective text, the map, and any dialogue. If it
   shows a title screen or a save-slot screen rather than a chapter, follow "When you get
   stuck" to get into the chapter.

---

## Your tools

| Tool                  | Use it for                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mgba_screenshot`     | A picture of the screen, saved to a path you choose. This is how you see the game, and the only way. Take one before every decision and after every action. See "Screenshots" below.                                                                                                                                                                                                                                                                               |
| `mgba_press_sequence` | Every input to the game. Pass `presses`, an ordered list of buttons (`A`, `B`, `Start`, `Select`, `Up`, `Down`, `Left`, `Right`, `L`, `R`); an entry can be an object such as `{"buttons":["A"],"frames":3,"release_frames":40}` to hold longer or pause after a press. The call waits until every press has run, so a screenshot right after it shows the result. Use `release_frames` on the last press to let an animation or a phase play out before you look. |

Those are the only two. See "The one rule" at the top.

#### How to take a screenshot

Always pass an explicit `path`. Omitting it writes to the system temp folder, where the file
will be lost, and passing an existing path overwrites it silently. Save every screenshot into
the playthrough folder's `screenshots/` subfolder, with a name that says when and why:

```
<playthrough folder>/screenshots/<YYYY-MM-DD>_<session>_ch<chapter>_t<turn>_<what>.png
```

For example `.../playthroughs/2026-09-26_14-30/screenshots/2026-09-26_s03_ch12_t03_boss-forecast.png`
or `.../screenshots/2026-09-26_s03_ch12_t00_objective.png`. Use the absolute path when you
call the tool. If you take more than one on the same turn for the same reason, add a suffix
(`-2`, `-3`) rather than overwriting.

**Keep every screenshot. Never delete or overwrite one.** They are part of the run's record.

## Taking notes

- **`CURRENT_RUN_STRATEGY.md`** is your strategy notebook. To beat the game, you will need to periodically take notes. You may do so at any time during the run. Keep in mind that Fire Emblem is a turn-based game, so you may stop what you're doing at any time during your run when you deem it appropriate to add additional notes to this document. Once again, the only strategy that persists between sessions is what's contained in this document.

## When something goes wrong / When you get stuck

**Take a screenshot**. Then figure out why you are stuck.

- **Do not fix things.** Do not edit the tools, the runbook or the repo mid-run. Work around
  the problem, and mention it in the summary if it changed how the chapter went.
- **If the game is at the title screen or a save-slot screen, get back into the chapter.**
  Screenshot it, pick the save slot already in use, and choose Resume Chapter if it is
  offered, or Restart Chapter if it is not. Never start a new game, and never erase or copy
  a save.
- If that doesn't work, use your intelligence to get back to playing the chapter.

### Common ways the game gets stuck

- **The game is on the Preparations screen.**
- **A tool call fails with a connection error.** Retry the same call. The emulator is still
  where you left it.
- **An unexpected menu or dialog popped up.**

---

## Ending the session

Every session ends with four things: `run_state.json` handed over to the next chapter, a final screenshot, and a **result
line** as the last line of your final message. The loop reads the result line, so it must be
exactly:

```
PLAYTHROUGH_RESULT=WON
```

`WON` starts the next session on the next chapter. The only other result is
`PLAYTHROUGH_RESULT=RETRY`, and only when the attempt limit is reached (see "When the attempt
limit is reached" below): it starts a fresh session on the same chapter. Otherwise there is
no result line for a lost chapter or for being stuck, because neither one ends the session:
keep playing until the chapter is won. A missing result line is treated as a crash, and the
loop waits before starting a new session on the same chapter.

### When the chapter is won

1. **Press through the ending.** Start or `A` advances the ending dialogue, the world-map
   narration and the next chapter's opening cutscene; screenshot between batches. Screenshot
   the next chapter's **title card** so the chapter name and number are on record. Stop
   pressing when the screen shows the new chapter loaded — the Preparations screen, or the
   map with your units on it at turn 1. **Do not press Start on the Preparations screen**;
   that is the next session's job.
2. **If a screen asks you to choose something** — a save prompt, a slot, anything with a
   Yes/No — take a screenshot first, then follow this table, and record the choice in the
   summary:

   | Screen                                | Choose                                                                             |
   | ------------------------------------- | ---------------------------------------------------------------------------------- |
   | "Save?" / "Continue?" after a chapter | Yes / the slot already in use                                                      |
   | A story or difficulty choice          | Choose Hector mode on Normal difficulty. This will happen after beating Chapter 10 |
   | Anything else                         | The highlighted default, and say so in the summary                                 |

   If it takes you to the title screen, follow "When you get stuck" to get back into the game.

3. **Hand over `run_state.json`** (see below).
4. **Final message**, ending in `PLAYTHROUGH_RESULT=WON`.

### Handing over `run_state.json`

Once the next chapter has loaded, make these changes to `run_state.json`, and no others:

- **`dead`**: append every one of _your_ units that died this chapter. Use the name the game
  shows, one string each. The deaths you saw on screen and your own summary are the
  sources. Only the attempt that won counts: restarting a lost chapter brings back everyone
  who fell in the lost attempt.
- **`completed`**: append `{ "chapter": <current_chapter>, "attempts": <attempts>,
"session": <your tag> }`.
- **`current_chapter`**: set it to the heading of the chapter that has just loaded, copied
  verbatim from `CURRENT_RUN_STRATEGY.md`. The title card you screenshotted names it. Gaiden
  chapters (`7x`, `13x`, …) only happen when their condition was met, so go by what the game
  loaded, not by the next heading in the file.
- **`attempts`**: set it to `0`. The next session adds 1 when it starts.

The overlay draws `dead` left to right in the order written, so append
only.

### When the chapter is lost

Play the chapter again - Press through the game over,
and from the title screen pick the save slot already in use and choose Restart Chapter.
Units that fell in the lost attempt are back, so do not add them to `dead`. Work out what
went wrong, change the plan, and keep going until the chapter is won.

**Every restart is a new attempt.** Before playing again, add 1 to `attempts` in
`run_state.json`.

**Restart Chapter**, not Resume Chapter. Take a screenshot after each press on these
screens. This is the one situation where choosing Suspend on the field menu is allowed: after a chapter loss, you may Suspend and Restart
Chapter to play it again. Never rewind the game any other way.

### When the attempt limit is reached

The header above this runbook may set an **attempt limit**: the value of `attempts` in
`run_state.json` at which this session stops playing the chapter. Long sessions get
compacted, and a fresh session with good notes plays better than a crowded one. If the
header sets no limit, there is none.

When an attempt is lost and `attempts` has already reached the limit, do not play the
chapter again in this session. Instead:

1. Press through the game over and choose Restart Chapter, as above, so the game sits at the
   chapter's start. **Do not add 1 to `attempts`**; the next session does that when it starts.
2. Take a final screenshot.
3. End with `PLAYTHROUGH_RESULT=RETRY` as the last line of your final message.

Only a lost attempt ends a session this way. Never use `RETRY` while an attempt is still in
progress, and never on a won chapter — that is `WON`.
