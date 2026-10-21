# Playthrough Strategy

Pre-made strategy for the agent, plus the agent's own notes added as it plays. Every chapter has
its own section below with a **Recruits** table (pre-filled by the human) and an **Agent notes**
area (filled in by the agent). Broad, cross-chapter lessons go under **Broad strategy notes**.

## General Strategy

- Always select "yes" to accept side missions when offered the choice to do so.
- Once Merlinus has joined your party, you will be prompted at the beginning of every single chapter whether or not you want to deploy him. Always select yes.

## Recruiting Units

In each chapter, there are often units that appear as green units (uncontrollable allies) or red units (enemies). These units can often be recruited by executing the Talk action with a specific player-controlled unit, but there are some more complex conditions that have to be fulfilled in order to recruit some characters. For each chapter, you have been provided a list of the recruitable units that appear and the conditions that need to be fulfilled in order to recruit the character. You should try to recruit units if possible, but it is not a strict requirement.

The chapter sections below cover Lyn mode and Hector mode. Eliwood mode is not covered. Recruits are the same on normal and hard difficulty throughout the entire game, so use the list for your mode regardless of difficulty.

## Broad strategy notes

Cross-chapter lessons the agent adds as it plays. Append below.

- Player-initiated attacks end the turn adjacent to the target, so the enemy swings AGAIN on its phase: count both exchanges before attacking a boss. Waiting adjacent at full HP (they swing first) is often safer. (s01)
- Restart Chapter's "Suspended data will be lost" box: wait for the text, press Left, then A. RNG appears to repeat on restart for identical inputs. (s01)
- Cavaliers (Sain/Kent) cannot cross Mntn tiles; check fe7_reachable early or the lord ends up soloing. (s03)
- Stationary bosses with only a melee weapon can be whittled down for free from range 2 (Wil/Erk) — they never counter. Check fe7_threat across a turn to confirm they do not move. (s06)
- fe7_wait can carry straight through a chapter-ending enemy phase into the next chapter's turn 1; temporary units leaving show as DIED. Screenshot right away. (s08)
- fe7_state's chNN is the identity check: ch23 is Matthew, not Guy. Read the screenshot portrait before assuming who a slot is. (s09)
- A unit on a tile fe7_threat marks '.' can still die: Erk did on Ch8 with no attacker logged. Keep casters 2+ tiles behind the front, not just outside the map. (s10)
- fe7_wait at a chapter change prints units whose slot moved as DIED (Wallace on Ch9->10); check fe7_state before believing it. (s11)
- Switch tiles are invisible to fe7_terrain (read as Floor) and stepping on one interrupts fe7_act's Wait (reported as not confirmed); find them by screenshot and re-read fe7_terrain after. (s07)

## Lyn mode

### Prologue — A Girl from the Plains

**Objectives:**

Seize the gate (3,2). Boss Batta (brigand, 21 HP, Iron Axe) sits on it and never moves; one other brigand at (2,6).

**Recruits:**

None.

**Agent notes:**

s01: WON on attempt 3, seized turn 8. Lyn only; no deaths, no recruits. Opening screen was the tactician entry (chose No → default "Mark").
- Attempts 1–2 lost: Lyn attacked Batta from (3,3) at 16 HP, took his 10-dmg counter, then he attacked again on enemy phase → dead. Never initiate on him unless the kill is guaranteed.
- What worked: bait the lower brigand at (5,7)/(6,8) and kill it, then WAIT adjacent to Batta at full HP (3,3) and let him attack into her 2x5 counter; repeat until he is at ≤5 HP, then attack and seize.
- Restarting reproduced identical rolls when the same moves were made — vary moves to change outcomes.
- Handover: Lyn Lv1-2ish, Iron Sword ~38 uses, 2 Vulneraries.

### Chapter 1 — Footsteps of Fate

**Objectives:**

Defeat the boss (brigand Lv4, 23 HP, Iron Axe, stationary at (13,1)). Four other brigands.

**Recruits:**

None.

**Agent notes:**

s02: WON on attempt 1, boss killed turn 11. No deaths, no recruits. Lyn, Sain, Kent all alive.
- Forests cost Sain/Kent a lot of Move here; check fe7_reachable instead of guessing tiles.
- Brigands only move when you enter their reach. Sain/Kent missed a lot (~45% vs forest brigands); Kent dropped to 1 HP on turn 2 from attacking into a forest unit — don't.
- Boss: Kent waited adjacent at full HP (took 10, countered 8), then retreated+healed; Sain hit, Lyn finished.
- Handover: Lyn Lv3 (Iron Sword 26, Vulnerary x3); Sain Lv1 Iron Lance 44, no healing; Kent Lv1 Iron Lance 43 / Iron Sword 46, Vulnerary x1. Ch2 loaded straight to turn 1 (no prep).

### Chapter 2 — Sword of Spirits

**Objectives:**

Seize the throne (11,1). Boss mercenary (Lv3, 20 HP, Iron Sword) sits on it; 5 brigands. Castle entered from the south (11,6-8); breakable-looking wall at (8,3).

**Recruits:**

None.

**Agent notes:**

s03: WON on attempt 1, seized turn 17. No deaths, no recruits (none available). Lyn got the Mani Katti in the ending.
- Mountains (6,8),(7,7),(7,8),(6,9) seal the west start from the castle side and cavaliers cannot cross them, so Lyn did the castle half ALONE. Kent/Sain only helped on the first 3 brigands (bait them onto the forest at (6,4)).
- Lyn in forest (49 avoid) baits brigands one at a time and kills them on counter; boss (merc on throne, 4x2 vs her) beaten by waiting adjacent + Vulneraries, attacking only when he was at 4 HP.
- Save prompt after the chapter: chose the slot in use (Ch.2), then Save.
- Handover: Lyn Lv6 19/19, Iron Sword only 6 uses left (use the Mani Katti 0A x45, slot 3), 2 Vulneraries (1+3). Sain Lv1 Iron Lance 43. Kent Lv1 Iron Lance 43 / Iron Sword 46, no Vulnerary. Florina (pegasus, Lv1, Slim Lance 30, 3 Vulneraries) joined at Ch3 start. Ch3 loaded to turn 1, no prep.

### Chapter 3 — Band of Mercenaries

**Objectives:**

Defeat all enemies (rout, 9). Boss fighter Lv6 25 HP Steel Axe, stationary at (13,0).

**Recruits:**

| character | action                                                     |
| --------- | ---------------------------------------------------------- |
| **wil**   | visit southwest village; otherwise he auto-joins on turn 3 |

**Agent notes:**

s04: WON on attempt 1, turn 11 (boss died countering on enemy phase). No deaths. Wil recruited turn 1 by Lyn visiting village (3,6).
- Fences: row 5 and column 10 (rows 6-9) wall the map; the only way north is the gap at (11,4)-(11,5). Archers behind the col-10 fence can only be hit by Wil.
- Enemies come to you; Wil (range 2) + Sain/Kent first strikes killed everything without danger. Boss: Wil from (13,2) twice (no counter), then melee from (13,1)/(14,0) only — (12,0) is unreachable from the south in one turn, so bring finishers within range BEFORE starting the boss.
- Mistake: Florina finished boss at 4 HP needing two 3-dmg hits, left it at 1 and sat at 2 HP adjacent; luckily his attack died to the counter.
- Handover: Lyn Lv6 (Iron Sword 5 uses! Mani Katti 45, 1 Vulnerary). Sain Lv2 Iron Lance 38, 2 Vuln. Kent Lv2 Iron Lance 37/Iron Sword 46, 1 Vuln. Florina Lv2 Slim Lance 26, no Vuln. Wil Lv3 Iron Bow 38. Ch4 loaded straight to turn 1, no prep: Protect (green NPC at (7,3)), 7 turns.

### Chapter 4 — In Occupation's Shadow

**Objectives:**

Protect Natalie (green, (7,3)) for 7 turns. 14 enemies; Dorcas (fighter, ch08, Hand Axe) starts at (13,7).

**Recruits:**

| character  | action                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| **dorcas** | **lyn talks to him** while he's an enemy; alternatively finish without killing him |

**Agent notes:**

s05: WON on attempt 1 (survived to end of turn 7). No deaths. Dorcas RECRUITED turn 3 (Lyn talked from (7,5) when he stood at (7,6); he can act the same turn).
- Natalie's room (6-8,2-3) is reachable only through (7,4)->(7,5). Block (7,4) and (7,5) and put everyone else in the room; only (7,6) can melee the (7,5) unit. Rotate the (7,5) holder when hurt (Lyn hit 6 HP once).
- The west wall (3,4) breaks; an archer then stands at (4,2)/(4,3) and shoots (6,2)/(6,3). Keep wounded units on (7,2)/(8,2)/(8,3).
- Handover: Lyn Lv7ish, Mani Katti ~34, Iron Sword 3, no Vulnerary. Kent Iron Lance 34, no Vulnerary. Sain Iron Lance 38, 2 Vuln. Florina Slim Lance 26. Wil Iron Bow 36. Dorcas Lv3 30 HP, Hand Axe 20, 3 Vuln. Ch5 loaded straight to turn 1, no prep: "Defeat enemy" (7 left), 2 green NPCs at (9,5),(8,6).

### Chapter 5 — Beyond the Borders

**Objectives:**

Defeat all enemies (7). Boss: brigand Lv9 29 HP Steel Axe, stationary at (14,9). Serra and Erk start as greens at (6,6),(7,6).

**Recruits:**

| character | action                                              |
| --------- | --------------------------------------------------- |
| **serra** | **lyn talks to her**; otherwise joins after chapter |
| **erk**   | joins with serra                                    |

**Agent notes:**

s06: WON on attempt 1, turn 13. No deaths. Serra recruited turn 1 (Lyn talked from (5,6)); Erk joined with her.
- Enemies mostly stay put until you enter their reach; bait one at a time with a full-HP unit and Serra heals.
- Boss hits 13-17 (Steel Axe, 20 atk) and Kent/Sain only do 4-7 to him: do NOT melee. He never moves, so Wil chipped 4/turn from (14,7) with no counter and Erk's Fire (10 dmg) finished from (12,9). Slow but zero risk.
- Mountains at (10,6)/(13,6) and cliffs at (7-9,7-9) split the map; Erk needed 4 turns to walk around via the north (row 2-3).
- Lyn visited house (8,3) (talk only). Lyn picked up a second Iron Sword (brigand drop).
- Handover: all 8 healthy. Lyn Mani Katti 27, Iron Sword 3 + 46. Kent Iron Lance 36, Sain Iron Lance 33, Florina Slim Lance 24, Wil Iron Bow 30, Erk Fire 38, Serra Heal 26 (3 Vuln), Dorcas Hand Axe 20. Rath (ch1C, nomad) is in the army at Ch6 start. Ch6 loaded straight to turn 1, no prep and no save prompt.

### Chapter 6 — Blood of Pride

**Objectives:**

"Hit switches" (objective box). Three hidden blue switch tiles: (8,1) in the room behind door (8,3), (16,7) in the room behind door (16,9), (12,1) under the boss knight. Standing on the last one ends the chapter.

**Recruits:**

| character   | action                                                |
| ----------- | ----------------------------------------------------- |
| **matthew** | visit a northern village; otherwise auto-joins turn 3 |

**Agent notes:**

s07: WON on attempt 1, turn 14. No deaths. Matthew RECRUITED turn 1 (Rath visited village (4,2)).
- Switches are not shown by fe7_terrain (they read as Floor); find them by screenshot. Waiting on one makes fe7_act report "Wait NOT confirmed" — the switch event ate the menu; re-read terrain, it worked.
- Switch (8,1) opens the central hall (chest at (12,6)) and door (16,3) (chest (16,1)); switch (16,7) opens the boss room. Matthew's Lockpick opens doors/chests.
- Enemies are all stationary except 2 mercenaries in the south who rush on turn 1. Boss knight (26 HP, D10) never moves: Erk Fire from range 2 (22 dmg) + Rath bow finished it, no counters.
- Loot: chest items 0x5A and Armorslayer (0E, given to Lyn), Kent picked up a soldier drop (0x69).
- Save prompt after the chapter: chose the slot in use (Ch.6), Save.
- Handover: all 12 healthy. Rath and Matthew benched by Ch7 deployment (not dead). Ch7 loaded straight to turn 1, no prep; 11 enemies. Lyn: Mani Katti 25, Iron Sword 3+46, Armorslayer 18. Two new units in Ch7 slots #10 (cls41) and #11 (cls1C).


### Chapter 7 — Siblings Abroad

**Objectives:**

Defeat Heintz (shaman Lv5, 22 HP, Flux) who sits on the gate (7,10) and never moves. 11 enemies total.

**Recruits:**

None.

**Agent notes:**

s08: WON on attempt 1, turn 15 (Heintz died countering Lucius on enemy phase). No deaths. Nils (#10) and Lucius (#11) were temporary and left; they show as "DIED" in fe7_wait at the chapter change — they are NOT dead.
- Map is split by peaks/rivers: the only practical route south is the east bridge (17,4), then along x=16-18. The bridge at (13,5) leads into mountains (slow). NE village (17,2) was razed by a fighter on turn 5 before anyone could reach it.
- Lucius (Res 6, Light) is the MVP vs shamans: they do 2 dmg to him and he kills them on counter. Bait each shaman with him alone.
- Heintz: Lucius from (9,10) doubles for 16; few other units can reach a range-2 tile quickly — stage Erk/Wil near (10,9)-(11,9) a turn early.
- fe7_wait pressed straight through the ending into the next chapter (turn 1, 12 enemies, "Defeat enemy"); title card was not captured. Chapter byte at 0x0202BC06 read 0x08, taken as Ch7x. Guy (ch23, myrmidon) and Rath are in the army there.
- Handover: all 10 healthy. Sain picked up a second lance (0x14). Erk Fire ~27, Wil Iron Bow ~27, Kent Iron Lance ~25.

### Chapter 7x — The Black Shadow (gaiden)

**Objectives:**

Defeat enemy (rout, 12 at start + 2 reinforcements). Boss mercenary Lv7 24 HP Steel Sword sits at (2,1) in the NW room and never moves. Indoor map, 15x17.

**Recruits:**

None.

**Agent notes:**

s09: WON on attempt 1, turn 17 (boss died countering Sain on enemy phase). No deaths, no recruits (none available).
- Start is the SE corner. Two approaches: the west corridor (x=7, via (7,12)-(7,15)) and the 1-tile choke (12,11)->(12,12) into the east corridor (x=14). Enemies trickle in over turns 1-8; hold chokes and let them come.
- Rath (bow, doubles for 13-14) is the MVP: 4 kills from range with no counters. Lyn took 18 in one enemy phase holding (12,11) (archer + soldier); keep her off the choke.
- Remaining mages/shamans/mercenaries are stationary in the north; Sain takes only 1-2 dmg from the mercenaries — bait with him.
- Boss room door (2,3) was already open (enemies opened it); Rath from (2,3) + Sain from (2,2) took him 24->2, Sain's counter finished.
- #9 ch23 is MATTHEW (thief, Lockpick 6A), not Guy. Item 0x69 (Kent->Sain) is not a Door Key.
- Handover: all 10 alive. Ch8 loaded straight to turn 1, no prep; Matthew benched (fe7_wait printed him as DIED — he is not). Lyn Mani Katti 23; Rath Iron Bow 11 uses (low!); Kent Iron Lance 18; Dorcas Hand Axe 14; Serra Heal 17.

### Chapter 8 — Vortex of Strategy

**Objectives:**

Defeat enemy (rout, 14 at start). Start NW corner; village (13,3) NE guarded by monk+cleric; armory (1,3).

**Recruits:**

None.

**Agent notes:**

s10: WON on attempt 1, turn 20 (rout). Erk DIED (enemy phase turn 5->6, at 8/18 HP on (3,4), which fe7_threat called safe; no attacker logged — cause unclear). No recruits available.
- Start NW is boxed in by cliffs; exits are (3,5)/(4,5) south and (5,4)/(6,4) east. Enemies stay still until you step near, then the south group (cavaliers, soldiers, archers, merc) floods the (3,5) choke; more soldiers arrive from (4-6,15-16) turns 3-5.
- Soldiers (cls38) have 0 Def: Dorcas hand axe / Rath double-kill them from range 2. Brigand razed the village (13,3) on turn 5; unreachable in time.
- Boss: armored knight (Def 11, 19 Atk, never moves) at (12,15). Only Sain (6x2) hurts it; Kent/Lyn do 2, Florina 0. Did it with Sain hit -> Kent rescue+canto out -> fort regen -> Kent chip + Sain finish.
- Handover: Rath's Iron Bow BROKE (no weapon; buy one), Dorcas hand axe ~0-1 uses, Kent Iron Lance ~10, Serra Heal ~13. Kent/Sain Lv5, Dorcas Lv5.
- Do differently: keep wounded casters well back (2+ tiles behind the line), and heal the same turn; bring a hammer/mage for the knight.
- Ch9 loaded straight to turn 1 (no prep). New units: Nils(?), Wallace (ch2C knight), Matthew deployed.

### Chapter 9 — A Grim Reunion

**Objectives:**

Seize gate (17,13), held by boss (cls2A knight-type, Lv1 30HP D10, item 1C/28). 5 enemies at start, expect reinforcements. Map 20x15; start west; village (1,5), house (14,1).

**Recruits:**

None.

**Agent notes:**

s11: WON on attempt 1, turn 17 (Lyn seized). No deaths, no recruits (none available).
- Reinforcements spawn from the forts every turn for ~5 turns (brigands on peaks, cavaliers, archers, soldiers); hold the start area and kill them as they arrive. They stop around turn 7.
- The NW pocket (x0-2, y0-2) is a cliff-locked dead end: Kent got trapped there and was whittled to 4 HP by a cavalier + 2 archers. Don't send cavalry north on turn 1.
- Brigands (cls39) are easy: Lyn doubles for 20, Matthew's sword doubles; Wallace takes 0 from them.
- Boss (cls2A, javelin/hand axe, Def 12 on gate, gate heals +3/turn) never moves; only (17,14) is adjacent. Wallace (Def 15) takes 3 per hit and traded with it for 4 turns until a crit killed it. Lyn would take ~16 — keep her away until it dies.
- Village (1,5) visited by Matthew turn 1: gave item 0x6F (x5).
- Save prompt after the chapter: chose the slot in use (Ch.9), Save.
- Handover: all 11 deployed alive. Ch10 loaded straight to turn 1 (no prep); Wallace is now player #11, a new cls1C unit is #10. Dorcas has NO weapon (Hand Axe used up); Wil Iron Bow 22; Kent Iron Lance ~5 uses (has a spare 14x45); Sain Iron Lance 7 + Iron Sword. #3 (ch1D) carries no staff — no healer this chapter, only vulneraries.

### Chapter 10 — The Distant Plains

**Objectives:**

Seize gate (2,16) SW corner; boss general-type (cls16, 35HP D14, R7) sits on it. 11 enemies at start. Start NW; bridge (7,2) east, rivers cut the map. Village (15,12), houses (3,1),(16,2),(13,16), armory/vendor (12,15)/(11,15).

**Recruits:**

None.

**Agent notes:**

s12: WON on attempt 1, turn 24 (Lyn seized). No deaths, no recruits (none available). LYN'S TALE IS COMPLETE.
- Map is sand: plain tiles cost 2 for most units, so cavalry crawl. The only way out of the NW start is the bridge (7,2); the only way south is the bridge (16,6), then west over the bridge (11,11).
- Enemies wait until you come near. An archer hit Lyn from 4 HP short of death on turn 2, at a tile fe7_threat had marked safe as she crossed the bridge. Send Wallace across first.
- Cavalier reinforcements arrive at (7,12) on turns 5-10. Wallace on the (16,6) bridge (Def 16, takes 0) plus the mage firing across the river killed them all.
- Boss (cls16, D14 on the gate, castle at x1-3 y14-16): mage Lv6 kills the knight at (2,17) from (4,17), then chips the boss from (3,17) for 14 a turn. The boss only counters at range 2 once it switches to its javelin (16 dmg). Lyn's swords do 3.
- Brigand razed the village (15,12) before we got there. Florina carries NO weapon.
- Ending: "Here ends Lyn's story. Save?" -> Yes, slot 1 (was Ch.10); it saved as "Ch.11: Taking Leave". Next came "Would you like to continue playing?" (Yes/No), which I LEFT UNANSWERED for the human, because Eliwood mode is not in this file.

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

_(filled in by the agent)_

**Recruits:**

| character  | starts as | recruit with / action     | important condition                                              |
| ---------- | --------- | ------------------------- | ---------------------------------------------------------------- |
| **nino**   | green npc | **hector or lyn**         | keep her alive afterward                                         |
| **jaffar** | green npc | **nino must talk to him** | both must survive ch. 28; jaffar then joins automatically in 28x |

**Agent notes:**

_(none yet)_

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
