# Chapter Playbook

**Read this before playing a chapter. It is self-contained — you do not need to read anything
else to start, though `RAM.md` is there when you need a fact and `README.md` explains the repo
layout and the current chapter.**

This is the playbook for **beating one chapter**. `SCOUTING_RUNBOOK.md` is its sibling for
runs whose point is to find tool gaps; the two share most of their text and differ in what
the run is for.

---

## What your job actually is

You have two jobs.

1. **Beat the chapter.** This is the primary objective. Clear the win condition — seize the
   gate, defeat the boss, survive the turn count, protect whoever must be protected — with
   as few losses as you can manage, and finish.
2. **Record everything the tools could not do.** Every time you wanted an action that does
   not exist, had to work around a limitation, or could not tell what was going on.

**Job 1 is the mission. Job 2 is secondary, and it is cheap** — one `fe7_note` call that
never blocks and changes nothing in the game — so do it as you go rather than skipping it.
A run that clears the chapter and records the three places the tools got in the way is the
ideal outcome. A run that clears the chapter and records nothing is still a win, just a
less useful one.

Play to win. Take risks when the odds favour them and avoid them when they do not, the way
a careful player would. Experiments are welcome when they are free — a refused attack costs
nothing, a menu probe costs nothing — but do not spend a unit or a turn purely to see what a
tool says. That is the scouting runbook's job, not this one's.

**Never pause to ask permission.** Not before a risky move, not before something that might
lose a unit, not before an experiment. Decide, act, and record what happened. Saves can be
reverted; there is a full backup.

Unit deaths happen. Losing a chapter can happen. Never report a loss as though it were
shameful; report it as what happened, say what you would do differently, and stop.

### What actually ends a chapter

Two things, and they are the constraints you plan around:

- **A lord dies.** Lyn, Eliwood, or Hector. Whichever of them the chapter has deployed.
- **A unit you are required to protect dies**, on a chapter whose objective is to defend
  someone.

Everything else — any other unit dying, a turn spent badly, a failed experiment — is a
setback, not the end. If a chapter ends, say so plainly, note what you learned, and stop; the
save gets reverted and the next run starts fresh.

---

## Before you start

1. `fe7_state` — confirm you get a battlefield with units in it. If turn is 0 and no units
   are listed, no chapter is loaded and you need a human to load one.
2. Check the phase is `player`. If not, `fe7_wait`.
3. If anything looks strange, `fe7_unstick` before pressing anything.
4. **If the phase is `green/prep` and the turn is 0, the Preparations screen is up.** No tool
   drives it. Press Start once with `mgba_press_buttons` (hold 6 frames), then `fe7_wait`; the
   chapter begins on turn 1. Unit slots can be re-sorted when prep closes, so read `fe7_state`
   again before trusting any slot number from before.
5. **Take an opening screenshot** (see "Screenshots" below) so the run's record starts with
   what the screen actually showed — the objective text, the map, and any dialogue.

---

## Your tools

| Tool | Use it for |
|---|---|
| `fe7_state` | The whole battlefield in one call. Start every turn with it. `brief: true` when you only need positions and HP. |
| `fe7_reachable` | Where one unit can legally go, as a cost map with allies, greens and enemies marked. |
| `fe7_act` | One unit's whole turn: select, walk to a tile, and commit an action. On an attack, pass `weapon_slot` to swing a chosen inventory weapon (the Rapier, the Silver Lance); without it the EQUIPPED weapon, slot 0, is always used, and the game re-equips whatever you pick, so re-read `fe7_state` for slot numbers afterwards. Five are confirmed by effect: `wait` / `attack` / `staff` / `item` / `seize`. Six more are the **shallow tier** — `visit` / `door` / `chest` / `ride` / `dismount` / `status` — which press A and report the before/after delta instead of claiming success. With `action:'seize'` it also doubles as a **menu probe** — see "The 27 actions" below. |
| `fe7_terrain` | The WHOLE board's terrain in one call, plus `find` to locate tiles by name. Use it at the start of a chapter — this is how you find the gate, the villages and the forts. |
| `fe7_threat` | The enemy DANGER MAP: for every tile, how many enemies can attack it next enemy phase, and which enemies threaten each of your units. Pure read, computed from ROM Move/cost tables. Pass `verify: slot` to cross-check one enemy against the game's own grid. |
| `fe7_inspect` | What is on ONE tile, read off the cursor. Only needed for something `fe7_terrain` cannot answer; note a unit standing on a tile masks its terrain, which `fe7_terrain` does not suffer from. |
| `fe7_forecast` | Both sides' damage, number of blows, hit% and crit% for an attack you have **not** committed to. Hit is printed as the displayed value AND the true chance — FE7 averages two rolls, so displayed 70 lands 81.7% and displayed 30 only 18.3%; plan on the true number. A defender the projection kills first is reported with the chance it survives to counter. Commits nothing. Pass `weapon_slot` to forecast a specific weapon; the game re-equips it even though nothing is committed. |
| `fe7_unstick` | Why the game seems frozen and what to press. Returns a screenshot. |
| `fe7_note` | Record something the tools could not do, and log every screenshot you take. |
| `fe7_end_turn` | End the player phase. Returns quickly. |
| `fe7_wait` | Wait out the enemy phase in resumable chunks. Read WHICH answer you got — "units did move" means call again, "NOTHING CHANGED" means stop and call `fe7_unstick`. If the phase came back between calls it says so and still prints what happened. |
| `fe7_inventory_full` | Answers the "inventory is full, send an item to Merlinus" list that HALTS the game when a unit holding 5 items picks up a drop. Enemies that drop are tagged `DROPS` in `fe7_state`. `fe7_act`, `fe7_wait`, `fe7_end_turn` and `fe7_unstick` stop and print the six entries when it is up; decide which item is least needed and pass its index. The last entry is the new item, and sending it leaves the kit as it was. |
| `mgba_screenshot` | A picture of the screen, saved to a path you choose. **Use it liberally** — see "Screenshots" below for when and how. |

Raw `mgba_*` tools other than `mgba_screenshot` exist, but **prefer the `fe7_*` tools every
time** for driving the game. The raw ones take absolute hex addresses and blind button
presses; the `fe7_*` ones take tile coordinates and slot numbers and verify every step
against memory. Dropping to raw presses mid-run is almost always a mistake — see "when
something goes wrong".

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
  of the chapter. The record should show it.

When in doubt, take the screenshot. It costs one call, changes nothing in the game, and the
file is small.

**Screenshots supplement memory; they do not replace it.** Game state — positions, HP,
whose turn it is, what a unit can reach — still comes from `fe7_state` and friends, which are
checkable. A screenshot tells you what is *displayed*: text, portraits, menus, the cursor.
If a screenshot and a memory read disagree, trust the memory read for the next action and
record the disagreement with `fe7_note` — that is a real finding.

#### How to take one

Always pass an explicit `path`. Omitting it writes to the system temp folder, where the file
will be lost, and passing an existing path overwrites it silently. Save every screenshot into
this repo's `screenshots/` folder, which already exists, with a name that says when and why:

```
screenshots/<YYYY-MM-DD>_ch<chapter>_t<turn>_<what>.png
```

For example `screenshots/2026-09-11_ch7_t03_boss-forecast.png` or
`screenshots/2026-09-11_ch7_t00_objective.png`. Use the absolute path when you call the tool
(the repo lives at `~/Desktop/fe7_llm_experiments/llm_plays_fe7`). If you take more than one
on the same turn for the same reason, add a suffix (`-2`, `-3`) rather than overwriting.

#### Every screenshot gets a note

Immediately after each `mgba_screenshot`, call `fe7_note` with `kind: "screenshot"`, the
saved path, the turn, and one line on **why you took it** and **what it showed**. The
automatic log records that the tool ran, but not what you were looking for or what you saw,
and a folder of unlabelled PNGs is nearly useless afterwards.

**Keep every screenshot. Never delete or overwrite one.** They are part of the run's record
and are reviewed after the run alongside the notes.

### The 27 actions — what is known, and what still is not

The game offers **27 unit actions**. `fe7_act` takes eleven: five confirmed by effect —
`wait`, `attack`, `staff`, `item`, `seize` — and the six shallow-tier ones, which press A and
report a delta rather than a verdict. All 27 are catalogued in `RAM.md`; you do not need it to play.

Every command has a stable ROM pointer, and the tool layer reads a live menu and names each
entry, so "what can this unit do on this tile" has an exact answer instead of a guess.
Selecting any of the 27 is a solved problem — the layer can find an entry, confirm it by
pointer and move the highlight onto it without ever pressing `A` on something it cannot name.

**What is still missing is everything after that `A`.** Each action opens its own screen, and
each needs a memory signal that proves it landed.

#### Seeing what a unit is actually offered

`fe7_act(slot, x, y, action: 'seize')` doubles as a **menu probe**. Where Seize is not on the
menu it names every entry and presses nothing:

```
No Seize entry on unit #0's action menu at (11,2) — the menu holds
[attack, rescue, item, trade*, wait]. Nothing was pressed; unit unspent at (11,2).
```

A trailing `*` marks an action that does **not** consume the unit's turn. Reach for this
whenever you want to know what a tile really offers. If it names something you needed and
could not invoke, write a note that names the command exactly.

> ⚠️ **Do not probe with it where Seize would genuinely be offered** — a lord standing on a
> gate or throne. There it does not just look: it moves the highlight onto Seize and presses
> `A`, which commits, and on a Seize chapter that ends the chapter. On a Seize chapter that
> is of course the point — but only when you mean it.

#### How far each of the 22 actually is

| Tier | Actions | What is missing |
|---|---|---|
| **Shallow** — press `A` and it happens | Visit, Door, Chest, Ride, Dismount, Status | Only a confirm-by-effect signal: which memory field proves it worked |
| **Medium** — opens a unit target selection | Rescue, Drop, Take, Give, Talk, Dance, Play, Support | The target-cycling machinery exists but is proven only on the staff and attack paths; plus the same confirm signal |
| **Deep** — a whole new screen to drive | Trade, Supply/convoy, Armory, Vendor, Secret Shop, Arena, Steal | The entire flow. Trade is written but unregistered because its partner-select never matched expectations |

#### What actually goes wrong if you try one

- **You cannot invoke the medium and deep tiers.** `fe7_act`'s `action` stops at the shallow
  tier. The probe tells you what is there; it does not let you do it. Plan around it, record
  it, and move on.
- **A shallow-tier action reports a delta, not a verdict.** Read what changed and judge; take
  a screenshot if the delta is ambiguous. If it worked, that delta is the confirm signal
  nobody has recorded yet — note it.
- **Reaching a screen is not completing it.** Everything except `Wait` backs out with `B`, so
  landing on Rescue's target select by accident is recoverable.
- **Confirming is the real gap.** For most of the 22 nothing is known about which memory
  changes prove success. An action can work perfectly and the tool still report that nothing
  happened, which invites doing it twice. Check `fe7_state` (and a screenshot) before
  repeating anything.
- **A menu entry is not a guarantee.** The game offering Rescue means Con and Aid allow it;
  it says nothing about whether your intended target is in range.

**When a menu offers something you cannot invoke, that is a known gap, not a mistake on your
part.** Record it with `fe7_note` *as it comes up in play*, naming the unit, the tile, the
command and what you did instead. Do not go hunting through all 22 — you have a chapter to win.

---

## The turn loop

0. **`fe7_terrain`** once per chapter — where the gate, villages, forts and impassable
   tiles are. You cannot plan an objective you have not located, and it is three reads.
   Pair it with the opening screenshot so you also know what the objective *says*.
1. **`fe7_state`** — read the board.
1b. **`fe7_threat`** — the danger map. Do not path enemies by hand; the two mistakes that
   cost HP on Ch.7x (a mage firing through a wall, a diagonal that was really range 2) were
   both pathing errors this call does not make.
2. **Decide.** Who is in danger, who can reach what, what moves the chapter toward its win
   condition. Keep the lord out of the danger map unless the numbers say otherwise.
3. **`fe7_forecast`** before any attack where the outcome matters — a wounded unit, a
   possible kill, or a choice between targets. It costs one call and commits nothing.
4. **`fe7_act`** per unit. Pass `target_slot` so the target is verified rather than guessed.
   Independent moves — destinations all empty right now — can go in ONE tool block; the
   server runs them one at a time. Put a move into a tile another unit is vacating in the
   next block.
5. **`fe7_end_turn`**, then **`fe7_wait`** until the player phase returns. A full enemy phase
   takes about four minutes. That is normal and is the floor — battle animations are already
   off. Do not try to speed it up.

   **Read which answer you got; do not loop blind.** `fe7_wait` fingerprints every unit's
   position and HP across the window, so *"units did move, call again"* and *"NOTHING CHANGED
   — call `fe7_unstick`"* are different answers with opposite responses. Calling again on the
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
- **A drop into a full inventory halts the game on an item list, and A on it SENDS the highlighted item** (the unit's equipped weapon) to Merlinus with no confirmation. The tools now stop and report instead of pressing; answer with `fe7_inventory_full`. Only send a 5-item unit to kill a `DROPS` enemy when you mean to.
- **Choosing a weapon re-equips it.** `weapon_slot` on `fe7_act` or `fe7_forecast` moves that weapon to slot 0 even when the forecast is cancelled, so re-read `fe7_state` before reusing slot numbers.
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
  record it with `fe7_note`, and do something else.
- **Do not drop to raw `mgba_press_*`** to force it through. That is how inputs get lost
  silently and how the board ends up in a state nobody can explain.
- **Do not edit `src/fe7.ts` mid-run.** Changes need a rebuild and a restart to take effect,
  so the edit does nothing except make the run inconsistent with the log. Record the gap and
  keep playing.
- **Screenshots are for what is displayed, not for game state.** Use them freely to see
  dialogue text, a menu, the objective, or to sanity-check a surprising memory read. Then
  take the next action from memory, which is checkable. When the two disagree, record it.

---

## Recording — the secondary deliverable

Two channels. You only drive one of them.

**Automatic.** Every `fe7_*` call and result is already written to `runs/<date>.jsonl`. You
do not need to do anything, and you should **not** re-report tool failures with `fe7_note` —
they are already captured.

**`fe7_note` — this is your job.** It catches what automatic logging structurally cannot: a
tool that does not exist never fails. If there is no rescue action, nothing errors; you just
quietly never try, and the log looks clean. **Only you know you wanted something that was
not there.** It is also where every screenshot gets its label.

### Call `fe7_note` the moment you think any of these

- *"I wish I could…"* — a missing action. This is the most valuable kind.
- *"I'll just work around this."* — record it, then do the workaround.
- *"I can't tell what happened."* — confusion is a finding. Take a screenshot too.
- *"That's not what I expected."* — a tool reported something that turned out to be false.
- *"I'm not going to bother, it's too awkward."* — that is a gap talking.
- *You just took a screenshot.* — `kind: "screenshot"`, path, turn, why, what it showed.

Err toward recording. It is one cheap call, it never blocks, and it changes nothing in the
game.

### Write notes someone can act on

A note becomes a backlog item, so it needs enough detail to implement from.

**Useless:** `"trade didn't work"`

**Useful:** `kind: "missing_action"`, detail: `"Bartre at 4/40 was standing next to Lyn, who
carries a spare vulnerary. I wanted to hand it over so he could heal himself next turn.
There is no trade action, so he stayed at 4 HP and I retreated him instead, wasting the
turn."`, wanted: `"fe7_act(slot, x, y, action: 'trade', target_slot, item_slot) — or a
standalone tool, since trading doesn't consume the action."`

Name the units, the tiles, what you were trying to achieve, and what you did instead. The
sketch of the call you wish existed is the most useful part.

**Name the command exactly.** The menu probe gives you the game's own name for every entry, so
a note can say *"the menu at (11,2) held `[attack, rescue, item, trade*, wait]` and I wanted
Rescue"* rather than *"I wish I could pick him up"*. That turns a wish into a specification.

---

## Do not stop to fix things

Log it and keep playing. Fixing one problem mid-run means reacting to issues one at a time
and never seeing the shape of the whole list. Triage happens afterwards, with everything
visible at once — notes, the automatic log, and the screenshots together.

The only reasons to stop are that the chapter is won, the chapter is lost, or you genuinely
cannot make progress at all. When you stop, take a final screenshot, say which of the three
it was, and summarise in a few lines: the outcome, the units lost, and the gaps you recorded.
