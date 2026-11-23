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

In virtually all cases, a unit is promoted by using a specific consumable item that matches its class. For example, a knight can use a knight crest to be promoted to a general. Alternatively, you could give that knight crest to a cavalier, who would then use it to be promoted to a paladin. The complete promotion-item mapping is below.

| item              | eligible classes → promoted class                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| **hero crest**    | mercenary → hero; myrmidon → swordmaster; fighter → warrior                                          |
| **knight crest**  | cavalier → paladin; knight → general                                                                 |
| **orion's bolt**  | archer → sniper; nomad → nomad trooper                                                               |
| **elysian whip**  | pegasus knight → falcoknight; wyvern rider → wyvern lord                                             |
| **guiding ring**  | mage → sage; shaman → druid; monk → bishop; cleric → bishop; troubadour → valkyrie                   |
| **ocean seal**    | pirate → berserker                                                                                   |
| **fell contract** | thief → assassin                                                                                     |
| **earth seal**    | any class eligible for a hero crest, knight crest, orion's bolt, elysian whip, or guiding ring       |
| **heaven seal**   | lyn → blade lord; eliwood → knight lord; hector → great lord, subject to story-specific restrictions |

## Broad strategy notes

Cross-chapter lessons the agent adds as it plays. Append below.

- `fe7_threat` can under-claim: in Ch2 an enemy it counted as unable to reach attacked anyway. Leave a margin for wounded units. `fe7_act` `item` sometimes fails with "could not locate"; passing `item_slot` explicitly and retrying once worked.
- `fe7_act` sometimes reports "action menu could not be located" and backs out with the unit unspent (seen on rescue). Retrying the same call once works.
- `trade` hands over a whole item, and a Vulnerary is one item with 3 uses, so giving one away gives all 3 uses. When an `item`/`trade` keeps failing on one unit, give up after two tries and `wait`.
- Don't guess who a unit is from its class number. Check its inventory: a staff means a healer, a tome means a mage. Or check the portrait in a screenshot. `fe7_forecast` sometimes fails with "action menu could not be located" even after a retry; the matching `fe7_act` attack still worked straight away.
- After a chapter ends, a late Start from `fe7_wait` can leave the minimap open on the new chapter. Press B once to close it.
- Read the goal window in the opening screenshot; Ch6's was "Hit switches" (step on blue floor tiles), not seize or rout. `fe7_wait` can report story-benched units as DIED at a chapter change. Check `fe7_state`, which reports benched and fallen separately.
- Ch7 (Lyn): killing every enemy before the boss unlocked Ch7x. `fe7_forecast` sometimes says "menu could not be located" on turn 1, then works later. Before attacking a unit on a mountain or fort, forecast it — Sain swung at 26% true hit vs a mountain brigand.
- Weapon uses are running low (Lyn's Mani Katti, Rath's Short Bow, Florina's Slender Lance), and nobody has bought anything yet. Use the first armory or vendor you can reach. Enemy thieves head straight for chests and then escape, so kill or block them early.
- Shops: `fe7_act` has no `armory`/`vendor` action yet. To shop, select the unit with raw presses, move it onto the shop and pick Armory. Screenshots lag about one frame, so take two after each press. `fe7_end_turn`'s "nothing changed on the board" can be wrong: in Ch8 the enemies had advanced. Always re-read `fe7_state`/`fe7_threat`. Enemy item IDs: 0x12 Lancereaver, 0x1E Axereaver, 0x2A Swordreaver, 0x2C Iron Bow.
- A two-way `trade` swap (item_slot + take_item_slot) failed every time in Ch9. Use one-way gives and takes, through a third unit if needed. A plain `attack` swings slot 0, and a boss's equipped weapon changes after each fight, so forecast with the exact weapon every time. Kent's Armorslayer swing in Ch9 hit a Javelin and nearly got him killed.
- Against a boss whose counter could kill (Ch10 Lundgren), use hit-and-rescue. One unit attacks, a mounted ally rescues it and cantos out of range, and a dancer refreshes a tank for another swing. A dropped unit can't act that turn, so drop it a turn early. Lyn mode ends after Ch10, and answering Yes to "continue playing?" loads Eliwood's Ch11 "Taking Leave". This file has no Eliwood-mode sections.
- The run is now in **Eliwood's tale**, but `run_state.json` `mode` stays "lyn". From Ch12 on, use the Hector-mode headings, whose chapter names match. Their **Recruits** lists are Hector's, though, so check the screen for who is actually green or red. The Ch11 "Taking Leave" section was added above "## Hector mode".
- Marcus on a fort is the best tool in early Eliwood mode. Turtle with him and let the enemy suicide into his counters, but watch the uses on his Silver Lance. Ch12 and Ch13 had no prep screen and no save prompt; the chapter just rolls on.
- `fe7_act` `armory`/`vendor` are NOT implemented: the unit walks onto the shop and its turn is spent. Talk-recruit enemies like Guy, who has a Killing Edge, will kill-or-die against any unit in their range, so keep his range clear until the recruiter is adjacent.
- Shops: `fe7_act` rejects `armory`/`vendor`, but by hand it works. Select the unit (`fe7_inspect` on its tile, then A), move the cursor onto the shop, A, and pick Armory/Vendor. Then A through the text, A for Buy, pick the item, A for Yes, B B to leave. A mounted unit is left in canto afterwards: put the cursor back on it, A, then A on Wait. On a shop tile the action menu confuses `fe7_act` `item`, so step off first. Eliwood-mode chapter numbers run one lower than the Hector-mode headings (E15 "Noble Lady" is the "Chapter 16" heading here).
- `fe7_inventory_full` reports "resolved", but the game then shows a "Drop <item>? Yes/No" confirmation with **No** highlighted. Press Left, then A (and A again to clear the "Dropped" banner). A boss boxed into a gate or throne by a tank on its only entrance can't move, and dies to the tank's counters.
- `fe7_forecast` with `weapon_slot` sometimes refuses ("the weapon list had a single entry"), but the same `fe7_act attack` with `weapon_slot` works. After `fe7_inventory_full`, do NOT press A; it opens the field menu. Merlinus's tent can be attacked; at 0 HP he only retreats and returns next chapter, but guard him anyway. Eliwood cannot use the Horseslayer (it is a lance).
- `fe7_act action:'item'` (Vulnerary) only works with x,y = the unit's CURRENT tile. Using an item after a move, or after a trade in the same turn, fails ("could not put the highlight on Use"), and after a trade it leaves the unit spent. Heal first, then move next turn. Shamans (Flux) do 11-12 to Res-0 units; only Marcus (Res 9) shrugs them off. After a chapter ends, press Start one at a time with screenshots, since one press too many starts the next chapter from its prep screen.
- **Lyn's death is a Game Over in Eliwood's tale**, same as Eliwood and Hector. Treat all three as lords. Bosses that "never move" still attack anything within their weapon range on the enemy phase, and they pick soft targets. Near the top map rows `fe7_act` staff/item often fails with "menu could not be located"; do those actions by hand.
- Fog-of-war maps (Ch19): a hidden enemy can't be targeted, even adjacent, and `fe7_end_turn`'s "nothing changed on the board" missed enemy moves there, so always re-read `fe7_state`. A boss holding a bow can't counter at range 1, so check the forecast's "--" (by hand if the tool can't open the menu: A, A, read the forecast, A or B).
- Enemies whose unit flags (+0x0C) read 0x200 are invisible, can't be attacked and don't act, yet `fe7_state`/`fe7_threat` still list them (Ch21: the boss sat this way until a unit entered his area). If an attack menu shows only [item, wait] next to a listed enemy, this is why. Wyverns land on fences and roofs, so a "sealed" pocket isn't sealed against fliers. A unit's death in Eliwood's tale only ends the game for Eliwood and for Lyn **when Lyn is deployed**, and Lyn can be benched at Pick Units.
- Defend/survive chapters with a 2-wide choke: hold the tiles where the FEWEST enemy tiles can reach each holder, even if it is one row further back. Moving the line forward to recruit someone is fine for a single phase, then go back. Hector's death is a Game Over in Eliwood's tale, so keep him off the front once the monk/mage waves arrive (Res 5). `fe7_act` `item` (Elixir/Vulnerary) failed with "could not put the highlight on Use" several times this chapter; heal with Serra instead.
- Before using a unit as a blocker or bait, compare its AS with the enemy's: a gap of 4+ means it gets doubled (Heath, AS 5, died to a Spd-12 warrior in Ch23). At prep, **Trade → List** shows every unit's and the convoy's items by weapon type and lets you pull any of them. `fe7_forecast`/`fe7_act` `weapon_slot` on Marcus's lances kept being refused ("single entry"); the default weapon or a different slot worked.
- **Ballistae are invisible to the tools.** A ballista is a trap object: `fe7_terrain` shows plain and `fe7_threat` ignores it. A sniper or archer standing on one shoots at range 3-10 without its inventory uses changing. If a unit dies or loses HP with no enemy weapon use explaining it, read the attacker's BattleUnit at `0x0203A3F0` (+0x0B roster, +0x10/0x11 x,y, +0x48 u16 weapon after: item 0x34 = Ballista) and the last-acted record at `0x0202BD48`.
- Against a crit-heavy sword boss, a **Swordreaver** (axe that reverses the triangle) on a full-HP Hawkeye standing on a fort turned Lloyd's 95% hits into 29%. Look for reavers at shops before bosses. Shops: select the unit by hand, A on the shop, Buy; with a full inventory, Yes sends the item to Merlinus. Backing out without buying leaves the unit unmoved. Units next to Merlinus get a "Merch" (convoy) command that doesn't end their turn.
- Late-game survive maps flood the board with wyvern waves. Every soft unit (and the lords) should ride on a high-Def carrier (rescue); wyverns do 2-4 to Hector, Marcus, Hawkeye or Oswin. Never leave a group isolated behind mountains, because isolated groups get wiped. At prep, the Trade menu's **Use** can apply promotion items.
- Snow weather changes move costs turn to turn (horses sometimes 3 per plain), and `fe7_threat` ignores it, so use `verify` on a key enemy. A talk-recruit target that out-damages everyone (Harken) must be kept out of reach entirely; a counter crit can kill him. Range-2 attackers are free damage against bosses with a 1-range tome plus a siege tome.
- **Green NPCs can be rescued**: a carried unit can't be targeted. That's how Ch28 "Guard Zephiel" was won (Marcus carried Zephiel and Pent healed Marcus with Physic). In fog, attacking an unseen enemy makes `fe7_act` land in the Item menu with a bogus "inventory full" report: press B ×3, have another unit Wait next to the enemy first, then attack. `fe7_act staff` fails often; cast Physic by hand (A on the unit, A on the tile, Staff, Physic, Left/Right to cycle to the target, A).
- **Poison (Poison Lance) does about 3 per turn and CAN kill a 1-HP unit.** Twice in Ch29, `fe7_wait`'s A/Start presses during reinforcement-arrival events left the game on the title screen (it suspended). **Resume Chapter** returned to the same turn unchanged. A bow-only enemy (nomad, sniper) standing next to your unit can't attack it and blocks that tile for others, so it works as a "cork".
- **`fe7_threat` does not see ballistas.** A sniper sitting on a ballista tile has range 3-10, and it's effective vs fliers. Treat any enemy archer on a "Ballista" tile as covering a 10-tile radius.
- Raw-press shopping and unit selection can land on the field menu with **Suspend highlighted** if a press is dropped. Always screenshot before pressing A, and prefer retrying the `fe7_act` call, which usually works on the second try. Player slot numbers do NOT map to fixed units: check `chNN` against `overlay/names.json` (0F Louise, 15 Pent, 1A Marcus, 22 Hawkeye, 31 Florina).
- **Rescue as armour.** A unit being carried can't be targeted at all, so a Def-18 carrier that isn't doubled while carrying makes the carried unit safe. Check Spd: carrying halves it, and a carrier that gets doubled loses that edge.
- **Hidden fire traps**: some maps have invisible fire tiles that do 10 per phase. Read the trap array at `0x0203A518` (8-byte entries: x, y, type; type 4 is fire, type 2 a breakable wall with HP in byte 3). `fe7_act attack` refuses walls; attack them by hand. A chapter whose goal is "Claim a space" or "Arrive" has no Seize entry; Wait on the tile.
- **Berserk/Sleep druids:** a berserked ally acts by itself right after your last unit moves, and it will attack lords. Counter it by carrying lords (carried units can't be targeted by anything), by keeping the likely targets unarmed or out of range (druid staff range ≈ Mag/2 after moving 6), and by `take`, which pulls a carried lord off a sleeping carrier. Read status at unit +0x30 (low nibble: 1 poison, 2 sleep, 4 berserk; high nibble: turns). Pillars are passable.
- `fe7_wait` presses A/Start through the chapter-end save screen and can save into the wrong slot. After a win, open Prep → Save and re-save into the slot in use.

## Lyn mode

### Prologue — A Girl from the Plains

**Objectives:**

Seize gate at (3,2), where the boss Batta (brigand) sits. Lyn is alone. Two brigands in total.

**Recruits:**

None.

**Agent notes:**

- s01: WON on turn 6, first attempt, with no deaths. The save started on the tactician "Personal Information" screen; I took the defaults (Yes, Start, Yes).
- The house at (14,9) is Lyn's home and can't be visited.
- The brigands don't move until Lyn is in range. I parked at (6,6) so only the southern one could reach her, and it died to her double counter.
- Batta stays on the gate (+DEF, and he heals there). Lyn did 5 x2 at 99% and he hit 32% for 10. It took two rounds plus his enemy-phase attack. Lyn fell to 6 HP but didn't use a vulnerary.
- Lyn reached Lv2 (17 HP), has 39 uses left on her Iron Sword and 2 vulneraries, and was fully healed for Ch1.
- Save prompt after the chapter: I picked the slot already in use (the top one, "Prologue") and chose Save.
- Handover: Ch1 is on the map at turn 1 with the opening dialogue cleared. Objective: Defeat enemy (5 left). Two blue cavaliers (Sain and Kent) are at the west edge.

### Chapter 1 — Footsteps of Fate

**Objectives:**

Defeat all enemies (5 brigands). The boss (Lv4 brigand, 23 HP) sits at (13,1) and never moves. Only (12,1) and (13,2) are next to him; the other two tiles are peaks.

**Recruits:**

None.

**Agent notes:**

- s02: WON on turn 7, first attempt, with no deaths. Lyn, Sain and Kent are all alive.
- The brigands hold still until you're in their range. Bait them one at a time with Kent or Sain on a tile only one of them can reach (use `fe7_threat`), take the counter, then finish with Lyn. She doubles every brigand, and her hit is 100%.
- Boss kill: Sain's lance from (13,2) did 10, then Lyn from (12,1) did 8x2 for the kill. Heal everyone first, outside his reach.
- Lyn went to Lv4 (18 HP) and has 29 uses left on her Iron Sword plus 1 vulnerary. Sain is Lv1 with 42 uses on his Iron Lance and has 1 vulnerary from Lyn. Kent is Lv1 with his lance re-equipped in slot 0 and has 1 vulnerary.
- No save prompt appeared. The tool's presses ran straight through to the Ch2 title card.
- Handover: Ch2 is on the map at turn 1, no prep screen, opening dialogue cleared. Objective: seize the throne. There are 6 enemies, one of them a mercenary at (11,1) carrying a vulnerary, and two villages to the north-west.

### Chapter 2 — Sword of Spirits

**Objectives:**

Seize the throne at (11,1). The boss is a Lv3 mercenary (20 HP, Iron Sword, 3 vulneraries) who sits on the throne and never leaves it. There are 5 brigands as well.

**Recruits:**

None.

**Agent notes:**

- s03: WON on turn 16, first attempt, with no deaths. Lyn, Sain and Kent are all alive.
- The three houses at (0,7), (1,7) and (0,9) give only dialogue. The way into the castle runs over the mountains at (7,7)–(7,8), which the cavaliers cannot cross. **Only Lyn can reach the throne.** Kent and Sain kill the early brigands in the west and then sit idle.
- The brigands do come to you. Bait them one at a time and let Lyn counter (she does 10x2 and kills a full-HP brigand). A forest tile gives her about 5% enemy hit. Kent's Iron Sword (100% hit vs axes) beats his lance.
- Boss: Lyn does 7x2 at 94% against his throne bonus, and he does 7 at 84%. He drinks vulneraries and heals on the throne, so the fight dragged on. Never attack him at ≤14 HP, because a miss leaves her one hit from death. Heal to full and let him attack into her counter. If I did it again, I'd go in at full HP and with more vulneraries.
- Lyn is Lv5 with 19 HP. She has 14 uses left on her Iron Sword and **got the Mani Katti (0A, slot 3)**, which may be worth equipping. She has 4 vulneraries. Sain is Lv1 with 41 uses on his Iron Lance and **no vulneraries**. Kent is Lv1 with Iron Sword x43 and Iron Lance x44 (sword in slot 0) and 1 vulnerary.
- Save prompt after the chapter: I picked the slot already in use (top, "Ch. 2: Sword of Spirits") and chose Save.
- Handover: Ch3 is on the map at turn 1 with the opening dialogue cleared. Objective: Defeat enemy (9). **Florina (pegasus, #3, Slender Lance) joined.** There are 9 enemies: brigands, mercenaries, archers (cls18, dangerous to Florina), and a Lv6 boss at (13,0).

### Chapter 3 — Band of Mercenaries

**Objectives:**

Defeat all enemies (9): brigands, mercenaries, two archers, and a Lv6 brigand boss (25 HP, Steel Axe, 17 Atk) at (13,0). The boss never left his tile.

**Recruits:**

| character | action                                                     |
| --------- | ---------------------------------------------------------- |
| **wil**   | visit southwest village; otherwise he auto-joins on turn 3 |

**Agent notes:**

- s04: WON on turn 12, first attempt, with no deaths. **Wil joined** on turn 1 when Lyn visited the village at (3,6).
- The NW village (2,2) was razed by a brigand on turn 3–4 before anyone could reach it. Send Florina (flyer) to it on turn 1–2 if you replay this.
- Equip Lyn's **Mani Katti**: it does 12x2 with ~25% crit against mercenaries and brigands. It is now in her slot 0.
- Fences at column 10 (rows 7–9) and row 5 (cols 5–10) wall off the middle. Cavalry pay 3 for forest and can't reach the archer behind the fence. Ruins cost extra, so check `fe7_reachable` before planning boss tiles.
- Boss: Wil shot him from (13,2) for 7, then Kent (Iron Sword) did 8x2 at 100% from (12,0). His counter hit Kent for 12. Sain rescued Kent from (12,1) and Lyn finished him next turn. A safer order is Wil, then Lyn, then Kent.
- Levels at handover: Lyn Lv6 (20 HP, Mani Katti x40, Iron Sword x14, 3 vulneraries), Sain Lv2 (Iron Lance x36, no vulnerary), Kent Lv2 (Iron Sword x39, Iron Lance x44, no vulnerary), Florina Lv1 (Slender Lance x29, 3 vulneraries, has not fought yet), Wil Lv2 (Iron Bow x40). Kent and Sain need vulneraries; Florina could trade hers.
- There's an armory at (13,7) that went unused. No save prompt appeared; the tool ran straight to the Ch4 title card.
- Handover: Ch4 is on the map at turn 1, no prep screen, and the opening dialogue is cleared. The objective is **Protect (the green NPC at (7,3)) for 7 turns**. There are 14 enemies. **Dorcas is enemy #13 (ch08, cls12 fighter) at (13,7)**; Lyn must Talk to him, so don't kill him.

### Chapter 4 — In Occupation's Shadow

**Objectives:**

Protect Natalie (green, (7,3)) until the end of turn 7. You don't have to kill everyone. Reinforcements (brigands and mercenaries) arrive from (1,13) and (14,0) every turn.

**Recruits:**

| character  | action                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| **dorcas** | **lyn talks to him** while he's an enemy; alternatively finish without killing him |

**Agent notes:**

- s05: WON at the end of turn 7, first attempt, with no deaths. **Dorcas recruited**: on turn 1 he walked to (10,5), and on turn 2 Lyn talked to him from (10,6).
- Natalie's room can only be entered through (7,4), and (7,4) through (7,5), which is reached only from (7,6). Florina sat on (7,4) all chapter and nothing ever touched Natalie. Enemies come in through the south gap (5,9)/(6,9), the east side (col 10/11) and a breakable west wall at (3,4).
- What worked: on turn 1 keep everyone on tiles `fe7_threat` marks `.`, then strike first every turn. Kent, Sain, Wil and Dorcas chip the brigands and Lyn (Mani Katti 12–14x2) finishes them. Mercenaries do 0 to Sain. Florina rescued Dorcas at 5 HP and parked him on (7,4).
- `fe7_act` `item` failed 4 times for Kent at (7,5) (menu not located), and a `trade` there failed twice. A plain wait worked. Kent ended at full HP anyway after the chapter.
- At handover: Lyn Lv7 (21 HP, Mani Katti x33, Iron Sword x14, Iron Axe x45, **no vulnerary**), Sain Lv3 (Iron Lance x27, Vulnerary x2), Kent Lv3 (Iron Sword x33, Iron Lance x44, Vulnerary x3), Florina Lv1 (Slender Lance x29, **no vulnerary**, has never fought), Wil Lv3 (Iron Bow x37), Dorcas Lv4 (30 HP, **Hand Axe x10 only**, Vulnerary x2). Dorcas will need a new axe soon. Lyn could hand him her Iron Axe.
- No save prompt appeared, and I missed the Ch5 title card screenshot. Handover: Ch5 is on the map at turn 1. Objective: Defeat enemy (7). Serra (green #0, cleric, **10/17 HP**) is at (7,6) and Erk (green #1, mage) is at (6,6). An archer (11/20 HP) is at (7,4) right next to them. The boss is a Lv9 brigand at (14,9).

### Chapter 5 — Beyond the Borders

**Objectives:**

Defeat all enemies (7): two archers, two mercenaries, two brigands, and a Lv9 brigand boss (29 HP, Steel Axe, 18 Atk) at (14,9). The boss never moved.

**Recruits:**

| character | action                                              |
| --------- | --------------------------------------------------- |
| **serra** | **lyn talks to her**; otherwise joins after chapter |
| **erk**   | joins with serra                                    |

**Agent notes:**

- s06: WON on turn 7, first attempt, with no deaths. **Serra and Erk recruited**: on turn 2 Lyn talked to Serra from (8,6). Earlier notes had the two mixed up. The wounded green at (7,6) was **Erk** (mage, Fire, now player #6). **Serra** (Heal staff 4A, now #7) was at (6,6).
- Turn 1: Florina flew to (7,5) and killed the 11-HP archer next to the greens (6x2, and an archer can't counter in melee). Do this first.
- The map is mostly forest, mountains and cliffs. Cavalry and Lyn crawl, and Lyn can't cross the mountains at column 10. The way east is (9,5)→(10,5)→(11,5) or the northern plains.
- **The enemies stay put until you enter their range**, so bait with `fe7_threat`. Florina standing on the house at (8,3) took a 10-damage hit from the brigand. She is too fragile to bait with.
- Boss: Dorcas's Hand Axe from (12,9) and Erk's Fire from (13,8) hit him from range 2 with no counter (7 and 10 damage). Then Lyn finished him from (13,9) (9x2 at 100%; his counter has 16% true hit).
- The houses at (8,3), (10,7) and (13,2) gave nothing visible. The armory at (14,3) went unused. Sain now carries the brigand's dropped Iron Sword.
- At handover: Lyn Lv8 (22 HP, Mani Katti x29, **no vulnerary**), Sain Lv4 (Iron Lance x25, Iron Sword x46, Vulnerary x1), Kent Lv3, Florina Lv2 (Slender Lance x24, no vulnerary), Wil Lv3, Dorcas Lv4 (**Hand Axe x9 only**; Lyn's Iron Axe x45 should go to him), Erk Lv1 (Fire x37), Serra Lv1 (Heal x28).
- No save prompt appeared. Handover: Ch6 is on the map at turn 1 with the opening cleared. The objective box reads "Hit switches"(?). A new Lv7 unit is deployed as player #8 (ch1C, cls2E, Short Bow? x22, probably Rath the nomad). There are 7 enemies: knights (cls38) on the east side, one carrying item 0x69, and a boss-type unit (cls14) at (12,1).

### Chapter 6 — Blood of Pride

**Objectives:**

"Hit switches": three blue floor switches, at (8,1) (behind the locked door (8,3)), at (16,7) (in the SE room, behind locked door (16,9), under a soldier), and at (12,1) (under the boss, a Lv5 knight with a Steel Lance, in a sealed room). Standing on a switch (move there + Wait) opens the next part of the castle. Stepping on the third one ends the chapter. There are 7 enemies and no reinforcements.

**Recruits:**

| character   | action                                                |
| ----------- | ----------------------------------------------------- |
| **matthew** | visit a northern village; otherwise auto-joins turn 3 |

**Agent notes:**

- s07: WON on turn 9, first attempt, with no deaths. **Matthew recruited**: on turn 1 Lyn visited the village at (4,2). He comes with a Lockpick.
- The enemies never leave their posts, so it's safe to take your time. Two mercenaries in the south charged on turn 1, did 0–2 damage to Sain and Kent, and died on turn 2.
- Route: Matthew lockpicks the door at (8,3), and a unit steps on (8,1), which reveals the central hall (chest at (12,6), door at (16,3) leading to a NE room with a chest at (16,1)). Kill the soldier at (16,4); he drops a Door Key. Rath's village (7,8) also gives a Door Key. Open (16,9), kill the soldier on (16,7), and step on it. That opens the boss room. You can't attack into a roofed room before it opens.
- Chests: (12,6) gave item 0x5A (unknown, Matthew had it). (16,1) gave the **Armorslayer**, now with Kent. Houses (1,7) and (2,2) gave nothing.
- Boss: Dorcas's Hand Axe from range 2 did 6x2, Rath's bow from range 2 did 3x2 (it crit), and Kent's Armorslayer did 11 for the kill. The boss hits 13 at 91%, so don't stand next to him.
- Save prompt after the chapter: I picked the highlighted slot "Ch. 6: Blood of Pride" (the one in use) and chose Save.
- At handover **Rath and Matthew are benched by the story** (fe7_state says "2 benched, 0 fallen"; fe7_wait wrongly reported them as DIED). New units: **Ninian** (#10, dancer) and #11 (ch10, cls1C, item 3E). Lyn Lv8 (Mani Katti x27), Kent Lv4 (Armorslayer x17), Dorcas (**Hand Axe x7 only**), Florina Lv2. Nobody has vulneraries except Kent, Sain, Dorcas and Serra.
- Handover: Ch7 is on the map at turn 1. Objective: **Defeat Heintz**. There are 11 enemies, including shamans (cls24), and one shaman at (5,5) is right next to the party.

### Chapter 7 — Siblings Abroad

**Objectives:**

Defeat Heintz, a Lv5 shaman (22 HP, Flux) on the gate at (7,10). There are 11 enemies and no reinforcements. The gate can only be reached on foot from (7,11), its south side, or at range 2 from (9,10), (5,10), (6,11), (8,11) or (7,12).

**Recruits:**

None.

**Agent notes:**

- s08: WON on turn 15, first attempt, with no deaths. I killed all 11 enemies, and that **unlocked Ch7x** (the game went straight to 7x). Lucius (#11, monk, Lightning) fought for this chapter only.
- The enemies stay put until you enter their range. Bait them one at a time on tiles where `fe7_threat` shows 1. A sword unit (Kent) baits the axe brigands, and Sain baits the mercenaries. Lucius's and Erk's magic plus Lyn finish them. Florina (Res 5) tanks the shamans and the mage for 1–4 damage.
- Map: the mountain at (13,6) south of the middle bridge blocks cavalry. They have to go east over the bridge at (17,4), and foot units pay 4–5 Move to climb it. The village at (17,2) was razed on turn 5 before anyone could get there, so send Florina on turn 1–2 if you replay this. The houses at (4,1) and (3,2) gave nothing.
- Heintz never moved. He is weak (ATK 9–10, heals on the gate). Lucius at (9,10) did 7 and took 3 back. Lyn from (7,11) did 11x1 for the kill (83% true hit; she does NOT double him).
- At handover: Lyn Lv8 (23 HP, Mani Katti x22, Iron Sword x14). Dorcas holds Lyn's Iron Axe x45 but it **isn't equipped yet** (slot 2, Hand Axe x7 is still in slot 0). Florina is Lv3+ with Slender Lance x13 (running low). Erk has Fire x33 and picked up an Iron Lance. Kent has Armorslayer x14. Serra has Heal x24.
- No save prompt appeared. Ninian and Lucius are benched by the story for 7x (`fe7_wait` said DIED, but `fe7_state` shows "2 benched, 0 fallen").
- Handover: Ch7x is on the map at turn 1. Objective: **Defeat enemy (12)**. New units: #8 Rath (cls2E nomad) and #9 Matthew (ch23, cls3C thief; enemy thieves share class 3C). The map is an indoor fortress with a chest at the lower left. Enemy #6 (3,12) DROPS a vulnerary.

### Chapter 7x — The Black Shadow (gaiden)

**Objectives:**

Defeat all enemies (12). Indoor fortress, 15x17, fog of war. Party starts bottom-right. Boss-type Lv7 (cls0A, Steel Sword, stationary) at (2,1) in the NW room behind doors (2,3)/(3,5). Chest at (3,9). Breakable walls at (3,11), (8,8), (13,8). Two enemy thieves.

**Recruits:**

None.

**Agent notes:**

- s09: WON on turn 12 (Kent killed the boss), first attempt, with no deaths. No recruits in this chapter. Ch8 loaded straight onto its **Preparations screen** (turn 0, "Defeat enemy"). There was no save prompt.
- The map is a set of rooms joined by 1-wide corridors. Column 7 (rows 5–10) is a choke point: hold its south mouth and enemies come one at a time. The enemies break the breakable walls at (8,8) and (13,8) themselves. Reinforcements (a mage and a shaman) appeared at (3,1)/(1,1) on turn 3.
- The enemy thief went for the chest at (3,9) on turn 3–4, took item 0x26 and escaped on turn 5. Nobody could get into that west room in time. To get that item on a replay, open the room early or kill the thief first.
- **Rath is the MVP.** His bow does 13x2 to soldiers and 8x2 to mages at 100%, and almost never takes a counter. Erk's Fire one-shots wounded units at range 2. Lyn's Mani Katti killed the enemy cavalier on the counter (it's effective against horses).
- The boss (Lv7, Steel Sword, 24 HP, Def 5) **never moves**. Rath shot him twice from the doorway (2,3) at range 2 with no counter, then Kent finished him from (2,2).
- At handover: Lyn Lv9 (Mani Katti **x16**, Iron Sword x14, **no vulnerary**), Sain Lv5, Kent Lv5 (Armorslayer x10), Wil Lv4, Erk Lv3 (Fire x27), Serra Lv2 (Heal x20), Rath Lv7 (**Short Bow x10, running low**), Dorcas Lv4 (Hand Axe x7; the Iron Axe x45 is still not equipped), Florina Lv3 (Slender Lance x11; she never fought). Matthew is benched for Ch8.
- `fe7_act item` (Sain's vulnerary) failed 3 times with "could not put the highlight on Use". Use Serra instead.

### Chapter 8 — Vortex of Strategy

**Objectives:**

"Defeat enemy" (rout). There are 14 enemies at the start, plus 3 soldier reinforcements at the bottom edge on turns 3–4. The map is 15x18. The party starts on a NW plateau walled in by a cliff ridge, and the way down is the gap at (2,5)/(3,5). There is an armory at (1,3) and a village at (13,3). The boss group (a Lv6 knight plus a soldier, a mercenary and a brigand on forts) sits at (11–13,14–16).

**Recruits:**

None.

**Agent notes:**

- s10: WON on turn 12, first attempt, with no deaths. Ch9 loaded onto its Preparations screen ("Seize gate"). There was no save prompt.
- **Armory (1,3)**: Iron Sword 460, Iron Lance 360, Iron Axe 270, Iron Bow 540. `fe7_act` has no `armory` action in this build, so I drove it by hand: select Lyn, move her onto the tile, Armory, Buy. Shopping ends the unit's turn. I bought an Iron Sword (kept by Lyn), an Iron Bow (given to Rath) and an Iron Lance (given to Sain). 3640G left.
- Enemies charge in waves. On turn 2 the cavaliers and the mercenary climbed into the gap, and the mage moved within Erk's range (Erk doubled and killed it). The shaman then hit Erk for 14. The rest died one by one at the gap.
- The **village (13,3)** gave Florina a **Lancereaver** (item 0x12). It should go to Lyn or Kent.
- The boss group **holds reaver weapons**: the knight and soldier have an Axereaver, the mercenary a Lancereaver, the brigand a Swordreaver. Pick the counter-weapon, e.g. Florina's lance did 7x2 to the Swordreaver brigand while it had 0.6% to hit her. The boss group never moves until you come within reach. Kent on (8,13) baited the soldier and mercenary off their forts. Kent's Armorslayer did 18x2 at 100% to the boss (Lv6 knight, 25 HP, Def 11), which never moved.
- At handover: Lyn Lv9 (Mani Katti x14, Iron Sword x14 and x46, 1 vulnerary), Kent Lv6 (Armorslayer **x8**), Sain Lv6 (Iron Lance x3 and x45), Dorcas Lv5 (Iron Axe x43, Hand Axe x5), Rath Lv7 (Iron Bow x42), Wil (Iron Bow x32), Erk (Fire x22), Serra (Heal x16), Florina Lv4 (**Slender Lance x6**, Lancereaver). **Matthew is back** (#9) for Ch9.
- `fe7_act item` (vulnerary) still fails often ("could not put the highlight on Use"). Kent's worked once.

### Chapter 9 — A Grim Reunion

**Objectives:**

"Seize gate". The gate is at (17,13) in the SE corner on a 20x15 map, with the boss (cls2A, 30 HP, Def 10, Javelin + Hand Axe) standing on it. Only one tile, (17,14), can attack the gate in melee; (16,13)/(18,13) are walls. Range-2 tiles are (15,13), (16,14), (18,14) and (19,13). The river crossing is a 1-tile bridge at (6,10). There is a village at (1,5).

**Recruits:**

None.

**Agent notes:**

- s11: WON on turn 12, first attempt, with no deaths. **Wallace** (General, Lv12, Def 15, lances only, he can't use his Iron Axe) joined automatically on turn 1. On turn 1 Lyn visited the village at (1,5) and got item 0x6F x5, now held by Matthew.
- Weak reinforcements (brigands, soldiers, archers, cavaliers) spawned every turn from turn 2 to about turn 4, around the start area and the mid-map, then stopped. The SW brigands on the peaks hit 9 per swing. Wallace takes 0–3 from everything, so he is the ideal bait.
- **Boss:** the gate gives Def +2 and heals 3 a turn. The boss uses its Hand Axe and Javelin at range 1–2 and **never moves**. **Lyn's Mani Katti did 14x2 at 98% and one-rounded it** (it's effective against this class). Bring Lyn to (17,14) early. Kent's Armorslayer only works while the boss has the Hand Axe equipped. Against the Javelin, Kent dropped to 7 HP. Forecast every attack, because the boss's equipped weapon changes.
- Ending: a save prompt came up and I saved to the highlighted slot in use (it was "Ch. 9", now "Ch. 10"). Ch10 loaded straight onto the map at turn 1, with **no prep screen**.
- At handover: Lyn Lv11 (**Mani Katti x7**, Iron Swords x14/x46, 1 vulnerary). **Florina has NO items** (her Slender Lance broke); she needs a lance. Matthew holds the **Lancereaver** (0x12, a sword), and Lyn or Kent should have it. Kent's Armorslayer is down to x4. Sain still carries an Iron Lance x3 alongside his x38. New units: #10 Ninian (dancer) and #11 (ch10, cls1C, item 3E).
- `trade` swaps (item_slot + take_item_slot) failed 3/3 with "did not pick the item up". A one-way give or take works.

### Chapter 10 — The Distant Plains

**Objectives:**

"Seize gate". The gate is at (2,16) in the SW, inside a walled block, and the boss Lundgren (General, 35 HP, Def 14, rising to 16 on the gate) stands on it. Only (2,17) can attack him in melee. Range-2 tiles are (4,16), (0,16), (1,17) and (3,17). The start is a NW plateau, the only way out is the (7,2) bridge, and the only crossings south are the (16,6) bridge and then the (11,11) bridge west, so the march is long. There are houses at (3,1) and (16,2). The village at (15,12) was razed by a brigand before I got there.

**Recruits:**

None.

**Agent notes:**

- s12: WON on turn 23, first attempt, with no deaths. This was the end of Lyn's tale. I answered Yes to "save your progress?" (saved over the slot in use, "Ch. 10") and Yes to "continue playing?". The game then went straight into **Eliwood's** Ch11 "Taking Leave", which loaded on turn 1 with no prep screen and Eliwood, Marcus, Lowen and Rebecca deployed. Nothing from Lyn mode carries over.
- **Rain** hits intermittently, about turns 3–5 and turn 20. It doubles plain costs, so units only get 2–3 tiles. Check `fe7_reachable` before planning a strike.
- Enemies were weak and came in waves: archers, a mage, mercenaries, a brigand, a shaman, and about 5 cavalier reinforcements spawning at (7,12) and (5,14) on turns 5–9.
- **Lundgren is the whole chapter.** His Silver Lance counter did 24 to Lyn (she was left at 1 HP) and 19 to Kent, and the gate heals him 3 a turn. Mani Katti is NOT effective against him (7x2), and Armorslayer is only x2 (8x2). Bows and lances do 0–4. What worked was hitting him once per unit from (2,17) and then having a mounted ally **rescue the attacker out of reach** (Sain/Florina rescue + canto), with Ninian dancing Wallace for an extra swing. Erk's Fire at range 2 finished him; he can't counter at range 2 while the Silver Lance is equipped.
- `fe7_forecast` with `weapon_slot` failed on turn 2 ("weapon list had a single entry") but worked later. `fe7_act` attack with `weapon_slot` always worked. Visiting the (3,1) house failed 3x with Dorcas and Matthew, then worked with Serra.

### Chapter 11 — Taking Leave

_(Section added by s13: the run moved from Lyn's tale into **Eliwood's** tale, and the template has no Eliwood sections. From Ch12 on, the run uses the Hector-mode headings below, whose chapter names match Eliwood's.)_

**Objectives:**

"Seize gate" (Eliwood's tale). The map is 18x12. The gate is at (3,7) in the SW, walled on three sides, so (3,8) is the only way in, and the boss (a Lv5 brigand, 25 HP) stands on it. There is a village at (16,2) and houses at (9,2)/(10,2), plus a vendor at (6,4) and forts at (14,4)/(2,10). The two NW villages were already burning at the start.

**Recruits:**

None to talk to. **Dorcas** and **Bartre** (both fighters) join automatically at (17,3)/(16,3) during the turn 1 enemy phase.

**Agent notes:**

- s13: WON on turn 10, first attempt, with no deaths. There were 13 enemies: 11 brigands with Iron Axes and 2 archers, and no reinforcements. They trickle in a few at a time, so this is an easy chapter.
- Marcus (Paladin, Steel Sword + Silver Lance) one-shots brigands and only takes about 2 per hit. Marcus took the boss to 7 HP from (3,8), and his counter killed the boss in the enemy phase. I fed the chip-and-finish kills to Eliwood, Rebecca and Dorcas.
- The (16,2) village gave Eliwood item **0x5F**. The houses only had talk. I skipped the vendor.
- Ending: a "Save" screen came up and I saved over the slot in use ("Ch.11: Taking Leave", 2nd slot). **Ch12 "Birds of a Feather" loads straight onto the map at turn 1, with NO prep screen**. Its goal window reads "Defeat enemy, Left 20".
- At handover: Eliwood Lv1-2, 13/18 (Rapier x38, vulnerary x3, 0x5F), Marcus 15/31 (Silver Lance x26, Steel Sword x25), Lowen (Iron Lance x20, Iron Sword x46), Rebecca (Iron Bow x41, vulnerary), Dorcas (Iron Axe x42, Hand Axe x20), Bartre Lv6 (Steel Axe x28). The wounded heal between chapters.

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

"Defeat enemy" (Eliwood's tale), 20 enemies. The map is 17x16 and you start in the SW. The boss is a Lv9 fighter (32 HP, Steel Axe) at (15,1). Brigands, mercenaries and fighters come from the east, and a group of soldiers, an archer and a brigand waits in the NW. There's a village at (1,8) (walled, so enter from (1,9)), houses at (7,4)/(7,15)/(0,13), a vendor at (1,13), an armory at (7,10) and forts at (5,7)/(12,12)/(8,14).

**Recruits:**

None.

**Agent notes:**

- s14: WON on turn 8, first attempt, with no deaths. **Hector (Lv1, Wolf Beil) and Oswin (Knight Lv9, Def 13)** arrived in the NW corner at (4,2)/(3,2) on the turn 3 enemy phase, next to the passive NW soldiers. Oswin takes 0 damage from all of them, so let him wall while Hector picks off the wounded.
- Lowen visited the (1,8) village on turn 2 and got item **0x5C**. Marcus visited the (7,15) house, which was talk only. The (0,13) house failed twice with "menu could not be located", so I skipped it.
- What won it: **Marcus on the (12,12) fort**. The eastern brigands, mercenaries and the boss all walked into his Silver Lance counter. The boss left his tile, attacked Marcus on the fort and died to the counter (18x2).
- **Marcus's Silver Lance is down to x12.** Give him a Steel/Iron Lance soon, and use his Steel Sword (x25) against axes.
- Hector's Wolf Beil doesn't double anything, so he has only 2 kills and is still Lv1. Eliwood is Lv2. Both lords are underleveled, so feed them kills.
- No save prompt appeared. Ch13 "In Search of Truth" ("Seize gate") loaded straight onto the map at turn 1 with **no prep screen**. **Matthew (#20, thief, Lockpick) and Serra (#22, cleric, Heal)** joined. **Guy is enemy #8 (ch06, myrmidon) at (7,14)**: Matthew talks to him, and nobody should attack him.

### Chapter 13 — In Search of Truth

**Objectives:**

"Seize gate" (Eliwood's tale). The map is 18x17 and you start in the NE. The gate is at (2,10) in the SW, walled on three sides, so (2,11) is the only melee tile. The boss is a Lv13 Knight (27 HP, Def 13, which is 15 on the gate) with a Silver Lance, and he **never moves**. The only way south is the east pass at (17,7)/(15-17,8); from there you go west over the bridges at (10,14)/(10,15). The NW block (village (1,2), plus an archer) is cut off by river and can't be reached on foot. Village (12,9) is entered from (12,10). There are houses at (2,15), (10,6) and (15,1), an armory at (5,5), a vendor at (6,5), and forts at (13,13), (8,15), (0,13), (11,16) and (12,16).

**Recruits:**

| character | starts as | recruit with / action    | important condition  |
| --------- | --------- | ------------------------ | -------------------- |
| **guy**   | enemy     | **matthew** talks to him | don't kill him first |

**Agent notes:**

- s15: WON on turn 14, first attempt, with no deaths. **Guy was NOT recruited: he died.** The (old) notes had Matthew and Serra swapped: **Matthew is the one with the Lockpick (0x6A)**, Serra carries Heal (0x4A). Guy (enemy #8, Killing Edge) sat still at (7,14) for 4 turns, then charged on the turn 5 enemy phase. Eliwood was in his range and her counter apparently crit-killed him; she went from Lv2 to Lv3 in that phase. Lesson: before Guy moves, put Matthew next to him, or keep every unit that can kill him out of his reach (Move 5 + 1).
- The enemies are weak soldiers, brigands with hand axes, and archers. Reinforcement soldiers spawn on the (0,13) fort. Marcus and Oswin as walls with lords picking off the wounded worked cleanly. Marcus killed the boss: Silver Lance 10x2 from (2,11) took him from 27 to 17, then his enemy-phase counter finished him.
- Serra visited village (12,9) and got item **0x79**. Matthew's visit to house (2,15) was talk only. `fe7_act` has no `armory` action, and trying it moves the unit onto the shop and wastes its move, so nothing was bought.
- Ending: I saved to the highlighted top slot ("Ch.13: In Search of Truth"); slot 2 still holds "Ch.11". **13x was not unlocked**: Ch14 "False Friends" loaded at a **Preparations screen** (turn 0, goal "Defeat enemy", 22 enemies).
- At handover: Eliwood Lv3 (Rapier x28), Hector Lv2 (Wolf Beil x24), **Marcus's Silver Lance is at x4** (Steel Sword x17), so he needs a new lance badly. Oswin Lv9 (Iron Lance x31, Javelin x19), Lowen (Javelin x17), Rebecca (Iron Bow x38), Dorcas Lv3, Bartre Lv6 (Steel Axe x26), Serra Lv4 (Heal x25), and Matthew Lv2.

### Chapter 13x — The Peddler Merlinus (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 14 — False Friends

**Objectives:**

"Defeat enemy" (rout) in Eliwood's tale; it started at 22 enemies, and pirates spawn from the SE forts (17,16)/(22,14)/(27,14) for about the first 7 turns. The map is 28x17 and you start in the NE, walled off by a river with bridges at (17,1) and (20,5). The boss is **Erik, a cavalier with a Horseslayer** (effective vs Marcus/Lowen), who sits at (3,7) beside the gate (1,6) but does leave to attack once units come near. Erk is a green NPC at (11,2). Priscilla's village is at (6,14), entered from (6,15). There are a village at (9,2) (walled; step onto the tile), an armory at (9,12) (Iron sword/lance/axe/bow), a vendor at (11,13) (Vulnerary/Heal/Fire), houses at (7,3), (22,1) and (23,1), and **rain around turns 5-7 that doubles move costs**.

**Recruits:**

| character     | starts as | recruit with / action                    | important condition               |
| ------------- | --------- | ---------------------------------------- | --------------------------------- |
| **erk**       | green npc | **serra or priscilla** talks to him      | —                                 |
| **priscilla** | village   | **any unit visits the southern village** | protect the village from brigands |

**Agent notes:**

- s16: WON on turn 23, first attempt, with no deaths. **Erk recruited** (Serra talked to him on turn 3 from (11,1); the talk from (12,2) failed twice with "menu could not be located"). **Priscilla was NOT recruited**: a pirate razed the (6,14) village on turn 8. Rain slowed us, and nobody could get there in time. To save her, send Lowen/Marcus SW along x13 and then west on turns 1-3, before the rain.
- What worked: Oswin as bait (pirates, soldiers and the boss's Horseslayer do 0-2 to him). Marcus plugged the one-tile corridor at (11,2)/(11,3) and killed 4 enemies on one enemy phase. The western cavalry and the boss mostly sit still until a unit enters their reach, so you can bait them one at a time.
- Danger: rescuing with Marcus left him without canto inside Horseslayer range, with halved Spd, which meant a doubled 17x2. I fixed it with Hector `take`. Keep Marcus and Lowen out of Erik's reach.
- **Shopping works by hand:** 10000G at the start. Bought Marcus an Iron Lance and an Iron Sword, Eliwood an Iron Sword, Hector an Iron Axe (traded to him), and Serra a Heal staff and a Vulnerary. 7850G left.
- **Hector and Eliwood got a support (C)** on turn 19.
- At handover: Eliwood Lv5 (killed the boss; Rapier x22, Iron Sword, **Horseslayer x16** from the boss drop), Hector Lv3 (Wolf Beil x19, Iron Axe), Marcus Lv3 (Iron Lance x43; Steel Sword/Lance x4 each), Oswin Lv10 (Javelin x5, Iron Lance x31), Erk Lv6, Lowen Lv2, Rebecca Lv3, Dorcas Lv3, Bartre Lv6, Serra Lv4 (Heal x17 and x30), Matthew Lv2 (8/18 HP). The lords and Lowen are underleveled.
- No save prompt or Yes/No screen came up. The rout went straight to the "Ch.15: Noble Lady of Caelin" title card, and I left it at the **Preparations** screen (turn 0, "Seize gate", 21 enemies, 8 deployed).

### Chapter 15 — Talons Alight

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 16 — Noble Lady of Caelin

**Objectives:**

"Seize gate" (Eliwood's tale, E15), 21 enemies. The map is 24x17 and you start in the west (8 deployed). The gate is at (21,3) in the NE, walled on three sides, so (21,4) is its only entrance. The boss is **Bauker**, a Lv18 Knight (31 HP, Def 11 (13 on the gate), Javelin). There are houses at (6,4), (9,5), (21,11) and (19,14), villages at (1,11) and (12,14) (both walled), a vendor at (20,15), armories at (21,15)/(22,15) and forts at (15,2)/(15,4). A diagonal cliff (9,3)-(6,7) splits the west, and the way east is through the forest gap at (6-8,7-8).

**Recruits:**

None.

**Agent notes:**

- s17: WON on turn 12, first attempt, with no deaths. On turn 1, **Lyn (Lv11, Mani Katti), Kent, Sain and Wil** arrive as player units in the SE corner (19-22,13-15). **Florina** was in the west group. All of them were benched again at the Ch17 prep.
- The enemies are weak: cavaliers, mercenaries, archers, mages and brigands. **Marcus soloed most of them** (Def 12, doubles everything). Hector's Wolf Beil one-shots cavaliers (it is effective vs horses, about 24 damage).
- **Boss trick:** Marcus standing on (21,4) traps Bauker; he can't leave the gate and only gets 7-damage javelin pokes in. Marcus's double (9x2) plus one enemy-phase counter killed him. Then move Marcus off and walk Eliwood onto the gate.
- Reinforcement cavaliers spawn at (1,0)/(3,0) in the NW every turn from turn 8, and brigands come off the mountain at (8,0). Leave Hector there as a guard.
- Mistakes: Dorcas axed a mercenary in the forest without forecasting (23% hit) and ate 20 damage; Sain missed and dropped to 7 HP. Forecast mercenaries on forest tiles. **No healer was deployed** (Serra was benched). Deploy Serra next time.
- Ending: I saved to the top slot ("Ch.15: Noble Lady of Caelin"). The next chapter, "Ch.16: Whereabouts Unknown" (the Chapter 17 heading here, "Seize throne", 27 enemies, mostly archers and knights), loaded at **Preparations**. Lyn's group is benched, and Serra and Matthew are in the default deployment.
- At handover: Eliwood Lv5 (Rapier x21, which is effective vs knights, useful for the next boss), Hector Lv5 (**Wolf Beil x11**), Marcus Lv4 (**Iron Lance x20**, plus a Fire tome he picked up), Oswin Lv11, Rebecca Lv4, Florina Lv5. Everyone is out of Vulnerary except Hector (x3) and Serra.

### Chapter 17 — Whereabouts Unknown

**Objectives:**

"Seize throne" (Eliwood's tale, E16 "Whereabouts Unknown"), 27 enemies. This is a 17x28 indoor castle. You start along the south edge (rows 26-27, with Merlinus's tent at (15,26)), and the throne is at (14,1) in the NE. The only route north is: stairs (10-12,23-25), the room above, the exit (10-12,16), west along the row 14 corridor, up the stairs at (0-1,12-13), up the x=0 column to row 4, then east to the throne room. The boss (cls16, 29 HP, Def 15 on the throne, Steel Lance + Hand Axe) **never moves**, and **(14,2) is his only melee tile**. There are chests at (1,19)/(2,19) (behind door (1,21)) and (2,1)/(4,1) (behind door (3,3)).

**Recruits:**

| character  | starts as | recruit with / action      | important condition                       |
| ---------- | --------- | -------------------------- | ----------------------------------------- |
| **raven**  | enemy     | **priscilla** talks to him | recruit him before he gets himself killed |
| **lucius** | green npc | **raven** talks to him     | therefore raven must be recruited first   |

**Agent notes:**

- s18: WON on turn 25, first attempt, with no deaths. **Raven (enemy ch04) and Lucius (green ch10) were NOT recruited** (no Priscilla); they spent the chapter in the east rooms. Lyn and Sain were greyed out at Pick Units. Hector-mode "17x Badon" did not trigger: the next chapter is "Ch.17: Pirate Ship" (Survive 11 turns, no prep, Serra and Matthew benched).
- **Cavalry reinforcements** come 2 per turn from the SW plains (0,26)/(0,27) on turns 7-11, and they killed Merlinus's tent on turn 9. He came back next chapter, so the loss is only the convoy for this map. **What saved us:** the west pocket (west room + west strip + chest room) is entered only through (9,19)/(9,20). Hector (Def 10) and Eliwood (Rapier, effective vs horses) held those two tiles with Serra and Rebecca inside, and killed two cavaliers per turn.
- Every room in the middle (x3-7, rows 7-9) is an archer nest sealed by door (5,6). They shoot x=1-2 and row 5 but can never leave, so walk the x=0 column and row 4. 0x69 (dropped by the (2,11) archer) is a Door Key.
- Boss kill: Marcus's Steel Lance 10x2 from (14,2) took him to 9, and his Javelin counter took him to 5; then Eliwood's Rapier finished him and she seized the next turn.
- Matthew got items 0x57 (x10), 0x63, 0x64 from chests, and his inventory is full, so the (4,1) chest was left. Marcus had to send his Fire tome to Merlinus.
- At handover: Eliwood Lv9 (**Rapier x7**, Iron Sword x44), Hector Lv8 (Iron Axe x31, Wolf Beil x11), **Marcus Lv5 has NO lances left** (only swords 0x05 x35 and Iron Sword x46). Give him a lance first thing. Oswin Lv11 (Iron Lance x23, plus a Steel Axe he can't use), Lowen Lv4, Rebecca Lv4, Dorcas Lv3, Bartre Lv6, Serra Lv6 (Heal x6 and x30). Shopping is badly needed.
- Ending: I saved to the top slot (now Ch.16; slot 3 "Ch.16 Whereabouts Unknown, 4:02" is an older file). Note that the save menu's cursor defaulted to slot 2 (Ch.11), so move it up before pressing A.

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

"Survive 11 turns" (Eliwood's tale E17), no prep screen. The deployment is forced: Eliwood, Marcus, Lowen, Rebecca, Dorcas, Hector, Oswin, Bartre, plus Merlinus (#8, the tent). The map is 19x21 and you start on the upper deck of the N ship (rows 1-3, x7-12). The only ways down are the stairs **(8,4)-(8,5)** and **(11,4)-(11,5)**, and fences block the rest of row 4. There is an **armory at (9,5)** (Iron/Steel Sword, Steel Lance, Javelin, Steel Axe, …) and a **vendor at (10,5)** just below. 20 enemies at the start, mostly **shamans (cls24, Flux, ~12 Atk, hits res-0 units for 11-12 at range 1-2)** in the W ship and mercenaries in the E ship. Reinforcements come every turn: shamans in the W, mercs at (18,10), and **myrmidons with Armorslayers (cls0E) at (18,5)** (lethal to Oswin).

**Recruits:**

None.

**Agent notes:**

- s19 attempt 1 (LOST, restarted on turn 5): held both stairs. Marcus (Res 9) is nearly immune: shamans do 3 and mercs 0, and his counters killed 4-5 per enemy phase. Everyone else melts to Flux, so 2 shaman hits kill a 24-HP Res-0 unit. Bartre holding (8,3) died to a merc double plus a shaman, the shamans poured in, and Oswin died too. The `item` (Vulnerary) after a `trade` failed and left Hector spent and unhealed. Heal BEFORE moving into position, or with a separate unit. Shopping by hand works (Marcus walks onto (9,5), then cantos back).
- s19 attempt 2: **WON (survived 11 turns), no deaths.** Turn 1: Marcus bought a Steel Lance and a Javelin at the armory and cantoed to (8,4); Lowen bought 2 Vulneraries at the vendor (6070G left) and cantoed to (11,3). After that the setup held: **Marcus on the west stair (8,4) and Hector on (11,3)**, which only (11,4) and (11,5) can reach and whose attackers are mostly mercenaries (0-2 dmg to him). Everyone else stays on rows 1-2. When Marcus had to heal, a holder on (8,3) (only (8,4) and (8,5) can reach it) worked: Bartre went 32→6 there, which is just enough. Leave a weak enemy standing on a stair tile, since it blocks a shaman from that tile. Hector's Wolf Beil one-shots myrmidons; kill Armorslayer myrmidons before they reach Oswin. Pegasus knights (cls32) arrive on turn 9-10 and can reach rows 1-2 on turn 11.
- Tool quirks here: the Vulnerary `item` only works **in place** (x,y = current tile); after a move or a trade it fails. Two-way trade swaps fail. Marcus's Javelin broke on turn 6.
- At handover: Eliwood Lv9 (**no kills this map**, Rapier x7), Hector Lv10 (**Wolf Beil x4**, Iron Axe x25), Marcus Lv5 (Iron Blade x24, Steel Lance x30, Flux he can't use), Rebecca Lv6 (HP refilled to 20/20 at the chapter change; carries a Vulnerary x2 and a Longsword), Bartre 32, Oswin 30. Dart joined at the start of Ch19.
- **Ending mistake:** after the win I pressed Start through the interlude; a late Start hit the Ch19 Preparations screen and started the chapter. Default deployment (13 incl. Dart, Merlinus prompt default Yes) and I took the default on Dart's opening question. The handover is at **Ch19 turn 1** with the opening events cleared, not at the prep screen. No save prompt appeared.

### Chapter 19 — The Dread Isle

**Objectives:**

"Defeat Uhai" (Eliwood's tale E18), **fog of war**, no prep screen this time (the deployment was the default 13, including Dart). The map is 17x23 and you start in the NW (x1-8, rows 3-8). **Uhai** is a Lv7 Nomadic Trooper (33 HP, Def 12, plus forest) who sits at **(13,22)** in the SE forest and never moves; his only melee tiles are (12,22) and (13,21). There are 29 enemies, mostly cavaliers (cls28), nomads (cls2E/2F, bows only) and pirates. Pirates keep arriving at (2,0) and (14,0). A river splits the map, and the south bridges (3,10)/(4,10) plus the NE bridge (10,3) are chokepoints. Forts are at (3,11)/(4,11).

**Recruits:**

| character | starts as | recruit with / action    | important condition |
| --------- | --------- | ------------------------ | ------------------- |
| **fiora** | green npc | **florina** talks to her | appears turn 3      |

**Agent notes:**

- s20: **WON on turn 17, first attempt, with no deaths.** **Fiora was NOT recruited.** Florina was benched (not in the default deployment), and Fiora (green pegasus) arrived at (2,11) on turn 3 among the enemies and died on the enemy phase. To recruit her, deploy Florina and fly her to (2,11) on turn 3.
- What worked: on turns 1-6, **Hector on (4,9) and Oswin on (3,9) sealed the south bridge exits** and **Marcus on (9,3) sealed the NE bridge**. The cavaliers and nomads fed into them, and the wounded were finished by Lyn, Eliwood, Rebecca and Lowen. Nomads/archers can't counter at range 1, so melee them freely. Two bow nomads did slip round to the rear on turn 10 and shot Serra to 6 HP.
- **Uhai kill:** he holds his **Short Bow equipped, so he can't counter at range 1** (the forecast shows "--"). Marcus Steel Lance took him 33→19, Hector's Wolf Beil counter on the enemy phase took him to 3, and Marcus finished him. Hector went to 7 HP from Uhai's sword on the enemy phase, so don't leave a lord beside him below about 15 HP.
- **Fog:** you can't attack or forecast an enemy hidden in fog, even an adjacent one. Park a unit within sight on the turn before. `fe7_forecast`/`fe7_act` attack from (12,22)/(13,21) failed with "action menu could not be located" (the menu draws at the top-left there); I did the attack by hand: A, A on the weapon (the forecast shows), then A.
- Uhai drops item 0x65, which Marcus now carries (I sent his unusable Flux away for it). The forest in the south makes moving very slow; use `fe7_reachable` before every move there.
- At handover: Eliwood Lv9 (Rapier x5), Hector Lv11 (**Wolf Beil x2**), Marcus Lv7 (Steel Lance x26), Lyn Lv12 (Mani Katti x27), Oswin Lv12 (Iron Lance x10), Lowen Lv5 (Javelin x5), Serra (Heal x29). Eliwood is still underleveled.
- Ending: I saved to the top slot (now "Ch.19: Dragon's Gate"). The next chapter is "Ch.19: Dragon's Gate" (the **Chapter 20** heading here, "Seize throne", 33 enemies), so no 19x gaiden. Left at the **Preparations** screen, turn 0, with 12 deployed (Dart benched).

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

"Seize throne" (Eliwood's tale E19), 33 enemies, with a prep screen. The map is 22x22 and you start in a walled pocket at the south (rows 17-21, x0-12). The throne is at **(12,2)**. The route is: column (6,11)-(6,15) → hall rows 7-9 → door (12,6), which Legault opens for you → throne room. Reinforcements spawn endlessly at (3,0)/(4,0)/(0,1)/(0,2) (knights and mages) from about turn 14.

**Recruits:**

| character   | starts as | recruit with / action          | important condition                     |
| ----------- | --------- | ------------------------------ | --------------------------------------- |
| **legault** | enemy     | **hector or lyn** talks to him | appears turn 2; he may eventually leave |

**Agent notes:**

- s21 attempt 1 (LOST on turn 20; Lyn died, and **Lyn's death is a Game Over in Eliwood's tale**). The setup worked up to that point. The start pocket (rows 17-21) is entered only through (5,16)/(6,16), and later Marcus alone on (6,14) seals the column. The hall army (paladin, cavaliers, nomads, fighters, mercs) died to Marcus's and Hector's counters. **Hector on the forest at (6,10) takes 0-3 from everything in the hall.**
- Reinforcements: archers spawn on the stairs at (1,18) (turns 3-4), and **pegasus knights spawn at (0,21)/(1,20)** (turns 7-9, two per turn, 18 HP, Def 4). Rebecca's bow plus Dorcas's or Lyn's double kill them. More knights and mages keep spawning at (3,0)/(4,0)/(0,1) in the throne region.
- Two archers (one with a Longbow, range 3) are walled into a room at x8-15, rows 11-15, behind door (9,16). They shoot over the walls at the column and at hall row 9. Keep wounded units on hall row 7 or further west.
- **Boss** (cls16 General, 34 HP, Def 17 on the throne, Spear 1-2, Atk 27) sits on (12,2). Rapier only does 4 to him. **Oswin carries a Hammer (0x26)**; Hector with it does 16 at 59%. **He DOES attack anything within 2 tiles on the enemy phase** (he skipped Marcus, who has Def 13, but hit Lyn on (12,4) for 24). Keep low-Def units out of range 2 of (12,2): no unit on (12,4), (11,3), (13,3), (10,2) or (14,2) unless it can take 24.
- Legault went (0,1) → row 2 → opened door (12,6) → hall → door (6,8) → chests (1,8)/(0,9) → back out by turn 15. He never came within reach of Hector. To recruit him, push Hector up the column early (turns 5-7) to meet him around (6,9).
- Item IDs: 6B Vulnerary, 6C Elixir, 63 Hero Crest (Eliwood), 64 Knight Crest (Matthew), 65 Orion's Bolt (Marcus), 31 Brave Bow (Matthew, from the (2,17) chest), 26 Hammer. Slot #12 "cls44" is Merlinus's tent, not a dancer.

**s21 attempt 2: WON on turn 21, no deaths, Legault RECRUITED.**
- In Eliwood's tale **Hector has NO Talk with Legault; Lyn does.** He arrived at (6,9) on turn 7, then sat at (1,8) in the west wing from turn 10 on. Marcus blocked the 1-wide row-7 corridor at (3,7), and Lyn walked to (2,8) and talked to him on turn 13.
- At prep I used Trade/List (List shows everyone's items and lets you pull them): Oswin's Hammer and Dart's Steel Axe went to Hector, and the Horseslayer to Sain. The Brave Bow is unusable (Rebecca's bow rank is too low).
- **Gateway trick:** Marcus on (9,2) seals the whole throne area from the west spawns, which can only reach him. With that in place, Hector (full HP) traded Hammer blows with the boss from (12,3), stepped back to (13,4) to be healed from (14,4), then hit again, and Marcus left the gateway to finish him from (11,2) (Steel Lance, 93%). Eliwood waited at (12,5), out of range, and seized the same turn.
- Pegasus waves came on turns 7-10 (6 fliers). Rebecca (effective bow), Dorcas, Sain and Lyn killed them all. The archers spawned on the stair pocket were cleared by Lyn.
- The tool's `staff`/`item` fail near the top rows (y ≤ 4): "menu could not be located". I healed by hand (select, move, A, Staff, A, A) and used Marcus's Elixir the same way.
- At handover: Marcus Lv8 (Steel Lance x20, Iron Blade x7, Elixir x2, Orion's Bolt), Hector Lv12 (Hammer x14, Steel Axe x25, Iron Axe x13; **Wolf Beil is gone**), Eliwood Lv10 (Rapier x4, Hero Crest), Lyn Lv12, Serra (2/23 at the end of the map, Heal x22), Matthew (Knight Crest, Unlock staff), Legault Lv12 (Steel Sword, Elfire, Blue Gem). I saved to the top slot ("Ch.20: New Resolve"). The next map is "Defeat Oleg", left at **Preparations** turn 0 with 8 deployed by default.

### Chapter 21 — New Resolve

**Objectives:**

"Defeat Oleg" (Eliwood's tale E20), with a prep screen and 8 deploy slots. **Ninian (dancer, ch25) joins** as an extra unit on turn 1. The map is a 26x15 town. You start in the west-middle (x5-8, rows 6-13), and Merlinus's tent is at (2,7). **Oleg** (cls13 Warrior, Lv5, 42 HP, Def 12, Silver Axe + Hand Axe, drops a Hero Crest) sits at **(25,12)** in the far SE. The map has 26 enemies: monks (cls1C, light tomes, ~7 Atk, so harmless to Eliwood, Marcus and Hector) scattered west and north, plus cavaliers, wyverns (cls34), berserker-types (cls39, Hand Axe/Hammer/Poleax), archers and knights in the east. The **corridor rows 7-8, x9-12** is the way east (fences on row 9 and buildings on rows 5-6).

**Recruits:**

None.

**Agent notes:**

- s22 attempt 1 (LOST on turn 3, enemy phase): **Lyn died at (13,7)**, which is a Game Over. I had put her (Def 3) on the corridor-mouth front tile at full HP, and several east enemies piled onto her in one phase. **Never put Lyn or Eliwood on a tile more than one enemy can reach.** Front only with Marcus, Hector or Oswin. The first two turns went fine: Eliwood and Lyn killed monks and the two cavaliers (Mani Katti and Rapier are effective vs horses), and Marcus and Hector cleared the west monks. Monks attack from range 2, so Marcus's and Hector's melee can't counter them.
- The pre-chapter Start ran the opening events, and then the game fell to the title screen; **Resume Chapter** put it back on turn 1. At Pick Units I swapped Bartre out for Serra.

**s22 attempt 2: WON on turn 19, no deaths.**
- **Lyn can be benched at Pick Units here.** That removes the second game-over risk. I fielded Eliwood, Hector, Marcus, Lowen, Rebecca, Oswin, Serra and Sain (Horseslayer), plus Ninian, who joins anyway.
- What worked was a **corridor wall at x11-12, rows 7-8**: Hector and Oswin (later Marcus) on the two front tiles, everyone else in the pocket behind. Enemy waves (cavaliers, wyverns, Poleax berserkers, nomads, knights) arrived every turn through about turn 12 and died on the wall. **Wyverns fly over the fences and roofs into the pocket** (seen at (10,7), (11,6) and (12,9)). **Monks and nomads snipe from range 2**, so the front tile must not leave a range-2 gap onto soft units. Oswin carrying Ninian (rescue) kept her safe from the wyverns.
- **Hidden enemies:** several enemies (Oleg, his Hammer berserker, an archer at (24,1), a monk at (3,0), plus some row-13 monks early) carry unit flag 0x200. They are drawn nowhere and can't be attacked, but they block pathing and `fe7_state`/`fe7_threat` list them. Oleg only "woke up" after Marcus stepped into his enclosure (22,8) on turn 18: the berserker suicided into Marcus, and Oleg walked to (22,10).
- **Oleg kill:** Marcus's **Iron Blade** (sword beats axe) did 16x2 at 100%, and Oleg's Hand Axe counter hit only 22%. Hector then blocked (22,7) and his counter finished Oleg (10 HP) on the enemy phase. Oleg drops a Hero Crest (63).
- At handover: Marcus Lv9 (Iron Blade x5, **Steel Lance x3**, Iron Sword x20, Elixir x2, Orion's Bolt), Hector Lv15 (Hammer x7, Steel Axe x15), Eliwood Lv10 (Rapier x4, Iron Sword x35), Rebecca Lv8, Sain Lv9 (now holds the Luna tome 3F, which he can't use), Oswin Lv13 (**Iron Lance x3**), Serra Lv9 (**Heal x7**). Weapons are running low, so buy at the next shop.
- Ending: `fe7_wait`'s A/Start presses ran straight through the ending, any save prompt and the next chapter's prep screen (if it had one). The game is now on **"Kinship's Bond" turn 1** ("Defend Nils, 11 turns") with the default 13-unit deployment, and Lyn, Dorcas, Bartre and a new paladin (ch34, cls2B, Lv1) are deployed. I saw no title card or Yes/No screen.

### Chapter 22 — Kinship's Bond

**Objectives:**

"Defend Nils" for 11 turns (Eliwood's tale E21), no prep screen; the default 13-unit deployment with Lyn deployed (her death = Game Over). The map is 22x23. Nils (green, 10 HP) is at (10,1) in the N throne room (x8-13, rows 0-3), whose ONLY entrance is the 2-tile choke **(10,4)/(11,4)** (the braces at (9,4)/(12,4)/(9,5)/(12,5) are impassable). Merlinus's tent is at (8,2) (the convoy is nearly empty, 5 items). There are 22 enemies to the south: wyverns (cls34, Steel Lance), fighters (one with a Hammer), archers/nomads, monks, a shaman, and a **paladin at (10,21) that drops a Knight Crest (0x64)**. **Heath** is the wyvern ch20 at (0,15) (Axereaver + Javelin). Six green knights stand at rows 6-7.

**Recruits:**

| character | starts as | recruit with / action               | important condition |
| --------- | --------- | ----------------------------------- | ------------------- |
| **heath** | enemy     | **eliwood, hector, lyn, or ninian** | —                   |
| **rath**  | green npc | **lyn**                             | —                   |

**Agent notes:**

- s23 attempt 1 (LOST on turn 8; **Hector died, which is a Game Over**). The row-4 choke (10,4)/(11,4) held fine on turns 1-5. On turn 6 Hector stepped to (10,5) to talk to Heath (**Hector's Talk recruits Heath** in Eliwood's tale) and Marcus took (11,5). I then LEFT the line on row 5, where each tank can be hit from 5-6 tiles instead of 3, and by turn 8 Hector (25/34) died to the arriving fighters, wyverns and monks.
- s23 attempt 2: **WON (the chapter ended after the turn-11 enemy phase). Heath RECRUITED; Isadora DIED; Rath NOT recruited.** Rath (green nomad ch32) appears on turn 2 in the walled NE room, walks out into the enemy horde at (17,7) and dies by turn 4-5. Lyn can't get there safely from the throne room. To try, send Lyn east on turn 1-2 with an escort.
- What worked: **seal (10,4)/(11,4)** with tanks, which leaves only (10,5)/(11,5)/(10,6)/(11,6) able to strike. Dorcas's Hand Axe and Rebecca's bow from (10,3)/(11,3) pick off weak enemies on the stairs. Heath sat at (10,6) on turn 6 in both attempts: kill the unit on (10,5), Hector talks from (10,5), Heath flies inside, Marcus holds (11,5) for that one phase, and on turn 7 **Hector goes back to the rear row** and the line returns to row 4.
- Hector must never hold the choke: the monks (cls1C, Atk 9) plus wyverns and fighters overwhelm his Res 5. **Marcus (Res 12) is the anchor**; monks and mages do 0 to him. The second slot went Hector → Isadora (turn 7) → Oswin → Isadora. **Isadora died on (10,4) at 20/28 on the turn-10 enemy phase** (Armorslayer equipped, so she couldn't double), and two monks walked in and hit Nils to 5/10. Rotate a fresh tank in every turn and don't leave a 20-HP unit on the choke this late. Bartre and Marcus killed the intruders, Oswin resealed, and Serra healed Nils.
- No prep screen. Default 13 deployed (incl. Lyn and Isadora). The convoy holds only 5 items.
- At handover: Marcus Lv10 (**Iron Sword x1, Steel Lance x3**, Orion's Bolt; the Elixirs are used up), Hector Lv15 (Hammer x4, Steel Axe x15, Iron Axe x13), Oswin (**no weapon**), Rebecca (**no bow**; Brave Bow unusable), Lowen (no Javelin, Iron Sword x41), Serra (Heal x3), Heath Lv7 (Javelin x18, Axereaver x15), Eliwood Lv10 (unchanged). **Everyone needs weapons: shop at the first chance.** No save prompt or Yes/No was seen; `fe7_wait`'s presses ran the ending, and I stopped at the next chapter's **Preparations** screen ("Chapter 22: Defeat enemy" in-game = the Ch23 Living Legend heading).

### Chapter 23 — Living Legend

**Objectives:**

"Defeat enemy" (rout; Eliwood's tale E22), with a prep screen and 8 deploy slots. A 22x16 desert map. You start on the NE plains (x14-21, rows 0-9), and Merlinus's tent is at (21,2). 27 enemies: about 11 mages (Fire), 5 wyverns, archers, knights, a nomad, a cavalier, a Luna monk and **two warriors (ch53 with a Killer Axe, ch54)**. Shaman reinforcements spawn at (0,3)/(0,11) until about turn 8. **Pent (green sage) and Hawkeye (green berserker, ch22, arrives turn 2)** fight on their own and kill most of the map. House at (12,13), not visited.

**Recruits:**

| character   | starts as | recruit with / action | important condition |
| ----------- | --------- | --------------------- | ------------------- |
| **hawkeye** | green npc | **hector**            | appears turn 2      |

**Agent notes:**

- s24: **WON on turn 9 (enemy phase), first attempt. Heath DIED (turn 5). Hawkeye joined automatically at the chapter end** (no Talk was needed, and Hector never went near him; he is in the Ch24 Pick Units list). The roster went from 24 to 25 units, so Pent may have joined too; check.
- Prep: I benched Lyn (her death = game over), Lowen, Rebecca and Oswin, and fielded Eliwood, Hector, Marcus, Serra, Sain, Erk, Heath and Ninian. Trade → **List** shows every unit's and the convoy's items. I pulled the convoy's Steel Lance 17, Florina's Slim Lance/Javelin and Kent's Iron Sword to Marcus, and Dart's Hand Axe to Hector. Used the Energy Ring (Hector Str 15), Dragonshield and Secret Book (Eliwood).
- What worked: turtle on the NE plains on turn 1. Pent and Hawkeye killed 8 enemies on the first phase alone. The desert costs 2+ per tile even for Erk, and more for horses, so let enemies walk in.
- **Heath's death:** I caged the Killer-Axe warrior (Spd 12) on four sides with Eliwood/Sain/Heath/Marcus. Heath has AS 5, so he got **doubled** (19x2 > 28). Check AS before using a unit as a blocker: the warrior doubles anyone with AS 7 or less. Kill it the turn it arrives with Hand Axe/Javelin/Fire from range 2 (it cannot counter there), and use a dance for a second throw.
- At handover: Eliwood Lv11 (**Rapier is GONE**, Iron Sword x35, Elixir x2, Hero Crest), Hector Lv15 (Hand Axe x19, Steel Axe x13, Hammer x4, Iron Axe x13), Marcus Lv10 (Javelin x19, Iron Sword x43, Slim Lance x21, Steel Lance x17; no Elixir), **Serra has NO staff** (Heal used up; only Vulneraries), Erk (Fire x21), Sain (Iron Lance x27, Horseslayer x15). Ninian gave her Elixir to Eliwood. **Nobody can heal with a staff, so buy one or bring Pent/Priscilla-type healers.**
- Ending: Save prompt → top slot "Ch. 22: Living Legend" (Save). No 23x. Next is **"Ch. 23: Four-Fanged Offense", objective "Defeat Lloyd"** (the 24b Lloyd version). Left at the **Preparations** screen, turn 0, with 12 deployed by default (Lyn included).

### Chapter 23x — Genesis (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 24 — Four-Fanged Offense (24a Linus version / 24b Lloyd version)

**Objectives:**

"Defeat Lloyd" (Eliwood's tale E23, the **Lloyd version**), **fog of war**, with a prep screen and 12 deploy slots (Merlinus deploys too, as his tent at (7,24)). The map is 19x25 and you start in the SW (x0-8, rows 20-24). **Lloyd** (cls10 Swordmaster, Lv12, 41 HP, Str 18, Skl 19, Spd 19, Def 8, Res 15, Lck 16, Silver Sword) stands at **(7,3)**, just south of the gate (7,2). His AI byte (+0x44 = 03) is the "attack whatever comes in reach" kind, so treat his reach as Move 6 + 1. The map has 28 enemies at the start: myrmidons (cls0E), mercenaries, monks (cls1C), **7 wyverns in the NW peaks** (x0-3, rows 0-9), **snipers (cls1A, about 25 Atk, range 2)** at (5,10), (16,20) and (13,24), plus knights and myrmidons in the NE. **Wallace** (green knight ch2C) starts at (16,17), east of the river. There are shops in the SE across the river: armories (13,22)/(14,22) and vendors (17,23)/(16,24). Villages are at (13,15) and (17,2), the arena at (2,13), and the bridges at (13,11)/(16,11).

**Recruits:**

| character   | starts as | recruit with / action                | important condition                        |
| ----------- | --------- | ------------------------------------ | ------------------------------------------ |
| **geitz**   | enemy     | **dart**                             | only on the linus version of the map (24a) |
| **wallace** | green npc | **lyn, kent, sain, florina, or wil** | only on the lloyd version (24b)            |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

- s25 attempt 1 (RESTARTED on turn 21 after two deaths, **Ninian on turn 6 and Rebecca on turn 20**). Prep: Lyn and Oswin benched, Hawkeye and Legault in, and Wil's Iron Bow given to Rebecca via Trade → List. Nobody has a heal staff (Matthew's Unlock is the only staff).
- **Fog:** every enemy except one starts hidden. You can't attack an enemy your units don't currently see (Attack is missing from the menu), so scout with Legault first; once a unit has seen it, others can attack it the same turn. `fe7_state`/`fe7_threat` still list hidden enemies, so you know where everything is.
- **The wall that won the middle:** the only ways from the centre into the SW start area are the two **forts (6,15) and (7,16)**. Those forts are also the monk spawn points. **Hawkeye on (6,15) and Marcus on (7,16)** take 0-4 from the myrmidons, and their counters killed the whole centre horde (about 25 enemies) by turn 14. Hector on (5,16) behind them is out of melee reach, but range-2 attackers can hit him on (5,15); a sniper and some monks took him 26→10 there.
- West-edge spawns (a monk and a myrmidon) appear at (0,15)/(0,16) around turns 6-7; they don't act on the turn they arrive. The NW wyverns stay put until something is within their reach, then come one or two at a time; Hawkeye on (5,10)/(5,9) baits and kills them.
- Wallace (green) died on the turn-2 enemy phase east of the river, so there is no way to reach him in time; he goes in unrecruited.
- **Ninian died on (6,17) on turn 6 with no visible attacker.** Attempt 2 explained it: **ballistae** (see below).
- **Rebecca's death:** the 2-HP sniper moved and shot her at (13,10) for exactly 21. I skipped `fe7_threat` that turn. Snipers do about 25 at range 2, which one-shots anyone with ≤21 HP and low Def.

**s25 attempt 2: WON on turn 43, enemy phase (Lloyd died on Hawkeye's counter). Ninian DIED (turn 6); Wallace not recruited (he dies on turn 2 every time).**
- **Ballistae the tools can't see:** sniper #27 walks to **(8,10)** and fires a **Killer Ballista** (range 3-10, about 13 dmg, 2 uses). Sniper #2 sits at **(15,17)/(16,17)** with a **Ballista** (range 3-10, Mt 8, about 23 Atk; it killed Ninian on turn 6 in both attempts). The nomad at **(11,1)** has an **Iron Ballista** that hit from 15 tiles away. Keep soft units more than 10 tiles from the first two and more than 15 from the nomad, and kill the snipers early.
- The fort wall again held the centre (turns 4-19). Rotate tanks: Hawkeye and Marcus, with Hector on the fort (6,15) late (Def 17 there; his Hand Axe counters killed monks). Berserkers walk over the (5,14) peak into the west pocket, so kill them before they do.
- **SE shops (map them before you need them):** vendor (16,24) sells Vulnerary/Antitoxin/Heal/Mend/Restore; vendor (17,23) sells only tomes; armory (14,22) has iron weapons and an Iron Bow; **armory (13,22) has Steel weapons, Lancereaver, Axereaver and a Swordreaver (2100G)**; the (13,22) shop buys tomes. The village (13,15) was already ruined.
- **Lloyd kill:** Hawkeye at full HP with the **Swordreaver** equipped (Item → Equip by hand) on the **fort (10,6)**. Lloyd moved onto the fort (10,5) next to him; the guards died on the first counters. Lloyd hits him only about 29% for 12 (crit 8%), and Hawkeye hits 61% for 21. Lloyd heals 8 a turn on his fort and doesn't attack while below about half HP, so it took 7 turns of trading.
- At handover: Hawkeye Lv5 (Swordreaver x8, Killer Axe x10), Marcus Lv12 (**5/37 HP**), Hector Lv18 (Steel Axe x9, Iron Axe x13, Hand Axe broken), Erk Lv10, Rebecca Lv10 (Iron Bow), Sain 10/27. Gold 2220. **Convoy: Mend and Heal staves (nobody deployed could use them)** plus some vulneraries; Bartre carries one. `fe7_wait` ran straight through the ending into the next chapter's turn 1 (I didn't see the title card or any save prompt).

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

"Survive 11 turns" (Eliwood's tale, in-game "Ch. 24: Unfulfilled Heart"; s25 mislabelled it as Crazed Beast, which this run skipped). There is a prep screen. The map is 21x27. Lords Eliwood, Hector and Lyn are FORCED, in locked centre slots (9-11,10), and Pent and Louise join beside them. The south group sits at (9-11,17-19) with Merlinus's tent at (12,16), and the east group at (17-19,15-17). **Boss Vaida** (cls37 Wyvern Lord, 60 HP, Def 21, Spear 1-2) sits at (2,2) and attacks anything within |dx|+|dy| <= 10 of (2,2). Don't kill her; she is recruitable later.

**Recruits:**

None.

Vaida appears here as an enemy. Do **not** kill her; she must survive this chapter to be recruitable in Chapter 29.

**Agent notes:**

- s26 attempt 1 (RESTARTED on turn 5 after **Bartre and Oswin died**). Every enemy rushes in from turn 2: about 10 wyverns (more arrive at (0-2,0-2) and (20,2-3)), berserkers that walk over peaks, 5 shamans (Flux/Nosferatu), monks, an Elfire sage, nomads and a Lv18 paladin. The centre lords get swarmed by magic (Eliwood has Res 2, Lyn Res 4). What worked: **Pent carrying Lyn** (rescue) makes her untouchable; Pent has Res 16 and Def 11. Hector on a west forest ((7,10)) took almost nothing. The SW pocket (rows 11-13, x3-7) had no enemy reach on turn 4.
- Bartre died on a tile `fe7_threat` called safe ((19,16), berserker E#8); leave a margin. Oswin died carrying Erk (carrying halves Spd, so he got doubled).
- Prep: the item menu has **Use**, so promotions can be done at prep. Kent's Orion's Bolt went to Rebecca (Sniper) and Matthew's Knight Crest to Sain (Paladin). Serra got Heal and Mend, Oswin Iron and Steel Lances, and Kent a Javelin, all from the convoy. Bartre was benched for Kent. Formation can't move the lords.

**s26 attempt 2: WON (survived the turn-11 enemy phase). SIX DIED: Dorcas (t7), Kent (t8), Sain, Lowen, Legault (t10), Serra (t11). Merlinus's tent was also destroyed (t10).**
- Turns 1-5 went well. The west/centre group killed everything nearby, using Pent and Louise as one-shot killers (Elfire 28 vs wyverns, effective bow) and Hector on forests. The SW pocket (rows 11-20, x0-5) stays almost free of enemies all chapter. Keep the lords there and outside Vaida's range (|x-2|+|y-2| > 10).
- **Wyverns keep arriving in waves of 4-8** (at (15-20,0-2), (19-20,25-26) and (0-2,0-2)) on turns 3-10, about 35 in total. From turn 6 on, **carry every soft unit on a high-Def unit**: Hector carried Eliwood, Marcus carried Lyn, Pent carried Louise, Hawkeye carried Rebecca and Oswin carried Erk. Wyverns do 2-4 to those carriers, and all of those pairs survived.
- What went wrong: the east group (Sain, Lowen, Kent, Legault, Serra) started cut off by mountains and got buried under 15+ wyverns by turn 9. **Next time, march the east group south and west via rows 19-22 on turns 1-3 to join the south group, or bench those units.**
- `fe7_act`/`fe7_forecast` `weapon_slot` kept failing with "single entry". Re-equip by hand: Item, then the weapon, then Equip, then B, Up, A to Wait. Pent's Physic (range 9) was the MVP; when the tool failed I cast it by hand.
- At handover: Eliwood holds the **Heaven Seal** and Hero Crest. Hector's Steel Axe is down to 2 uses. Survivors: Eliwood, Hector, Lyn, Marcus, Erk, Rebecca (Sniper), Hawkeye, Oswin, Pent, Louise, plus bench Bartre, Matthew, Florina, Wil and Dart. **No healer is left except Pent (Physic x12)**; the convoy holds the Heal staff. No save prompt appeared; the game auto-saved at the chapter change, and the top slot reads "Ch. 25: Pale Flower of Darkness". I left the game at that chapter's **Preparations** screen (Seize throne), turn 0.

### Chapter 27 — Pale Flower of Darkness

**Objectives:**

"Seize throne" (Eliwood's tale, in-game "Ch. 25"), with a prep screen and 12 slots. The map is a 25x26 snowy castle with weather: plains cost 2 (3 for horses) on some turns and 1 on others, so re-check reach every turn. You start in the SW (x3-9, rows 19-24). The **boss (ch58 Bishop, 41 HP, Def 9, Res 21) sits on the throne (21,4)** with **Purge (range 3-10, 5 uses)**, about 16-25 damage to anyone within 10 tiles of the throne; he can't counter at range 2. The route is the corridor x7-8 north to the hall (rows 7-10), east through the single-tile choke **(17,9)**, then the throne room through **(21,7)** only. A bishop (13,13) has a 5-use siege tome and a druid (2,2) has a 5-use siege tome. About 18 mages, plus wyvern waves that come down the corridor and also spawn at **(0,21)/(0,23) in the SW corner** (they don't act on the turn they arrive). Thieves loot the chests at (14-16,3-5).

**Recruits:**

| character  | starts as | recruit with / action                                 | important condition                                           |
| ---------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **karel**  | green npc | **hector or lyn**                                     | mutually exclusive with harken; see the note below this table |
| **harken** | enemy     | **eliwood, marcus, lowen, hector, oswin, or isadora** | mutually exclusive with karel; see the note below this table  |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

**s27 attempt 1: WON on turn 24 (seize). Erk DIED (turn 9). Harken NOT recruited (killed on turn 12).** Merlinus's tent was knocked out on turn 2 (he only retreats).
- Prep: Lyn benched (no game-over risk), Florina and Wil benched; Pent, Louise and Dart in. Eliwood's **Heaven Seal can't be used yet** (Use does nothing). Dart has no weapon (a Torch only).
- What worked: Marcus corked the SW mage room's stair exit (3,18). Then **Hawkeye (7,19) and Hector (8,19) sealed the corridor mouth**, and the wyverns died on them. Interior mages line up at x10 across the x9 wall, where Pent, Louise and Marcus (Javelin) shoot them at range 2 from x8.
- **Erk died at (8,19)** from range-2 hits over the wall plus a shaman in the corridor. I didn't re-run the threat map after moving.
- **Harken** (ch38, Lv8 Hero, Brave Sword, Spd 17) appears around turn 9 at (3,8) in the NW. He doubles with brave hits (about 60 damage), so nobody survives his enemy phase. I gave Hawkeye a Swordreaver to survive him, and Hawkeye's counter crit killed him. **Next time keep everyone out of his reach and talk with Marcus or Hector the turn he walks into range;** snow can stop Marcus reaching him.
- Boss kill: bait the mages to the (17,9) choke from outside Purge range (more than 10 tiles from (21,4)). Then Louise hit 14x2 from (20,5) (no counter) and Hawkeye finished in melee. Hawkeye's Iron Axe went to Marcus; Hawkeye now has Swordreaver x3 and Killer Axe x4.
- At handover: Marcus 18/37 (Steel Lance x10, no Javelin, still holds unused **Speedwings**), Hector 14/37 (Iron Axe x9 only), Louise's Silver Bow x3, Pent's Physic x4. Oswin and the others are healthy. `fe7_act staff`/`item` for Pent kept failing, so I cast Physic by hand (A, A, Staff, cycle targets with Left/Right).
- Ending: Save prompt → top slot ("Ch. 25: Pale Flower of Darkness"), then **"Deploy Merlinus?" → Yes**. Ch. 26 "Battle before Dawn" (= this file's Chapter 28) had no prep screen and loaded straight onto turn 1.

### Chapter 28 — Battle before Dawn

**Objectives:**

"Guard Zephiel" for 15 turns (Eliwood's tale, in-game "Ch. 26: Battle before Dawn"); **Zephiel's death = Game Over**. **Fog of war**, no prep screen on first entry, 11 deployed + Merlinus's tent at (19,6). Map 30x28. You start sealed in the north (x4-19 rows 0-6); the only exits are the **east stairs (20,3)/(20,4) into a room (x21-29 rows 2-4) whose door (26,6)** leads south, and a west door (6,3) into a myrmidon/swordmaster nest. **Zephiel** (green, 20 HP, Def 8, Res 13, Silver Sword, 3 Elixirs) starts at (14,14) in a room (x10-17, rows 12-16) whose ONLY entrance is the 2-wide stair corridor **(13-14,17-19)** from row 20. **Nino** (green mage) at (25,16) in the SE; **Jaffar** (green assassin, kills ~2 enemies a turn) roams the west (x0-5, rows 10-20). Boss **Ursula?** (ch51 cls2D, Bolting 3-10) sits at (7,26) in the SW.

**Recruits:**

| character  | starts as | recruit with / action     | important condition                                              |
| ---------- | --------- | ------------------------- | ---------------------------------------------------------------- |
| **nino**   | green npc | **hector or lyn**         | keep her alive afterward                                         |
| **jaffar** | green npc | **nino must talk to him** | both must survive ch. 28; jaffar then joins automatically in 28x |

**Agent notes:**

- s28 attempt 1 (LOST on turn 8 enemy phase: **Zephiel died**, Game Over). Matthew also died turn 7 (bishop cls1E at (28,18) moved and killed him; I skipped the threat check). Route taken: east room → door (26,6) (an enemy fighter with a Door Key opened it on the turn-2 enemy phase) → down x26-28 → (28,13-17). That is ~32 tiles from the door to Zephiel's stair entrance (14,18); infantry never got there. Enemies (tome users cls24, shamans, fighters, then Lv6 swordmasters cls0C) entered Zephiel's room from turn 5; he was 17→12→(Elixir)20→dead by turn 8.
- **In Eliwood's tale HECTOR CANNOT TALK TO NINO — ELIWOOD CAN** (recruited turn 8 at (25,17)). Hector can rescue her (greens can be rescued) to keep her safe until Eliwood arrives.
- Fog: you can't attack an enemy no unit currently sees; the `fe7_act` menu probe at an adjacent tile showed [item, wait]. Enemy flag +0x0C = 0x200 here means "hidden by fog", not dormant. Bows/Hawkeye cleared the door area: shaman (26,5) T3, shaman (26,8) T4, shaman (26,10) T5.
- s28 attempt 2 (LOST turn 10 EP: Zephiel died; Marcus died T9). Restart DOES show a Preparations screen — press Start ONE at a time; a queued extra Start skipped it and B on "Deploy Merlinus?" = No. Marcus rush timeline that worked: T1 (22,4); T2 stand on (26,5) right in front of the closed door (the key fighter opens it on the T2 enemy phase); T3 kill the key fighter at (26,7) from (26,6); T4 Rebecca shoots the shaman at (26,7) from (26,5), Marcus rides to (28,12); T5 (25,17); T6 (19,19); T7 (14,18) stair entrance; **T8 rescue Zephiel from (16,15)** (greens can be rescued; carried = untargetable) and canto into the corner (17,16). The T8 enemy phase took Marcus 25→3 (swordmaster cls0C doubled him: carrying halves Spd), T9 he was boxed in, dropped Zephiel on the pillar (17,15) and died; Zephiel died T10. The corridor (13-14,17-20) is clogged with enemies from T8, so the army (2 turns behind Marcus) could never get in. Eliwood recruited Nino T8.

**s28 attempt 3: WON (survived the turn-15 enemy phase). No deaths. Nino RECRUITED (Eliwood, T9); Jaffar NOT recruited (he stayed in the far west behind the enemy blob, and his Killing Edge broke).**
- Prep (press Start one at a time to land on it): Dart and Matthew out, **Pent (Physic) and Florina in**; Marcus used his Speedwings (Spd 14) and took a Vulnerary; Rebecca's **Brave Bow is now usable** (equip it).
- Same Marcus rush as attempt 2 (T8 rescue of Zephiel, 10/20 by then). What saved it: **Pent's Physic (range 9) on Marcus on T8, T9 and T11**, cast by hand because `fe7_act staff` fails ("menu could not be located"). Marcus on the pillar (17,15) or the corner (17,16), with weak enemies plugging his other neighbours, took 5-16 a turn; with a lance he has the triangle edge on the swordmasters (only 4-5 a hit at ~53%), and his counters killed a swordmaster and a myrmidon. His weapons broke on T11, after which he's useless except as a carrier.
- T12 Hawkeye (53 HP) baited at the foot of the stairs (14,20); his counters killed **both Lv5 generals**. T13 he cleared (15,16) and blocked (14,16), so Marcus could ride out of the room carrying Zephiel to (15,20). T14-15 we killed the casters around him and walled Hector (9 HP after a counter) in with Pent/Louise/Hawkeye/Nino/Rebecca. The boss at (7,26) (Bolting) never moved in three attempts.
- **Fog:** you can't target a fogged enemy even next to it (the tool falls into the Item menu and reports a fake "inventory full" prompt; press B three times). Park a unit next to it and Wait, then attack it with a second unit.
- At handover: Marcus 26/37 with **NO weapons**, Hector 9/37 (Iron Axe x5, 2 Elixirs), Hawkeye Iron Axe x13 (Killer Axe broken), Pent **Physic used up** (Elfire x5), Louise Silver Bow x1, Rebecca Brave Bow + Iron Bow, Bartre 13/32, Florina Slim Lance. No Vulneraries left. **Buy weapons and a staff before anything else.**
- No save prompt and no Yes/No. "Ch. 27: Cog of Destiny" (= Chapter 29 heading) loaded at **Preparations** ("Defeat enemy", 43 enemies); stopped there.

### Chapter 28x — Night of Farewells (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 29 — Cog of Destiny

**Objectives:**

"Defeat enemy" (rout; in-game "Ch. 27: Cog of Destiny"), with a prep screen and 10 deploy slots; Merlinus deploys as a tent at (22,26). The map is 29x27 and you start in the SE (x23-28, rows 21-26). The SE pocket's only entrances are the bridges (25,18) to the north and (21,21)/(22,21) to the west, plus the (20,25) bridge from the SW. 43 enemies at the start. **Boss** (ch66, Swordmaster Lv18, 58 HP, Light Brand 1-2) sits on the throne (7,5). **Shops are in the SW corner: armory (7,26) sells Iron/Silver sword, lance, axe and bow; vendor (8,26) sells Heal, Fire, Thunder, Elfire, Lightning, Shine and Flux.** Infantry can't reach them from the east (peaks x7-9, river x10-11); Hawkeye (Berserker) can, via (12,25)->(11,25) river->(9,25) peak->(8,26). A flier would get there faster.

**Recruits:**

| character | starts as | recruit with / action | important condition                          |
| --------- | --------- | --------------------- | -------------------------------------------- |
| **vaida** | enemy     | **hector**            | she must have survived as an enemy in ch. 26 |

**Agent notes:**

**s29 attempt 1 (RESTARTED on turn 37 after Rebecca (t11), Nino (t19) and Oswin (t36) died).**
- Prep: sold the White Gem (Louise, 10000G at full price) and Blue Gem (Lyn, 5000G) via Trade → Sell, for 17220G total. Florina's Slim Lance went to Marcus, who had no weapon. The Heaven Seal still can't be used.
- Reinforcements: **knight waves** (1 general + 4 lance/javelin knights) at forts (14-16,10-12) on turns 4/6/8/10. **Western sword waves** (swordmaster, 2 heroes, myrmidon) at forts (6-8,14-16) on turns 16/18/20/22. **Wyvern waves** at (26-28,24-26), right next to Merlinus's tent: Vaida (ch21 Wyvern Lord, Spear 1-2, about 32 Atk, Def 21, **Res 6, so Pent's doubled Elfire kills her: keep him away**) plus 2 riders on turn 33, then **5 lance or javelin riders EVERY turn from 34**. Two nomads (longbow and short bow, Move 8) come south around turn 17.
- What worked: Hawkeye + Hector at (22,20)/(21,21) (the west bridges) and Oswin at (25,19) seal the SE pocket. Pent's Elfire behind them doubles and kills knights (Res 2-3). Knights mostly refuse to attack the walls. Hawkeye walked to the shops (turns 15-20) and bought Elfire, Heal, Silver/Iron weapons; overflow goes to Merlinus ("send to Merlinus? Yes"), and units next to the tent take it via **Merch**. Marcus with a lance on a forest killed whole sword packs on counters.
- Deaths: **Rebecca** was hit at range 2 by three javelin knights from beyond the wall (I didn't re-run threat after trades). **Nino** died to the two nomads who rode into the pocket over the open (22,21) bridge. **Oswin** died to Vaida plus riders. Merlinus's tent fell on turn 34 to the wyverns.
- **Next attempt:** deploy Florina (flier) and shop on turns 1-3; keep Rebecca and Nino out of javelin range; keep both west bridges walled the whole chapter; by turn 32 have everyone grouped with Hector, ready to Talk to Vaida, and soft units carried (rescued) by tanks before the wyverns arrive.

**s29 attempt 2 (RESTARTED on turn 9 after Oswin (t5) and Marcus (t8) died).** Prep: benched Nino and gave her Elfire to Pent; sold the gems and Hawkeye's Aura (21220G). Hawkeye left for the shops on turn 2 and bought on turns 6-7. **Sending Hawkeye west early triggered the western sword waves (swordmasters/heroes/myrmidons from forts (6-8,14-16)) from turn 3 instead of turn 16**, and they merged with the knight waves at our bridges, about 25 enemies by turn 7. The two nomads also arrived early (turn 5) and one sat on the (20,21) river tile next to the bridge. The bridge walls (Oswin unarmed, then Marcus) died to general + nomad bow + swordmaster focus. **Lesson: hold the bridges through the knight waves (turns 4-11) with Hawkeye at (22,20) and Hector at (21,21) like attempt 1, and only shop after that.** Never leave a unit under 25 HP on a wall tile.

**s29 attempt 3 (RESTARTED on turn 48 after Merlinus and Bartre died; 0 deaths until turn 46).**
- The attempt-1 wall worked again: Hector (21,21) + Hawkeye/Marcus (22,21/22,20) + Oswin (25,19), Pent behind with Elfire. Knight waves (to T11) and western sword waves (T16-T22) died on counters. Hawkeye shopped T19-T20: armory = Silver Lance x2, Silver Axe, Iron Axes, Silver Sword; vendor = Heal x2, Elfire x5 (6220G left). Pent (Sage) uses Heal staves.
- **Merch**: a unit that has NOT moved can Merch and then still move, but Merch uses up its trade. Hand items over by having the RECEIVER start the trade.
- After T22 the western enemies hold position. Lure them one at a time with Hawkeye or Marcus on tiles where `fe7_threat` shows 1. Snipers do walk forward.
- **Wyverns did NOT come on T33.** They arrived at the end of T45, right after the enemy count fell to about 10: Vaida + 2 riders, then 5 riders per turn (another run saw them stop after ~4 waves). Likely trigger: low enemy count, not turn number.
- Deaths: Merlinus (immobile tent, nobody sealed it because my army was west) and **Bartre (Spd 5: Vaida doubled him, 28x2)**. Check doubling before calling a tile survivable.
- Next attempt: bench Bartre; before the enemy count drops under ~12, park the army around the tent: Hawkeye in the river (21,26), tanks on (22,25)/(23,26), soft units carried, Hector next to (28,24-26) to Talk to Vaida the turn she lands.

**s29 attempt 4 (GAME OVER on turn 77: Eliwood died in the enemy phase).** The restart skipped Preparations, so the default team took the field. Deaths, in order: Oswin, Louise, Pent, Rebecca, Bartre, Florina, Eliwood.
- **Vaida could NOT be recruited.** Hector stood next to her and his menu showed only Attack/Item/Wait. Treat her as a boss: 43 HP, Def 21, Spear 1-2 range (15 uses), attack 32. She doubles anyone with Spd 9 or less, and anyone carrying a unit.
- Reinforcements this attempt: 5 riders (2 cavaliers with Toxin Lances, a paladin, 2 nomads) on the NE forts (21-23,1) on turns 39/41/43/45. Then the wyverns at the SE corner: Vaida + 2 on T63, then 5 per turn on T64, T65 and T67.
- Best defence: hold the one-tile corridor (26,11) or the bridge (26,10) south of the NE forts, with Hawkeye or Hector on it (nomads can't cross those rivers). Hector on fort (27,9) took 0 from the Toxin/Javelin wyverns. The AI skips attacks that would do 0, so Hector can only kill those wyverns on his own turn (14x2).
- Heal on the NE forts (25,9),(27,9) after the riders die; they heal +7 to +11 per turn.
- Hector can NOT wield a Silver Axe (rank too low): buy Iron/Steel axes for him. The vendor sells no Vulneraries.
- Mistakes: I moved units AFTER reading `fe7_threat` and did not re-check it. Vacated tiles open new paths: Rebecca, Bartre and Eliwood all died on tiles that had been "safe". Re-run threat after every move that might change blocking. Also, a unit that has moved or attacked cannot be moved again that turn: check that before planning a retreat.
- Next attempt: kill the field slowly but keep Eliwood carried by a Def-18 unit (Hector or Hawkeye) once the wyverns come, never alone. Have 2+ Silver Axe users and an archer or mage ready for Vaida.

**s29/s33 attempt 5 (GAME OVER on turn 67: Hector killed by Vaida's wyverns).** s29 played T1-19 and hit a usage limit; s33 took over at T19. Deaths in order: Rebecca, Bartre (both before T19), Florina (T20), Merlinus's tent (T28), Marcus (T33), Louise and Pent (T47).
- **Convoy/Merch:** Merch does NOT use up the Trade command, but a mounted unit gets **no canto** after Merch. s29 bought 4 Silver Lances, 3 Iron Axes, a Silver Axe and a Silver Bow (11,200G left). Nobody bought Heal staves. **Having no healing is what lost this attempt.**
- **Florina died** at (21,23) when the 6-HP mercenary "cork" on the west bridge died on Hector's counter, which let a second attacker through. Don't leave soft units next to a cork that might die.
- **NE rider waves:** units entering the NE island (x24-28, rows 12-17) around T24 triggered 5 riders (2 Poison-Lance cavaliers, a paladin, 2 nomads) at forts (21-23,1) on T25/27/29/31. **Poison does 3 per turn and CAN kill at 1 HP** (Marcus died that way).
- **Corridor farm (works):** the island's north entrance is the bridge (26,10) leading to the corridor (26,11), then (26,12). A **nomad standing on (26,11)** can't shoot an adjacent unit, so a bow user on (26,12) is untouchable while a **melee rider sits on the bridge**, and the bow user kills the bridge occupant every turn (5 riders died this way). The nomad cork moved on T47 and the nomads flooded in, killing Louise and Pent. Nomads can't counter at range 1, so Lyn's Mani Katti, Hawkeye and Hector then killed all of them in melee.
- NE forts (25,9)/(27,9) heal 7-10 per turn once the riders are dead. Wyverns came on **T63** anyway (Vaida + 2, then 5 per turn), regardless of enemy count. The throne boss was never engaged; my 4 survivors couldn't out-damage the throne's healing.
- **Next attempt:** on T1-3 send Florina (flier) to the vendor (8,26) for **Heal staves for Pent**. Hold the west bridges with Hector/Marcus as attempts 1/3 did. Stay out of the NE island until T35 or later. Kill the riders at the (26,11) corridor with bows. Be grouped and healthy around Hector by T60.

**s33 attempt 6 (GAME OVER on turn 53: Hector died to snipers after the wyvern swarm wore everyone else down).** Deaths in order: Florina (T~20), Bartre, Merlinus's tent, Louise and Pent (T45 enemy phase), Oswin and Hawkeye (T50), Marcus (T51), Rebecca (T52), Hector (T53).
- **Hidden ballistas:** snipers at (8,20) and (10,18) sit on ballistas (range 3-10). `fe7_threat` does NOT show them. They one-shot Florina (bows are effective vs fliers) and do 7-14 to Hawkeye. Keep fliers well east of x~18 in the south half.
- The wall plan held again until T44: west bridges (21,22)/(22,22), the SW bridge (21,25) and the north exit (25,19). Pent and the bows killed whatever stood on the bridges. Hawkeye shopped after the sword waves (Heal staves + Elfire for Pent). Hector and Hawkeye axes baited the knight waves (forts (14-16,10-12), T32-38).
- **Wyverns came on T44 this time** (earliest yet). Louise and Rebecca killed Vaida on T45 with bows (Louise's Silver Bow 18x2). After that, about 13 wyvern riders came in waves of 4-5 per turn, with steel lances, poison lances and javelins, through T49.
- Wyvern riders vs this army: javelins do 0-1 to Hector or Oswin (Def 18), steel lances do ~4-6, and poison lances ~4 + poison. **Hector carrying Eliwood is nearly invulnerable to them** (axe beats lance, and his Spd 13 halved to 6 still isn't doubled). Oswin IS doubled while carrying (Spd 6 → 3). Marcus carrying Rebecca was solid, and Rebecca's effective Brave Bow kills one rider per turn (21x2).
- What actually lost it:
  - Soft units left in the open the turn the wyverns landed (Louise at 6 HP, Pent on a "safe" tile).
  - Nobody could heal once Pent died.
  - Marcus's Silver Lance broke (convoy gone with Merlinus).
  - Meanwhile the western sword/sniper group walked in from the north and its three snipers finished the wall units.
- **Next attempt:**
  - Before the enemy count drops low (or by T40), pack the army into a 2x2/plus block at the west bridges.
  - Soft units are carried by Marcus/Hector; Eliwood is carried by Hector.
  - Give everyone spare weapons.
  - Kill the northern snipers (they walk forward) before the wyverns arrive, or the two fronts meet.

**s33/s34 attempt 7: WON on turn 76 (rout).** s33 played T1-T69 and wrote no notes before hitting its usage limit; s34 finished from T69. **Died: Rebecca, Oswin, Bartre. Vaida NOT recruited** (killed by s33). Merlinus's tent survived (Florina deployed; she sat at (0,26) in the SW).
- s34 endgame (T69-76): I killed the last 3 wounded wyvern riders (Hawkeye and Pent one-shot them). The two throne guards (cls0E, Iron Sword) were lured one at a time by Hawkeye standing at **(8,12) and then (6,12)**, the only tiles their Move 5 reaches past the stairs. They do 0-1 to him and his Silver Axe counter kills.
- **Throne boss** (Swordmaster, 58 HP, Light Brand) **never leaves the throne** and heals only about 5 a turn. At range 2 his Light Brand does 0-5 (Pent with Elfire from (7,7) takes 0-3; Louise with bows from (6,6) takes 5). In melee he hits for about 19-22, so Marcus's Silver Lance hit (13) was followed by Hawkeye rescuing Marcus out of reach. He died in 3 turns: Pent 10-11 + Louise 5 + Marcus 13.
- Ending: on the save screen I pressed A on the default highlight (it appeared to be the "Ch. 27: Cog of Destiny" slot), then Save. **Eliwood promoted to Knight Lord** in the ending event. Next: "Ch. 28: Valorous Roland" (Eliwood's tale; it fills the "Chapter 30 — The Berserker" slot in this file). Prep screen, objective "Claim a space", 32 enemies. I stopped there.
- At handover: Eliwood (Knight Lord, Iron Sword only), Hector (Iron Axe x16), Marcus (Silver Lance x14/x20), Hawkeye (Silver Axe x3, Silver Axe x20, Iron Axe x45), Louise (Silver Bow + Iron Bow), Pent (Elfire + Heal, about 17-19 uses each), Florina. The bench has 20+ units, most of them low level.

### Chapter 30 — The Berserker

**Objectives:**

"Claim a space" (Eliwood's tale, in-game "Ch. 28: Valorous Roland"). Prep screen with only **3 slots**: Eliwood and Hector are forced, the third is your choice. Map 17x29. The goal is the red tile **(8,3)** in front of the shrine, at the top. Eliwood has to **Wait** on it; there is no Seize entry. The Berserker boss (60 HP, Def 18, Res 21, Tomahawk 1-2, about 40 Atk) starts ON the goal tile. The three units start in **three separate corridors**: Eliwood in the centre (8,25), Hector in the SW (4,27), the third unit in the SE (12,27). Only Eliwood's corridor reaches the goal; the other two end at breakable walls (3,5) and (13,5) (100 HP each).

**Recruits:**

None.

**Agent notes:**

**s35 attempt 1: WON on turn 21. No deaths, nobody to recruit.**
- Prep: Hector used a Heaven Seal at Trade → Use and is now a **Great Lord**. Pent took Marcus's slot (he has Heal and two Elfires; one Elfire came from the convoy via List). Eliwood's corridor is all fighters, mercs, knights, a Rapier myrmidon and a warrior. Hector's is mages, a monk, a shaman and a **Bolting sage**. Pent's is archers, a sniper and a javelin knight; his Elfire one-shots archers (Res 2) and they do 0-5 to him.
- **Hidden fire traps** (type 4 in the trap array at 0x0203A518, 8 bytes each) do 10 to whoever ends a phase on them: (11,12) (10,13) (9,14) (11,14) (16,13) (16,14) (16,16) (16,17) (14,16) (16,19) (15,25) (8,21) (9,20) (9,18) (5,18) (5,20) (4,21) (0,16) (0,14) (4,14) (3,12) (7,12) (3,10) (3,8) (13,8). `fe7_threat` doesn't show them.
- The Bolting sage (5 uses, about 16 to Hector, 22 to Eliwood) roams rows 6-10 in the west. Pure Water on Hector cut the Bolting to 9. The boss **left the goal tile** to attack Pent across the (13,5) wall (it fought him from (13,4)) and then stayed at (13,4). Eliwood went (6,6) → (8,3) once (6,6) was outside both the boss's and the sage's reach. The stationary warrior at (8,6) came out to (8,8) when Eliwood baited it from (9,9).
- `fe7_act item` failed often ("could not put the highlight on Use"). Using it by hand works: A on the unit, A, Item, item, Use. The `fe7_act attack` won't target walls; attack them by hand.
- At handover: Eliwood is Knight Lord Lv1, his **Iron Sword is at 7 uses** and he carries a 2-use Elixir; he needs a real weapon. Hector is Great Lord Lv1 at 10/41 with Iron Axes (9 and 45 uses), a 3-use Silver Axe (probably usable now) and 2 uses of Pure Water. Pent is Lv11 with Elfire (26 uses), Heal (19), an Elixir (2 uses) and a Rapier.
- Ending: the save screen highlighted the "Ch. 28: Valorous Roland" slot; I saved there (Yes). The next chapter loaded at Preparations: **"Ch. 29: Sands of Time"** (= the Chapter 31 heading), objective "Protect throne", 12 deploy slots, 35 enemies.


### Chapter 31 — Sands of Time

**Objectives:**

"Protect throne" for 11 turns (in-game "Ch. 29: Sands of Time"). The win fires as turn 12 begins; an enemy reaching the throne (6,2) loses the chapter. Prep screen with 13 slots; Merlinus deploys as an immobile tent at (9,1). The throne room (x0-12, rows 1-4) opens only through the stairs at (1-2,5) and (10-12,5). 7 green knights start on those stairs and die by about turn 4. 35 enemies plus reinforcements every turn. Most are poison-bow archers (0 damage to Def 15+ units, and they can't shoot at range 1). The rest: snipers (silver/steel/longbow), Flux/Luna/Nosferatu shamans, swordmasters, thieves, poison-lance knights. **4 druids:** E#30 at (18,9) has a **BERSERK staff (x3, range = Mag/2 ≈ 11 after moving 6)**; E#29 (0,11) and E#21 (south) have Sleep; E#19 (21,14) has Silence and drops Restore.

**Recruits:**

None.

**Agent notes:**

**s36 attempt 1: GAME OVER on turn 4 (Lyn killed by her own berserked allies).** The Berserk druid hit Hawkeye on EP1 and Marcus on EP2. **Berserked allies act automatically the moment your last unit acts (before the enemy phase), and they DO attack lords.** Hawkeye (30 dmg) plus Marcus killed Lyn. Pillars (1D) are passable; braces (3F) and walls are not.

**s36 attempt 2: WON (survived to turn 12). No deaths.** Merlinus's tent was knocked out (he only retreats).
- Prep: deployed only Eliwood, Hector, Lyn, Pent, Marcus, Hawkeye. Lyn used the Heaven Seal at Trade → Use and is now a **Blade Lord**. Eliwood took Pent's Rapier. Check Map → Formation (Select opens the menu) moved Hawkeye out of the side room to (3,2).
- **What won it: carry both lords all chapter.** Carried units can't be targeted by attacks, staves or berserkers. Hawkeye carried Lyn at (5,2); Marcus carried Eliwood at (7,2) until Hector **took** him on the throne. Take works even from a sleeping carrier. Hector sat on the throne (6,2) with the three tiles beside it filled by my units or by jammed-in archers. Leave the archers alive: they can't shoot at range 1 and they plug tiles.
- **Dodging Berserk:** E#30 stays put at (18,9) until a unit is within Move 6 + range 11. Keeping everyone on tiles with x+y ≤ 9 avoided it on EP1-3. When it came, it berserked Pent, who held only a Heal staff (I had parked his Elfire on Marcus), so it was harmless.
- Carrying halves Spd, so silver-bow snipers (AS 11) double a carrier (Marcus lost 28 in one phase). The heavy Nosferatu gives druids AS 2, so they never double. Pure Water (+7 Res) on the carriers was key. Elixirs were relayed with free trades: Pent → Marcus → Hector → the boxed-in Hawkeye, who then drank it.
- At handover: **Pent's Elfire is gone** (it vanished from every inventory during EP7; he now has only Heal x~13). Marcus has Silver Lances x12/x20. Hawkeye has Silver Axe x20. Hector has Iron Axes x9/x45 and Silver Axe x3; his Pure Water is used up. Eliwood has Iron Sword x7, Rapier x40 and Elixir x2. Lyn (Blade Lord Lv1) has Mani Katti x24, Blue Gem and Hero Crest. Hawkeye, Marcus and Pent were still poisoned at the end. **Buy weapons in 31x**, especially Elfire for Pent.
- Ending: no save prompt appeared to me, but fe7_wait's A/Start presses saved the chapter-end into **slot 3** (overwriting the old "Ch. 16" save). I then used Prep → Save on slot 1 (the slot in use), so both slots now read "Ch. 29x: Battle Preparations". Handover is at the **Ch. 29x Prep screen** ("Get supplies", 10 units auto-deployed). Bartre is dead, so Karla can't be recruited.

### Chapter 31x — Battle Preparations (gaiden)

**Objectives:**

"Get supplies" (in-game "Ch. 29x: Battle Preparations"): a 15x10 town, **no enemies**, ends by itself when turn 5 ends. Shops: sword armory (7,3) (Slim/Iron/Steel/Silver sword, Killing Edge, Lancereaver); lance armory (10,2) (Slim/Iron/Steel/Silver/Killer lance, Axereaver); axe armory (13,2) (Iron/Steel/Silver/Killer axe, Swordreaver); bow armory (10,8) (Iron/Steel/Silver/Killer/Short bow); tome vendor (1,4) (Fire, Thunder, Elfire, Lightning, Shine, Divine, Flux); item vendor (12,5) (Vulnerary, Elixir, Pure Water, Door Key, Heal, Mend, Recover, Restore); arena (5,7); house (13,8) gives only dialogue.

**Recruits:**

| character | starts as | recruit with / action | important condition                                                                                              |
| --------- | --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **karla** | npc       | **bartre**            | bartre must be a **level 5+ warrior**, be deployed, talk to her, and both must survive their forced combat round |

**Agent notes:**

**s37 attempt 1: WON (timer ran out after turn 5). No deaths. Karla not recruited (Bartre is dead).**
- Spent 35680G → 13080G. Bought: Pent Mend + 3 Elixirs; Eliwood Silver Sword + Killing Edge; Louise 2× Elfire (for Pent); Hawkeye Silver Lance + Killer Lance (for Marcus); Lyn Silver Axe + Killer Axe (for Hector/Hawkeye); Dart Silver Bow + Killer Bow (for Louise). **Many items sit on the wrong unit — redistribute with Trade.**
- Shopping by hand: inspect the unit's tile, A, d-pad to the shop, A, A (shop name), A through "This is…", A for Buy, scroll, A, A (Yes). The first A into a shop is sometimes dropped, so screenshot after each. Exit with B, B, A. Mounted units get canto afterwards: A on the unit, then A on Wait.
- **There was no Preparations screen for Ch. 30.** It started at turn 1 with 14 units auto-deployed, including **Nils, Wil (Lv4 archer) and Nino (Lv5 mage), all alive**. Nils's opening event gave Eliwood an **Earth Seal**, and his old Iron Sword (7 uses) went to Merlinus. No save prompt was seen; the game save slot may still be at the 29x start.
- Handover: "Ch. 30: Victory or Death" on the map at turn 1, opening event cleared, cursor free. Goal is **"Seize gate"**. The army starts in the SW corner (x0-7, rows 25-29) with Merlinus's tent at (3,29). 36 enemies; the boss (ch85, cls23, 68 HP, Def 21, Res 25) is at (24,3). There are druids/sages with Res 18-19. Renault: visit the NW ruins within 11 turns.


### Chapter 32 — Victory or Death

**Objectives:**

"Seize gate" (in-game "Ch. 30: Victory or Death"; no prep screen). Map 28x30. The gate (24,3) is in the NE, behind 2C walls; it is entered from (24,4). The boss (ch85, cls23, 68 HP, Def 21, Res 25, Bolting x5 at 3-10 + Fimbulvetr 1-2) sits on it. The army starts in the SW corner (x0-7, rows 25-29) with Merlinus's tent at (3,29). Renault's ruins are at (5,2) in the NW (visit within 11 turns).

**Recruits:**

| character   | starts as | recruit with / action            | important condition            |
| ----------- | --------- | -------------------------------- | ------------------------------ |
| **renault** | ruins     | **visit the northwestern ruins** | must do so **within 11 turns** |

**Agent notes:**

**s38 attempt 1 (RESTARTED on turn 14 after Matthew (T2), Nils (T5) and Wil (T13) died; Merlinus's tent was knocked out T12).**
- **Sage E#12 (9,17), Bolting 3-10:** it kills Res-0 units from 16 tiles away (Matthew died T2). Kill it on T2-3; it walks onto the fort (5,21). Marcus 23x2 kills it with no counter (it equips Bolting).
- Turn-1 wedge in the corner worked: Marcus/Hawkeye/Hector walls, the rest on tiles `fe7_threat` shows as '.'. The two paladins from the forts (4,20)/(5,21) died on Marcus's counters on EP1. The generals (13,22-24) and the warrior arrive T3-5 and die to Pent's Elfire (Res 2-4, doubles) and Rapier/axes.
- **Ballistas (trap array 0x0203A518): Iron Ballista (3,11), Ballista (4,25) (empty, next to the start), Iron (19,28), Iron (11,17), Killer (16,11), (17,1), (26,9). Range is about 15 tiles, not 10.** Sniper E#20 walks onto (3,11) on T4 and one-shot Nils at distance 15. E#21 sits on (19,28).
- **Reinforcements, every turn from about T6:** NW fighters/warriors appear AT (0-1,9-12) (T7), lance cavalry and paladins at (1,0)/(3,0)/(7-9,0-1), fighters at (16,0), nomad troopers (steel bow + steel sword, Spd 15-18) at the SE forts (26-27,28-29), wyverns at (27,16-18), and **paladins spawn on the start-area forts (4,20)/(5,21) from T11**. By T10 there were 49 enemies. The 8 centre wyvern lords and the falcon knights start moving about T12.
- The west corridor (x0-1, rows 15-19; x2-4 are peaks) is a good 2-wide choke. But the army got squeezed between the NW waves and the SE nomads, with fliers landing on the peaks.
- **Mistake: a canto after rescue can't cross the forest (1,19)** (mounted forest cost). Eliwood got stranded at (2,21) carrying Nino at half Spd and dropped to 8 HP. Check `fe7_reachable` before relying on canto.
- **Next attempt:** turtle T1-5 the same way but keep Res-0/flier units out of the sage's reach on T1-2. Then move FAST. Turtling at the start just lets the reinforcement waves pile up, and the goal is a seize.

**s38 attempt 2 (RESTARTED on turn 13 after Dart and Wil (T11) and Nils and Matthew (T12) died).**
- **T1-T5 opening, no deaths (copy this):** use the T1 corner wedge plus trades: Pent gives an Elixir to Nils, Louise gives Elfire to Pent, Lyn gives the Killer Axe to Hector, Dart gives the Killer Bow to Louise. On T2-T4 **carry every soft unit** (Eliwood-Nils, Hector-Wil, Hawkeye-Nino, Lyn-Florina, Pent-Matthew, Marcus-Dart) so the Bolting sage has only tanks to hit. On T5 the sage walks next to the group: Louise's Silver Bow kills it (17x2). Pent's Elfire and Marcus finish the generals and the warrior on T4-T5. **The convoy holds only a Killing Edge, Fire and Lightning.**
- `fe7_act`'s Rapier/Killer Axe `weapon_slot` was refused ("single entry") in this attempt; only slot 0 got used. A forecast with `weapon_slot` re-equips, but it failed the same way.
- **The NW lance reinforcements (cls33) are FLIERS.** Louise's bows are effective (30x2, one-round). They arrive in pairs from (1,0)/(3,0) every turn from T6 and reach the SW corner around T10. SE nomad troopers (steel bow + steel sword, AS 15-18) arrive in pairs every turn from T8 and reach the SW around T11. Paladins spawn on the start forts (4,20)/(5,21) from T11. The centre wyvern pack plus 2 falcon knights start moving around T11-12. By T12 there were 50 enemies.
- **Sitting in the SW corner fails.** Fliers and bows reach any soft unit that isn't fully enclosed or carried, and a dropped unit can't act or move on its next turn. The ballista sniper at (19,28) shot a tank once; the one at (3,11) waits for weak targets.
- Next plan: clear the opening the same way (T1-T5), then march at once, with softies carried.

**s38/s41 attempt 3 (RESTARTED on turn 16 after Canas (T3), Nino (T4), then Marcus and the Matthew he carried (EP15) died).**
- The opening went as planned, then the army went north up the west corridor (x0-1, rows 13-19). By T13-15 it was boxed at rows 13-14 x0-4. Fighters and paladins came from the north, 4-6 nomad troopers and cavaliers came up the corridor from the south (nomads DO enter forest; one reached (1,15) from (2,20) in one turn), and wyverns plus a wyvern lord came from the east. With 4 real tanks (Hector, Marcus, Hawkeye, Pent) and 10 soft units, every formation was one body short. Marcus (40/40 HP, carrying Matthew, so half speed and doubled) died in one enemy phase to nomad bows plus fighters.
- **Carrying halves Skl too**: carriers' hit rates fall to 30-60%. Only Pent (unencumbered) and Louise's effective bows are reliable killers. Nomad troopers (AS 16-17) double any carrier and Lyn.
- `fe7_act` bug: after a free `trade`, the resumed `attack` committed a Wait (no damage). Do the trade with one unit and the attack with another, or attack first.
- Leaving a weak enemy (1-6 HP) next to a wall unit works as a cork; killing it opens the tile to a stronger enemy.
- Next attempt: do NOT walk into the west corridor. It is where the NW waves, the south fort/nomad waves and the wyvern pack converge.
- Correction: slot #13 (ch28, cls44, 28 HP, at (3,29)) is **Merlinus's tent**, not Canas. Its "death" only means he retreats. Canas isn't in this chapter.

**s41 attempt 4 (in progress; notes written at T21).**
- T1-T6 opening with no deaths: the T1 corner wedge and trades, then carry Matthew, Nils, Wil, Nino and Florina on T2. On T3 the sage walks onto the (5,21) fort: Hawkeye **takes** Matthew off Marcus, and the unencumbered Marcus doubles the sage (23x2, no counter). The generals and the warrior then die to Pent and the tanks on T4-T6.
- After T6 the army moved east into the south strip (x8-12, rows 26-29). This strip is outside the wyvern nest's reach, so the only threats are waves arriving piecemeal. **Wyvern lure:** an unencumbered Marcus at full HP on (13,24), a tile only 2 nest wyverns can reach, killed 2 wyverns on counters in one enemy phase. The 6-wyvern nest at (14-16,15-18) never moves unless a unit enters its range.
- **The (19,28) iron ballista sniper (E#21) hits anything in the strip (~18-21 to soft units).** It killed Nino and nearly killed Lyn twice. Keep the lords carried or at full HP while in its range. Kill it before lingering in the south.
- Florina died after being dropped as a wall to shield Lyn. Nino died to the ballista.
- `fe7_act` quirks: (1) a **mounted unit that GIVES gets put straight into canto** with only Wait offered, so it cannot then rescue (a foot unit can). (2) After a trade, the tool often can't find the menu; do the attack or staff by hand. (3) Carried units can be traded with directly (Hawkeye traded with Pent's passenger Nils), so a carried unit's Elixir is reachable. (4) Hector's attack was refused with weapon_slot for Silver/Killer Axe ("single entry"); only his Iron Axe ever came up.

**s41 attempt 4 result: GAME OVER on enemy phase 43 (Eliwood killed by the (3,11) ballista at 14 tiles). Deaths before that: Florina, Nino, Marcus (EP28), Wil (EP31), Pent and Louise (EP38), Nils (EP39).**
- **Reinforcements STOP.** The enemy count sat at the 50 cap until about T35, then fell: 44 (T36), 37 (T38), 29 (T40), 24 (T43), with no new spawns. After that every remaining enemy is static (nest, snipers, shamans, NW cls0C pair, sage, boss), and the whole SW (x0-12, rows 20-29) shows '.' on `fe7_threat`. **A future attempt only has to survive about 35 turns with healing to spare, then walk.**
- **`fe7_threat` ignores ballistas.** The iron ballista at (3,11) (sniper E#20) killed a 5-HP Eliwood standing on (3,25), 14 tiles away, on a "safe" tile. Treat everything within about 15 tiles of (3,11), (19,28), (11,17), (16,11), (17,1) and (26,9) as unsafe for a wounded unit.
- **The south-strip turtle at (9-12,26-29) held about 12 turns but bled out.** Fliers stand on the peaks, so the "pocket" (11,29) has a hole at (12,29). Eliwood carrying Lyn has half Spd and gets doubled by every wyvern (14x2 per phase). The six Elixirs and Mend ran out by T35; once Pent died the attempt was over. Weapons wore out too: Hawkeye's Killer and Silver Axes broke by T38, and Hector is down to an Iron Axe x17.
- What worked: Hawkeye's Killer Axe crits (54%). Louise's effective bows on wyverns (Killer Bow, 50% crit). Pent's Elfire (Res 2-3 soldiers and wyvern lords die in one hit). Leaving 1-12 HP soldiers next to Hector as corks (they deal him 0). Eliwood taking Elixirs from carried units (Nils) or from Pent by trade, then drinking.
- **Boss numbers (read): Mag 24, Skl 20, Spd 17, Def 21, Res 25, 68 HP.** Bolting x5 (3-10) plus a 1-2 tome. No physical unit we had did more than about 15 per hit, so keep Hawkeye's Killer Axe and Lyn's Silver Axe x20 for him. Lyn carries a Silver Axe, Hero Crest and Blue Gem; Dart carries a Silver Bow and an Iron Axe.
- Tool notes: `fe7_act` trade/item/staff very often reports "action menu could not be located" (Pent, Eliwood, Louise). The manual path always worked: `fe7_inspect` the unit, then A, (move), A for the menu, then Item = Down from the top, Up wraps to the last item, then A, A. Trading with a CARRIED unit through `fe7_act` targets the carrier; do it by hand and cycle the list with Down.

**s41 attempt 5 result: GAME OVER on enemy phase 14 (Lyn killed in the SW corner). Dart died EP13.**
- Opening again cost nothing through T7. T1: the soft units stand on the corner tiles `fe7_threat` shows as '.'; Louise swaps an Elfire for one of Pent's Elixir stacks; Lyn gives the Killer Axe to Hawkeye. Marcus fronts at (3,26), and both fort paladins die on his counters. T2: carry Nils (Eliwood), Wil (Hector), Matthew (Hawkeye), Nino (Pent) and Florina (Lyn). Louise gives Marcus an Elixir. T3: the sage walks onto the (5,21) fort; Marcus doubles it from (4,21), 24x2, no counter. Pent's Elfire plus Hawkeye's Silver Axe kill the general (7,27); Hector chips the knights. T4: Pent and Louise kill the warrior.
- **CONFIRMED: a unit standing on a reinforcement fort blocks that spawn.** With Marcus on (5,21), soldiers kept appearing on (4,20) but never on (5,21), on two separate turns. The spawn resumed the turn he left.
- **Ballista range is at least 14 tiles.** The (19,28) iron ballista hit Dart for 21 at (5,28), 14 tiles away. Corner tiles x0-3, rows 26-29 are 16 or more tiles from both (19,28) and (3,11).
- The corner fortress worked while it was intact: lords at (0,29)/(1,29), walls at (0,28)/(1,28)/(2,28), Hawkeye (0,27), Hector (1,27), tent (3,29). **It failed the moment I pulled the walls out (T12-14) to chase nomads.** That left (1,28)/(2,29) open, and a wyvern lord from the nest, which starts moving about T12, reached Lyn. RULE: never move a wall unit while a lord sits inside; let enemies come to the walls and only shoot from inside.
- Dart (def 6) is not a wall: three nomads (steel bow + steel sword) killed him from full HP on a 3-threat tile. Marcus burns lances fast on a fort (8 + 12 uses gone by T13); give him Hawkeye's Silver and Killer Lances on T1-2.

**s41 attempt 6 result: GAME OVER on enemy phase 12 (Lyn killed at (1,29) while carrying Nils). Merlinus's tent fell EP11.**
- **Carrying halves Spd, so a carrier gets doubled.** Lyn (29 HP, def 6) carrying Nils was doubled by an enemy reaching her (most likely a nomad's bow from (3,29) once the tent fell). A lord must never carry anyone on a tile any enemy can reach, even at range 2.
- **Merlinus's tent is a weak wall.** Every unit targets it (28 HP, def 7): the sage's Bolting, the general and wyverns. Once it falls, (3,29) opens next to the inner tiles. Only a staff user standing next to it (2,28)/(2,29)/(3,28)/(4,29) can heal it.
- **Merlinus's convoy** (the Merch command when standing next to the tent) holds Fire x40, Lightning and a Killing Edge. Pent starts with no tome if Louise's Elfires go elsewhere; take Fire from the convoy on T1-2 (deposit an Elixir first if Pent is full). Merch then Staff in the same turn works.
- **Plan for attempt 7 (v4 corner fortress, all 13 units, no carrier on any reachable tile):**

| Tile | Unit | Why it is safe enough |
| --- | --- | --- |
| (0,29) | Lyn + Nils | reachable by nothing, not even at range 2 |
| (0,28) | Eliwood + Wil | reachable by nothing, not even at range 2 |
| (1,29) | Dart + Florina | safe while the tent stands |
| (1,28) | Pent, unencumbered | healing hub next to Hector, Marcus, Eliwood and Dart |
| (0,27) | Louise, unencumbered | only northern bows reach her |
| (2,29) | Matthew + Nino | reachable only through the tent side; losing him costs a unit, not a lord |
| (2,28) | Marcus | outer wall |
| (1,27) | Hector, unencumbered | outer wall |
| (0,26) | Hawkeye, unencumbered | outer wall |
| (3,29) | Merlinus's tent | 4th wall, with 2 open sides |

  Give Hawkeye and Marcus their own Elixir stacks, since Pent cannot reach (0,26). Walls NEVER move; they attack only what is adjacent. Survive to about T35 (reinforcements stop), then march.

**s41 attempt 7 result: GAME OVER on enemy phase 36 (Eliwood killed on the outer tile (1,27)). Before that: Dart (EP12), Florina (EP14), Nino (EP16), Wil (EP17), Marcus (EP29), Matthew (EP35).**
- **The v4 fortress held for 35 turns.** It is the right shape. The enemy count fell 50, 46, 43, 39 over T34-36, so reinforcements really do stop around T35. Reaching T36 with Lyn, Eliwood, Hector, Pent, Louise, Hawkeye and Nils alive is enough to win.
- **The leak was the tent again.** It fell EP11. After that, nomad bows on (3,29) or (1,27) reached the carried pairs on (1,29) and (2,29) at range 2, one per phase. The fix: Pent's first job every turn is to heal the tent (stand on (2,28) or (2,29) early). Otherwise, put Hector or Hawkeye on (3,29) the moment it falls, and never leave a soft unit within range 2 of an open tile.
- **The fatal mistake: after killing the cork nomad on (1,27), I moved Eliwood (33/33, Def 10) onto that outer tile to close the ring.** Ten enemies could attack it; he died in one phase. **A lord is NEVER a wall, not even at full HP.** Close the gap with Hector or Hawkeye instead, or leave a weak enemy as a cork. Dropping Matthew on (1,29) while a bow nomad stood at range 2 on (1,27) killed him the same way.
- Pent's Elfire (23x2, 100% hit) one-rounds nomad troopers; Louise's bow one-rounds the cls33 fliers from inside. By T35 the walls were trading 3 kills a turn for no damage.

**s41 attempt 8 result: GAME OVER on enemy phase 15 (Lyn, carrying Nils on (0,29), was killed after Marcus died on the wall). Before that: Dart and the Matthew he carried (EP12), Merlinus's tent (EP13), Nino (EP14).**
- The opening was clean again through T11: T1 trades, T2 carry the softs, T3 Marcus kills the sage on the (5,21) fort. On T4 Hector on (3,28) blocked the tent's approach, so only one enemy could hit it, and Pent Mended it from (2,29). EP4-6 killed the hero and all four generals on counters, then T6-T10 were a full lull (the whole SW showed '.').
- **A carrier on a reachable tile loses BOTH units.** Dart carrying Matthew on (1,28) was doubled by bows from range 2 and both died. Never carry on a tile with any range-2 exposure.
- **The real loss: Marcus was left at 15/39 on wall (2,28) while Pent attacked instead of healing.** He died, (2,28) opened, and a bow at (1,28) reached Lyn at range 2 on the "safe" corner while she carried Nils. **RULE: every wall at or above ~30 HP before ending the turn; heal before attacking.** The lords' corner is safe only while ALL of (0,26)/(1,27)/(2,28)/(2,29) hold.
- Tool traps this attempt: a staff use right after a free GIVE marked Pent spent without healing; Wil's Elixir item menu failed and also spent him; `take` is not offered after a `give` on the same unit. Verify with `fe7_state` after every heal or item.
- **Plan v5 (next attempt):** walls Hawkeye (0,26), Hector (1,27), Marcus (2,28), Pent (2,29) (Pent heals Marcus and the tent and is reachable only by bows while the tent stands). Lyn (0,29) and Eliwood (0,28) each carry one soft. Nils stands uncarried on (1,29) to Play Pent for a second heal each turn, Louise unencumbered on (1,28), Dart on (0,27). Hand Hector and Hawkeye an Elixir stack each during the T6-T10 lull. Expect the two leftover softs to die.

**s41 attempt 9 result: GAME OVER on enemy phase 37 (Hector, carrying Eliwood, fell at 6 HP with no healing left).** Deaths, in order: tent (EP13), Dart+Nino (EP14), Nils and Marcus (EP15), Wil (EP16), Pent and Louise (EP29), Matthew and Florina (EP30).
- T1-T11 had no losses (same opening as attempt 8, plus an Elixir for Marcus on T2). Layout v5 held until the tent fell on EP13. Nils's Play gave Pent two heals a turn, which worked very well.
- **The best defensive shape found: the tanks CARRY the lords in the corner.** From T30, Hawkeye carried Lyn on (0,29) and Hector carried Eliwood on (0,28). Carried lords cannot be targeted, and doubled hits on Def 17/20 are small (Hector lost about 6-10 per phase, Hawkeye 4-9). It failed only because no healer and no weapons were left by then.
- **Resources run out around T30:** Hawkeye broke a Silver Axe, a Killer Axe and Lyn's Silver Axe (60 uses) by T34; Pent's Elfire ran low (Louise gave him her Elfire x30); every Elixir was gone by T32. The convoy (Merlinus's Supply command, next to the tent) has Fire x40, Lightning and a Killing Edge that went unused.
- **Reinforcements seem to stop around T35.** The count went 50, 49, 48, 46, 45 on T35-37 with no refills.
- Tool traps: `item` right after a free trade/give fails AND spends the unit; drive it by hand instead (select, A, A, Down to Item, A, Up to wrap to the last entry, A, A). The tool's `staff` after a free trade also failed. `take` is not offered after `give`.
- **Plan v6 (attempt 10):** opening as before. From the lull (T6-T10), use layout T: (0,29) Hector carrying Lyn, (0,28) Hawkeye carrying Eliwood, (1,29) Pent (melee-sealed; heals Hector, Marcus and (2,29)), (1,28) Marcus, (2,29) Louise, (0,27) Dart, (3,29) tent. Hector's tile is then out of reach of everything. Hawkeye and Dart hold the Elixirs. Pull Fire from the convoy for Pent early. The leftover soft units have no safe tile.

**s41 attempt 10 result: the best defence so far, but no way left to kill the boss.** Layout W/T held both lords safe to T41+: Eliwood sealed on (0,29) (later carried by Hawkeye), Hector carrying Lyn, Pent healing next to the carrier, Louise as the last wall. Losses: Florina, Wil (EP10), Matthew, Nino (EP11), Nils, Dart and the tent (EP12), Marcus (EP14). Reinforcements stopped about T35-36 again, and the enemy count fell 50 to 40 by T41.
- **Mend heals ~20-40 and Pent next to a carrier can keep it at full indefinitely.** The carrier must be on a tile adjacent to Pent ((1,29) next to Pent on (2,29) worked). Enemies standing on the ring tiles with lances (cavaliers, generals) are good corks; kill the bow nomads.
- **WHY IT STILL FAILS: by T35 every boss-capable weapon was gone.** Hawkeye countered all game and broke his Killer Axe, both Silver Axes and Hector's spare Silver Axe; Pent used up Elfire and Fire; Louise's Silver Bow broke. Vs the boss (Def 21, Res 25, 68 HP, attacked from (24,4) ONLY), the leftovers do 0-7 per hit: impossible.
- **RULE for attempt 11: STORE the boss kit on a sealed or carried unit from T6 and never counter with it.** Lyn is carried all game, so give her Hawkeye's Killer Axe and the two Silver Axes. Eliwood (sealed) holds Marcus's spare Silver Lance and the Silver Sword. Hawkeye counters with Dart's/Hector's iron axes only. Pull the Killing Edge from the convoy before the tent falls (~EP12). Boss math: Hawkeye Silver Axe 37-21=16 (Killer Axe crit x3 = 36), Hector Silver Axe 11, Marcus Silver Lance 12; one melee slot per turn plus range-2 chip, over about 3-4 turns with Pent healing the attacker after each Fimbulvetr counter (~25).

- Attempt 10 was ended deliberately on T41: Hector dropped Lyn beside the enemies. It was unwinnable because no weapon could hurt the boss, and a game over is the only route to Restart Chapter.
**s41 attempt 11 result: the boss kit survived and the SW was cleared by T48, then the march broke it.** Lyn was carried by Hector all game holding the Killer Axe x20 and Silver Axe x20 (it worked: neither was touched until T49). Losses: Florina, Nino (EP10), Matthew (EP11), Dart, Wil (EP12), Nils and the tent (EP13), Marcus (EP27, his Elixirs ran out). After Marcus fell, a 2x2 corner block held to T48: Hawkeye carrying Eliwood (0,28), Hector carrying Lyn (1,28), Pent on (0,29) (enclosed; heals (0,28) and (1,29)) and Louise on (1,29). Pent's Elfire picked off one ring enemy a turn.
- **Reinforcements did NOT stop at T35 this time**: the count stayed near 50 until about T36, fell to 27 by T49, then 4 new nomads spawned at (20-23,27) on T59-60.
- **Hector (Def 23-24) takes 0 from nomads, archers, cavaliers and wyverns.** Baiting the 8-wyvern nest (14-16,15-18) with Hector alone on (13,23) worked: 2-3 wyverns came each phase and died to his counters.
- **THE FATAL MISTAKE: the support units parked at (10-12,26), 3-4 tiles from the bait, "safe" on fe7_threat. A wounded Killer Lance wyvern (12 HP) skipped Hector and flew to them, killing Pent and Louise in one phase (crit).** fe7_threat is computed before the bait shifts. Park supports 12+ tiles from any live wyvern, or keep Pent adjacent to Hector.
- **Tool trap: fe7_forecast on a CARRYING unit with no target in range pressed the first menu entry (Drop)**: Hawkeye dropped Eliwood onto (13,21) and both were spent. Never forecast with a carrier unless the target is surely in range.
- A carrier CAN trade with its own passenger (Hector traded Lyn's axes on T49/T56).
- Ended deliberately on T61: with no healer left, two units could not out-damage the gate boss, so Eliwood walked into the nomads to force the game over.

**s41 attempt 12: WON on turn 83** (Eliwood seized; survivors Eliwood, Hector, Lyn, Hawkeye, Pent, Louise). Deaths: Nino and the tent (EP4), Matthew, Wil (EP10), Florina (EP11), Dart (EP12), Marcus (EP15), Nils (EP58).
- T4: Nino took the convoy's Killing Edge and Fire x40 (via Merch) but died that phase with them. Don't store loot on a soft unit next to the tent.
- Final shape from T22: Hawkeye carrying Eliwood (0,27), Hector carrying Lyn (1,28), Louise (0,29), with Pent fully enclosed on (0,28), where he can heal all three. Weak corks on (1,27)/(1,29)/(2,28) kept fresh attackers off the ring. Reinforcements thinned from about T36; the corner was clear by T49.
- Ending a turn right after an unverified heal cost a heal twice. Call fe7_end_turn ONLY after the staff result reads "HP a -> b".
- The 8-wyvern nest died to Hector baiting from (13,23)/(14,23) while Louise shot finishers from (12,24), a tile the nest can't reach (T52-56). Hector alone at (12,24) seals the south pocket against ground units.
- SE nomad reinforcements (4) arrived ~T55, and 8 riders and knights spawned around (23-25,7-11) at T73. Hector on the bridge (24,12) with Pent Mending from (24,13) killed them on counters (rivers flank the bridge).
- **Boss: Fimbulvetr weighs him down to AS 9, so Hawkeye with the Killer Axe DOUBLES (9x2, 91% hit, 59% crit) and takes 24 per counter.** 68 -> 50 (player phase) -> 20 (enemy-phase counter) -> dead the next turn after a Mend. Gate regen was negligible. All 5 Bolting missed or were wasted on Hector.
- The druid (cls1E, Purge 3-10) roams in from the west; tiles at x>=23 near the gate stay out of its range.

### Chapter 32x — The Value of Life (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Final Chapter — Light (two parts)

**Objectives:**

Part 1 "Defeat Nergal" (Nergal ch44 cls45, 75 HP, Def 28, Res 30, at (8,2), Ereshkigal 1-2). Map 17x27; the army starts at (6-9,18-21) with NO prep screen. Part 2 (per the 2026-10-18 playthrough): "Kill dragon" (Fire Dragon, 120 HP, (12,5)).

**Recruits:**

None.

**Agent notes:**

**s42 attempt 1: GAME OVER on enemy phase 6 (Athos fell at the pocket entrance, then Hector).** Army: Eliwood, Hector, Lyn, Athos, Pent, Hawkeye, Louise. **No staff and only one Elixir (Louise), so every HP lost is permanent until part 2.** There is no prep screen; Athos starts holding Forblaze 3C, Aureola 86, Durandal 84, Armads 85 and Sol Katti 8C, and **Hector starts with NO weapon**. Trade them on T1 (partners may be spent).
- T1: the SE group (Uhai cls30, Rienfleche Mt 20 range 2, **Spd 25, doubles everyone**, 42 atk, plus 2 snipers) comes out on EP1 to (10,21)/(10,23)/(11,24) without attacking. T2: they have bows only, so melee them. Hector (10,20), Hawkeye (9,21) and a third unit on (10,22) **cork Uhai: he cannot move and cannot shoot adjacent units**. Pent killed a sniper (21x2), Athos (35) and Louise finished the other.
- The NW Bolting sage (E#5, Bolting x5 at 3-10, Physic) leaves its room on EP2 and Boltings a LORD every turn: Eliwood (Res 5) took 28 and Lyn 25. **Carry both lords from the end of T1/T2 until that sage is dead.**
- Weapon pick is broken again: Eliwood's `weapon_slot` for Durandal was refused ("single entry 0x01"), so he swung the Iron Sword for 2. Put Durandal in slot 0 (trade the other swords away) or skip him.
- The W room (Linus cls13 Basilikos 51 atk + warrior) opens T3; the E room generals T4; the SW room (**Excalibur sage, 42 magic atk, AS 22, doubles Hector (60 dmg) and Hawkeye (58)**, plus a Runesword Valkyrie) T5; NE Lloyd/hero T6. By EP6 they all converged on the SE pocket.
- The SE pocket (12-14,21-22)+(12,23)+(12,24) seals with one unit on (12,24). (13-14,21-22) are unreachable by anything except Bolting. But the (12,24) holder can be hit by 3 enemies; Athos (40 HP) died there to Linus/general/Excalibur. Turtling with no heals does not work; kill the waves as they arrive.
- `fe7_act item` right after a trade failed and spent the unit (Elixir not drunk), as warned.

**s42 attempt 2: GAME OVER on enemy phase 6 (Athos fell, then Lyn).** This time there WAS a Prep screen (restart): Pick Units shows only these 7. Trade, then List: no staves anywhere, and the convoy is empty. Prep trades done: Durandal into Eliwood's slot 0, Armads to Hector, Sol Katti into Lyn's slot 0, and Athos given Nosferatu + Elixir (from Louise).
- **T1 carry both lords** (Hector carries Eliwood from (8,18), Athos carries Lyn). T2 then copies attempt 1 but better: Pent attacks sniper A from (10,22) at range 1 (no counter, 19x2), Louise finishes it from (8,23), Hector (10,20) and Hawkeye (9,21) hit the corked Uhai (Hawkeye's Killer Axe crit killed him), and Athos takes sniper B to 10 from (10,24). The whole SE group was dead by EP2, with no damage taken.
- The sage sat at (5,16)/(5,17) on T3-T4, out of everyone's reach, then came to (10,18) on T5 with Linus (10,20), the warrior (10,19) and the generals (12-13,19).
- EP5: everyone in the pocket's 4 inner tiles plus Pent on (12,22) took only the warrior's bow and Bolting. **The inner tile (13,21) is hit at range 2 from (13,19) over the wall** (north side).
- T6: **Linus stood in the pocket mouth (12,24)**: one melee tile (12,23) and one range-2 tile (12,22) on him, so he can't be killed in a turn. Athos gave Lyn to Pent and stood on (12,22) to drain Linus, **but `weapon_slot` for Nosferatu failed and left Athos SPENT at 22 HP**, and Linus killed him. **Put the weapon you need in slot 0 at Prep; never rely on `weapon_slot`.**
- The pocket is a trap once Linus reaches (12,24). Kill the sage early and fight the waves before they converge.

**s42 attempt 3: GAME OVER on enemy phase 6 (Pent and Louise died holding seal tiles, then Hector at 14 HP).** T1-T6 went very well; copy them:
- **Prep: Athos [Nosferatu, Aureola, Elixir, Forblaze]** (Nosferatu in slot 0, so plain attacks heal him); Eliwood Durandal and Lyn Sol Katti in slot 0; Hector Armads.
- T1: Hector carries Eliwood from (8,18); Pent steps to (7,19); Hawkeye carries Lyn from (8,20). T2: Pent kills sniper A from (10,22) at range 1; Athos hits sniper B from (10,24) at range 1 (Nosferatu 30); Louise finishes B from (9,24); Hector (10,20) and Hawkeye (9,21) hit and cork Uhai. T3: Pent finishes Uhai at range 1. Uhai's Rienfleche (Mt 20 bow) went to Louise; **Louise also has a support with Hawkeye**.
- The sage Boltings HECTOR on EP2/EP3/EP4 (20 each). The Elixir was given to Hector on T3 and **had to be drunk by hand** (the tool's `item` failed twice).
- **T4: Athos at (7,17) kills the sage at (5,17) with Nosferatu 22x2. It can't counter: its equipped Bolting is range 3-10.** T5: Athos kills the warrior (Res 6, 34 dmg). EP5: Linus attacked Athos and died to Nosferatu counters. T6: Athos kills general E#10 (27x2) from (8,21). Athos stayed at 40/40 throughout: **Nosferatu Athos is the engine of this chapter.**
- The loss: the rest of the army sat in the SE while Athos fought in the north. On EP5 the Rex general reached Hector at (10,23), a tile `fe7_threat` called safe, and took him to 14. On EP6 the Excalibur sage, the Valkyrie and the Rex general killed both seal units in one phase, and then Hector.
- **Next time: keep the whole team with Athos.** Excalibur (48 HP, Def 16) dies in one turn to Athos 15 + Louise's Rienfleche 18 + Hawkeye's Killer Axe 16, with Hawkeye last so he never eats the counter. Don't leave Hector at low HP. The **E room (13-15,15-17) empties on EP4; its door is (13,18), and its inner tiles (14-15,15-17) are unreachable even at range 2** once the door is held.

**s42 attempt 4: GAME OVER on enemy phase 9 (Athos fell at the pocket throat, then Lyn).** Deaths: Pent and Louise (EP3), Hawkeye (EP6).
- **PREP WAS SKIPPED by queued Start presses ("START: Fight!").** After Restart Chapter, press Start ONE at a time with a screenshot each, and stop at the Preparations menu. On-map fallback: Item > weapon > Equip by hand puts any weapon in slot 0 (free action).
- On EP3, Uhai (12 HP, corked) shot Pent dead from 2 tiles away (Pent stood on (10,23), two from (10,21)); Louise died the same phase. **A corked Uhai still shoots anyone exactly 2 tiles away.**
- **Excalibur sage: its AS is 16, not 22.** It does NOT double Athos (13), Hawkeye uncarried (29) or Hector uncarried (30), but doubles any carrier. Hawkeye carrying took 29x2 = 58 vs 57 HP.
- With 3 units left, a placement where Excalibur's best kill was Hawkeye (deep at (13,22)) instead of Hector worked: it killed Hawkeye, Lyn dropped on his tile out of the Valkyrie's reach, then Athos (Nosferatu 16) + Hector (Armads 23, 95%) killed Excalibur.
- **Athos vs each enemy with Nosferatu counters:** net-positive vs Excalibur, Valkyrie, generals and the warrior; net-negative vs **Lloyd (Regal Blade 21x2, doubles, crit ~13%)** and the **hero (Tomahawk 17x2 at range 2, Brave Sword in melee)**. Nosferatu ran from 20 to 4 uses by T9. Lloyd's Res is effectively 25 (Nosferatu does 15).
- The Rex general standing on (11,24) is the only access to (12,24), so it corks the pocket. But enemies pass through each other, so Lloyd still reached (12,24).

**s42 attempt 5: GAME OVER on enemy phase 13 (Hector, 39 HP, holding (12,24), killed by Lloyd from (11,24) — a crit).** Deaths before that: Hawkeye (EP10, sacrificial cork at (11,24)), Pent (EP11, same cork), Louise (EP11, cause unclear: she was on (14,22), which the threat tool called safe).
- The prep and the T1-T9 recipe worked: the SE group was dead by T2, the sage by T4 (Athos at (7,17)), Linus by EP5 on Nosferatu counters, general E#10 T6, Excalibur and the Valkyrie T7, and the Rex general EP8 on Athos's counter. **By T9 only Lloyd, the hero and the two NW druids were left in part 1.**
- **The endgame against Lloyd plus the hero is the problem.** Lloyd: Regal Blade, 100% hit and 24% crit on Hector, 13x2 (a crit does 39); Hector's Armads hits him only 52%. Eliwood with Durandal takes 31x2 from him. The hero is weak on Hector (Brave 5x4, Tomahawk 8) but deadly on Athos (17x2).
- The pocket does not help here. (12,24) has exactly one melee neighbour, (11,24), and Lloyd always gets it. The tiles at range 2 of the mouth are all outside, so Athos can only attack from (12,24) itself, and he dies there. **Lloyd's AI moves before the hero's.**
- **Next time: kill Lloyd and the hero in the OPEN while the army is still whole** (T7-T9, when Pent, Louise and Hawkeye were alive). Lloyd: Aureola 20 at 96% from range 2 (he can't counter at range), Louise's Rienfleche, and Pent. Hero (60 HP, Res 19): Aureola ~23, Nosferatu ~18, at range 2 only when his Tomahawk is used up or he holds the Brave Sword. Don't let the pocket become a 1v2 against Lloyd's crits.

**s42 attempt 6: GAME OVER on enemy phase 4 (Lyn).** Deaths: Pent and Louise (EP1), Hawkeye (EP2).
- **Exact T1 that works (attempts 3 and 5): Pent (8,20)->(7,19) Wait; Hector (7,20)->(8,18) rescues Eliwood; LOUISE (8,21)->(7,21) Wait; Hawkeye (6,21)->(8,20) rescues Lyn; Athos stays at (9,19).** In attempt 6 I forgot to move Louise. On EP1 Uhai then came to (8,23) and attacked instead of stopping at (10,21)-ish, and Pent and Louise both died. After that the run fell apart.
- **Attempt-5 T2, for reference:** Pent from (10,22) on sniper E#13 (44->4); Athos from (10,24) on sniper E#16 (44->13); Louise finishes E#16 from (9,24); Hector from (10,20) on Uhai (crit kill); Hawkeye finishes E#13 from (9,23).
- **`fe7_wait` can eat a whole player phase.** After EP3 it reported "still enemy phase (turn 4)", but its A/Start presses had ended player phase 4 with nobody moving. A transient "FALLEN" read (Lyn reported dead, actually 9 HP) came just before. When `fe7_end_turn` or `fe7_wait` reports a death you don't expect, check `fe7_state` before waiting again.
- Lyn (Res 9, 29 HP) on a "sage-only" tile still took Elfire for 20 at range 1-2 from the sage, who walked up next to her. Linus then came out of the W room to (8,19).

**s42 attempt 7: GAME OVER on enemy phase 14 (Hector, 13 HP, at the mouth; his 90% Armads counter missed the 9-HP hero).** Lloyd was killed (T12). Deaths: Hawkeye EP10 (Lloyd), Louise and Pent EP11. **The best attempt so far; T1-T9 is a reliable recipe:**
- T1 exactly as above (Louise to (7,21)!). EP1: Uhai stops at (10,21), the snipers at (10,23) and (11,24), and nobody attacks.
- T2: Pent from (10,22) on sniper E#13 (20x2 -> 1); Athos from (10,24) on sniper E#16 (-> 13); Louise from (9,24) kills E#16; Hector from (10,20) hits Uhai (-> 34); **Hawkeye from (9,21) completes the cork** (Uhai's only free neighbour; (11,21) is a wall). EP2: E#13 died on Pent's counter; the sage Bolted Hector for 22.
- T3: Pent hits Uhai at range 1 (12, -> 8); Athos moves to (9,20), trades the Elixir to Hector (`trade` with `item_slot`), then kills Uhai at range 2. Hector drinks the Elixir by hand. Louise (12 HP) hides at (13,22).
- T4: Athos kills the sage at (6,19) from (8,19) (21x2; it can't counter, Bolting equipped). The carriers go to (11,24) and (12,24): **Linus (Basilikos 51 atk) doubles any carrier for a kill.**
- T5: Athos drains Linus from (7,17) (range 2, no counter; out of the generals' reach). EP5: Linus and the warrior both die on Nosferatu counters.
- T6: drop the lords into the pocket ("a dropped unit cannot act until next turn"). T6-T7: Athos baits the generals near (7,17); both die on his counters. **Park Athos at (5,18) on T7**, where only the general reaches. Lloyd and the hero arrive around (9,14)-(5,16).
- T8: the Excalibur sage stood in the pocket mouth; Hawkeye (Killer Axe, 59% crit) killed it from (12,24). **Excalibur (Mt 18, 1-2) is Athos's best weapon:** 23 vs Lloyd (effective Res 25), 29 vs the hero, 32 vs the Valkyrie. Equipped, it gives Athos AS 16, so the hero does NOT double him (with Nosferatu, AS 15, it does). But it doesn't heal.
- **Armads gives Hector +5 Def when equipped** (Def 30). The hero then does Brave 4x4 or Tomahawk 7x2 to him; with the Iron Sword it is 11x2. Lyn's sword rank is A, and the Regal Blade needs S.
- Pent died on (14,22) on EP11 with no visible attacker. (Louise died there in attempt 5 too.) **Don't trust (14,22) while the Valkyrie (E#15, cls3E) lives.**
- The loss: Hector carried Eliwood all game and was chipped by Bolting (EP2), the Valkyrie (EP7) and the Tomahawk (EP13), down to 13. A lord at low HP can't be the cork. **Keep Hector topped up (Elixir), and let Athos with Excalibur (no counter at range 2) take Lloyd in three hits from range.**
- **PART 2 WARNING (from the 2026-10-18 win):** only Aureola hurts the dragon (20/hit, 6 hits), and its breath counters for a flat 37. That run healed Athos between hits with Mend/Heal. **This run has no staves.** Plan for part 2 before spending the Elixir in part 1.

**s42 attempt 8: GAME OVER on enemy phase 18 (Lyn, killed by a BERSERKED Hector). Part 1 got as far as the gate opening on EP14 and all 3 spawn generals dead by T16.** Deaths: Hawkeye (EP8), Pent and Louise (EP9; Louise on (14,22) again).
- T1-T4 as attempt 7, but the sage's Bolting missed twice, so the Elixir was saved. EP4: Linus died on Athos's counter (crit). T5: Athos used Forblaze on the warrior from (6,17). T6: Darin (Rex Hasta) died to a Nosferatu crit from (7,17); the other general died on EP6 counters.
- **Forblaze (Mt 14, light) gives Athos AS 18 and avoid 66.** It doubles druids and generals and has a 22% crit. Ursula, the Excalibur Valkyrie, died to a Forblaze crit on T8, cast from **(10,25), a tile neither Lloyd nor the hero could reach.**
- **Lloyd and the hero died to Athos holding the pocket mouth.** T9: Athos on (12,24) with Nosferatu. Lloyd has 0% crit on Athos, and from that tile the hero couldn't reach him. T10: Athos on (12,23) drained Lloyd, and a 2% crit killed him. EP10: the hero died on Nosferatu counters.
- **After the gate opens (3 enemies left), the druid E#2 (it starts at (9,3) beside Nergal) carries a BERSERK staff (item 0x52, 3 uses) and Eclipse.** It Berserked Lyn (status byte +0x30 = 0x34), then Hector, who was carrying Athos. A berserked unit can't be rescued, traded with or controlled, and acts on its own during the enemy phase. Berserked Hector killed Lyn.
- **Next time: kill E#2 before it reaches staff range, or keep every lord out of it.** Its reach is about move 6 plus Mag/2 = 13 tiles. In attempt 8 it came south to (7,6) on EP15 and (7,9) on EP16. Forblaze does 25x2 to it (Res 19), enough to kill it in one round.
- The NW druid room: Athos (Forblaze) baited both druids at (5,17) and killed both on counters in one enemy phase (taking 30 damage). The 3 gate generals do 0 to Hector with Armads; he killed 2 on counters.
- The tool hazards seen again: `fe7_end_turn` suspended the game to the title once (Resume Chapter restores it), and the tool's inventory-full discard sometimes doesn't take (do it by hand: A, Left, A).


**s42 attempt 9: GAME OVER on enemy phase 8 (Lyn, on (13,21) inside the SE pocket).** Deaths: Pent (EP6, on (3,17), a tile `fe7_threat` called safe), Louise (EP6, on the (12,23) cork).
- T1-T3 as before; Uhai suicided on Athos (EP3). T4: the sage died to Forblaze 23x2, but **EP4 Linus + the warrior took Athos 40->9** (the warrior died, Linus at 38). T5: Pent crit Linus from range 2, Athos finished him. T6: **Athos drained general E#10 (Res 11) with Nosferatu 29x2 from (9,17): 9 -> 40 HP in one action.** Low-Res generals are Athos's heal battery.
- **The SE pocket is (12,21)-(14,22) plus the corridor (12,23)-(12,24); its ONLY door is (11,24)->(12,24)** ((11,23) is a Brace pillar, row 20 is wall, (13,23)/(13,24) wall).
- **(12,21), (13,21) and (14,21) are only 2-3 tiles from row 19 ((12,19)/(13,19) are floor, through the wall).** The hero's Tomahawk (1-2) or anything ranged on (13,19) hits (13,21). **The only truly safe interior tiles are (13,22), (14,22) and maybe (14,21).**
- Measured: E#15 (cls3E, Runesword) is WEAK: 9-10 to Hector/Hawkeye, 1 blow, 0 crit. The Excalibur sage E#12 has AS 16 and does NOT double: 29 to Hawkeye, 30 to Hector, 14 to Athos. **Lloyd E#6 (cls10, item 0x90, Spd 27) does 22x2 = 44 to Athos (40 HP) — a one-round kill. Never leave Athos in Lloyd's reach.**
- The Elixir and the inventory-full discard both need hand input (Item -> row -> Use; discard: highlight item, A, Left, A).

**s42 attempt 10: ended deliberately on T4 (Athos died on EP3; part 2 is unwinnable without his Aureola).**
- **Restart Chapter -> repeated Start presses skipped the Preparations screen** (Start on Prep = Fight). The army started untraded: Durandal, Armads and Sol Katti on Athos, the Elixir and Nosferatu on Louise, Hector UNARMED. After Restart, press Start ONE at a time and screenshot until the Prep menu appears.
- On-map fixes that worked on T1: Eliwood/Lyn `trade` with Athos to TAKE their weapons (take-only works; the tool's SWAP failed twice with "nothing changed hands"). On T2 Louise gave Athos the Elixir; on T3 Athos gave it to Hector and Hector took Armads (two separate units' trades).
- T2 Forblaze one-rounds a sniper (34x2). **EP3: Uhai (43 HP) killed Athos (40) at (9,20) with a Rienfleche double (22x2) at range 2.** In attempts 7-9 Athos stood there only after Uhai was weakened (<=29) or died. Never park Athos within Uhai's reach while Uhai has >38 HP.

**s42 attempt 11: GAME OVER on enemy phase 10 (Lyn, on (13,21), killed by the hero's Tomahawk).** Deaths: Pent (EP7, (12,21), hero's Tomahawk from (12,19)), Louise (EP7, (13,22), attacker not seen). Best part-1 progress so far: by T10 sage, Linus, warrior, both generals, Uhai, both snipers, Ursula AND Lloyd were dead with Athos at 40/40.
- Prep: press Start ONE at a time after Restart; wait on the black fade and the Prep menu appears. The prep trade UI drops the first D-pad press after opening a trade (check the highlight before A).
- **NOSFERATU EQUIPPED IS THE KEY.** T4: Athos killed the Bolting sage with Nosferatu 20x2 from (7,17) (it can't counter); EP4 Linus died on his drain counters and Athos stayed 40/40. T5: Nosferatu one-shots the warrior (Res 7, 33 dmg). T6: Nosferatu doubles general E#10 (28x2) from (10,19). EP7: Darin died on his counter. Keep Nosferatu in slot 0 all of part 1 (only ~20 uses: budget them).
- T3: Pent 12 + Hector 21 (Armads, 76%) kill Uhai if Hawkeye crits on T2; otherwise use Pent+Hector+Hawkeye. NEVER put Athos within 2 of Uhai while Uhai has >38 HP.
- **Ursula (E#12, Excalibur, Res 25, Def 16, 48 HP) died T7: Athos Nosferatu 16 from (10,23) (100% hit), then Hector Armads 23 from (12,24) (100% hit).** Both forecasts said 100%; Hector takes no counter because his blow kills.
- **The hero E#7 (cls0C, Tomahawk 1-2, Brave Sword) hits THROUGH WALLS at range 2:** from (10,21) onto (12,21), from (12,19)/(13,19) onto (12,21)/(13,21). From inside the pocket only (14,21) and (14,22) are out of his Tomahawk once he is near.
- **Lloyd (E#6, cls10, Regal Blade 0x90, melee only, Spd 27, 22x2 on Athos, crit 12%)** hunts Athos. EP9 Athos (40, Nosferatu) survived his double at 16; T10 Athos drained him from range 2 and crit-killed him.
- **The pocket failure:** on T8 I took Hector off the door to carry Eliwood deep, and E#15 (Runesword, weak, but it DRAINS on hit and doubles any carrier) walked in to (12,22). Once an enemy is inside, nothing can leave and Hector got chipped 47->7. **Never leave the door (12,24) open. Kill E#15 early with uncountered damage (Athos Forblaze 28 at range 2; E#15 counters only 3). Never melee it: each counter heals it.**
