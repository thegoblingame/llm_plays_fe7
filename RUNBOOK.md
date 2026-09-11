# Run Playbook

**Read this before playing. It is self-contained — you do not need to read anything else to
start, though `RAM.md` is there when you need a fact and `README.md` explains the repo
layout and the current chapter.**

---

## What your job actually is

You have two jobs, and the second one is the deliverable.

1. **Play the chapter.** Get as far as you can.
2. **Record everything the tools could not do.** Every time you wanted an action that does
   not exist, had to work around a limitation, or could not tell what was going on.

**Job 2 is the primary mission. Job 1 is secondary, and exists to generate job 2.** A run
that ends "I played seven turns and it went fine" is a **failed run** — not because playing
well is bad, but because it produced no information. A run where you lose the chapter on
turn 3 having recorded eleven concrete gaps is a good run.

### When the two conflict, information wins. Always.

This is the rule to internalise, because it inverts the instinct a game trains into you.

If finding something out might get a unit killed, or lose the chapter — **find it out.**
Try the risky move to see what the tool reports. Walk a unit somewhere questionable to learn
whether the destination is refused. Spend a turn on an experiment. None of that needs
weighing up, and none of it needs permission. Saves can be reverted; an unanswered question
costs another whole run.

The two goals are mostly *symbiotic* rather than opposed — the further you get, the more of
the game you touch and the more you learn, so playing competently is worth doing. But the
moment they genuinely pull against each other, information wins, every time, without
deliberation.

**Never pause to ask permission.** Not before a risky move, not before something
destructive, not before an experiment that might end the chapter. Just do it and record what
happened.

Unit deaths are expected and inevitable. Losing a chapter is fine. Corrupting the save is
fine — there is a full backup. Never report a loss as though it were a failure; report it as
what happened, and move on.

### What actually ends a chapter

Two things, and they are constraints on play — not things to be anxious about:

- **A lord dies.** Lyn, Eliwood, or Hector. Whichever of them the chapter has deployed.
- **A unit you are required to protect dies**, on a chapter whose objective is to defend
  someone.

Everything else — any other unit dying, the turn limit, a failed experiment — is a normal
outcome. If a chapter ends, say so plainly, note what you learned, and stop; the save gets
reverted and the next run starts fresh.

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

---

## Your tools

| Tool | Use it for |
|---|---|
| `fe7_state` | The whole battlefield in one call. Start every turn with it. `brief: true` when you only need positions and HP. |
| `fe7_reachable` | Where one unit can legally go, as a cost map with allies, greens and enemies marked. |
| `fe7_act` | One unit's whole turn: select, walk to a tile, and commit an action. Five are confirmed by effect: `wait` / `attack` / `staff` / `item` / `seize`. Six more are the **shallow tier** — `visit` / `door` / `chest` / `ride` / `dismount` / `status` — which press A and report the before/after delta instead of claiming success. With `action:'seize'` it also doubles as a **menu probe** — see "The 27 actions" below. |
| `fe7_terrain` | The WHOLE board's terrain in one call, plus `find` to locate tiles by name. Use it at the start of a chapter — this is how you find the gate, the villages and the forts. |
| `fe7_threat` | The enemy DANGER MAP: for every tile, how many enemies can attack it next enemy phase, and which enemies threaten each of your units. Pure read, computed from ROM Move/cost tables. Pass `verify: slot` to cross-check one enemy against the game's own grid. |
| `fe7_inspect` | What is on ONE tile, read off the cursor. Only needed for something `fe7_terrain` cannot answer; note a unit standing on a tile masks its terrain, which `fe7_terrain` does not suffer from. |
| `fe7_forecast` | Both sides' damage, number of blows, hit% and crit% for an attack you have **not** committed to. Hit is printed as the displayed value AND the true chance — FE7 averages two rolls, so displayed 70 lands 81.7% and displayed 30 only 18.3%; plan on the true number. A defender the projection kills first is reported with the chance it survives to counter. Commits nothing. |
| `fe7_unstick` | Why the game seems frozen and what to press. Returns a screenshot. |
| `fe7_note` | Record something the tools could not do. |
| `fe7_end_turn` | End the player phase. Returns quickly. |
| `fe7_wait` | Wait out the enemy phase in resumable chunks. Read WHICH answer you got — "units did move" means call again, "NOTHING CHANGED" means stop and call `fe7_unstick`. If the phase came back between calls it says so and still prints what happened. |

Raw `mgba_*` tools exist, but **prefer the `fe7_*` tools every time**. The raw ones take
absolute hex addresses and blind button presses; the `fe7_*` ones take tile coordinates and
slot numbers and verify every step against memory. Dropping to raw presses mid-run is
almost always a mistake — see "when something goes wrong".

### The 27 actions — what is known, and what still is not

The game offers **27 unit actions**. `fe7_act` takes eleven: five confirmed by effect —
`wait`, `attack`, `staff`, `item`, `seize` — and the six shallow-tier ones, which press A and
report a delta rather than a verdict. All 27 are catalogued in `RAM.md`; you do not need it to play.

**What changed:** the other 22 are no longer *unidentifiable*. Every command has a stable ROM
pointer, and the tool layer reads a live menu and names each entry, so "what can this unit do
on this tile" now has an exact answer instead of a guess. Selecting any of the 27 is a solved
problem — the layer can find an entry, confirm it by pointer and move the highlight onto it
without ever pressing `A` on something it cannot name.

**What is still missing is everything after that `A`.** Each action opens its own screen, and
each needs a memory signal that proves it landed. That is the work, not the identification.

#### Seeing what a unit is actually offered

`fe7_act(slot, x, y, action: 'seize')` doubles as a **menu probe**. Where Seize is not on the
menu it names every entry and presses nothing:

```
No Seize entry on unit #0's action menu at (11,2) — the menu holds
[attack, rescue, item, trade*, wait]. Nothing was pressed; unit unspent at (11,2).
```

A trailing `*` marks an action that does **not** consume the unit's turn. Reach for this
whenever you want to know what a tile really offers, then write a note that names the command
exactly — "the game offered Rescue here and I could not invoke it" is worth far more than "I
wish I could rescue".

> ⚠️ **Do not probe with it where Seize would genuinely be offered** — a lord standing on a
> gate or throne. There it does not just look: it moves the highlight onto Seize and presses
> `A`, which commits, and on a Seize chapter that ends the chapter.

#### How far each of the 22 actually is

| Tier | Actions | What is missing |
|---|---|---|
| **Shallow** — press `A` and it happens | Visit, Door, Chest, Ride, Dismount, Status | Only a confirm-by-effect signal: which memory field proves it worked |
| **Medium** — opens a unit target selection | Rescue, Drop, Take, Give, Talk, Dance, Play, Support | The target-cycling machinery exists but is proven only on the staff and attack paths; plus the same confirm signal |
| **Deep** — a whole new screen to drive | Trade, Supply/convoy, Armory, Vendor, Secret Shop, Arena, Steal | The entire flow. Trade is written but unregistered because its partner-select never matched expectations |

#### What actually goes wrong if you try one

- **You cannot invoke the medium and deep tiers.** `fe7_act`'s `action` stops at the shallow
  tier. The probe tells you what is there; it does not let you do it. Record and move on.
- **A shallow-tier action reports a delta, not a verdict.** Read what changed and judge; if
  it worked, that delta is the confirm signal nobody has recorded yet — note it.
- **Reaching a screen is not completing it.** Everything except `Wait` backs out with `B`, so
  landing on Rescue's target select by accident is recoverable — but getting there is the easy
  half.
- **Confirming is the real gap.** For most of the 22 nothing is known about which memory
  changes prove success. That matters more than it sounds: an action can work perfectly and
  the tool still report that nothing happened, which is the worst failure shape available
  because it invites doing it twice.
- **A menu entry is not a guarantee.** The game offering Rescue means Con and Aid allow it;
  it says nothing about whether your intended target is in range.

**When a menu offers something you cannot invoke, that is a known gap, not a mistake on your
part.** Record it with `fe7_note` *as it comes up in play*, naming the unit, the tile, the
command and what you did instead. Do not go hunting through all 22.

---

## The turn loop

0. **`fe7_terrain`** once per chapter — where the gate, villages, forts and impassable
   tiles are. You cannot plan an objective you have not located, and it is three reads.
1. **`fe7_state`** — read the board.
1b. **`fe7_threat`** — the danger map. Do not path enemies by hand; the two mistakes that
   cost HP on Ch.7x (a mage firing through a wall, a diagonal that was really range 2) were
   both pathing errors this call does not make.
2. **Decide.** Who is in danger, who can reach what.
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
   what hit you — a dropped use names the attacker and the weapon it swung.

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
- **A refused attack costs nothing.** If `fe7_act(action:'attack')` finds no enemy in range it
  backs out and leaves the unit UNSPENT — it does not fall back to Wait. Probing an attack you
  are unsure about is free, so probe.
- **`NO ATTACK` in a forecast is information, not an error.** It means that side cannot fight
  at this range — nearly always a defender that cannot counter — so its numbers were withheld
  instead of being printed from a struct the game never populated. It is good news: nothing
  is coming back at you.
- **A Gate tile does NOT mean the objective is Seize.** Lyn Ch.7 is "Defeat Heintz" and still
  has a gate. Read the objective; do not infer it from terrain.
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
- **Never read game state off a screenshot.** `fe7_unstick` returns one so you can see *what
  is displayed* — dialogue text, a menu, the objective. Game state comes from memory, which
  is checkable. Pixels invite confident misreadings.

---

## Recording — the actual deliverable

Two channels. You only drive one of them.

**Automatic.** Every `fe7_*` call and result is already written to `runs/<date>.jsonl`. You
do not need to do anything, and you should **not** re-report tool failures with `fe7_note` —
they are already captured.

**`fe7_note` — this is your job.** It catches what automatic logging structurally cannot: a
tool that does not exist never fails. If there is no rescue action, nothing errors; you just
quietly never try, and the log looks clean. **Only you know you wanted something that was
not there.**

### Call `fe7_note` the moment you think any of these

- *"I wish I could…"* — a missing action. This is the most valuable kind.
- *"I'll just work around this."* — record it, then do the workaround.
- *"I can't tell what happened."* — confusion is a finding.
- *"That's not what I expected."* — a tool reported something that turned out to be false.
- *"I'm not going to bother, it's too awkward."* — that is a gap talking.

Err heavily toward recording. It is one cheap call, it never blocks, and it changes nothing
in the game. An over-full list is far more useful than a tidy empty one.

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
and never seeing the shape of the whole list — which is exactly the guessing game this run
exists to replace. Triage happens afterwards, with everything visible at once.

The only reason to stop is if you genuinely cannot make progress at all.
