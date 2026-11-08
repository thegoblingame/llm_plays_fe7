# Playthrough Strategy

Pre-made strategy for the agent, plus the agent's own notes added as it plays. Every chapter has
its own section below with a **Recruits** table (pre-filled by the human) and an **Agent notes**
area (filled in by the agent). Broad, cross-chapter lessons go under **Broad strategy notes**.

## General Strategy

- Always select "yes" to accept side missions when offered the choice to do so.

## Recruiting Units

In each chapter, there are often units that appear as green units (uncontrollable allies) or red units (enemies). These units can often be recruited by executing the Talk action with a specific player-controlled unit, but there are some more complex conditions that have to be fulfilled in order to recruit some characters. For each chapter, you have been provided a list of the recruitable units that appear and the conditions that need to be fulfilled in order to recruit the character. You should try to recruit units if possible, but it is not a strict requirement.

The chapter sections below cover Lyn mode and Hector mode. Eliwood mode is not covered. Recruits are the same on normal and hard difficulty throughout the entire game, so use the list for your mode regardless of difficulty.

## Promoting Units

Fire Emblem has a mechanic known as promotion, where a unit advances to a stronger class. A unit must be at least level 10 to be promoted, although it can go as high as level 20 before being promoted. It is up to you to decide when it is appropriate to promote a unit.

In virtually all cases, a unit is promoted by using a specific consumable item that matches its class. For example, a knight can use a knight crest to be promoted to a general.

## Broad strategy notes

Cross-chapter lessons the agent adds as it plays. Append below.

- Fog of war: an enemy hidden when a unit starts moving is not targetable that move — the menu shows no Attack, even adjacent, while `fe7_state` still lists it. `fe7_act` attack then fails with confusing errors and can land in the Item menu and print a false INVENTORY FULL prompt; do NOT call `fe7_inventory_full` (it would discard). Screenshot, back out with B. Only attack enemies visible on screen before moving.
- If only a non-acting unit (e.g. Merlinus) is left, the phase can end by itself and `fe7_end_turn` reports a cursor error: call `fe7_wait`.
- `fe7_act` item with `item_slot` failed on a unit holding 5 items ("could not put the highlight on Use"); "action menu could not be located" is often transient, so retry once, alone rather than in a batch.
- The game's title card calls this "Ch. 26: Battle before Dawn" while `run_state.json` says hector / Chapter 28, and Eliwood rather than Hector could Talk to Nino. The save may be Eliwood mode, which the recruit tables do not cover: treat their speakers and chapter numbers as unverified.
- On the Restart Chapter prompt the pointer starts on Quit: press Left to reach Start, then A.

## Lyn mode

### Prologue — A Girl from the Plains

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 1 — Footsteps of Fate

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 2 — Sword of Spirits

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 3 — Band of Mercenaries

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | action                                                     |
| --------- | ---------------------------------------------------------- |
| **wil**   | visit southwest village; otherwise he auto-joins on turn 3 |

**Agent notes:**

_(none yet)_

### Chapter 4 — In Occupation's Shadow

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character  | action                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| **dorcas** | **lyn talks to him** while he's an enemy; alternatively finish without killing him |

**Agent notes:**

_(none yet)_

### Chapter 5 — Beyond the Borders

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | action                                              |
| --------- | --------------------------------------------------- |
| **serra** | **lyn talks to her**; otherwise joins after chapter |
| **erk**   | joins with serra                                    |

**Agent notes:**

_(none yet)_

### Chapter 6 — Blood of Pride

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character   | action                                                |
| ----------- | ----------------------------------------------------- |
| **matthew** | visit a northern village; otherwise auto-joins turn 3 |

**Agent notes:**

_(none yet)_

### Chapter 7 — Siblings Abroad

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 7x — The Black Shadow (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 8 — Vortex of Strategy

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 9 — A Grim Reunion

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 10 — The Distant Plains

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

## Hector mode

### Chapter 11 — Another Journey

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 12 — Birds of a Feather

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 13 — In Search of Truth

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action    | important condition  |
| --------- | --------- | ------------------------ | -------------------- |
| **guy**   | enemy     | **matthew** talks to him | don't kill him first |

**Agent notes:**

_(none yet)_

### Chapter 13x — The Peddler Merlinus (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 14 — False Friends

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character     | starts as | recruit with / action                    | important condition               |
| ------------- | --------- | ---------------------------------------- | --------------------------------- |
| **erk**       | green npc | **serra or priscilla** talks to him      | —                                 |
| **priscilla** | village   | **any unit visits the southern village** | protect the village from brigands |

**Agent notes:**

_(none yet)_

### Chapter 15 — Talons Alight

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 16 — Noble Lady of Caelin

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 17 — Whereabouts Unknown

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character  | starts as | recruit with / action      | important condition                       |
| ---------- | --------- | -------------------------- | ----------------------------------------- |
| **raven**  | enemy     | **priscilla** talks to him | recruit him before he gets himself killed |
| **lucius** | green npc | **raven** talks to him     | therefore raven must be recruited first   |

**Agent notes:**

_(none yet)_

### Chapter 17x — The Port of Badon (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action | important condition     |
| --------- | --------- | --------------------- | ----------------------- |
| **canas** | village   | **visit a village**   | must access chapter 17x |

**Agent notes:**

_(none yet)_

### Chapter 18 — Pirate Ship

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 19 — The Dread Isle

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action    | important condition |
| --------- | --------- | ------------------------ | ------------------- |
| **fiora** | green npc | **florina** talks to her | appears turn 3      |

**Agent notes:**

_(none yet)_

### Chapter 19x — Imprisoner of Magic (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 19xx — A Glimpse in Time (gaiden, Hector mode only)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 20 — Dragon's Gate

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character   | starts as | recruit with / action          | important condition                     |
| ----------- | --------- | ------------------------------ | --------------------------------------- |
| **legault** | enemy     | **hector or lyn** talks to him | appears turn 2; he may eventually leave |

**Agent notes:**

_(none yet)_

### Chapter 21 — New Resolve

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 22 — Kinship's Bond

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action               | important condition |
| --------- | --------- | ----------------------------------- | ------------------- |
| **heath** | enemy     | **eliwood, hector, lyn, or ninian** | —                   |
| **rath**  | green npc | **lyn**                             | —                   |

**Agent notes:**

_(none yet)_

### Chapter 23 — Living Legend

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character   | starts as | recruit with / action | important condition |
| ----------- | --------- | --------------------- | ------------------- |
| **hawkeye** | green npc | **hector**            | appears turn 2      |

**Agent notes:**

_(none yet)_

### Chapter 23x — Genesis (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 24 — Four-Fanged Offense (24a Linus version / 24b Lloyd version)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character   | starts as | recruit with / action                | important condition                        |
| ----------- | --------- | ------------------------------------ | ------------------------------------------ |
| **geitz**   | enemy     | **dart**                             | only on the linus version of the map (24a) |
| **wallace** | green npc | **lyn, kent, sain, florina, or wil** | only on the lloyd version (24b)            |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

_(none yet)_

### Chapter 25 — Crazed Beast

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character  | starts as | recruit with / action | important condition             |
| ---------- | --------- | --------------------- | ------------------------------- |
| **farina** | green npc | **hector**            | appears turn 5; **pay 20,000g** |

**Agent notes:**

_(none yet)_

### Chapter 26 — Unfulfilled Heart

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

Vaida appears here as an enemy. Do **not** kill her; she must survive this chapter to be recruitable in Chapter 29.

**Agent notes:**

_(none yet)_

### Chapter 27 — Pale Flower of Darkness

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character  | starts as | recruit with / action                                 | important condition                                           |
| ---------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **karel**  | green npc | **hector or lyn**                                     | mutually exclusive with harken; see the note below this table |
| **harken** | enemy     | **eliwood, marcus, lowen, hector, oswin, or isadora** | mutually exclusive with karel; see the note below this table  |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

_(none yet)_

### Chapter 28 — Battle before Dawn

**Objectives:**

Guard Zephiel for 15 turns (game banner: "Guard Zephiel, n/15 Turn"). Fog of war.

**Recruits:**

| character  | starts as | recruit with / action     | important condition                                              |
| ---------- | --------- | ------------------------- | ---------------------------------------------------------------- |
| **nino**   | green npc | **hector or lyn**         | keep her alive afterward                                         |
| **jaffar** | green npc | **nino must talk to him** | both must survive ch. 28; jaffar then joins automatically in 28x |

**Agent notes:**

s01 attempt 1 (LOST, turn 9 enemy phase: Zephiel killed): Army starts on the north plain. Only land exit used: east stairs (20,3)/(20,4) into a hall, then door (26,6) (enemies opened it on T2) and a one-wide corridor (26,5)-(26,6) south, then (27,12) stairs, x=28 column, (27,17) stair, row 18 west. Zephiel is green ch7A in the centre room (14-16,13-14), whose only entrance is the south stairs (13-14,19). Enemies reach him about T5 and he dies about T9 even using his own heals; walking the army there took until T9, far too slow. Next time: rush only fast units, skip the slow column, and block/kill at the south stairs. Nino green at (25,16): HECTOR GOT NO TALK ENTRY, ELIWOOD RECRUITED HER (from (25,15), she sat at (25,14)). Dart starts with no weapon; Marcus has a spare Iron Axe. Marcus's 5D is Speedwings = +2 SPEED, not Move. Hawkeye's 0x42 is unusable by him. Jaffar's weapon breaks around T8.

s01 attempt 2 (LOST, turn 8 enemy phase: Zephiel killed from 15 HP): full rush with no stair plug. Turn log: Marcus T1 (22,4), T2 (26,5), T3 kills the fighter at (26,7) from (26,6), T4-5 kills the mages at (26,8)/(27,8); Hawkeye T6 (25,18), T7 (19,18), T8 (15,20), which is the earliest I found for anyone to reach the stairs. Too late: 4-5 enemies are already in the room by T7-8 (first entry about T5) and more stand on the stairs. They ignored Hawkeye as a decoy (he took 6) and focused Zephiel. No Preparations screen: deployment is fixed, no healer or staff user. Routes checked on the map: (14,7-9) braces are impassable, the west door route is about as long as the east one and has more enemies. Talk to Nino worked for Eliwood at T8 from (26,16). Not tried: the convoy's contents (Merlinus has never been opened). I have no plan that reaches Zephiel before T8; a new attempt needs a new idea, not a repeat of the rush.

### Chapter 28x — Night of Farewells (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 29 — Cog of Destiny

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action | important condition                          |
| --------- | --------- | --------------------- | -------------------------------------------- |
| **vaida** | enemy     | **hector**            | she must have survived as an enemy in ch. 26 |

**Agent notes:**

_(none yet)_

### Chapter 30 — The Berserker

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 31 — Sands of Time

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 31x — Battle Preparations (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character | starts as | recruit with / action | important condition                                                                                              |
| --------- | --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **karla** | npc       | **bartre**            | bartre must be a **level 5+ warrior**, be deployed, talk to her, and both must survive their forced combat round |

**Agent notes:**

_(none yet)_

### Chapter 32 — Victory or Death

**Objectives:**

_(filled in by the agent)_

**Recruits:**

| character   | starts as | recruit with / action            | important condition            |
| ----------- | --------- | -------------------------------- | ------------------------------ |
| **renault** | ruins     | **visit the northwestern ruins** | must do so **within 11 turns** |

**Agent notes:**

_(none yet)_

### Chapter 32x — The Value of Life (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Final Chapter — Light (two parts)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_
