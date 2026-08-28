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

Job 2 is the point of the run. Job 1 is how you generate job 2. A run that ends "I played
seven turns and it went fine" is a **failed run** — not because playing well is bad, but
because it produced no information. A run where you die on turn 3 having recorded eleven
concrete gaps is a good run.

**Winning is not the objective.** Unit deaths are expected and inevitable. Losing the
chapter is fine. Corrupting the save is fine — there is a full backup. Never pause to ask
whether something is safe to try, and never report a loss as though it were a failure.

The one thing that genuinely ends a run early: **if Hector dies, the chapter is over.** That
is a constraint on play, not something to be anxious about.

---

## Before you start

1. `fe7_state` — confirm you get a battlefield with units in it. If turn is 0 and no units
   are listed, no chapter is loaded and you need a human to load one.
2. Check the phase is `player`. If not, `fe7_wait`.
3. If anything looks strange, `fe7_unstick` before pressing anything.

---

## Your tools

| Tool | Use it for |
|---|---|
| `fe7_state` | The whole battlefield in one call. Start every turn with it. `brief: true` when you only need positions and HP. |
| `fe7_reachable` | Where one unit can legally go, as a cost map with allies, greens and enemies marked. |
| `fe7_act` | One unit's whole turn: select, walk to a tile, and commit `wait` / `attack` / `staff` / `item`. |
| `fe7_forecast` | Both sides' damage, number of blows, hit% and crit% for an attack you have **not** committed to. Commits nothing. |
| `fe7_unstick` | Why the game seems frozen and what to press. Returns a screenshot. |
| `fe7_note` | Record something the tools could not do. |
| `fe7_end_turn` | End the player phase. Returns quickly. |
| `fe7_wait` | Wait out the enemy phase in resumable chunks. Call repeatedly until it says the player phase is back. |

Raw `mgba_*` tools exist, but **prefer the `fe7_*` tools every time**. The raw ones take
absolute hex addresses and blind button presses; the `fe7_*` ones take tile coordinates and
slot numbers and verify every step against memory. Dropping to raw presses mid-run is
almost always a mistake — see "when something goes wrong".

---

## The turn loop

1. **`fe7_state`** — read the board.
2. **Decide.** Who is in danger, who can reach what.
3. **`fe7_forecast`** before any attack where the outcome matters — a wounded unit, a
   possible kill, or a choice between targets. It costs one call and commits nothing.
4. **`fe7_act`** per unit. Pass `target_slot` so the target is verified rather than guessed.
5. **`fe7_end_turn`**, then **`fe7_wait`** repeatedly until the player phase returns. A full
   enemy phase takes about four minutes. That is normal and is the floor — battle animations
   are already off. Do not try to speed it up.

### Things that will bite you

- **A tile can be reachable and still refused** if any unit stands on it — including green
  NPCs, who are easy to forget. `fe7_act` checks all three arrays and will tell you.
- **A unit carrying a staff may be unable to use it.** Rank 0 in a weapon type means the
  class cannot use it at all.
- **A level-up freezes a unit's spent flag** until dismissed, so an action can look like it
  never landed when it is only waiting on a press. The tools handle this; do not panic and
  re-issue the action.
- **Ranged weapons exist.** Hand axes, bows and tomes attack from 2 tiles.

---

## When something goes wrong

**Call `fe7_unstick` first.** Before pressing anything, before theorising, before retrying.
It tells you which of three situations you are in — input is being accepted, a menu is open,
or input is being swallowed — and each has a different fix. Guessing between them wastes
presses and a wrong `A` can commit an action you did not want.

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

---

## Do not stop to fix things

Log it and keep playing. Fixing one problem mid-run means reacting to issues one at a time
and never seeing the shape of the whole list — which is exactly the guessing game this run
exists to replace. Triage happens afterwards, with everything visible at once.

The only reason to stop is if you genuinely cannot make progress at all.
