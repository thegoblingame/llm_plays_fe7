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
| `fe7_act` | One unit's whole turn: select, walk to a tile, and commit an action. On an attack, pass `weapon_slot` to swing a chosen inventory weapon (the Rapier, the Silver Lance); without it the EQUIPPED weapon, slot 0, is always used, and the game re-equips whatever you pick, so re-read `fe7_state` for slot numbers afterwards. Eighteen actions report a verified result: `wait` / `attack` / `staff` / `item` / `seize`, the target-selection commands `talk` / `dance` / `play` / `rescue` / `drop` / `take` / `give` / `trade` / `steal` / `support`, and the map-object commands `visit` / `door` / `chest`. `take`, `give` and `trade` are free actions that leave the unit mid-turn, and mounted units can `canto_x`/`canto_y` on after most of them. `ride` / `dismount` / `status` are accepted but unverified. With `action:'seize'` it also doubles as a **menu probe** — see "The 27 actions" below. |
| `fe7_terrain` | The WHOLE board's terrain in one call, plus `find` to locate tiles by name. Use it at the start of a chapter — this is how you find the gate, the villages and the forts. |
| `fe7_threat` | The enemy DANGER MAP: for every tile, how many enemies can attack it next enemy phase, and which enemies threaten each of your units. Pure read, computed from ROM Move/cost tables. Pass `verify: slot` to cross-check one enemy against the game's own grid. |
| `fe7_inspect` | What is on ONE tile, read off the cursor. Only needed for something `fe7_terrain` cannot answer; note a unit standing on a tile masks its terrain, which `fe7_terrain` does not suffer from. |
| `fe7_forecast` | Both sides' damage, number of blows, hit% and crit% for an attack you have **not** committed to. Hit is printed as the displayed value AND the true chance — FE7 averages two rolls, so displayed 70 lands 81.7% and displayed 30 only 18.3%; plan on the true number. A defender the projection kills first is reported with the chance it survives to counter. Commits nothing. Pass `weapon_slot` to forecast a specific weapon; the game re-equips it even though nothing is committed. |
| `fe7_unstick` | Why the game seems frozen and what to press. Returns a screenshot. |
| `fe7_note` | Record something the tools could not do. |
| `fe7_end_turn` | End the player phase. Returns quickly. |
| `fe7_wait` | Wait out the enemy phase in resumable chunks. Read WHICH answer you got — "units did move" means call again, "NOTHING CHANGED" means stop and call `fe7_unstick`. If the phase came back between calls it says so and still prints what happened. |
| `fe7_inventory_full` | Answers the "inventory is full, send an item to Merlinus" list that HALTS the game when a unit holding 5 items picks up a drop. Enemies that drop are tagged `DROPS` in `fe7_state`. `fe7_act`, `fe7_wait`, `fe7_end_turn` and `fe7_unstick` stop and print the six entries when it is up; decide which item is least needed and pass its index. The last entry is the new item, and sending it leaves the kit as it was. |

Raw `mgba_*` tools exist, but **prefer the `fe7_*` tools every time**. The raw ones take
absolute hex addresses and blind button presses; the `fe7_*` ones take tile coordinates and
slot numbers and verify every step against memory. Dropping to raw presses mid-run is
almost always a mistake — see "when something goes wrong".

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

| Not available | Consequence |
|---|---|
| **Armory, Vendor, Secret Shop** | Nothing can be bought. Weapon uses are a resource for the whole campaign: do not burn a Silver Lance on a soldier an Iron Lance would kill. New weapons come only from chests and enemy drops; trading moves them between units, and stealing takes items, never weapons. |
| **Supply** (Merlinus's convoy) | Items cannot be fetched from or stored in the convoy on the map. |
| **Arena** | No arena fights. |
| `ride`, `dismount`, `status` | Accepted, but still press `A` and report a raw delta with no verdict. |

**Recruit everyone you can.** A character who joins by Talk is no longer out of reach: check
your chapter's recruit table, bring the named speaker next to them, and use `talk`. Until
then, do not kill them.

When a menu offers one of the missing five and you needed it, record it with `fe7_note` *as it comes up in play*, naming the unit, the tile, the command and what you did instead. And when any of the verified actions reports something that does not match the screen, that is exactly the finding this run exists for — note it with the full result text.

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
tool that does not exist never fails. If there is no armory action, nothing errors; you just
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

**Useless:** `"couldn't buy anything"`

**Useful:** `kind: "missing_action"`, detail: `"Kent's last Iron Lance broke on turn 6. He ended
turn 7 standing on the armory at (13,7) and the menu held [armory, item, wait]. I wanted to
buy a Javelin so he could answer the archers. There is no armory action, so he fought the
rest of the chapter with a sword at a triangle disadvantage."`, wanted: `"fe7_act(slot, x, y,
action: 'armory', buy: [item ids]) — it should report gold before and after."`

Name the units, the tiles, what you were trying to achieve, and what you did instead. The
sketch of the call you wish existed is the most useful part.

**Name the command exactly.** The menu probe gives you the game's own name for every entry, so
a note can say *"the menu at (13,7) held `[armory, item, wait]` and I wanted
Armory"* rather than *"I wish I could buy a lance"*. That turns a wish into a specification.

---

## Do not stop to fix things

Log it and keep playing. Fixing one problem mid-run means reacting to issues one at a time
and never seeing the shape of the whole list — which is exactly the guessing game this run
exists to replace. Triage happens afterwards, with everything visible at once.

The only reason to stop is if you genuinely cannot make progress at all.
