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

- (s01) A spare Start press on the map opens the minimap overlay, and fe7_end_turn then fails with "Could not move the cursor"; press B once to close it. fe7_wait on the boss-kill turn can carry straight into the next chapter's turn 1.
- (s03) Named enemies that are recruitable (e.g. Guy, Killing Edge) still attack and crit hard; recruit them early rather than letting them reach the line.
- (s04) In RAIN (Ch.14) every move costs ~3x; fe7_threat ignores weather and both under- and over-claims. Keep healers well clear of archers/nomads regardless of what it prints.
- (s05) fe7_act item without item_slot can pick a non-healing item (Door Key) and waste the turn; always pass item_slot. Dead-end corridors are death traps; get every unit inside the defended pocket on turn 1.
- (s06) fe7_threat is only valid for the positions it was run with — moving your own blockers opens paths. Re-run it after the LAST move, right before fe7_end_turn. Florina rescue+canto is the best way to pull a wounded lord out or ferry Hector over cliffs.
- (s07) The Merlinus tent (cls44) cannot be selected; pressing A on it opens the field menu (B closes it). fe7_inventory_full's "discard" pops a Yes/No confirm with No highlighted: press Left then A. Forecast before a Marcus attack. Without a weapon_slot he swings slot 0, which may be a Silver Lance.
- (s09) Item 0x27 is the Devil Axe — it can backfire on the wielder (Hector 29->3 in one swing). Never use it.
- (s10) FOG maps: an enemy listed by fe7_state but not offered as a target is fog-hidden; end a unit's move within its vision to reveal it first.
- (s11) POISON (Toxin Lance 0x18 knights) kills silently — no FALLEN line — at 1–3 HP per turn; nobody carries an Antitoxin (0x6F is a Torch). Also: enemies passive until in range; fe7_forecast with an unarmed unit presses menu entry 0 (it rescued someone). A throne boss counters everything: plan Marcus's enemy-phase counter, not chip damage.
- (s08) The bottom-right map label is not always the objective — open the field menu Status (Up x2 from Suspend, A, then B) to read it. Vulnerary is item 0x6B. fe7_end_turn can leave the field menu open with Suspend highlighted when it "could not move the cursor"; press B, never A.

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

Defeat the boss (Lv7 knight at (1,9)); killing it ended the chapter with 4 enemies still alive. Lose if Hector dies.

**Recruits:**

None.

**Agent notes:**

**s01 — WON on turn 11, attempt 1, no deaths, no recruits (none available).**
- Hector + Matthew start sealed in the NE room; enemies do not move until Matthew lockpicks the door at (15,3). Hector (Def 8) plugs the doorway and kills soldiers/knight on counters; archers cannot counter in melee.
- Middle of the map is enemy-free once the east group is dead. Matthew opened the south door (11,7) and the chest at (11,5) (got item 0x75).
- Boss knight never moves. Hector's Wolf Beil is effective on it (17 dmg vs 6 back): attack from (1,8) and it dies on the next counter/round.
- Hector Lv2 HP21, Wolf Beil 20 uses, Vulnerary x2. Matthew Lv3, Lockpick 12 uses.
- Note: the human's save had just finished Lyn mode; the "Continue playing?" prompt was answered Yes (default) and the tutorial text talks about Eliwood, but the game loaded Hector's Ch.11 (Hector, ch02), so mode is Hector as expected.
- Ch.12 loaded straight to turn 1 with no prep screen ("Defeat enemy, 12 left").

### Chapter 12 — Birds of a Feather

**Objectives:**

Defeat all enemies (12). Lose if Hector dies.

**Recruits:**

None.

**Agent notes:**

**s02 — WON on turn 9, attempt 1, no deaths, no recruits (none available).**
- Two groups: Hector/Oswin/Serra/Matthew top-left, Eliwood/Marcus/Lowen/Rebecca/Dorcas/Bartre bottom-left. Holding still turn 1-2 let cavaliers and brigands suicide into Oswin/Hector and the south block.
- Boss (fighter, Steel Axe, ~23 atk) walks in on turn ~4; Oswin's lance + Hector counters killed it. It hits Serra for ~21 — keep her sealed: (4,1) is enclosed by impassable tiles when Hector is at (4,2) and Oswin at (5,1).
- The map's mountains/peaks wall off the middle: archer at (4,7) is only reachable via fort (5,7) from the north. Mounts from the south cannot get there quickly.
- Hector Lv5 HP24 (Wolf Beil 11 uses left — running low). Bartre 11/32, Serra 9/19 at handover (heal on Ch13 start).
- Ch.13 loaded straight to turn 1 with no prep screen; objective "Seize gate".


### Chapter 13 — In Search of Truth

**Objectives:**

Seize the gate at (2,10) with Hector (the Lv13 lance-knight boss stands on it). Lose if Hector dies.

**Recruits:**

| character | starts as | recruit with / action    | important condition  |
| --------- | --------- | ------------------------ | -------------------- |
| **guy**   | enemy     | **matthew** talks to him | don't kill him first |

**Agent notes:**

**s03 — WON on turn 18, attempt 1. Lowen died. Guy recruited (Matthew talk, turn 8).**
- Start NE; gate SW at (2,10), reached only via the east corridor (x15-17) then west across the bridges (10,14)/(10,15). Enemies mostly hold until you enter range; forts (8,15),(11,16),(12,16) spawned soldiers/archers turns 2-6.
- Lowen died on turn 7 enemy phase to Guy (Killing Edge, 35% crit) — Guy walks straight at the front around turn 6-7. Keep frail units out of his reach and get Matthew adjacent by turn 6.
- Boss is a lance knight (Def 15 on the gate, Steel Lance). Marcus's Silver Lance doubles it for 14x2 = kill from (2,11), the only adjacent tile.
- Oswin (ch08 knight) baited every group fine with Serra behind. Marcus Silver Lance 17 uses. Hector Lv7, Hand Axe 12, Wolf Beil 9.
- Save prompt after the chapter: chose the slot in use (Ch.13) -> Save. No 13x; went straight to Ch.14 (turn 1, no prep, "Defeat enemy, 18 left").

### Chapter 13x — The Peddler Merlinus (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 14 — False Friends

**Objectives:**

Defeat all enemies (18 at start; reinforcements arrive). Lose if Hector OR ELIWOOD dies.

**Recruits:**

| character     | starts as | recruit with / action                    | important condition               |
| ------------- | --------- | ---------------------------------------- | --------------------------------- |
| **erk**       | green npc | **serra or priscilla** talks to him      | —                                 |
| **priscilla** | village   | **any unit visits the southern village** | protect the village from brigands |

**Agent notes:**

**s04 attempt 1 — LOST turn 9: Eliwood killed by the boss Erik.**
- RAIN all chapter: every unit (ours and theirs) moves ~2-3 tiles; fe7_threat over-claims enemy reach but fe7_act/fe7_reachable are truthful.
- Boss Erik = enemy slot #0 (ch45, Lv14 cavalier, Silver Lance, 28 HP) MOVES and charges. He did 18 x2 to Eliwood (18 HP). Eliwood is a lose condition here — keep Eliwood out of E#0's threat every turn, fully boxed in or far back.
- Erk (green mage, (11,2)) recruited by Serra turn 4 via the bridge (17,1); a brigand/merc/pirate trio harasses him — Marcus kills the north brigand turn 1.
- East: 2 brigands then 2 pegasus knights (turn 5) come from the east edge; Hector/Dorcas/Oswin handle them.
- Southern village (6,14) is too far in rain to save for Priscilla; pirates reach it by turn 5.

**s04 attempt 2 — WON on turn 14. Serra died (turn 9 enemy phase). Erk recruited (Serra talk, turn 4). Priscilla NOT recruited — both villages were razed by pirates before anyone could reach them in the rain.**
- Fix that worked: Eliwood parked at (20,1)-(21,1) in the NE all chapter; Erik never got near him.
- Erik + 3 cavaliers hit Marcus at (10,3)/(11,2) on turn 8 enemy phase; Marcus (Def 11) took 17 and left Erik at 4 HP; Marcus killed him turn 9 (drops a lance).
- Serra died at (13,1), a tile fe7_threat called SAFE, to the nomad archer: in rain the threat map is unreliable — keep Serra two tiles further back than it says.
- Handover: Hector Lv8 26 HP (Hand Axe 9, Wolf Beil 9); Marcus Iron Lance ~6 uses + 2 Silver/steel lances; Erk joined but is benched in Ch.15. No healer left (Serra dead) — vulneraries only.
- The ending events were skipped by fe7_wait's A/Start presses straight into the next chapter's turn 1 (no title card screenshot, any save prompt took the default).

### Chapter 15 — Talons Alight

**Objectives:**

Defend the throne for 7 turns (throne at (5,2)). Lose if Hector dies.

**Recruits:**

None.

**Agent notes:**

**s05 attempt 1 — RESTARTED turn 5: Guy (t2) and Dorcas (t4) died.**
- Throne room x3-7 y2-6; entries are the south stairs (4-6,7) and, once an enemy thief unlocks the NORTH door (9,1) on turn 1, the pocket (9,2)/(9,3) -> (8,2)/(8,3). The east corridor (x9-10, y5-7) is a dead end; door (9,4) stays shut.
- Boss = enemy #0 nomad with a Longbow (range 2-3), roams the east side and shoots through walls: hit Rebecca for 12 turn 1. Rebecca/Marcus/Bartre start in the east corridor — get them out.
- Guy died at (9,2) to mage + thief + boss crossfire. Dorcas (15 HP) died holding (6,6). Hector sitting ON the throne (Def 11 +2) took 0 from melee.
- Reinforcements: fighter from the NW (0,1) turn 3; thieves/mercs from the south stairs (7-9,16).

**s05 attempt 2 — WON (survived 7 turns). Bartre died (turn 3 enemy phase). No recruits in this chapter.**
- What worked: Hector on the throne turn 1; Marcus rescues Rebecca turn 1 and canters to (6,6); Oswin (4,6) + Dorcas/Guy (5,6)/(5,5) seal the stairs. Hector/Guy/Matthew on (5,2)/(6,3)/(6,4) seal the north pocket; intruders (mage, merc, nomad) die to Matthew doubles + Hector.
- The NW fighter BREAKS the wall at (2,3) around turn 4; Matthew killed it and stood on (2,3) to seal the breach.
- Bartre cannot get out of the east corridor once the knight blocks the stairs; he died there to myrmidon + boss. Next time walk him to row 8 west on turn 1, or have him rescue Rebecca and come in.
- Oswin's javelin (range 2, no counter from melee units) carried the south line. Oswin Lv11.
- fe7_act action:'item' with no item_slot picked Guy's Door Key (6A), not his vulnerary — always pass item_slot.
- Handover: Dorcas 4/29 HP at chapter end (full again at Ch.16 start); Marcus Iron Sword 3 uses; Matthew Lockpick? (0D) 11 uses; vulneraries low (Eliwood 0, Hector 2, Guy 1). Ch.16 loaded straight to turn 1, "Seize gate", with new units (Florina? pegasus, Erk, plus a green-start group in the SE).

### Chapter 16 — Noble Lady of Caelin

**Objectives:**

Seize the gate at (21,3) with Hector. Boss = knight (enemy #0, javelin + steel lance) standing ON the gate. Lose if Hector dies.

**Recruits:**

None.

**Agent notes:**

**s06 attempt 1 — RESTARTED turn 10: Erk (t7 enemy phase) and Dorcas (t9) died.**
- Start: main army NW (x0-4,y1-5); Lyn, Kent, Sain, Wil in the SE corner (19-23,13-16). Enemies mostly hold position until you enter range; reinforcements spawn on the forts (15,2)/(15,4) every turn or two, cavaliers at (1,0)/(3,0) NW around turn 9, brigands at (6,16)/(23,16).
- Cliffs between (6-9, 4-8) split the west: cavaliers sit on a ledge at (7-8,6) only hittable at range 2 (Erk from (6,5), Hector hand axe from (5,6)).
- Erk died at (3,8) on a tile fe7_threat had called safe — moving our blockers opened a path. ALWAYS re-run fe7_threat AFTER all moves, before ending the turn.
- Hector at (7,9) took 14 in one enemy phase (two mercs + mage + sword cavalier). Florina rescue+canto pulled him out at 8 HP — good trick.
- Dorcas (29 HP, Def4) died to two mercs (doubled 7x2) + the dark mage after attacking at 23% hit. Forecast every attack; don't swing at low hit with fragile units.
- Middle mob (mercs, cavaliers, mage E#16 with 1-2 range) comes as a wave around turns 7-9 once you move south; fight it from a tight formation, Marcus/Oswin/Hector front.

**s06 attempt 2 — WON on turn 18 (seized). No deaths, no recruits (none in this chapter).**
- The gate plateau (x15-23, y0-8) is cut off from the SE by cliffs (rows 8-10); Lyn's group can never walk up. Reach it via the middle (x12-15, rows 3-7) — Marcus got to (15,4) in one move from (12,8) — or fly: Florina rescued Hector at (17,10), cantoed to (16,5), next turn dropped him at (21,5).
- The gate (21,3) is walled on three sides; (21,4) is the only melee tile. Marcus doubled the boss knight (17x2, 31 HP) from there for the kill.
- NW cavaliers spawn 2 per turn at (1,0)/(3,0) from ~turn 9 to ~13. Oswin alone at (5,5) took 0-1 from all of them and killed ~6 on counters/attacks — leave him as the west wall.
- Enemies sit still until you enter range; bait with Marcus (Def 12) / Hector on forest. Hector Wolf Beil one-shots cavaliers.
- Sain loses ~8 HP every enemy phase in the SE with no visible attacker; keep vulneraries on him.
- Handover: Hector Lv9 (Wolf Beil 3 uses left!), Marcus Lv4 22/34 (Steel Lance x9 uses + one x20), Oswin javelin 4 uses, Dorcas 17/30, vulneraries nearly gone (Hector 2, Kent 2, Sain 1, Guy 1). Ending save prompt: saved to the slot in use (Ch.16).


### Chapter 17 — Whereabouts Unknown

**Objectives:**

Seize the throne at (14,1) with Hector. Boss (enemy #0, cls16, 29 HP, Def ~15, javelin + lance) sits on it.

**Recruits:**

| character  | starts as | recruit with / action      | important condition                       |
| ---------- | --------- | -------------------------- | ----------------------------------------- |
| **raven**  | enemy     | **priscilla** talks to him | recruit him before he gets himself killed |
| **lucius** | green npc | **raven** talks to him     | therefore raven must be recruited first   |

**Agent notes:**

**s07 attempt 1 — WON on turn 18 (seized). No permanent deaths. Raven and Lucius unrecruited (no Priscilla); Marcus killed Raven turn 7.**
- Route: start stairs (10-12,23-25) -> room -> corridor x10-12 row 16 -> hall rows 14-15 -> WEST stairs (0-1,13) are the only way north -> column x0-1 to row 4 -> east along rows 4-5 -> throne room rows 0-3 x11-16.
- Merlinus (slot #21, cls44 tent at (15,26)) cannot be selected or moved; reinforcements (cavaliers + archers, from (0,26)/(0,27) every turn from ~t7) killed him on t10, but he only retreats — he was offered for deployment in 17x. Not a death.
- Enemies mostly hold until approached; Marcus (Def 12, Res 11) one-shots almost everything and Oswin alone at the room (11,16)-(12,19) killed the whole southern reinforcement wave on counters.
- Shamans have 2-2 range tomes (no melee counter); monks in the (3-7,7-9) side room shoot through walls at range 2 — Erk got hit pulling a 2-range trade there.
- Boss is NOT armored for Hammer purposes (Hammer did 19); Marcus doubles him 15x2 from (14,2) for the kill.
- Handover: Hector Lv10 25/28 with Hammer (19 uses) + Hand Axe 7 — the Wolf Beil broke. Marcus has ONLY two Silver Lances (6 and 5 uses) + Thunder + Door Key; give him an Iron/Steel lance ASAP. Oswin Iron Lance ~23. Dorcas 13/31, Erk 11/18. Vulneraries nearly all used up.
- Ending: accepted the side quest (Yes), saved to the slot in use (Ch.17), Deploy Merlinus = Yes. Ch.17x loaded with prep skipped (a queued Start fired) — next session starts at turn 1.

### Chapter 17x — The Port of Badon (gaiden)

**Objectives:**

Speak to Fargus (the "boss", enemy #0 ch0C, on the ship deck at (2,8)) with Hector. Do NOT attack him.

**Recruits:**

| character | starts as | recruit with / action | important condition     |
| --------- | --------- | --------------------- | ----------------------- |
| **canas** | village   | **visit a village**   | must access chapter 17x |

**Agent notes:**

**s08 attempt 1 — WON on turn 18 (Hector talked to Fargus from (3,8)). No deaths. Canas recruited (Eliwood visited the village at (17,6) turn 1).**
- Village (15,9) gives an axe (0x27, Killer Axe?) — given to Hector. Map bottom-right says "Reach Fargus"; the real objective (Status screen) is "Speak to Fargus".
- Enemies hold until you enter range; a 4-unit reinforcement wave (Lv5 paladin, cavalier, troubadour, mage) arrives turn 3 at (12-13,10-12). Killed it in the 1-wide row-10 corridor x16-18 with Oswin as the wall.
- Fargus and the pirate at (5,11) never moved or attacked all chapter, even with Marcus in range; walking Hector straight along row 8 was safe.
- Central mob includes a Killing Edge swordsman (crit 27 vs Hector) — let Marcus double it with an Iron Sword (100% hit). Canas Flux at range 2 doubles pirates.
- Handover: Hector 10/29 (no vulnerary!), Eliwood 5/20, Marcus 17/36 with Iron Sword ~28 + Silver Lance 1 use, Oswin 17/36 Iron Lance 17 (javelin broke), Lucius 8/18, Canas 13/22 (Flux 40, 2 vulneraries). HP resets for Ch.18 unless it carries over — check. Item 0x79 and 0x5E are not heals (used one each by mistake). Ch.18 is "Survive"; prep screen left up for s09.


### Chapter 18 — Pirate Ship

**Objectives:**

Survive 11 turns (shown bottom-right on turn 1).

**Recruits:**

None.

**Agent notes:**

**s09 attempt 1 — WON (survived to end of turn 11). No deaths, no recruits available.**
- Start on the north deck (rows 0-4, entries via stairs (8,5)/(11,5)); fences block mounted paths south. Enemies trickle in: mercs/archers from the east (x14-18, rows 5-10), mages + pirates from the south/west, reinforcement waves t7-t10 at (9-10,13-15), pirates at row 20, more at (18,5)/(18,14). Pirates walk on Deeps/gunnels and flank.
- Marcus (Res 11, Def 13) one-shots mages/pirates; #5 (cls14 armor, Def 17) takes 0 from mercs — those two killed nearly everything. Keep everyone else north.
- **Hector's item 0x27 is a DEVIL AXE (not Killer Axe)**: it backfired turn 5 and took him 29->3. Do not equip it; it is still his slot 0 — re-order or stash it. His other weapons: 0x28 x6, 0x26 x19.
- No healer was deployed and nobody had a vulnerary; HP reset for Ch.19 anyway. Deploy a staff user next time if one exists.
- Ending had no Yes/No prompt that I saw (Start presses carried straight to Ch.19 Preparations: "Defeat Uhai"). Prep screen left up for s10.


### Chapter 19 — The Dread Isle

**Objectives:**

Defeat Uhai (enemy #0, nomad trooper, Killing Edge + Longbow, 33 HP, Def 12) at (13,22) in the fogged south-east corner. FOG OF WAR map.

**Recruits:**

| character | starts as | recruit with / action    | important condition |
| --------- | --------- | ------------------------ | ------------------- |
| **fiora** | green npc | **florina** talks to her | appears turn 3      |

**Agent notes:**

**s10 attempt 1 — WON turn 17 (Marcus killed Uhai). Dart died (turn 2). Fiora joined automatically at chapter end (shows as player ch31 cls32 pegasus) — Florina was not deployed.**
- Dart (cls3A, arrives turn 1 at (8,6)) died on turn 2 to two nomads (bows are effective vs nothing he is, they just hit hard). Pull him back on turn 1.
- Waves of pirates (from (2,0) on the sea) and pegasi (14,0) come early; nomads/archers then mercs arrive t2-t7. Turtling at the start with Marcus/Oswin up front killed nearly everything on counters.
- FOG: fe7_state still lists hidden enemies, but you cannot attack one until a unit is within vision — moving next to Uhai and waiting revealed him. The south-east enemies (boss, myrmidon, monk) never moved; archers only came out when baited.
- Forests and rivers make the south almost impassable for mounts and Oswin (Oswin got stuck at (9,13)).
- Handover: Hector Lv11 29/29 (Iron Axe equipped; Devil Axe still in slot 1 — never use). Marcus Iron Sword ~38 (took Sain's), Sain has only a lance + 1-use sword. No healer deployed; Kent's vulnerary used. Bartre is alive (in run_state 'dead' list from an earlier session error?).
- Ending: Save prompt -> saved to the slot in use (Ch.19). Next chapter loaded straight to turn 1 (Chapter 20, Seize throne; Legault ch36 at (20,16) on turn 1); 19x did not happen.

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

Seize the throne at (12,2) with Hector. Boss (enemy #0, cls16, 34 HP, Def 15, 1-2 range lance) sits on it. Legault (enemy #24, ch36 thief) starts at (20,16) on turn 1.

**Recruits:**

| character   | starts as | recruit with / action          | important condition                     |
| ----------- | --------- | ------------------------------ | --------------------------------------- |
| **legault** | enemy     | **hector or lyn** talks to him | appears turn 2; he may eventually leave |

**Agent notes:**

**s11 attempt 1 — LOST turn 10: Eliwood (lord — his death is a game over in Hector mode) died to three shamans.**
- Start in the SW (x4-11, y16-21). Turn 1: Canas Flux from (5,16) kills the knight at (6,15), no counter.
- Reinforcements spawn EVERY turn or two: archers on the west-room stairs (1,18) (room x0-3 y17-18, its door (2,19) gets opened by the enemy), pegasus knights at (0,21)/(1,20) from turn 8, shamans on (4,13) stairs, archers/axe units in the walled SE room (14-18,18-20) that only shoot over walls. Standing on a spawn stair blocks it.
- The north route is the 1-wide corridor x6 rows 11-16; enemies (paladin, fighters, nomads, cleric, 3 shamans) pour down it. Shamans in a column can all hit the corridor exit (5,15)/(6,15)/(5,16) from (6,13)-(6,15).
- NEVER leave Eliwood (Res 1) — or anyone carrying a unit (halved Spd) — within reach of the corridor. Keep Eliwood far back all chapter.
- Tool hazard: fe7_forecast with a unit that has NO usable weapon presses menu entry 0 — it made Oswin RESCUE Marcus. Check the forecaster actually has a weapon. Oswin's Iron Lance broke turn 6 (only item 0x13 left, unusable); Marcus's Iron Sword/Silver Lance were gone by turn 7 (gave him Fiora's Slim Lance).
- Legault (thief, E#24) ran north via the east column (x20-21) opening chests and ESCAPED around turn 8 — Hector could not get there; to recruit him, send Hector east immediately (or give up on him).

**s11 attempt 2 — RESTARTED turn 33: Fiora (t5, nomad bow — effective vs fliers) and Oswin (poison, t32) died.**
- Turns 1-16 went well: Canas kills the knight, #10 (cls28, ch30) kills the sniper from the opened door (2,19) and stands on the archer stairs (1,18); Marcus/Oswin hold the corridor exit (6,14)-(6,16); Matthew/#10 stand on the pegasus spawns (0,20)/(1,20). Hall (rows 7-9) cleared by ~t16. Pegasus waves t8-t11 at (0,20)/(0,21)/(1,20); Hector/#10 one-shot them.
- THE BOSS (E#0 cls16, throne (12,2), Def 17 on throne, spear 1-2, ATK 25-27) is the real problem: Hector Iron Axe does 4-6, Lyn 2, Marcus Halberd 14 / Armorslayer 17 (single hit), and it counters for 12-13 vs Marcus/Hector, 20+ vs anyone else. There is NO healer and NO vulnerary anywhere (convoy checked: Iron Sword, Armorslayer, Orion's Bolt, Door Key, Red Gem). Marcus must arrive at the throne with ~30+ HP: attack with Armorslayer (17), survive the counter, and the boss's enemy-phase attack on him gets countered for another 17.
- ARMORSLAYER (0x0E) drops from the hall fighter ~t8 (DROPS 0x0E) — with a full inventory the drop prompt can send it to the convoy; it is then in Merlinus's convoy (Merch/supply via menu probe: Down, A, Take).
- Hector's 0x27 is the DEVIL AXE (it forecasts 15 dmg but AS 0 and backfires). 0x75 = Red Gem, 0x6D = Pure Water, 0x6F = Torch, 0x67 = Guiding Ring — none heal.
- POISON KILLS: knights with Toxin Lance (0x18) poison; Oswin went 8->5->3->1->dead over turns with no FALLEN message. Kill Toxin-lance knights at range or with Marcus's Armorslayer (24 dmg one-shot), never let a wounded unit take a Toxin hit.
- Throne-room reinforcements (knights, shamans) spawn top-left (0-5,0-2) from ~t19-t24 and walk to the throne door (12,6)/(12,5). Enemies are passive until you come in range.

**s11 attempt 3 — WON turn 29 (Hector seized). No deaths. Legault not recruited (he escapes ~t8–11; unreachable).**
- Opening that works: t1 Canas kills knight from (5,16); t2 Dorcas hand-axes the wall archer from (10,17), Marcus (6,16)/Oswin (6,17) wall the corridor; t3 Marcus/Oswin kill nomad+merc, #10 (Kent-type cavalier) hits the sniper from the opened door (2,19), t4 finishes it, then sits on the archer stairs (1,18). Matthew opens the west chest (2,17). Fiora seals the west-room doorway (2,19); kill pegasi t9–11 with Hector/#10/Canas.
- Oswin is the corridor-top wall (6,12): the paladin/fighters do 0–3 to him and die to his Javelin counter. The fighter E#7 DROPS the Armorslayer — kill it with a unit that has a free slot (Oswin), then trade it to Marcus.
- Bait the two throne mages out one at a time: a unit at (12,9) can only be hit from (12,7). Marcus (Res 13) one-shots mages/shamans with the Iron Sword; shamans do 0 to him.
- BOSS: Marcus stood next to it at (13,2) WITHOUT attacking; its enemy-phase attack missed and his Armorslayer counter took it 34->2; finished it next turn. Plan for ~13 damage per boss hit on Marcus and keep everything else off him.
- Handover (HP resets between chapters): Marcus Armorslayer x4 left, Iron Sword x23; Hector has Halberd (0x25) + Hand Axe x4 + Devil Axe (0x27, never use); Oswin Javelin x4 only — needs a lance. Lyn's Mani Katti x35. Fiora has Slim Lance/Javelin/Flux. No healer, no vulneraries anywhere — buy/find some.
- Ending: save prompt -> saved to the slot in use (now "Ch.21: New Resolve"). 19x/19xx did not trigger. Ch.21 prep screen ("Defeat Oleg") left up for the next session.

### Chapter 21 — New Resolve

**Objectives:**

Defeat Oleg (enemy #0, cls13, 42 HP, Def 12; equips a range-2-only weapon 0x2D that hits ~15 x2, plus a Killer Axe 0x24) at (24,13) in the walled SE corner. 26x15 town map, no fog.

**Recruits:**

None.

**Agent notes:**

**s12 attempt 1 — RESTARTED turn 5: archer (#4) and Dorcas (#5) died** chasing into the mage/pegasus wave at x13-14 on turn 4. fe7_threat run mid-turn said 'safe' for tiles that later opened up.

**s12 attempt 2 — LOST turn 21: Dorcas then Hector died to Oleg.**
- Turtling at x9-12 (rows 7-8) works: enemies are passive until in range; pegasi/wyverns (Toxin Lance — poisons) and knights die on Hector/Marcus/Lyn counters. Reinforcement fliers spawn at (22-25,0) and (22-25,14) every turn or two until ~t13.
- ROSTER (slot labels are misleading): #5 ch09 = Dorcas (axes), #6 ch0B = a lance-only Lv20 armor (#6 can't use the Hammer/Longsword it carries), #23 ch25 = Ninian (dancer) holding 3 ELIXIRS (0x6C). #8 ch23 is not a healer. Nobody heals; vendor needs gold and the party has 0G.
- WEAPONS RUN OUT: Marcus starts with Armorslayer x4 + Iron Sword — both broke by t9; Dorcas's/Hector's run low. Hector carries Horseslayer (1B) and Halberd (25) he can't use: give them to Marcus/#6 early. fe7_act 'item' cannot find the item list (use reachable keep_selected + A, Down to Item, by hand); trade SWAP (item_slot + take_item_slot) never works — one-way gives only.
- OLEG leaves his corner once anyone enters x≥21 rows 5-14, and then roams (Move 6). He killed Dorcas (30 HP) in one phase with 0x2D and then Hector (31 HP). At player phase he only has 0x2D equipped (range 2) so MELEE attackers take NO counter: Marcus Halberd 17 x2. Kill him on the turn he first comes out: have Marcus (unencumbered, full HP), Hector, Lyn and Ninian (dance Marcus) all within reach of his landing area BEFORE baiting. Never leave anyone carrying a unit near him, and never let him get a phase on Hector.


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
