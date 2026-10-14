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

- Re-run `fe7_threat` AFTER moving units, not just before: a tile a unit vacates opens a path. On Ch.13, Rebecca stepped from (15,5) to a "safe" (15,4) and a pegasus took the tile she left. Also forecast EVERY attack, even "sure" finishes: a 3-HP cavalier standing in a forest made Eliwood's attack 68%, and he ate 10 damage.
- Blocking works: enemies (fliers included) cannot path through your units. Surround a fragile lord's open tiles so at most one melee attacker can reach anyone. Marcus on a fort and Oswin (Def 13) make excellent bait.
- RAIN (Ch.14): your units' plain costs double (mounted units pay 3), but `fe7_threat` ignores weather, and on Ch.14 enemy fliers and pirates still moved their full range. Trust the threat map, not "the rain slows them too". Pirates walk on river and sea tiles. (s02)
- Counters use the EQUIPPED weapon (slot 0). Before using a unit as bait, equip its cheap weapon with a forecast plus `weapon_slot`, or it will burn Javelin or Silver uses. `fe7_wait`'s A/Start presses can run straight through the post-chapter save prompt AND the next chapter's Preparations. (s02)
- Enemy fighters break "Wall" tiles with the second wall ID (1B in `fe7_terrain`) within about two turns, and enemy mercs/thieves carry Door Keys and open doors. A "sealed" room isn't. Give a blocker a margin of 8+ HP over the worst all-hit total; a 2-HP margin lost Dorcas to a crit. Use vulneraries on the turn before they are needed, not after. (s03)
- HECTOR HAS NO WEAPON after Ch.15. With no shop or trade tool, treat him as a non-combatant tank. He still blocks well (Def 14), but he cannot counter. (s03)
- The Preparations screen has a working **Trade** menu, driven by raw presses with a screenshot after each because input lags. Use it every chapter to put weapons where they matter. **Ballistae are invisible to `fe7_threat`**: unexplained damage with no enemy weapon use is a ballista (range 3-10), so screenshot the map to find it. An enemy whose counter weapon is the equipped melee weapon cannot counter at range 2: forecast it, since free chip damage may be available. (s04)
- **Survive maps (Ch.18): the turn counter "N/11" means you must survive the T11 ENEMY phase too.** The win event fires at the start of T12. Turtle the lord in a corner where every adjacent tile is either one of your units or a gunnel only a flier can stand on, and keep a flier of your own on that gunnel. Kill the enemies that reach the edge of your formation each player phase rather than holding wide chokes. A wall unit must survive the worst all-hits total of only the attackers that can actually reach it; check that with `fe7_threat` after the final move. (s06)
- Never edit `run_state.json` with `sed` number patterns: an attempts bump also rewrote every `completed` entry with the same value. Use a JSON load/dump. (s06)

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

Seize the gate at (2,10) (bottom-left, inside a walled pen entered only from (2,11)). Boss: Lv13 Knight on the gate, Steel Lance, Def 15.

**Recruits:**

| character | starts as | recruit with / action    | important condition  |
| --------- | --------- | ------------------------ | -------------------- |
| **guy**   | enemy     | **matthew** talks to him | don't kill him first |

**Agent notes:**

- s01 (attempt 1, start): 10 deployed — Hector, Eliwood, Marcus, Rebecca, Lowen, Bartre, Oswin, Serra, Matthew, Dorcas. 19 enemies: 6 pegasi (Move 7, fly), 5 archers, 4 cavaliers, a brigand, a lance unit, Guy (Myrmidon, KILLING EDGE) at (7,14), boss.
- Guy cannot be recruited (no Talk tool) — expect him in `unrecruited`.
- River is impassable to foot/mounted units (Lords/brigands only at cost 5); the only crossing to the gate side is the bridge at (10,14)-(10,15). Route: east pass (15-17,7-8) -> south basin -> bridge -> west.
- Villages: (12,9) entered from (12,10); (1,2) in the far NW across the river.

**s01 result — WON on attempt 1, seized turn 17. No deaths. Guy not recruited (killed by Oswin T7; no Talk tool).**
- How it went: held the NE start until the east pass (17,7) was clear, then used Marcus on the fort (13,13) and Oswin as bait while everyone else sat on 0-threat tiles. Enemies came in piecemeal and died on counters. Crossed at the bridge (10,14). The boss never leaves the gate: Oswin Javelin + Hector Hand Axe chip from range 2, then Marcus Silver Lance from (2,11) (crit killed it). Pegasi died charging Marcus/Oswin.
- Both villages were razed by brigands before anyone could visit: (12,9) on T4, (1,2) around T9. To get them, send someone (12,10) by T3. Reinforcements spawn from the forts (8,15), (11,16), (12,16), (0,13) through about T7.
- Level-ups: Hector 7, Eliwood 2, Marcus 2, Rebecca 2, Oswin 10, Serra 4, Dorcas 7. All at full HP at handover.
- Weapon uses: Hector Hand Axe 6 / Wolf Beil 9 (Wolf Beil is effective vs cavalry, 21 dmg). Marcus Silver Lance 18 / Iron Sword 18 (sword running low). Serra Heal 19. Oswin Javelin 14 / Iron Lance 33. Rebecca Iron Bow 41.
- The army has no magic: the Def 15+2 gate knight was only killable by Marcus. Expect armoured bosses to be Marcus's job until a mage joins (Erk in Ch.14).
- Save prompt after the chapter: chose Save, slot 1 (the slot already in use, "Ch.13"). 13x did not trigger; the game went straight to Ch.14 (Preparations, objective "Defeat enemy").

### Chapter 13x — The Peddler Merlinus (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 14 — False Friends

**Objectives:**

"Defeat enemy" — rout all enemies (30 at start, plus fort spawns). Rain mid-chapter. Boss Erik (Cavalier, Steel Lance).

**Recruits:**

| character     | starts as | recruit with / action                    | important condition               |
| ------------- | --------- | ---------------------------------------- | --------------------------------- |
| **erk**       | green npc | **serra or priscilla** talks to him      | —                                 |
| **priscilla** | village   | **any unit visits the southern village** | protect the village from brigands |

**Agent notes:**

**Objective:** "Defeat enemy" = rout (30 at start; pegasi and pirates spawn from the forts (22,14), (27,14), (17,16) through about T6). Boss Erik (Cavalier, Steel Lance) starts at (3,7) with the west cavalry block.

**s02 result: WON on attempt 1, rout finished on the T15 enemy phase. Rebecca died (T8). Erk and Priscilla not recruited.**
- Map: you start in the NE pocket (x≥18, y≤8), cut off by a river with two bridges: (17,1) and (20,5). One tank on (18,1) and one on (21,5) seals the pocket against ground units. Five soldiers and a knight start inside the pocket at x=27: Oswin as bait on (24,3) killed four of them on T1.
- Erk (green, (11,2)) wandered west and was killed around T3, which you can't stop without a Talk tool. Both villages ((9,2) and the Priscilla village at (6,14)) were razed by T5-6 by brigands/pirates from the far west and south, and you can't reach them in time from the NE start. Treat Priscilla as unobtainable without a fast flier.
- **Rain from about T5-T10 doubled MY units' plain costs (cavaliers paid 3), but enemy pegasi and pirates still moved their full range.** I assumed the enemies were slowed too, and Rebecca was killed by a pegasus plus a pirate that walked up the river. Pirates cross rivers and sea, so the "sealed" pocket leaks through river tiles.
- Level-ups: Hector 9, Eliwood 3, Oswin 11, Bartre 5, Dorcas 8, Lowen 4, Serra 5. Hector picked up Erik's Steel Lance (unusable by him, sitting in his inventory).
- Weapons at handover: **Hector Wolf Beil 4 / Hand Axe 5**. Marcus has only the Silver Lance (15) because his Iron Sword broke. Oswin has Iron Lance 30, Javelin 1. Serra Heal 12. Eliwood Rapier 30. Weapons are now critically short.
- Handover: the wait tool's A/Start presses ran through the ending, the save prompt (choice not seen) and Ch.15's Preparations, so **Ch.15 had already started (turn 1, player phase) when I took over again**. Nobody was re-deployed; the same 9 units are out (Rebecca gone). Everyone is near full HP.
- Next time: keep Rebecca and Serra off any tile a pegasus or pirate can reach even in rain (trust `fe7_threat`, not hand-pathing). Equip Oswin's Iron Lance before baiting so his counters don't burn the Javelin (he spent 12 Javelin uses on T1).

### Chapter 15 — Talons Alight

**Objectives:**

"Defend throne" — hold the throne at (5,2) until the end of turn 7. Hector starts on it.

**Recruits:**

None.

**Agent notes:**

- s03 (attempt 1, start): 15x17 indoor map. Throne room is x3-9, y2-6, walled. Entrances: the south mouth (4,6)-(6,6) between braces (one wall of 3 blockers), the locked doors (9,4) and (9,1), and a BREAKABLE wall at (2,3) (terrain 1B). Stairs (spawn points?) at (0-1,6), (9-10,6), (4-6,7), (1,12), (11,12), (7-9,16). Chests at (2,14), (4,14), and an enemy thief heads for them.
- Matthew, Lowen and Marcus start outside in the east pocket. Matthew can open (9,4) with his Lockpick (the `door` action works).
- 16 enemies at start: 4 nomads (one is a Lv15 named one with a Longbow, range 2-3), 4 knights, 2 soldiers, 2 archers, 2 shamans, a merc and a thief.

**s03 result: WON on attempt 1. The chapter ended by itself after the turn-7 enemy phase. Dorcas died (T5 enemy phase). No recruits in this chapter.**
- The room has FOUR entrances, not one. An enemy merc with a Door Key opened (9,1) on T1, fighters broke the wall (2,3) by T3, and the south mouth needs 3 bodies. The holding pattern that worked: Hector on (9,2) (Def 14, the bows do nothing to him), Bartre on (3,3) (only one fighter can reach it, from (2,3)), and Marcus/Oswin + one more across (4,6)/(5,6)/(6,5)-(6,6). The braces (3,6), (7,6), (3,7) and (7,7) are impassable. Hector can leave the throne. Nobody ever went for it.
- Dorcas died on (6,5) at 26 HP, facing one myrmidon (doubling him) plus a shaman, with a 2-HP margin; a crit or a level difference killed him. Don't leave a blocker with a margin under about 8 HP. Kill the south shamans first: they are the only thing that hurts the wall.
- Reinforcements: fighters (hammer and hand axe) from the NW (0-1,0-3) every turn, cavaliers from (14,9)/(14,11), and swords from the south stairs.
- Level-ups: Hector 10, Eliwood 4, Bartre 7, Oswin 12. All units full HP at handover (chapter heal).
- **Weapons at handover are critical. Hector has NO usable weapon (Wolf Beil and Hand Axe both broke; he holds only an unusable Steel Lance).** Marcus Silver Lance 10. Oswin Iron Lance 21 / Javelin 1. Bartre Iron Axe 29 / Hand Axe 10. Lowen Iron Lance 31 / Iron Sword 42. Eliwood Rapier 27. Matthew Iron Sword 36. Serra Heal 6 + 2 Vulneraries. Hector's and Eliwood's vulneraries are used up.
- Handover: one Start press after the win skipped the ending straight to Ch.16 Preparations ("Seize gate"). No save prompt or title card was seen; `fe7_wait`'s presses had already cleared 8 event screens.

### Chapter 16 — Noble Lady of Caelin

**Objectives:**

"Seize gate": the gate is at (21,3) inside castle walls and can only be entered from (21,4). Boss: a Lv8 Knight with a Steel Lance and a Javelin, who never leaves the gate (Def 14 on the gate, regenerates about 3 HP a turn).

**Recruits:**

None.

**Agent notes:**

**s04 result: WON on attempt 1, seized turn 25. No deaths.** Lyn, Sain, Kent and Wil start in the SE corner; Florina starts with the main group in the NW.
- **Use the Preparations Trade menu** (raw presses; inputs lag about one screenshot behind, so screenshot after every press). I gave Bartre's Hand Axe to Hector, Hector's unusable Horseslayer to Marcus (one-shots or doubles cavaliers) and Lowen's Iron Sword to Marcus, and moved Serra's Vulnerary to Hector. The convoy was empty, with 0 gold.
- The NW start is a pocket sealed by a diagonal cliff; holding a 3-tile line at (3,8)/(4,8)/(5,8) shuts out ground units. **Cavaliers spawn at (1,0)/(3,0) INSIDE the pocket, two per turn, on turns 9-12**, then stop. Forts (15,2)/(15,4) spawned cavaliers and mercs on turns 4-5.
- **The SE archer sits on a BALLISTA at (22,9)** (and earlier near (20,8)): 16 attack at range 3-10, which `fe7_threat` does not show and which spends no weapon use. It took Lyn from 18 to 4 and Kent from 11 to 1. Stay 11+ tiles away. Cliffs at rows 9-10 seal the SE corner from the north; kill it by flying Florina onto the adjacent cliff (21,9), where neither the bow nor the ballista can answer.
- Boss: it starts with the Steel Lance equipped and does NOT counter at range 2, so javelin/bow chip is free until it attacks someone with its javelin on its own phase. After that the javelin is equipped and it counters at range 1-2 (21 attack). Marcus at full HP (fort-healed 6/turn from 1 HP) with the Silver Lance (15×2) killed it; Hector then walked through allies onto (21,3).
- Level-ups: Hector 11, Florina 11, Bartre 8, Kent 5, Lowen 5, Lyn 4, Wil 7, Serra 6, Marcus +1.
- **Weapons at handover are critical:** Hector has NO weapon (Hand Axe broke; one Vulnerary). Serra's Heal broke, so there is **no healer**. Marcus has Silver ~8, Horseslayer 1, Iron Sword 34. Oswin has Iron Lance 15 and possibly 1 Javelin. Florina has Javelin ~16, Slim Lance 5, and a Fire tome she can't use. Bartre Iron Axe 23, Lowen Iron Lance 26, Eliwood Rapier ~25, Lyn Mani Katti 42 + 1 Vulnerary, Sain Iron Lance 37, Kent Iron Sword 45, Wil Iron Bow 41, Matthew Iron Sword 35.
- Ending: one Save prompt; I chose slot 3, the highlighted slot already holding the latest progress ("Ch.16"). Merlinus spoke over Ch.17 Preparations and one A press passed it with no Yes/No seen, and Merlinus is not in the deployed list. The next session should check Pick Units. Ch.17 is "Seize throne".

### Chapter 17 — Whereabouts Unknown

**Objectives:**

"Seize throne": the throne is at (14,1), top right. Boss: **Bernard** (General, Lv1, HP 32, Def 14 +2 on the throne, Res 11, Steel Axe + Javelin), who never leaves the throne.

**Recruits:**

| character  | starts as | recruit with / action      | important condition                       |
| ---------- | --------- | -------------------------- | ----------------------------------------- |
| **raven**  | enemy     | **priscilla** talks to him | recruit him before he gets himself killed |
| **lucius** | green npc | **raven** talks to him     | therefore raven must be recruited first   |

**Agent notes:**

**s05 attempt 1: abandoned on T16 via Suspend → Restart Chapter, with Kent dead.** By then the army had no path to a win: Eliwood, Marcus and Sain were at 1 HP, Bartre and Lowen at 3, Oswin at 5, and no healing exists on this map. **Read this before playing.**
- Map: indoor castle, 17x28. You start on a plain (rows 26-27). The only way in is a 3-wide stair at (10-12,23-25), leading to a room (rows 17-23) whose north exit is (10-12,16). From there the route to the throne runs: corridor rows 14-15 → stairs (0-1,13) → left column x0-1 → rows 4-5 → throne room x11-16 rows 1-5.
- **No healing at all.** Serra has no staff (don't deploy her). Merlinus is an immobile tent and can't be selected. There are no forts. Every point of damage is permanent for the chapter, so the whole plan has to be "take no damage".
- **Reinforcements:** a cavalier and a nomad appear at (0,26)/(0,27) on the starting plain every enemy phase from about T6 to T10, and attack from BEHIND along rows 26-27. A 2-tile wall at x=9 ((9,26)+(9,27); brace above at (9,25)) holds them, but only armoured units survive there. Archers also keep appearing at (5,8) inside the sealed archer room.
- **Enemy waves:** T1-T4, a myrmidon, a mercenary and a knight at the stair top, plus 4 archers and a nomad in the room; they die easily to a 3-unit wall on (10,25)/(11,25)/(12,25). About T5-T6, 2 nomads, a cavalier (Steel Lance), a knight and an archer come down from (10-12,16). About T8, **Raven** (Steel Sword, Skill 13, Spd 15; doubles everyone squishy) follows them. Raven and Lucius can't be recruited without Priscilla, so kill Raven.
- **The key to Bernard: the fighter at (0,6) (chEC) carries a HAMMER (item 0x26, DROPS).** Kill it with Hector or Bartre so an axe user holds it. Nothing else can dent Bernard on the throne (Def 16).
- 7 archers sit in a room sealed by a door at (5,6) (x3-7, rows 7-9). They never left it in 16 turns, but they shoot over walls: avoid column x1 (rows 5-11), row 11 x3-7 and column x9 (rows 7-9). Column x0 is out of their range. The cavalier at (15,15), the knight at (4,14), the archer at (8,23) (Steel Bow, shoots through walls) and the shaman at (1,23) never moved.
- What went wrong: I turtled at the stairs on two fronts. Every turn the third wall slot (whoever wasn't Hector or Oswin) took 10-18 from bows, and the rear pairs focus-fired Kent at (5,27). **Fix: before turn 1, use Prep Trade to give Bartre's Iron Axe to HECTOR** (Def 15; he counters everything and the bows do 0 to him) **and Florina's Javelin to OSWIN** (a range-2 counter against the bows). Then Hector and Oswin are the only units that ever stand where enemies can reach.

**s05 attempt 2: restarted on T27 after a second death (Merlinus T7, Oswin T26).** The plan worked until the throne approach, so reuse it:
- Prep: Bartre's Iron Axe to Hector, Florina's Javelin swapped for Oswin's 1-use one. Deploy Hector, Eliwood, Marcus, Lowen, Oswin, Lyn, Sain, Kent, Wil, Matthew; bench Serra and Bartre. Merlinus deploys himself as an immobile tent at (15,26). **He counts as a unit and can die**: he died on T7 because I moved Kent, Lowen and Sain off the east corner without re-running `fe7_threat`, and a nomad walked into the gap.
- T1-T4: wall (10,25) Sain, (11,25) Hector, (12,25) Oswin. The swords and archers die to counters plus first strikes (bows can't counter at range 1).
- **Spawn camp:** pairs (a cavalier with 26-27 HP and a nomad with 22-23) appear at (0,26)/(0,27) at the end of the T6, T7, T8 and T9 enemy phases, then stop. Put Marcus on (1,26), Lyn on (1,27) and Wil on (2,27). Each turn, Lyn (effective Mani Katti, about 18) plus Wil's bow (about 11) kill the nomad, and Marcus's Silver Lance x2 kills the cavalier, before either acts. Cost: about 4 HP per wave on Marcus and all 8 Silver uses.
- North wave (2 nomads, a Steel Lance cavalier, a knight, an archer, then Raven on T8-9): Hector and Oswin bait it at row 21-22 with everyone else out of reach. Raven dies on their counters.
- **The Hammer worked:** walk Hector (alone, Def 15) up column x0. The fighter at (0,6) attacked him and died on his counters, so Hector got the HAMMER. With it he does 24x2 to knights and should do about 20x2 = 40 to Bernard (33 HP) on the throne.
- The archer room is open (thieves unlock (5,6) and (3,3) early) and the archers DO come out once something is within their move+2. They do 0-1 to Hector and Oswin, so let only those two engage them.
- **What killed Oswin: the mage (14,4) comes west along row 4 and does 14 to Oswin and 11 to Hector, at about 91%.** Oswin got boxed in by archers inside its range at 8 HP. Fix: deal with the mage first. Lure it with Marcus (Res 10, takes about 4) and kill it with 2-3 units in one player phase, before Hector and Oswin walk east. Keep Hector at 23+ HP for the Bernard exchange (Bernard's counter does 11). Hector's only Vulnerary is precious.

**s05 attempt 3: WON on T29 with no deaths.** Attempt 2's plan, with these changes:
- The spawn pairs came at the end of the T6-T9 enemy phases (4 pairs), and none on T10. Lyn can miss; Wil then chips, and a 5-11 HP nomad left on a spawn tile blocks that spawn.
- North wave: Raven reached the row-20 seal at T8-9. Oswin's Iron Lance (17, 96%) took him to 12, and he died on counters. The third seal slot (Lowen/Kent) dies to Raven's doubling, so pull it back to the plain: nothing reaches the plain in one enemy phase.
- The knight at (4,14) dies to Hector's counters. The Hammer fighter attacked Hector at (1,11), as in attempt 2.
- **Archer room:** the archers came out one at a time through (5,6). Hector and Oswin (0-1 damage taken) and Marcus (Iron Sword x2, 100% kill) killed them, then **Oswin on (5,5) sealed the room shut**.
- **Mage:** Marcus on (7,4) is in the mage's reach only, not the knights'. The mage came to (9,4) and missed. Don't let Marcus attack it first (7 counter, then the javelins can kill him). Hector hit it (took its 15 counter) and Marcus finished it.
- The throne knights wander a little but never attack. Hector's Iron Axe doubles them (14x2); Marcus's Silver Lance kills one (19x2).
- **Bernard on the throne: the Hammer hits only 47%.** Fight from the pillar (13,1) (Def 17, his counter is 10 at 34-41%). He did attack Hector in the enemy phase from the throne and ate counters. Took 2 player phases.
- **Watch out:** a forecast with weapon_slot re-equips that weapon, so slots shift. I swung the Iron Axe by mistake once. Re-read the order before every act.
- Chapter 17x (Port of Badon) was skipped: the next chapter was Chapter 18, so Canas is lost.

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

"Survive" **11 turns**. No boss to kill. Merlinus auto-deploys as an immobile tent at (9,1). **He counts as a unit and can die** (19 HP, Def 5).

**Recruits:**

None.

**Agent notes:**

**s06 attempt 1: GAME OVER on T4 (Eliwood killed). Oswin had died T2 and Marcus died T4.**
- Map (19x21): you start on the raised stern deck, x7-12, rows 0-3. Land enemies can enter only through the two stair landings, **(8,4) and (11,4)**. A unit on **(8,3)** and one on **(11,3)** seal the deck against all ground units. Each holder can then be hit only from the landing (8,4)/(11,4) (melee or ranged) and the stairs (8,5)/(11,5) (range 2), plus by pegasi from any open neighbour tile.
- **Pegasi (Move 7) can perch on Gunnel, Fence and Sea tiles**, so the deck edges are not walls. Waves: 2 Iron Lance pegasi at (1,2)/(1,3) hit on the T1 enemy phase, 4 Steel Lance ones from the bottom (y17-18) reach the deck by T2-T3, and 5 more spawn at y14-20 on the T3 enemy phase. Each does about 13 to Eliwood, Kent or Merlinus and about 1 to Hector. Wil one-shots them (18x2 effective), Sain doubles them, and Hector's Iron Axe one-shots them (22, 100%).
- Merlinus's four neighbours (9,0), (8,1), (10,1), (9,2) must ALL be filled every enemy phase. One open tile let a pegasus take him from 19 to 6 on T3.
- Dangerous enemy weapons: **E#5 merc carries a LONGSWORD (0x13, effective vs mounted)**, which killed Marcus. E#6 merc has a **Lancereaver** (0x12, beats lances), and a cls0E arrival from (18,5) on T3 has an **Armorslayer** (0x0E). Check `fe7_state` items before choosing which holder faces which landing.
- What went wrong: Oswin held (8,3) at 20 HP on T2 with (7,3), (9,3) and (8,2) open; a pegasus, a merc, a shaman and an archer killed him, and an archer walked into the box. On T4 Marcus held (11,3) at 12 HP against the Longsword merc and died, the east choke opened, and enemies reached Eliwood at (10,1) the same phase. **Rotate choke holders BEFORE they drop below about 20 HP. Hector (Def 16), Oswin (Def 14) and Sain (Def 12, 30 HP) are the holders; Marcus (Res 10) only faces shamans, never the Longsword merc.** One holder dying ends the attempt, because the deck behind it is full of fragile units.
- No healing on this map (no staff deployed, no forts). The Armory (9,5) and Vendor (10,5) are on the enemy side of the chokes and unusable anyway.

**s06 attempt 2: GAME OVER on T4 again (Marcus died on the west choke at 11 HP, then Eliwood at 8 HP).** `fe7_wait`'s Start presses after Restart Chapter skipped Preparations, so the default lineup played (Lyn and Matthew, no Wil) and Merlinus was NOT deployed.
- **After Restart Chapter, step through the opening with single presses and screenshots.** `fe7_wait` presses Start, which is "Fight!" on the Preparations screen.
- T1-T3 went well with rotation: Oswin T1 (took 10), Hector T2 (took 14), then Oswin and Sain T3. Oswin's Javelin counters left both near shamans at 1 HP.
- **Leaving wounded enemies on the landings as "plugs" did NOT work.** Enemy phase order is not reliably slot order, and Marcus (11 HP) died behind two 1-HP shaman plugs. Kill the shamans; don't count on plugs.
- **`fe7_forecast` from a tile with no target in range can commit another menu entry.** It picked Rescue, so Hector picked up Lowen and spent his turn. Only forecast from tiles adjacent or in range of the target.
- The real killer is the 2-3 shamans (E#3 from (8,9), E#14 from (11,9), and E#2 later). They do ~11 to Hector, ~9 to Oswin, ~10 to Sain, but only 3 to Marcus. The shamans on the far-left ship ((1,13), (2,11), (5,10), the boss at (1,17)) never moved in 4 turns. On T2 the mobile shamans stand on the stairs (8,5)/(11,5) behind wounded mercs on the landings. Kill the merc from (8,3)/(11,3), then walk a second unit through onto the landing and kill the shaman (Sain doubles them, Marcus doubles with the Iron Sword).

**s06 attempt 3: restarted on T6 after a second death (Sain T2 EP, Oswin T6 PP).** Merlinus WAS deployed (tent at (9,1)); the lineup was the default with Lyn and Matthew. One Start too many on Preparations still skipped Pick Units.
- Kills that worked: T2 Oswin killed the landing merc and Sain stepped onto (8,4) to double shaman E#3. But Sain took its 48% counter (10) and died on the landing that enemy phase to the mercs, archers and pegasi around it. **A unit left standing on a landing faces about 5 attackers (2 fence perches for pegasi) — only Hector survives there.**
- T3 Oswin javelined shaman E#14 from (8,4) (82%). T4 Lowen (doubles pegasi, 10x2) plus Oswin's javelin cleared the pegasus beside Merlinus. T5 Hector held both chokes in turn; he takes 0 from mercs, archers, Armorslayers (he is not armoured) and iron-lance pegasi.
- **Oswin takes 0 from iron-lance pegasi** (only the steel ones do ~3); his counters with the Javelin chip everything. Lowen doubles pegasi (their Steel/Iron lance drops their speed).
- **Pegasus waves:** 2 at T1, 4 at T2-3, then 5 more spawning at y=13-20 at the end of the T3 and T5 enemy phases (probably every 2 turns). By T6 there were 5 pegasi in range and 5 more on the way. Land reinforcements: a merc and an Armorslayer at (18,10)/(18,5), and shamans at (0,18).
- **What killed the attempt: attrition.** No healing, and by T6 Lowen was at 4, Marcus 5, Merlinus 7, Oswin 9. Two shamans and a Lancereaver merc on the left reached T6 alive, and Oswin's last 12% javelin miss let the 4-HP shaman counter-kill him. **Never attack a shaman with a unit its counter would kill**, even at 88%.

**s06 attempt 4: GAME OVER on T9 (Eliwood).** Lineup: Hector, Eliwood, Marcus, Oswin, Sain, Lowen, Kent and Wil, plus Merlinus. "Deploy Merlinus?" appears after Preparations (A = Yes); `fe7_wait`'s presses had answered No in attempt 2.
- T1-T5 went well. **Marcus held the side with the shamans** (they do 3 to him), and Hector held the other (mercs, archers, Armorslayers and iron pegasi do 0-2 to him; he is NOT armoured). Sain on the west landing at 28 HP killed 4 enemies on counters in one enemy phase but ended at 2. Leaving an enemy with 4 HP on a landing as a plug worked twice in this attempt.
- Waves seen: pegasi arrive in 5s at the end of the T3, T5, T7 and T9 enemy phases. Shamans spawn at (0,18) about every 2 turns and walk the left ship to the west stairs by about T7. From T7, mercs, shamans and Armorslayers also appear at (9-10,13-20). By T8 there were 3-4 shamans at the west choke, killing whoever held it (Lowen, Oswin and Kent died T8; Marcus T6, between pegasi on his open flanks and two shamans).
- **Eliwood survives only if every tile within 2 of her is occupied or unreachable.** (9,0) is the best tile: its neighbours are the (8,0) gunnel, (10,0), and Merlinus's tent at (9,1). Within range 2, (9,2) and (8,1) must be filled. On T9 she died to pegasi after the fillers fell.
- **Idea for next time:** deploy Florina. A flier can stand on the (8,0) gunnel, which closes Eliwood's last open side. Pegasus knights have high Res, and her Javelin hits the stairs at range 2. Keep her out of archer range (bows triple against her).
- **s06 attempt 5: aborted on T1 by Suspend + Restart.** One Start press too many skipped Pick Units again. **On the pre-battle map scene (green crew), press Start ONCE and then only take screenshots until Preparations is stable.** The Preparations screen fades in slowly, and a second Start lands on "Fight!".

**s06 attempt 6: GAME OVER on the T9 enemy phase (Eliwood), the furthest yet.** Lineup: Hector, Eliwood, Marcus, Lowen, Oswin, Sain, Wil and Florina (HP 32, Spd 17, Res 7; she only has a Slim Lance 5 and a Javelin 1), plus Merlinus.
- **The Florina gunnel trick works.** Eliwood at (9,0), Florina on the (8,0) gunnel, a filler on (10,0) and Merlinus on (9,1): Eliwood took no damage until T9. Fillers on (8,1), (10,1) and (9,2) also seal Merlinus.
- **Florina is a good west-choke holder:** shamans do ~6 to her and the stairs archer can't shoot at range 1. But an archer that gets to range 2 does ~19, since bows triple against her.
- Deaths in order: Marcus (east choke, T3 enemy phase, 22 to 0 from mercs, shamans and steel pegasi on 3 open flanks), Sain T6, Wil, Florina and Merlinus T7, Lowen T8, then Eliwood T9.
- **Hector dropped to 1 HP on the T4 enemy phase** (one shaman 11, plus 1-2 from each of 3 physical hits). From then on he needed a fully sealed tile every phase. **What does 0 to Hector (Def 16):** mercs, Longsword, Lancereaver, Armorslayer, archers and iron-lance pegasi. **What hurts him:** shamans (11) and steel-lance pegasi (1). He can safely Hammer a Lancereaver (95%, 0-damage counter).
- **Killing order that worked:** Wil shoots wounded pegasi and archers at range 2, Sain doubles shamans and archers, and Oswin's Iron Lance one-shots shamans (98% vs 88% with the Javelin).
- By T7-T9 the deck is overrun (25-29 enemies; pegasus waves of 5 every 2 turns, new mercs, shamans and Armorslayers at (9-10,13-20)). Holding through T11 needs much less attrition on T1-T6.

**s06 attempt 7: GAME OVER on the T11 enemy phase (Eliwood), the furthest yet.** Same lineup as attempt 6. **The chapter does NOT end when T11 starts: the T11 enemy phase must be survived too** (the goal window reads "Survive 9/11 Turn").
- **Hector plugging a LANDING is the best play on this map.** T2: Oswin killed the landing merc, then Hector stepped onto (8,4) and killed shaman E#3 with the Iron Axe (98%; the Hammer is only ~83%). T3: Hector walked to the east landing (11,4) and doubled the archer with the Hammer. On the T3-T4 enemy phases his counters killed the Longsword merc, the Lancereaver and the Armorslayer for 0 damage taken.
- Oswin died T3 because his Javelin on a shaman standing on the armory (9,5) was only 76% and missed (its counter took him to 8). Florina can finish a shaman from the (9,4) fence (Slim Lance, 100%, doubles); nobody attacked her there.
- Marcus held (8,3) at 21 HP on T4 and died (merc, merc, Longsword through (8,4) one after another). Wil (3 HP) died the same phase. Merlinus died T6.
- **Eliwood's pocket that held T6-T8: Eliwood (10,0), Hector (9,0), Florina on the (11,0) gunnel, Lowen (10,1).** Each wall had at most two open sides. Sain on (8,2)/(8,3)/(8,4) kept the west shut and killed 3 enemies on counters on the T7 enemy phase.
- **What lost it: Florina ran out of weapons** (Slim Lance 5 uses + Javelin 1, both spent by T6). She died at 6 HP on the T9 enemy phase, and then a pegasus on the open (11,0) gunnel hit Eliwood for 10 on T9 and again on T10 (22 -> 2). On T11 the open gunnel (8,0) was reachable by two pegasi and one killed her.
- **For next time:** give Florina extra lances in the Preparations Trade (or bench her weapons' users), keep her on the gunnel next to Eliwood from T6 to the end, and never spend her HP on attacks after the early turns. Kill shamans with Hector from the landing (Iron Axe 98%) rather than with Oswin's Javelin. Hector at (9,0) next to Eliwood takes 0-1 per phase.

**s06 result: WON on attempt 8. Survived the T11 enemy phase; Fargus arrives at the start of T12 and the chapter ends. Deaths: Merlinus (T6), Sain (T7), Oswin (T8), Marcus (T11 enemy phase). Eliwood took 0 damage all chapter.** Lineup: Hector, Eliwood, Marcus, Lowen, Oswin, Sain, Wil, Florina, plus Merlinus.
- **T1-T3 (same as attempt 7):**
  - T1: Oswin on (8,3), Marcus on (11,3), Eliwood at (9,0) between Florina on the (8,0) gunnel and Lowen.
  - T2: Oswin kills the west landing merc, then Hector steps onto (8,4) and kills shaman E#3 with the Iron Axe.
  - T3: Marcus spends his last Silver Lance use on the east landing merc. Hector walks to (11,4) and plugs the east landing for the next 6 turns; his counters killed the Longsword merc, the Lancereaver and the Armorslayer. Oswin Javelins shaman E#14 from (9,3) (82%).
- **Kill every flier that gets inside on the player phase**, using the walls themselves: Wil from (9,0), Lowen from (10,1), Marcus, Oswin's Iron Lance (iron pegasi do 0 to Oswin). On T4 and T7 three pegasi each were killed without anyone leaving their tile.
- **Eliwood's box from T6:** Eliwood (10,0), Wil (9,0), Florina on the (11,0) gunnel, and Lowen or Marcus on (10,1) and (11,1). Merlinus was left outside it as bait.
- **Shamans** are the only real threat. Kill each one the turn it comes within 5 tiles of the deck: Marcus doubles them (Iron Sword, 100%) and takes only 3-4 back. Sain at 7 HP also traded for one. On T9 and T11 Marcus killed the shaman that could reach Eliwood's box, and Hector moved to the open landing so that only one shaman could reach him.
- **Hector's Iron Axe broke on counters by T3.** Forecast with `weapon_slot` to put the Hammer first before the enemy phase if you want to save it. Hector picked up the Longsword drop but cannot use it.
- Hector ended at 8/31, and Lowen, Wil and Florina survived.
- The Preparations Trade "List" shows every unit's items: there are no spare lances, no Vulneraries and 0 gold (Marcus's item 0x69 is a Door Key, and Serra has no staff). Florina's 6 lance uses must last, so don't spend them on kills after T5.

### Chapter 19 — The Dread Isle

**Objectives:**

"Defeat Uhai": Uhai (cls30 Nomadic Trooper, HP 36, Killing Edge + Longbow + Short Bow) starts at (13,22), the far bottom-right corner. Map 17x23 with fog of war; you start top-left. 33 enemies: cavaliers, archers, pirates, shamans/monks and 8 pegasus knights. Forts at (3,11)/(4,11).

**Recruits:**

| character | starts as | recruit with / action    | important condition |
| --------- | --------- | ------------------------ | ------------------- |
| **fiora** | green npc | **florina** talks to her | appears turn 3      |

**Agent notes:**

**s07 attempt 1 (in progress).** Dart (pirate: Steel Axe, Hand Axe, Vulnerary) joins at the start. Merlinus deploys as a tent at (1,9). Prep: only 10 slots; Hector has just a Hammer (5 uses); Bartre and Serra have no items. Gave Hector's Longsword to Kent (effective vs the many cavaliers). Fiora (green, T3) needs a Talk from Florina, which the tools could not do when this was written. **Update 2026-10-01: `fe7_act` now has `talk` (and rescue, trade, dance and more — see the runbook), so Fiora IS recruitable: bring Florina next to her and use `action:'talk'`, `target_faction:'green'`. Earlier notes in this file saying "no Talk tool" are history, not current limits.** Plan: turtle top-left and let enemies come in small groups.

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
