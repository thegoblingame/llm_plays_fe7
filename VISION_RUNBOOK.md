# Vision Runbook

**Read this before playing. It is self-contained — you do not need to read anything else to
start, though `README.md` explains the repo layout.**

This is the playbook for **playing through the entire game by sight**, one chapter per
session. Ignore the other runbooks. This run is a real campaign, and ultimately your goal is
to beat the game.

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

**Use no other game tool, ever**, even if your tool list offers more. That means no `fe7_*`
tool, and no `mgba_*` tool other than these two: no memory reads or writes, no
`mgba_press_buttons`, no save or load state, no reset. If something cannot be done with a
screenshot and a press sequence, it is not done. You still read and write the files in your
playthrough folder (`run_state.json`, `CURRENT_RUN_STRATEGY.md`) with your ordinary file
tools; that is bookkeeping, not playing.

## The shape of the run

You are **one session in a chain**. The chain works like this:

- A loop script (`playthroughs/run.sh`) starts a **fresh Claude session for every chapter**.
  Each session gets this runbook, a session tag (`s01`, `s02`, …) and the path of its
  **playthrough folder** (see "Your playthrough folder" below), and nothing else.
- Your session's job is **the chapter that is loaded right now**. Beat it, hand the game
  over at the start of the next chapter, write a short summary, and exit. The loop reads
  your result and starts the next session on the next chapter.
- **Nothing carries between sessions except the game itself and two files in the
  playthrough folder.** No conversation history, no scratch notes.
  - **`run_state.json`** is the run's state: which chapter is being played, how many attempts
    have been made at it, which chapters are done, who has died and who was never recruited.
    It is small, it is JSON, and it is the first thing you read. The loop creates it with
    the chapter the human loaded; you keep it current (see "`run_state.json`" below).
  - **`CURRENT_RUN_STRATEGY.md`** is the run's memory in prose. It starts as a copy of
    `PLAYTHROUGH_STRATEGY_TEMPLATE.md` at the repo root: general strategy written by the
    human, plus one section per chapter with the chapter's recruitable units pre-filled and
    room for you to record what you learned. Every session reads it before playing and
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

1. **Beat the chapter**, while achieving secondary objectives and minimizing material losses, while keeping in mind that the ultimate goal is clearing the game. I leave it to you to determine what this entails.
2. **Hand over cleanly.** When the chapter is won, press through the ending events until the
   next chapter has loaded, update `run_state.json`, fill in **your chapter's section** of
   the playthrough folder's `CURRENT_RUN_STRATEGY.md`, and end with the result line. All
   three are described below.

Losing a chapter can happen. A loss is not shameful and it does not end the run: get back into the chapter, change what did not work, and keep playing. Your job is to get as far into the game as possible. see "When the chapter is lost" below.

---

## Your playthrough folder

A **playthrough** is one launch of the loop: one or more chapters played in a single
sequence. Every playthrough has its own folder under `playthroughs/`, named for the date and
time it started, and **everything a session writes goes inside that folder**:

```
C:/Users/khaaa/Desktop/fe7_llm_experiments/llm_plays_fe7/playthroughs/<YYYY-MM-DD_HH-MM>/
  run_state.json            current chapter, attempts at it, chapters done, the dead and the unrecruited
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
  `llm_plays_fe7/PLAYTHROUGH_STRATEGY_TEMPLATE.md` into it as `CURRENT_RUN_STRATEGY.md`, and
  write a `run_state.json` (format below) whose `current_chapter` is the heading of the
  chapter the game has loaded, with `attempts` 0 and the lists empty. Then continue as
  below.

### `run_state.json`

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
  "dead": ["Sain"],
  "unrecruited": ["Dorcas"]
}
```

| Key               | Meaning                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `model`           | The model this launch of the loop runs on. Set by the loop each launch; never edit it.                                                                                   |
| `effort`          | The reasoning effort this launch runs at. Set by the loop each launch; never edit it.                                                                                    |
| `mode`            | `lyn`, `eliwood`, or `hector`. Set by the loop; never changes.                                                                                                           |
| `current_chapter` | The chapter being played, **verbatim** as its `### ` heading reads in `CURRENT_RUN_STRATEGY.md`. That heading is how you find your section: search for the exact string. |
| `attempts`        | Attempts made at `current_chapter`, **including the one in progress**. You add 1 at the start of every attempt. 0 means nobody has started it yet.                       |
| `completed`       | One entry per chapter won, in order, with the attempts it took and the session tag that won it. Appended at handover.                                                    |
| `dead`            | Your units that have died, in the order they fell. Names as the game shows them.                                                                                         |
| `unrecruited`     | Recruitable units that never joined, in the order the chances were missed.                                                                                               |

Edit it in place with small, exact changes, and keep it valid JSON — the overlay and the
next session both read it, and a file that does not parse is a file nobody can read. Never
remove or reorder entries in the three lists.

Everywhere this runbook says "the playthrough folder", it means this folder. Old playthroughs
live under `archive/`; never read from or write to them.

---

## Before you start

1. **Read `run_state.json` in the playthrough folder.** `current_chapter` is the chapter
   you are playing, `attempts` is how many times it has been tried, and `dead` and
   `unrecruited` tell you who is not coming.

   **Then add 1 to `attempts`**, and save the file. Do this for **every attempt on a
   chapter**: each time you are about to play it from its start, open `run_state.json` and
   add 1. That means once now, and once more every time you restart the chapter during this
   session. The one case that is not a new attempt is picking up a chapter mid-way (turn 2
   or later) where a previous session left it: that attempt was already counted.

2. **Read `CURRENT_RUN_STRATEGY.md` in the playthrough folder.** Read the general strategy
   and "Broad strategy notes" at the top, then find **your chapter's section**: the `### `
   heading that matches `current_chapter` exactly. The chapter sections before yours tell
   you who is alive, who is weak, and anything a previous session wanted you to know. Your
   own section holds the chapter's **recruitable units and how to recruit them**, pre-filled
   by the human, and any notes from earlier attempts.
3. **Take an opening screenshot** (see "Screenshots" below) so the run's record starts with
   what the screen actually showed — the objective text, the map, and any dialogue. If it
   shows a title screen or a save-slot screen rather than a chapter, follow "When you get
   stuck" to get into the chapter.
4. If a dialogue box or cutscene is up, advance it with `A` presses and a screenshot after
   each batch until you reach the map or the Preparations screen.
5. **If the Preparations screen is up**, press Start once with `mgba_press_sequence`, then
   screenshot; the chapter begins on turn 1. If you want to change who is deployed or move
   items first, do it on the Preparations menus with presses and screenshots before pressing
   Start.
6. Based on the information you've received about the current chapter and what you see in the screenshot, fill in the empty
   **Objectives** and **Agent notes** subcategories within the `CURRENT_RUN_STRATEGY.md`
   file. If those sections are already filled in, make whatever adjustments are needed.

---

## Your tools

| Tool                  | Use it for                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mgba_screenshot`     | A picture of the screen, saved to a path you choose. This is how you see the game, and the only way. Take one before every decision and after every action. See "Screenshots" below.                                                                                                                                                                                                                                                                               |
| `mgba_press_sequence` | Every input to the game. Pass `presses`, an ordered list of buttons (`A`, `B`, `Start`, `Select`, `Up`, `Down`, `Left`, `Right`, `L`, `R`); an entry can be an object such as `{"buttons":["A"],"frames":3,"release_frames":40}` to hold longer or pause after a press. The call waits until every press has run, so a screenshot right after it shows the result. Use `release_frames` on the last press to let an animation or a phase play out before you look. |

Those are the only two. See "The one rule" at the top.

### Screenshots — use them liberally

`mgba_screenshot` is your eyes. Take one whenever:

- You are about to decide anything. Read the board, the unit you are about to move, the
  enemy you are about to attack. You cannot plan around what you have not looked at.
- You just pressed something. Confirm the cursor, the menu or the unit is where you meant
  before pressing again; a wrong `A` can commit an action you did not want.
- A screen needs reading: the objective text, a dialogue box, a cutscene, the Preparations
  screen, a shop or arena screen, a battle forecast, a level-up card, a support
  conversation.
- You are unsure what state the game is in.
- Something notable just happened — a death, a boss kill, a village visit, a seize, the end
  of the chapter, the next chapter's title card. The record should show it.

When in doubt, take the screenshot. It changes nothing in the game, and the file is small.

#### How to take one

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

### Unit actions — what the menu offers

When a unit has moved to a tile, the game opens its action menu, and **the menu only lists
the commands that are possible from that tile.** Screenshot it and read it before choosing.
If the entry you wanted is not there, the unit is on the wrong tile or next to the wrong
character; press `B` to back out of the menu and the move, unspent.

| Command      | When the game offers it                                                                                  | Notes                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Talk         | The unit is **next to** a character it has a conversation with. The speaker matters as much as the tile. | Recruitment happens through Talk; check your chapter's Recruits list for the right speaker. |
| Dance / Play | Ninian or Nils is next to an ally that has **already acted**.                                            | The ally can act again this turn.                                                           |
| Rescue       | Next to an ally whose Con is at most this unit's Aid.                                                    | This unit now carries the ally.                                                             |
| Drop         | The unit is carrying someone and a free tile is adjacent.                                                | The dropped unit cannot act until next turn.                                                |
| Take / Give  | Next to an ally, with a carried unit to move between you.                                                | **Free action** — see below.                                                                |
| Trade        | Next to another **player** unit.                                                                         | **Free action**, once per unit per turn.                                                    |
| Steal        | A **thief** with a free slot, next to an enemy carrying an item.                                         | Weapons, tomes and staves cannot be stolen.                                                 |
| Support      | Next to a support partner whose conversation is ready.                                                   | Plays a support conversation.                                                               |
| Visit        | Standing **on** an open village or house.                                                                | A village closes after a visit; it may give an item or a character.                         |
| Door         | **Next to** a door, with a Door Key or a thief's Lockpick.                                               |                                                                                             |
| Chest        | **On** a closed chest, with a Chest Key or a Lockpick, and a free inventory slot.                        |                                                                                             |
| Seize        | A lord on the gate or throne of a Seize chapter.                                                         | Ends the chapter. Only press `A` on it when you mean it.                                    |

Attack, Staff, Item and Wait are the everyday commands. Armory, Vendor, Arena and Supply
open a shop, the arena or the convoy; work those screens with presses and a screenshot after
each one.

## The turn loop

0. **Survey the map once per chapter.** Move the cursor across the whole map with presses
   and screenshot as you go — where the gate, villages, forts, chests and impassable tiles
   are. You cannot plan an objective you have not located. Pair it with the opening
   screenshot so you also know what the objective _says_.
1. **Read the board with screenshots.** Hovering the cursor on a unit shows its name and HP;
   `R` on a unit opens its full stat page (`B` closes it). Know every one of your units' HP
   before you move anyone.
   1b. **Read the danger.** Pressing `A` on an enemy shows how far it can move and attack.
   Check every enemy that could reach a unit you care about.
2. **Decide.** Who is in danger, who can reach what, what moves the chapter toward its win
   condition. Keep the lord out of enemy reach unless the numbers say otherwise.
3. **Read the battle forecast** before any attack where the outcome matters — a wounded
   unit, a possible kill, or a choice between targets. Choose Attack, pick the weapon and
   the target, and the game shows both sides' HP, damage, hit and crit before the final
   `A`; screenshot it. `B` backs out without committing. FE7 averages two rolls for hit, so
   displayed 70 lands 81.7% and displayed 30 only 18.3%; plan on the true number. A side
   that cannot counter at this range shows no numbers — nothing is coming back at you.
4. **Act, one unit at a time.** Cursor to the unit, `A`, cursor to the destination, `A`,
   choose from the menu, `A`. You can put a whole unit's turn in one `mgba_press_sequence`
   when you are sure of the cursor path, but screenshot after every unit to confirm it ended
   where you meant and the menu did what you meant. The camera scrolls as the cursor moves,
   so a unit's position on screen shifts; count tiles from the cursor, not from the edge of
   the screen.
5. **End the turn, then wait out the enemy phase.** Press `A` on an empty tile to open the
   field menu, screenshot it, move the highlight to **End**, screenshot again to confirm, and
   press `A`. A full enemy phase takes minutes. That is normal — battle animations are
   already off. Wait in chunks: a press sequence whose last press has a long
   `release_frames` (for example 1500 frames, about 25 seconds), then a screenshot. Repeat
   until the screen shows your phase again. If several screenshots in a row show the same
   frame, something is waiting for input — see "When something goes wrong".

   **Then find out what happened while you were not looking.** Nothing reports it to you.
   Screenshot the board, and check every unit's HP and whether anyone is missing before the
   next move. Damage taken in the enemy phase is easy to miss and it adds up.

---

## When something goes wrong

**Take a screenshot first.** Before pressing anything, before theorising, before retrying.
Work out which situation you are in — the map waiting for input, a menu open, a target
selection, a dialogue or chapter event, an info screen — and what each one takes: `B` backs
out of menus, selections and info screens; `A` advances dialogue; Start skips a cutscene or
event. Guessing between them wastes presses, and a wrong `A` can commit an action you did
not want.

Then:

- **Do not repeat a failed sequence more than twice.** If the screen does not change the way
  you expected twice in a row, it is not a dropped input. Look at what the screen does show
  and do something else.
- **Press in small batches when you are unsure.** One or two presses, then a screenshot. Long
  blind sequences are how a board ends up in a state nobody can explain.
- **Do not fix things.** Do not edit the tools, the runbook or the repo mid-run. Work around
  the problem, and mention it in the summary if it changed how the chapter went.
- **If the game is at the title screen or a save-slot screen, get back into the chapter.**
  Screenshot it, pick the save slot already in use, and choose Resume Chapter if it is
  offered, or Restart Chapter if it is not. Never start a new game, and never erase or copy
  a save.

---

## When you get stuck

Getting stuck does not end the session. Work through these in order:

1. Screenshot, and press `B` a few times one at a time with a screenshot after each.
2. If that doesn't work, use your intelligence to get back to playing the chapter.

### Common ways the game gets stuck

- **The game is on the Preparations screen.** Press Start with `mgba_press_sequence`, then
  screenshot.
- **A tool call fails with a connection error.** Retry the same call. The emulator is still
  where you left it.
- **An unexpected menu or dialog popped up.** Read it in a screenshot, then `B` to close it
  or `A` to advance it, whichever the screen calls for.

---

## Ending the session

Every session ends with four things: `run_state.json` handed over to the next chapter, your
chapter's section of `CURRENT_RUN_STRATEGY.md` filled in, a final screenshot, and a **result
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

   | Screen                                | Choose                                                                                                |
   | ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
   | "Save?" / "Continue?" after a chapter | Yes / the slot already in use                                                                         |
   | A story or difficulty choice          | Should not appear — the tale and difficulty were chosen before the run. Take the highlighted default. |
   | Anything else                         | The highlighted default, and say so in the summary                                                    |

   If it takes you to the title screen, follow "When you get stuck" to get back into the game.

3. **Hand over `run_state.json`** (see below).
4. **Write the summary** (see below).
5. **Final message**, ending in `PLAYTHROUGH_RESULT=WON`.

### Handing over `run_state.json`

Once the next chapter has loaded, make these changes to `run_state.json`, and no others:

- **`dead`**: append every one of _your_ units that died this chapter. Use the name the game
  shows, one string each. The deaths you saw on screen and your own summary are the
  sources. Only the attempt that won counts: restarting a lost chapter brings back everyone
  who fell in the lost attempt.
- **`unrecruited`**: compare your chapter's **Recruits** table in `CURRENT_RUN_STRATEGY.md`
  against who actually joined. Append every recruitable unit that did not. A unit you failed
  to recruit and then killed goes here, not in `dead` — it was never yours.
- **`completed`**: append `{ "chapter": <current_chapter>, "attempts": <attempts>,
"session": <your tag> }`.
- **`current_chapter`**: set it to the heading of the chapter that has just loaded, copied
  verbatim from `CURRENT_RUN_STRATEGY.md`. The title card you screenshotted names it. Gaiden
  chapters (`7x`, `13x`, …) only happen when their condition was met, so go by what the game
  loaded, not by the next heading in the file.
- **`attempts`**: set it to `0`. The next session adds 1 when it starts.

The overlay draws `dead` and `unrecruited` left to right in the order written, so append
only.

### When the chapter is lost

Play the chapter again - Press through the game over,
and from the title screen pick the save slot already in use and choose Restart Chapter.
Units that fell in the lost attempt are back, so do not add them to `dead`. Work out what
went wrong, change the plan, and keep going until the chapter is won.

**Every restart is a new attempt.** Before playing again, add 1 to `attempts` in
`run_state.json` and adjust your chapter's Agent notes in `CURRENT_RUN_STRATEGY.md` with
what the lost attempt taught you, exactly as in "Before you start".

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

1. Write what the lost attempts taught you into your chapter's Agent notes, as in "When the
   chapter is lost". The next session starts with nothing else.
2. Press through the game over and choose Restart Chapter, as above, so the game sits at the
   chapter's start. **Do not add 1 to `attempts`**; the next session does that when it starts.
3. Take a final screenshot.
4. End with `PLAYTHROUGH_RESULT=RETRY` as the last line of your final message.

Only a lost attempt ends a session this way. Never use `RETRY` while an attempt is still in
progress, and never on a won chapter — that is `WON`.

### When you cannot make progress

Follow "When you get stuck" above. Being stuck is a problem to solve, not a reason to end
the session.

---

## The chapter summary

At the end of every session, write into the playthrough folder's `CURRENT_RUN_STRATEGY.md`.
**Edit the file in place; never replace it, reorder it, or touch the human's pre-filled
parts** (the general strategy and every chapter's **Recruits** list). The file persists for
the whole playthrough, so what you write is read by the next session and by any later attempt
at your chapter. Three places take your writing:

1. **Your chapter's section.**
   - Fill in **Objectives** with the win condition as the game stated it, if it is still
     the placeholder.
   - Write **Agent notes**: **brief**, about ten lines. Not a play-by-play; what the next
     session needs to know, and what a future attempt at this chapter would need. Cover the
     result and the turn it ended on, who died and who was recruited, what each unit gained
     that matters (level-ups, promotions, items), the army's state at handover — who is weak,
     who is out of weapon uses — and what you would do differently. If a Yes/No screen came
     up during the ending, record the choice here. If notes from a previous attempt are
     already there, add yours below them under a heading naming your session tag rather
     than overwriting them.
2. **Broad strategy notes**, near the top of the file. Only for a lesson that applies beyond
   the individual chapter — for example a menu quirk, an enemy behaviour, a unit that always needs babysitting.
   One or two lines, appended. Leave it alone if you have nothing cross-chapter to say.
3. Nothing else. Do not add new sections, do not rewrite the general strategy, do not
   delete anyone's notes.

If you lost the chapter or got stuck along the way, say so in your notes: what went wrong,
how you got back to playing, and what you would do differently.
