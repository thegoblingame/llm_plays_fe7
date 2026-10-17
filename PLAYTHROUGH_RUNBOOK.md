# Playthrough Runbook

**Read this before playing. It is self-contained — you do not need to read anything else to
start, though `RAM.md` is there when you need a fact and `README.md` explains the repo layout.**

This is the playbook for **playing through the entire game**, one chapter per session.
`VICTORY_RUNBOOK.md` is its sibling for beating a single chapter in isolation, and
`SCOUTING_RUNBOOK.md` is the one for finding tool gaps. This run is neither: it is a real
campaign, and the only thing that matters is getting as far into the game as possible.

---

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
  the game was left. `fe7_state` tells you the turn; treat it as your starting point.
  `run_state.json` still names the chapter, and its `attempts` already counts the attempt
  in progress.

The human is not watching in real time. There is no one to ask. Decide, act, and report.

---

## What your job actually is

1. **Beat the chapter.** Clear the win condition — seize the gate, defeat the boss,
   survive the turn count, protect whoever must be protected — with as few losses as you
   can manage. Every unit that dies here is gone for the rest of the campaign, so a loss is
   not a local setback the way it is on a one-chapter run. Play for the long game.
2. **Hand over cleanly.** When the chapter is won, press through the ending events until the
   next chapter has loaded, **save a state**, update `run_state.json`, fill in **your
   chapter's section** of the playthrough folder's `CURRENT_RUN_STRATEGY.md`, and end with
   the result line. All four are described below.

**You are not taking notes.** `fe7_note` exists as a tool; do not call it. Do not record tool
gaps, do not log screenshots, do not keep a running journal. The automatic log captures
every `fe7_*` call already. The only writing you do all session is to `run_state.json` (the
attempt counter at the start of each attempt, the handover at the end) and to
`CURRENT_RUN_STRATEGY.md` (your chapter's Objectives and Agent notes at the start of each
attempt, the chapter summary at the end).

Play to win. Take risks when the odds favour them and avoid them when they do not, the way a
careful player would. Free experiments are fine — a refused attack costs nothing, a menu
probe costs nothing — but do not spend a unit or a turn to see what a tool says.

**Never pause to ask permission.** Not before a risky move, not before something that might
lose a unit. Decide, act, and move on.

Unit deaths happen. Losing a chapter can happen. A loss is not shameful and it does not end
the run: get back into the chapter, change what did not work, and keep playing. Your job is
to get as far into the game as possible.

### What actually ends a chapter

Three things, and they are the constraints you plan around:

- **A lord dies.** Lyn, Eliwood, or Hector. Whichever of them the chapter has deployed.
- **A unit you are required to protect dies**, on a chapter whose objective is to defend
  someone.
- **Two or more units die and the attempt count is less than four.** Technically, this does
  not cause a game loss, but the chapter also needs to be restarted. On the first, second
  or third attempt at a chapter, losing multiple units is an excessive loss of human
  resources, and it makes the remainder of the run untenable. The limit on attempts is
  there because some chapters may be so difficult that they cannot be beaten without losing
  multiple units: **if the attempt count is 4 or more, progress through the chapter no
  matter how many units die.** The attempt count is `attempts` in `run_state.json`, which
  already includes the attempt you are playing (see "Before you start"). Count deaths
  across the whole attempt, not per turn.

Everything else is a setback, not the end. If the chapter is lost, play it again: see "When the chapter is lost" below.

---

## Your playthrough folder

A **playthrough** is one launch of the loop: one or more chapters played in a single
sequence. Every playthrough has its own folder under `playthroughs/`, named for the date and
time it started, and **everything a session writes goes inside that folder**:

```
C:/Users/khaaa/Desktop/fe7_llm_experiments/llm_plays_fe7/playthroughs/<YYYY-MM-DD_HH-MM>/
  run_state.json            current chapter, attempts at it, chapters done, the dead and the unrecruited
  CURRENT_RUN_STRATEGY.md   strategy and per-chapter notes in prose
  states/        save states, one per won chapter
  screenshots/   every screenshot you take
  sessions/      transcripts and MCP configs (written by the loop, not by you)
  runs/          the fe7 tool log (written by the MCP server, not by you)
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
  `states/` and `screenshots/` inside it, **copy the template**
  `llm_plays_fe7/PLAYTHROUGH_STRATEGY_TEMPLATE.md` into it as `CURRENT_RUN_STRATEGY.md`, and
  write a `run_state.json` (format below) whose `current_chapter` is the heading of the
  chapter the game has loaded, with `attempts` 0 and the lists empty. Then continue as
  below.

### `run_state.json`

```json
{
  "mode": "hector",
  "current_chapter": "Chapter 13 — In Search of Truth",
  "attempts": 1,
  "completed": [
    { "chapter": "Chapter 12 — Birds of a Feather", "attempts": 1, "session": "s02" }
  ],
  "dead": ["Sain"],
  "unrecruited": ["Dorcas"]
}
```

| Key               | Meaning                                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`            | `lyn` or `hector`. Set by the loop; never changes.                                                                                                                         |
| `current_chapter` | The chapter being played, **verbatim** as its `### ` heading reads in `CURRENT_RUN_STRATEGY.md`. That heading is how you find your section: search for the exact string.   |
| `attempts`        | Attempts made at `current_chapter`, **including the one in progress**. You add 1 at the start of every attempt. 0 means nobody has started it yet.                            |
| `completed`       | One entry per chapter won, in order, with the attempts it took and the session tag that won it. Appended at handover.                                                        |
| `dead`            | Your units that have died, in the order they fell. Names as the game shows them.                                                                                            |
| `unrecruited`     | Recruitable units that never joined, in the order the chances were missed.                                                                                                  |

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
3. `fe7_state` — confirm you get a battlefield with units in it. If turn is 0 and no units
   are listed, no chapter is loaded; follow "When you get stuck" to get into the chapter.
4. Check the phase is `player`. If not, `fe7_wait`.
5. If anything looks strange, `fe7_unstick` before pressing anything.
6. **If the phase is `green/prep` and the turn is 0, the Preparations screen is up.** No tool
   drives it. Press Start once with `mgba_press_buttons` (hold 6 frames), then `fe7_wait`; the
   chapter begins on turn 1. Unit slots can be re-sorted when prep closes, so read `fe7_state`
   again before trusting any slot number from before.
7. **Take an opening screenshot** (see "Screenshots" below) so the run's record starts with
   what the screen actually showed — the objective text, the map, and any dialogue.
8. Based on the information you've received about the current chapter, fill in the empty
   **Objectives** and **Agent notes** subcategories within the `CURRENT_RUN_STRATEGY.md`
   file. If those sections are already filled in, make whatever adjustments are needed.

---

## Your tools

| Tool                 | Use it for                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fe7_state`          | The whole battlefield in one call. Start every turn with it. `brief: true` when you only need positions and HP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `fe7_reachable`      | Where one unit can legally go, as a cost map with allies, greens and enemies marked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `fe7_act`            | One unit's whole turn: select, walk to a tile, and commit an action. On an attack, pass `weapon_slot` to swing a chosen inventory weapon (the Rapier, the Silver Lance); without it the EQUIPPED weapon, slot 0, is always used, and the game re-equips whatever you pick, so re-read `fe7_state` for slot numbers afterwards. Eighteen actions report a verified result: `wait` / `attack` / `staff` / `item` / `seize`, the target-selection commands `talk` / `dance` / `play` / `rescue` / `drop` / `take` / `give` / `trade` / `steal` / `support`, and the map-object commands `visit` / `door` / `chest`. `take`, `give` and `trade` are free actions that leave the unit mid-turn, and mounted units can `canto_x`/`canto_y` on after most of them. `ride` / `dismount` / `status` are accepted but unverified. The facility commands `armory` / `vendor` / `arena` / `supply` OPEN the shop, arena or convoy and verify it opened, but do not buy, sell, fight or move items — do that by hand with screenshots (see "What is still missing"). With `action:'seize'` it also doubles as a **menu probe** — see "The 27 actions" below. |
| `fe7_terrain`        | The WHOLE board's terrain in one call, plus `find` to locate tiles by name. Use it at the start of a chapter — this is how you find the gate, the villages and the forts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `fe7_threat`         | The enemy DANGER MAP: for every tile, how many enemies can attack it next enemy phase, and which enemies threaten each of your units. Pure read, computed from ROM Move/cost tables. Pass `verify: slot` to cross-check one enemy against the game's own grid.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `fe7_inspect`        | What is on ONE tile, read off the cursor. Only needed for something `fe7_terrain` cannot answer; note a unit standing on a tile masks its terrain, which `fe7_terrain` does not suffer from.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `fe7_forecast`       | Both sides' damage, number of blows, hit% and crit% for an attack you have **not** committed to. Hit is printed as the displayed value AND the true chance — FE7 averages two rolls, so displayed 70 lands 81.7% and displayed 30 only 18.3%; plan on the true number. A defender the projection kills first is reported with the chance it survives to counter. Commits nothing. Pass `weapon_slot` to forecast a specific weapon; the game re-equips it even though nothing is committed.                                                                                                                                                                                         |
| `fe7_unstick`        | Why the game seems frozen and what to press. Returns a screenshot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `fe7_end_turn`       | End the player phase. Returns quickly.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `fe7_wait`           | Wait out the enemy phase in resumable chunks. Read WHICH answer you got — "units did move" means call again, "NOTHING CHANGED" means stop and call `fe7_unstick`. If the phase came back between calls it says so and still prints what happened.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `fe7_inventory_full` | Answers the "inventory is full, send an item to Merlinus" list that HALTS the game when a unit holding 5 items picks up a drop. Enemies that drop are tagged `DROPS` in `fe7_state`. `fe7_act`, `fe7_wait`, `fe7_end_turn` and `fe7_unstick` stop and print the six entries when it is up; decide which item is least needed and pass its index. The last entry is the new item, and sending it leaves the kit as it was.                                                                                                                                                                                                                                                           |
| `mgba_screenshot`    | A picture of the screen, saved to a path you choose. **Use it liberally** — see "Screenshots" below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `mgba_save_state`    | **Once per session, after the chapter is won.** See "Save states" below. Always with an explicit `path`, never a slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Raw `mgba_*` tools other than `mgba_screenshot` and `mgba_save_state` exist, but **prefer the
`fe7_*` tools every time** for driving the game. The raw ones take absolute hex addresses and
blind button presses; the `fe7_*` ones take tile coordinates and slot numbers and verify every
step against memory. Dropping to raw presses mid-run is almost always a mistake — see "when
something goes wrong". Three raw tools are **forbidden outright**: `mgba_load_state`,
`mgba_reset`, and any `mgba_write*`.

### Screenshots — use them liberally

`mgba_screenshot` is the one raw tool you should reach for freely. Take one whenever:

- A listed tool does not cover what you want to know. The objective text, a dialogue box, a
  cutscene, the Preparations screen, a shop or arena screen, a level-up card, a support
  conversation — none of these have a `fe7_*` reader, and a screenshot is how you see them.
- A tool's answer would be **stronger with a picture beside it.** You are about to commit a
  risky attack, a unit's position looks wrong, a menu is open that you did not expect, the
  enemy phase did something the summary did not explain. Take the screenshot, then act.
- You are unsure what state the game is in. `fe7_unstick` already returns one; a plain
  `mgba_screenshot` is the cheaper call when you only want to look.
- Something notable just happened — a death, a boss kill, a village visit, a seize, the end
  of the chapter, the next chapter's title card. The record should show it.

When in doubt, take the screenshot. It costs one call, changes nothing in the game, and the
file is small.

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

### The 27 actions — what you can do, and the few you cannot

The game offers **27 unit actions**. `fe7_act` drives **18 of them with a verified result**,
three more unverified, and cannot yet do the five that open a shop, the convoy or the arena.
All 27 are catalogued in `RAM.md`; you do not need it to play.

Every command is found on the menu by its ROM pointer, and every target is picked from the
game's own target list, read out of memory. Nothing is pressed on an entry or a target the
tool could not name first, and each action below reports a verdict taken from what changed in
memory, not from the absence of an error.

#### What each action needs and what it proves

| `action` | When the game offers it | What to pass | The result says |
|---|---|---|---|
| `talk` | The unit is **next to** a character it has a conversation with. The speaker matters as much as the tile. | `target_slot` + `target_faction` (`enemy` / `green` / `player`), or `target_x`/`target_y`. Optional when there is one candidate. | `RECRUITED … now PLAYER #N` when the character changed sides, or that it did not. |
| `dance` / `play` | Ninian or Nils is next to an ally that has **already acted**. The two words are interchangeable. | The ally, as above. Add `item_slot` only to use one of the four rings instead of the plain dance. | `REFRESHED` — the ally's has-acted flag cleared, so it can act again. A ring buffs and does not refresh. |
| `rescue` | Next to an ally whose Con is at most this unit's Aid. | The ally. | `RESCUED` — this unit now carries it. |
| `drop` | The unit is carrying someone and a free tile is adjacent. | `target_x`/`target_y` of the tile. | `DROPPED` and where the unit now stands. It cannot act until next turn. |
| `take` / `give` | Next to an ally, with a carried unit to move between you. | The ally. | Who is carrying whom now. **Free action** — see below. |
| `trade` | Next to another **player** unit. | The partner, plus `item_slot` (your slot to give) and/or `take_item_slot` (their slot to take). Both together swap. | Both inventories, before and after. **Free action**, once per unit per turn. |
| `steal` | A **thief** with a free slot, next to an enemy carrying an item. | The enemy slot; `item_slot` is the slot in the **enemy's** inventory. Weapons, tomes and staves cannot be stolen. | `STOLEN` and both inventories. |
| `support` | Next to a support partner whose conversation is ready. | The partner. | `SUPPORT GAINED` and the support record. |
| `visit` | Standing **on** an open village or house. | Nothing. | `VISITED`; a village also reads `CLOSED`, and a character or item gained is listed. |
| `door` | **Next to** a door, with a Door Key or a thief's Lockpick. | Nothing. | `OPENED` and the tile that changed. |
| `chest` | **On** a closed chest, with a Chest Key or a Lockpick, and a free inventory slot. | Nothing. | `OPENED` and the item gained. |

`wait`, `attack`, `staff`, `item` and `seize` work as before.

When the entry is not on the menu, the result prints the menu the game did offer and what that
command requires. When you name a target the game does not offer, it backs out with the unit
unspent and lists who it does offer.

#### Free actions leave the unit mid-turn

`take`, `give` and `trade` do **not** end the unit's turn. The game reopens that unit's menu
and waits. Finish with **another `fe7_act` for the same unit at its current tile** — `wait`,
`drop`, `attack`, `item`. It can no longer move. If you act with a different unit first, or
end the turn, that unit's turn simply ends where it stands.

This is what makes the classic plays work: trade a weapon across and then attack with it;
take a carried unit and drop it on the far side in the same turn.

#### Mounted units keep their leftover Move

After `talk`, `rescue`, `drop`, `steal`, `support` or `visit`, a mounted unit (cavalier,
paladin, pegasus, wyvern, nomad, troubadour) is handed its leftover Move. Pass `canto_x` and
`canto_y` to ride on to that tile before it waits — rescue someone and carry them out of
range in one call. Leave them out and it waits where it stands. A destination that is out of
reach or occupied is refused in the result and the unit stays put.

#### Carried units in `fe7_state`

A rescued unit shares its carrier's tile. `fe7_state` tags the pair `CARRYING player #N` and
`CARRIED by player #N (cannot act until dropped)`. A carried unit cannot be selected, is not
attacked, and comes back spent on the turn it is dropped. Carrying halves the carrier's Skl
and Spd, so do not fight with a full saddle.

#### Seeing what a unit is actually offered

`fe7_act(slot, x, y, action: 'seize')` doubles as a **menu probe**. Where Seize is not on the
menu it names every entry and presses nothing:

```
No Seize entry on unit #0's action menu at (11,2) — the menu holds
[attack, talk, item, trade*, wait]. Nothing was pressed; unit unspent at (11,2).
```

A trailing `*` marks a free action. Use it to check that Talk really is offered before you
spend a turn walking the wrong speaker over.

> ⚠️ **Do not probe with it where Seize would genuinely be offered** — a lord standing on a
> gate or throne. There it does not just look: it moves the highlight onto Seize and presses
> `A`, which commits, and on a Seize chapter that ends the chapter. On a Seize chapter that
> is of course the point — but only when you mean it.

#### What is still missing

| Not fully driven | Consequence |
|---|---|
| **Armory, Vendor** | `fe7_act`'s `armory`/`vendor` OPEN the shop (verified), but buying and selling are NOT driven — do that by hand with `mgba_screenshot` + `mgba_press_buttons` while the shop is up. It is infrequent enough not to be worth a tool. Weapon uses are still a campaign-long resource: do not burn a Silver Lance on a soldier an Iron Lance would kill, and new weapons also come from chests and enemy drops, trades and steals. **Secret Shop** is not wired at all. |
| **Supply** (Merlinus's convoy) | `fe7_act`'s `supply` OPENS the convoy (verified) when the unit stands next to Merlinus, but moving items in or out is NOT driven — do it by hand with screenshots + button presses. |
| **Arena** | `fe7_act`'s `arena` OPENS the arena (verified), but fighting a bout is NOT driven — and a bout can kill the unit, so drive it by hand with screenshots + button presses, and only if you mean to gamble. |
| `ride`, `dismount`, `status` | Accepted, but still press `A` and report a raw delta with no verdict. |

**Recruit everyone you can.** A character who joins by Talk is no longer out of reach: check
your chapter's recruit table, bring the named speaker next to them, and use `talk`. Until
then, do not kill them.

---

## The turn loop

0. **`fe7_terrain`** once per chapter — where the gate, villages, forts and impassable
   tiles are. You cannot plan an objective you have not located, and it is three reads.
   Pair it with the opening screenshot so you also know what the objective _says_.
1. **`fe7_state`** — read the board.
   1b. **`fe7_threat`** — the danger map. Do not path enemies by hand; the two mistakes that
   cost HP on Ch.7x (a mage firing through a wall, a diagonal that was really range 2) were
   both pathing errors this call does not make.
2. **Decide.** Who is in danger, who can reach what, what moves the chapter toward its win
   condition. Keep the lord out of the danger map unless the numbers say otherwise.
3. **`fe7_forecast`** before any attack where the outcome matters — a wounded unit, a
   possible kill, or a choice between targets. It costs one call and commits nothing.
4. **`fe7_act`** per unit. Pass `target_slot` so the target is verified rather than guessed.
   Every call needs `reason`: one plain sentence saying why this unit takes this action at
   this tile. It is written for the human reading the run log afterwards, who sees only the
   calls, so name the threat, the kill, the tile or the heal, not the mechanics. The tool
   refuses to press anything without it. Independent moves — destinations all empty right now — can go in ONE tool block; the
   server runs them one at a time. Put a move into a tile another unit is vacating in the
   next block.
5. **`fe7_end_turn`**, then **`fe7_wait`** until the player phase returns. `fe7_end_turn`
   also needs `reason`: one sentence on why the turn is ready to end — who acted, who was
   deliberately left idle, and what you expect the enemy to do. A full enemy phase
   takes about four minutes. That is normal and is the floor — battle animations are already
   off. Do not try to speed it up.

   **Read which answer you got; do not loop blind.** `fe7_wait` fingerprints every unit's
   position and HP across the window, so _"units did move, call again"_ and _"NOTHING CHANGED
   — call `fe7_unstick`"_ are different answers with opposite responses. Calling again on the
   second one is how one run spent four and a half minutes polling a chapter that had already
   ended, and another spent five and a half on a board that was not moving.

   It also reports whether the cursor actually responds. The phase byte flips **before** an
   arrival cutscene finishes, so "player phase resumed" is not by itself proof the turn is
   yours — if it says the cursor is not responding, do not issue unit actions yet.

   Then read **WHAT HAPPENED WHILE YOU WERE NOT LOOKING**, printed on return: deaths, HP
   changes, arrivals, and which units spent a weapon use. That last part is how you find out
   what hit you — a dropped use names the attacker and the weapon it swung. If the summary
   leaves you unsure what happened, take a screenshot before the next move.

### Things that will bite you

- **A tile can be reachable and still refused** if any unit stands on it — including green
  NPCs, who are easy to forget. `fe7_act` checks all three arrays and will tell you.
- **A unit carrying a staff may be unable to use it.** Rank 0 in a weapon type means the
  class cannot use it at all.
- **A level-up freezes a unit's spent flag** until it finishes, so an action can look like it
  never landed when it is only waiting for the level-up to play out. **No button speeds a
  level-up up** — it runs at its own pace. The tools wait it out; do not panic and re-issue
  the action.
- **Ranged weapons exist.** Hand axes, bows and tomes attack from 2 tiles.
- **Ranged attacks go through walls.** A mage inside a sealed room hit Kent through the wall
  at range 2 on Ch.7x, and Rath shot back through it. Walls block movement, not arrows.
- **A diagonal neighbour is range 2, not range 1.** Erk at (10,3) hitting a merc at (11,2)
  was a range-2 attack, so the merc's sword could not counter. Count Manhattan distance.
- **Enemies break breakable walls.** A second "Wall" terrain ID that reads the same on the
  cursor is breakable; soldiers spent lance uses on it for two turns and it became Floor.
  A weapon use with no visible target in the enemy-phase summary usually means this.
- **A drop into a full inventory halts the game on an item list, and A on it SENDS the
  highlighted item** (the unit's equipped weapon) to Merlinus with no confirmation. The tools
  stop and report instead of pressing; answer with `fe7_inventory_full`. Only send a 5-item
  unit to kill a `DROPS` enemy when you mean to.
- **Choosing a weapon re-equips it.** `weapon_slot` on `fe7_act` or `fe7_forecast` moves that
  weapon to slot 0 even when the forecast is cancelled, so re-read `fe7_state` before reusing
  slot numbers.
- **A refused attack costs nothing.** If `fe7_act(action:'attack')` finds no enemy in range it
  backs out and leaves the unit UNSPENT — it does not fall back to Wait. Probing an attack you
  are unsure about is free, so probe.
- **`NO ATTACK` in a forecast is information, not an error.** It means that side cannot fight
  at this range — nearly always a defender that cannot counter — so its numbers were withheld
  instead of being printed from a struct the game never populated. It is good news: nothing
  is coming back at you.
- **A Gate tile does NOT mean the objective is Seize.** Lyn Ch.7 is "Defeat Heintz" and still
  has a gate. Read the objective — the opening screenshot shows it — and do not infer it
  from terrain.
- **Terrain can change mid-chapter** (a door opening, a wall breaking). Re-read `fe7_terrain`
  if the map stops matching what you expect, rather than trusting a stale copy.
- **The field menu holds Suspend directly above End.** Never open the field menu with raw
  presses; `fe7_end_turn` is the only sanctioned way to end a turn. Suspend save-quits the
  chapter to the title screen, and you then have to find your way back into the chapter.
  The one exception is a deliberate restart after two or more units have died; see "When
  the chapter is lost".

---

## When something goes wrong

**Call `fe7_unstick` first.** Before pressing anything, before theorising, before retrying.
It names which situation you are in — input being accepted, a menu open, a target selection,
a chapter event, an info screen, or input genuinely swallowed — and tells you the button each
one takes. Guessing between them wastes presses, and a wrong `A` can commit an action you did
not want.

Then:

- **Do not repeat a failed call more than twice.** If it fails identically twice, it is not
  a dropped input, it is a refusal. Read the message — the tools name the specific cause —
  and do something else.
- **Do not drop to raw `mgba_press_*`** to force a refused action through. That is how
  inputs get lost silently and how the board ends up in a state nobody can explain. Raw
  presses are for the screens no `fe7_*` tool drives; see "When you get stuck".
- **Do not edit `src/fe7.ts` mid-run.** Changes need a rebuild and a restart to take effect,
  so the edit does nothing except make the run inconsistent with the log. Work around it and
  keep playing.
- **Do not fix things.** Fixing one problem mid-run means the next session inherits a game
  and a tool layer that no longer match the log. Work around it, and mention it in the
  summary if it changed how the chapter went.
- **Screenshots are for what is displayed, not for game state.** Use them freely to see
  dialogue text, a menu, the objective, or to sanity-check a surprising memory read. Then
  take the next action from memory, which is checkable.
- **If the game is at the title screen or a save-slot screen, get back into the chapter.**
  Screenshot it, pick the save slot already in use, and choose Resume Chapter if it is
  offered, or Restart Chapter if it is not. Never start a new game, and never erase or copy
  a save.

---

## When you get stuck

Getting stuck does not end the session. Work through these in order:

1. Use the `fe7_unstick` tool.
2. If that doesn't work, use your intelligence to get back to playing the chapter.

### Common ways the game gets stuck

- **The game is on the Preparations screen.** Press Enter to get through it. Enter is the
  GBA's Start button, so press Start with `mgba_press_buttons`, then `fe7_wait`.
- **The mGBA MCP server got disconnected.** Reconnect to it, confirm with `mgba_ping`, and
  carry on from where the game is.
- **An unexpected menu or dialog popped up.** Press Enter to skip it, the same way.

---

## Save states — create, never load

**After every won chapter, save exactly one state**, with `mgba_save_state` and an explicit
absolute `path` under the playthrough folder's `states/` subfolder:

```
<playthrough folder>/states/<session>_ch<chapter>_<slug>.ss
```

For example `.../playthroughs/2026-09-26_14-30/states/s03_ch12_birds-of-a-feather.ss`. Use
the session tag the loop gave you. Never pass a `slot`, and never reuse a path — check the folder first if you
are unsure, and add a suffix rather than overwrite.

Save it **at the start of the next chapter** — once the ending events have been pressed
through and `fe7_state` shows the new chapter loaded (turn 0 on the Preparations screen, or
turn 1 if the chapter has no prep). That is the cleanest point for a human to resume from.
If you cannot get there — the events will not clear, the game went somewhere unexpected —
follow "When you get stuck" and keep working until the next chapter has loaded.

**Never load a state. Never.** Not after a death, not after a lost chapter, not to undo a
bad turn, not to retry a coin-flip attack, not because the board looks wrong. The states
you save are a **fail-safe for the human**, who will decide whether to use them. The same
goes for `mgba_reset` and anything else that rewinds a chapter that is still in play. The
one exception is the game's own Restart Chapter, **after a game over or after two or more
units have died on an attempt below the fourth**, which is how you play a lost chapter again. A campaign that quietly reloads to undo a bad turn is not a campaign,
and it would make the strategy file a lie.

---

## Ending the session

Every session ends with four things: `run_state.json` handed over to the next chapter, your
chapter's section of `CURRENT_RUN_STRATEGY.md` filled in, a final screenshot, and a **result
line** as the last line of your final message. The loop reads the result line, so it must be
exactly:

```
PLAYTHROUGH_RESULT=WON
```

`WON` starts the next session on the next chapter. There is no result line for a lost
chapter or for being stuck, because neither one ends the session: keep playing until the
chapter is won. A missing result line is treated as a crash, and the loop starts a new
session on the same chapter.

### When the chapter is won

1. **Press through the ending.** `fe7_unstick` recognises a chapter-end event and tells you
   Start advances it; keep going through the ending dialogue, the world-map narration and
   the next chapter's opening cutscene. Screenshot the next chapter's **title card** so the
   chapter name and number are on record. Stop pressing when `fe7_state` shows the new
   chapter loaded — turn 0 at the Preparations screen, or turn 1 on the map. **Do not press
   Start on the Preparations screen**; that is the next session's job.
2. **If a screen asks you to choose something** — a save prompt, a slot, anything with a
   Yes/No — take a screenshot first, then follow this table, and record the choice in the
   summary:

   | Screen                                | Choose                                                                                                |
   | ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
   | "Save?" / "Continue?" after a chapter | Yes / the slot already in use                                                                         |
   | A story or difficulty choice          | Should not appear — the tale and difficulty were chosen before the run. Take the highlighted default. |
   | Anything else                         | The highlighted default, and say so in the summary                                                    |

   If it takes you to the title screen, follow "When you get stuck" to get back into the game.

3. **Save the state** (see above).
4. **Hand over `run_state.json`** (see below).
5. **Write the summary** (see below).
6. **Final message**, ending in `PLAYTHROUGH_RESULT=WON`.

### Handing over `run_state.json`

Once the next chapter has loaded, make these changes to `run_state.json`, and no others:

- **`dead`**: append every one of _your_ units that died this chapter. Use the name the game
  shows, one string each. The `FALLEN:` line of `fe7_wait` / `fe7_end_turn` and your own
  summary are the sources. Only the attempt that won counts: restarting a lost chapter
  brings back everyone who fell in the lost attempt.
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

Screenshot the game-over screen, then play the chapter again. Press through the game over,
and from the title screen pick the save slot already in use and choose Restart Chapter.
Units that fell in the lost attempt are back, so do not add them to `dead`. Work out what
went wrong, change the plan, and keep going until the chapter is won.

**Every restart is a new attempt.** Before playing again, add 1 to `attempts` in
`run_state.json` and adjust your chapter's Agent notes in `CURRENT_RUN_STRATEGY.md` with
what the lost attempt taught you, exactly as in "Before you start".

**Restarting because two or more units died** (attempt count less than four; see "What
actually ends a chapter"). There is no game-over screen in this case, so you have to leave
the chapter yourself: screenshot the board, open the field menu and choose **Suspend**,
which save-quits to the title screen, then pick the save slot already in use and choose
**Restart Chapter**, not Resume Chapter. No tool drives these screens; use
`mgba_press_buttons` and a screenshot after each press. This is the one situation where
opening the field menu with raw presses and choosing Suspend is allowed. Still never load a
state and never use `mgba_reset`.

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
   this chapter — a tool quirk, an enemy behaviour, a unit that always needs babysitting.
   One or two lines, appended. Leave it alone if you have nothing cross-chapter to say.
3. Nothing else. Do not add new sections, do not rewrite the general strategy, do not
   delete anyone's notes.

If you lost the chapter or got stuck along the way, say so in your notes: what went wrong,
how you got back to playing, and what you would do differently.
