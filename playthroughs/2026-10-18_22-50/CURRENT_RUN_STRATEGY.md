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

- (s01, Ch21) Fog chapters: a hidden enemy cannot be targeted until one of our units has moved near it and WAITED; reveal first, attack second. Ballistae are not in fe7_threat; an archer on one hits anything 3-10 tiles away.
- (s01, Ch21) fe7_act 'trade' fails to SWAP when both inventories are full (nothing changes hands); route the item through a unit with a free slot. 'supply' is not wired in the tool. The Merch menu can be driven by hand (it shows up as 'Merch').
- (s01, Ch21) A boss with a bow equipped cannot counter in melee; check fe7_forecast every turn, since his equipped weapon can change.
- (s02, Ch22) Item IDs: 0x25 Halberd is an AXE (Hector/fighters), 0x1B Horseslayer is the LANCE. Counters use the first usable weapon in inventory, so put the right weapon in slot 0 with a fe7_forecast weapon_slot (it re-equips) before ending a turn on the front line. Note that a forecast re-equips even when cancelled, so check slot 0 again before a committed attack.
- (s02, Ch22) Weapons are scarce and there is no shop or healer yet: track uses and route spares through trades early.
- (s03, Ch23) The Prep screen's Trade -> Items menu (Trd/Use/Trnsfr/List/Sell/Give all) reaches BENCHED units, so spare weapons and stat/promotion items can be moved and Used there. Yes/No prompts default to No; press Left before A.
- (s03, Ch23) If the chapter can end during an enemy/green phase, fe7_wait will press through the ending, the next chapter's opening AND its Prep screen (Start = Fight), and its A on an "inventory full" prompt sends the equipped weapon to the convoy. Near the end of a chapter, poll with fe7_unstick instead of fe7_wait.
- (s04, Ch24) Before trusting a turn-1 board, check whether the map is FOGGED: a hazy screen plus enemies that do not render. fe7_threat still lists hidden enemies, but an attack refuses (the menu shows only Item/Wait) until a unit has waited within about 3 tiles. fe7_threat ignores ballistae: check the screenshot for ballista sprites.
- (s04, Ch24) Enemy AI byte at unit +0x44: 0x03 means it waits until you enter its move+range, then attacks; 0x00/0x0D/0x0F means it advances. A boss with 0x03 can be lured onto a tile of your choosing: leave it exactly one legal attack tile next to a tank.
- (s05, Ch25) If an objective is unclear, read the chapter's event data in ROM instead of guessing: search ROM for the first enemy's 16-byte unit entry (char, class, 00, flags, x, y, x, y, items, AI), search for that address as a pointer to find the chapter's event header, and read its misc-event list. Code 0x0B entries are AREA events (flag, script ptr, x1 y1 x2 y2): a unit has to WAIT on those tiles. The Prep-screen opening (skipped with Start) is where objectives like "points" are explained.
- (s05, Ch25) A General with Def 19+ and a lance is untouchable by cavaliers, pegasi, monks, archers and ballistae: park him alone in a choke as bait and let his counters do the killing. Watch his lance uses; the Horseslayer broke mid-chapter.
- (s06, Ch26) Turn-event reinforcements are in ROM: event header pointer [0] -> 16-byte entries (02 00 00 00, script ptr, start turn, end turn, .., mode byte at +0xC: 1/2 Eliwood N/H, 3/4 Hector N/H). Each script is "32 00 00 00 <unit list ptr>", 16-byte units. Item table names: 0x2C-0x33 are bows (Iron, Steel, Silver, Poison, Killer, Brave, Short, Long), 0x37 Fire, 0x38 Thunder, 0x39 Elfire, 0x3F Shine, 0x40 Divine, 0x44 Flux, 0x45 Luna, 0x4D Physic, 0x95 Short Spear, 0x6C Elixir.
- (s06, Ch26) The prep "List" screen moves an item straight from its owner to the selected unit. Fliers rescue and then canto across peaks, which makes a two-turn ferry that keeps lords and dancers out of reach. In FE7, bows do x2 Mt against fliers.
- (s07, Ch27) Item IDs: 0x69 Door Key, 0x6A Lockpick, 0x6F Torch, 0x6D Pure Water, 0x78 Chest Key (5 uses), 0x79 Mine, 0x7A Light Rune, 0x73 White Gem, 0x75 Red Gem, 0x3A Bolting. Item table at 0x08BE222C, 36 bytes per item (+0x14 uses, +0x19 range, +0x1E use effect). Units shown standing on "Roof" with state 0x81 are hidden inside a building until its door is opened.
- (s07, Ch27) fe7_act staff (and sometimes forecast/trade from a unit acting in place) fails with "action menu could not be located"; staff by hand works. Misses do not consume weapon uses. fe7_wait's "nothing changed" can miss enemy moves — re-read fe7_state each turn.
- (s08, Ch28) "Guard X" chapters: a staff's range (Physic = Mag/2) goes THROUGH walls, so a healer can sit safely in a different room. A green with AI that swarms dies to one enemy that doubles it, even at full HP. Physically seal the entrance tiles in time; healing alone does not save it.
- (s08, Ch28) Press Start ONE at a time through chapter openings: a queued extra Start skipped Prep entirely. fe7_act door is flaky (fails after a free action, sometimes even when fresh); doors by hand work (move, A, choose Door). In fog, fe7_act attack on a hidden enemy lands in the Item menu: press B, B, then Down+A to Wait.
- (s09, Ch29) AI-0x03 "waiting" enemies DO attack anything inside their move+range on the very first enemy phase — treat every "threatened by" line in fe7_threat as real (Heath died to this on T1). Nomads, nomad troopers and berserkers wade rivers; fliers hover on them. Sell unused promotion items (Ocean Seal = 25,000G) at prep for shop money. fe7_act staff fails for Pent ("menu not located") but works for Canas; Physic by hand works.
- (s11, Ch30) A boss can show AI 0x03 at +0x44 and still never leave his tile; fe7_threat draws his full move range anyway. Use fe7_forecast to read his counter damage and crit; it is the same swing he makes on the enemy phase. A tank who attacks and stays adjacent gets a second chip from his counter. "Claim a space" means Wait on the tile.
- (s12, Ch31) Longbows (item 0x33) reach 3 tiles THROUGH walls; fe7_threat counts it, my eye did not. A sleeping unit cannot move, and fe7_act reports that as "game REFUSED the destination". Status is at unit +0x30 (0x11 = poison, 1 turn left). On the end-of-chapter Save screen the dragon cursor may sit on a different slot: check that the PLAY TIME matches before pressing A.
- (s13, Ch31x) Shops by hand: move with A, A on the tile, then Armory/Vendor; Buy/Sell defaults to Buy and Yes is the default (a plain A confirms). The item list REMEMBERS its last row, so press Up past the top before counting. Without Merlinus on the map, a unit with 5 items cannot buy; sell junk first. Gems and spare Heaven Seals sell for 2,500-10,000.
- (s16, Ch32) fe7_threat ignores ballistae. A manned Long/Iron Ballista (item 0x35, Mt 13, range 3-15) one-shot Nils on a tile the threat map showed as safe. Check the Manhattan distance from every manned ballista for each soft unit, every turn.
- (s16, Ch32) A Bolting-only boss can be outwaited: keep everyone but a high-Res tank outside 10 tiles until his Boltings run out. Then a melee attacker plus a Mend right after lets the attacker survive the enemy phase and counter again.
- (s17, Final) Rescue bookkeeping, all verified:
  - A dropped unit cannot act the turn it is dropped.
  - A MOUNTED unit that uses Take gets canto with only Wait, and can't Drop afterwards. Use a foot unit to take and drop in the same turn.
  - "0 uses" on a boss weapon can mean unbreakable. Forecast the counter; don't assume.
- (s17, Final) Never batch a dependent attack behind a heal or rescue. Re-read state after every staff use. fe7_act staff works for Pent when the wanted staff is in slot 0; the last-used staff moves to the top of the list.

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

Defeat Oleg (boss, cls13 warrior-type, Killer Axe + Steel Bow, starts (24,13) in the SE corner). Map 26x15 town with fences; no forts. Nobody is must-protect, but Ninian (dancer, forced deploy) and Merlinus are fielded.

**Recruits:**

None.

**Agent notes:**

**s01 — WON on attempt 1, turn 16.** Erk died (turn 4 enemy phase). No recruits in this chapter.
- FOG OF WAR chapter. A hidden enemy cannot be attacked or forecast even from an adjacent tile until a unit has moved next to it and WAITED (vision updates on commit). Reveal with one unit, then attack with another. fe7_threat still reads hidden enemies from memory.
- BALLISTAE at (13,3), (13,7), (13,11), invisible to fe7_threat. An archer stepped onto (13,11) and shot Erk (7 HP) from 10 tiles away. Stay more than 10 tiles from any manned ballista, or kill its archer first.
- No healer on the roster. Swapped Matthew (no weapon) -> Sain and Rebecca -> Wil at Pick Units. Ninian and Merlinus (immobile tent) were forced deploys. Both Elixirs used (Ninian, Eliwood). The convoy has no healing items.
- Steady reinforcements of pegasi, wyverns and knights from the east edges until about turn 12. Turtling and letting them hit Hector, Marcus and Oswin on the counter worked very well.
- Oleg and the last guards stayed put until we entered their reach. Oleg then walked out with his STEEL BOW equipped, which means no melee counter: Marcus's Armorslayer crit killed him from 42 HP.
- Handover: Hector Lv16, Marcus Lv13 (Armorslayer 1 use, Silver Lance 1 use), Oswin has NO usable weapon (only a Longsword), Eliwood Lv4 (still weak), Lyn Lv11, Sain Lv11, Guy Lv5, Wil Lv6, Bartre Lv5. Hector's Hammer has 3 uses left. Marcus carries Antitoxin x3; Hector carries a useless Horseslayer and Halberd (lances).
- Do differently: kill the ballista archer before stepping into range; give Oswin a lance; get a healer deployed.
- Glitches: right after Prep, fe7_wait's A/Start presses during the opening events dropped the game to the title screen. Resume Chapter (Ch.21 slot) put it back on turn 1 with nothing lost. Later, one fe7_wait returned on turn 8 with turn 7's player phase skipped (two enemy phases in a row). No Yes/No prompts during the ending; the opening scene of Ch22 was skipped with Start, so no title card was captured (the Prep screen reads Chapter 22, Defend Nils).

### Chapter 22 — Kinship's Bond

**Objectives:**

Defend Nils: survive 11 turns (the win fired as turn 12 began). Nils is a green at (10,1) in the throne room at the top. Map 22x23. Ninian unavailable; Merlinus is a forced deploy.

**Recruits:**

| character | starts as | recruit with / action               | important condition |
| --------- | --------- | ----------------------------------- | ------------------- |
| **heath** | enemy     | **eliwood, hector, lyn, or ninian** | —                   |
| **rath**  | green npc | **lyn**                             | —                   |

**Agent notes:**

**s02 — WON on attempt 1 (survived to turn 12). No deaths. Recruited Rath (Lyn, turn 5) and Heath (Hector, turn 6).**
- Nils's room (x8-13, rows 0-2) is reachable ONLY via the 2-wide corridor x10-11, rows 3-5 (the braces at (9,4-5) and (12,4-5) are impassable). Oswin at (10,5) plus one tank at (11,5) seal it completely. Six green knights soak turns 3-5 and all die.
- Rath walks out of the NE room to (12,6) by turn 5, right in front of the stairs. Lyn talked from (11,6) with Sain, Hector and Isadora boxing her in. Heath flies to around (8,9) on turn 6 and Hector talks from (9,9).
- Enemies carry Swordreavers and Axereavers (they beat swords) and Lancereavers (they beat lances). Lances wreck the fighters and wyverns; bows are effective (x2) on the many wyverns.
- From turn 6 on I fought forward: Hector at (9,9) took almost nothing (Def 16), and Marcus, Isadora, Wil, Rath and Canas killed ~15 enemies. Reinforcements kept arriving from the W/SE edges until the end.
- Loot: thief drop Brave Axe (now Hector's, 28 uses). Rebecca, Wil and others levelled.
- Handover: Marcus has NO weapon (Iron Sword and Silver Lance broke), only a Vulnerary and item 0x67. Oswin has Horseslayer x15 plus the Halberd (an AXE in FE7, so useless to him; give it to Hector or Bartre). Canas holds Marcus's Armorslayer x1. Sain is at 9/27, Rath 16/26. Still no healer or staff on the roster.
- Do differently: equip weapons before positioning (counters use slot 0). The Halberd/Horseslayer mix-up cost a turn of trades.
- Ending: one save prompt; chose the slot in use (Ch.22). The game then loaded Ch.23 Prep ("Defeat enemy").

### Chapter 23 — Living Legend

**Objectives:**

"Defeat enemy" (Prep screen) — rout: kill all 20+ enemies. Map 22x16, almost all Desert (slow for foot/mounted units; fliers unaffected), plains in the NE, one House at (12,13) near the start, a Fort at (4,2). Enemies: ~9 mages (Thunder), 4 archers, 2 knights, monk, nomad, cavalier, a Luna druid-type that DROPS Luna, and two cls13 named axe users (ch53 Killer Axe at (2,10), ch54 Steel/Hand Axe at (7,6)).

**Recruits:**

| character   | starts as | recruit with / action | important condition |
| ----------- | --------- | --------------------- | ------------------- |
| **hawkeye** | green npc | **hector**            | appears turn 2      |

**Agent notes:**

**s03 — WON on attempt 1, turn 7. No deaths. Hawkeye recruited (Hector, turn 2: he appears at (17,12) right next to the start).**
- Pent (green Sage, Elfire/Thunder/Elixirs) walks the west half and killed ~12 enemies on his own, including both cls13 axe bosses, the Luna shaman (the Luna drop was lost) and the last two shamans. Let him; turtle in the SE corner.
- Desert costs: foot 2, paladin 4 (!), nomad 3, General 1 on sand, Canas (shaman) 1. Marcus moves 2 tiles a turn. Fliers and mages are the mobile units here.
- Kills came to us: mages first (only they hurt Hector, Def 17; Marcus at Res 14 takes 0 from them), then archers, nomad, cavalier, knights, Hammer unit, wyverns. Hector and Hawkeye baited, everyone soft stood on '.' threat tiles.
- fe7_threat under-counted a flying wyvern by one tile: Eliwood on a "safe" tile took 13. Leave a margin against fliers.
- Gains: Oswin promoted to General, Lyn +7 HP, Canas Lv10 (Marcus still holds the Guiding Ring: give it to Canas -> Druid), Hector Lv18. House at (12,13) is just talk.
- ENDING: the last enemy died on the green phase, and fe7_wait pressed straight through the ending, the Ch.24 opening AND the Ch.24 Prep screen. The handover is at Ch.24 TURN 1 (player phase, nothing moved), not at Prep, so Ch.24's deployment was chosen by the game: Hector, Eliwood, Lyn, Marcus, Bartre, Oswin, Guy, Wil, Canas, Rath, Heath, Sain, Rebecca, Merlinus. Hawkeye is benched. No title card was captured, and any save prompt took the default.
- During that ending Hector received item 0x88 (a 1-use key item) into a full inventory; fe7_wait's A sent his equipped BRAVE AXE (23 uses) to the convoy. Get it back from Merlinus (Supply, by hand). Hector now has Hand Axe x4, Iron Axe x31, Hammer x3, Devil Axe x17.
- Do differently: when only 1-3 enemies remain and a green NPC could finish them, do NOT call fe7_wait after ending the turn; poll with fe7_unstick/screenshots so the next Prep screen is not skipped.

**s03 prep notes:**
- Prep: benched Matthew (no weapon), Rebecca, Sain (cavalier in sand); fielded Heath (flier), Rath, Canas. Ninian is AVAILABLE on the bench (Ninis's Grace) but was left out.
- Prep trades: Halberd -> Bartre, Longsword + Isadora's Silver Sword + Short Spear -> Marcus, Sain's Steel Lance -> Heath. Wil's Knight Crest -> Oswin, used in prep: Oswin is now a GENERAL Lv1. Isadora's Angelic Robe used on Lyn (HP 30).
- The prep Items screen ("Trd/Use/Trnsfr/List/Sell/Give all") reaches benched units and can Use promotion items; Yes/No prompts default to No (press Left first).
- Dead/unavailable on the roster (status flag 0x0D): Erk, Dorcas, Serra, Lowen, Dart. No healer exists.

### Chapter 23x — Genesis (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 24 — Four-Fanged Offense (24a Linus version / 24b Lloyd version)

**Objectives:**

**24b (Lloyd version): "Defeat Lloyd".** Lloyd = enemy ch63, Swordmaster, Light Brand (1-2 range), HP41 S18 Skl19 Spd19 Def8 Res15, sits at (7,9) in the middle of the map. Map 19x25, no fog. We start in the SW (x0-7, y20-24). Wallace (green, General, Silver Lance/Hand Axe/Elixirs) starts at (17,4) NE and fights the NE enemies on his own. Dart is dead, so this is 24b and Geitz is irrelevant. Recruit Wallace with Lyn/Sain/Wil BEFORE killing Lloyd. **FOG OF WAR** (vision about 3 tiles): enemies outside vision cannot be targeted even when adjacent. Reveal by waiting a unit nearby first. A **ballista** sits at (7,11), and the archer (cls1A, Silver Bow) at (8,12) mounts it around turn 3-4 (about 20-Def per shot, roughly 10 tiles of range; fe7_threat does not see it).

**Recruits:**

| character   | starts as | recruit with / action                | important condition                        |
| ----------- | --------- | ------------------------------------ | ------------------------------------------ |
| **geitz**   | enemy     | **dart**                             | only on the linus version of the map (24a) |
| **wallace** | green npc | **lyn, kent, sain, florina, or wil** | only on the lloyd version (24b)            |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

**s04, attempt 1: LOST to the two-deaths rule on turn 6 (Guy on the turn 4 enemy phase, Rath on turn 5). Restarted.**
- Enemy AI byte at unit +0x44: 0x03 = sits still until something enters its move+range, then attacks. Lloyd, the nomad (Silver Bow, (8,12)), the myrmidons at (6,8)/(9,10), the Hero-ish cls0C at (15,18), the bishop at (16,24) (DROPS Orion's Bolt) and the knight at (14,1) all use 0x03. So Lloyd WILL walk out (Move 6, range 2) if anyone stands within ~8 tiles of (7,9). Keep everyone outside his zone; fe7_threat's per-unit lines name him.
- REINFORCEMENTS: on the turn 4 enemy phase, Shine monks (cls1C) appeared ON the forts (6,15) and (7,16), right at the mouth of our start area, and attacked at once. A 3-HP Guy on the house at (2,15) died. Also Lv15 myrmidons (Silver Sword / Steel Blade) and cls39 axe units arrive in the north from turn 3-4.
- Both monks sit on forts (+avoid): three of my four attacks on a 2-HP monk missed. Melee them, or block the forts before turn 4 (a unit standing on a fort may stop the spawn: untested).
- Rath (19 HP) died at (4,15) to a monk plus an unexplained 13-damage hit (Canas also took 13 at (6,17)), probably the Lv15 Steel Blade myrmidon. Do not leave anyone below ~25 HP in any threat count >= 2.
- Turn 1 logistics that worked: Marcus->Canas Guiding Ring (Canas -> Druid); Heath's Javelin -> Sain; Wil supplied the Brave Axe out of Merlinus's convoy (pressing A on 'Merch' by hand, Take, axe tab) and traded it to Hector. Convoy also holds Longbow, Orion's Bolt, 2 Door Keys, Red Gem. Gold reads 0, so there is no shopping and the Arena at (2,13) is useless.
- No healer at all: the only heal was Eliwood's single Vulnerary.

**s04, attempt 2: WON on turn 5. No deaths. Wallace NOT recruited (he stays in the fog in the crowded NE, and Florina at Lv3 was too fragile to send). Geitz is 24a-only, so he was never available (Dart is dead).**
- Prep: benched Bartre, Guy, Rath, Rebecca; fielded Florina, Isadora (given Guy's Killing Edge and Kent's Steel Sword), Hawkeye (given Bartre's Hand Axe and Halberd) and Ninian. Prep Items: Canas used the Guiding Ring (now a Druid), Hector used the Secret Book (Skl 13) and took the Brave Axe from the convoy (the Hammer went in), Eliwood used Afa's Drops, Heath's Javelin went to Sain, and Wil holds the Light Rune and Longbow. The convoy still holds an Orion's Bolt. Matthew holds a Brave Bow that Wil cannot use yet.
- How it was won: T2 killed the monk (Hector) and a revealed wyvern (Marcus); the second wyvern died on Marcus's counter. T4: Oswin stood on the (7,16) fort. Lloyd acts first while the myrmidon still blocks (7,14), so (7,15) is his only attack tile and he must fight in melee. Oswin's Horseslayer counter took him 41->23 and killed the myrmidon. T5: Hector Brave-Axed the monk that spawned on the (6,15) fort, and Marcus stepped onto that fort and killed Lloyd with the Silver Sword (89%).
- fe7_forecast often fails ("action menu could not be located") when the attacker does not move, or when the attack tile is on the right half of the screen; fe7_act attack still works.
- Handover: no one hurt; Marcus Lv14 (Silver Sword 9 uses left), Hector Lv18 (Brave Axe 21, Hand Axe 4), Oswin Horseslayer 13. Still no healer and no gold (0G). The ending and the Ch.25 opening were pressed through by fe7_act's own A/Start; no Yes/No prompt was seen. The handover is at the Ch.25 Prep screen ("Earn 3 points").

### Chapter 25 — Crazed Beast

**Objectives:**

"Earn 3 points." A point is scored by having any player unit **WAIT on each of the three castle gates**: NW (4,3), SW (2,17), NE (21,4). The third one ends the chapter. These are AREA events in the ROM event data (misc list at 0x08CA4734); killing the gate commanders does NOT score. Each gate sits inside a walled 3x3 castle with one entrance: (4,4), (2,18), (21,5). Gate holders: Pascal (ch57 Paladin, Spear, NW), a Warrior (Silver Axe, SW) and a Bishop (Purge 3-10, NE). Map 25x21 around a central lake; we start in a pocket at the south-centre.

**Recruits:**

| character  | starts as | recruit with / action | important condition             |
| ---------- | --------- | --------------------- | ------------------------------- |
| **farina** | green npc | **hector**            | appears turn 5; **pay 20,000g** |

**Agent notes:**

**s05: WON on attempt 1, turn 23. No deaths. Farina NOT recruited (0 gold).**
- I lost about 15 turns because I did not know what the points were (the opening was skipped at Prep). Done right, this is about a 6-8 turn chapter: send Hector/Hawkeye/Marcus to the three gates, kill each commander or lure it out, then WAIT on the gate.
- Enemies keep reinforcing until about turn 12: cavaliers from the north edge and the NW forts, pegasi from the NE edge, hammer pirates near the SW castle, monks respawning at the NE castle mouth every turn. Halberd/Hammer pirates are effective on our cavalry and on Oswin. A ballista archer at (12,4) has 10-tile range.
- What worked: turtling in the start pocket with Oswin (Def 19-22) alone in the mouth as bait (everything did 0 to him), and Hector at Def 20. Pascal (AI 0x03) walked off his gate onto Hawkeye; Hawkeye's Killer Axe and Hector's Brave Axe killed him.
- Gains: Hector Lv20, Oswin Lv5, Hawkeye Lv6, Marcus Lv15, Eliwood Lv5, Canas Lv2. Oswin picked up the Divine tome (0x40).
- Broken or used up: Hector's Brave Axe and Hand Axe, Marcus's Longsword (he has Silver Sword x2 and weapon 0x95 x6 left), Oswin's Horseslayer. Oswin now has Steel Lance x1 only; give him a lance. Eliwood's Vulnerary was drunk by Marcus. There is still no healer, and gold is 0.
- Ending: one Save screen, and I chose the slot in use (Ch.25: Crazed Beast). Handover is at the Ch.26 Prep screen ("Survive"). The game also deployed Bartre and Guy.

### Chapter 26 — Unfulfilled Heart

**Objectives:**

"Survive 11 turns" (turn event at turn 12 ends it). Map 21x27, mostly Peaks/Mountains; our start is split by a peak band (rows 13-15) into a north plaza (Hector, Eliwood, Lyn + Pent and Louise, who join at the start) and a southern basin around Merlinus's immobile tent at (12,18); a mountain ridge (x13-17) splits the basin again from the houses to the east. Vaida (ch2B, Wyvern Lord, 60 HP, Spear) sits at (17,2) with AI 0x03 and never moved; do not kill her (needed for Ch29).

**Recruits:**

None.

Vaida appears here as an enemy. Do **not** kill her; she must survive this chapter to be recruitable in Chapter 29.

**Agent notes:**

**s06: WON on attempt 1 (survived to turn 12). No deaths. Vaida untouched (she never left (17,2)). Pent (Sage: Elfire + Physic) and Louise (Sniper: Silver Bow, 3 Elixirs) joined automatically on turn 1 in the north plaza.**
- Reinforcements (read from the ROM turn events; this is the Hector Hard list): wyverns arrive in fours at the map corners on turns 2, 3, 4, 5 and 7-10. Almost all carry Iron Lances (19 attack); two javelin wyverns (range 1-2) come from the SE on turns 4-5. Many hover near the castle or the west forts and never engage. Hector, alone in the north plaza at (10,9), took 0 damage all chapter and killed three on counters.
- What worked: Florina and Heath ferried Eliwood, Lyn, Pent, Louise, Rebecca and Ninian over the peaks into one tight block around Merlinus's tent at (12,18). Lords and fragile units sat on tiles whose 4 neighbours were all allies, and the javelin wyverns were killed first. Every turn I ran fe7_threat and checked that no exposed unit could take more hits than its HP. Bows do x2 (not x3) against wyverns: Louise does 28-29 per hit, Wil about 14.
- Prep: benched Guy and Bartre (no weapons) and fielded Rath (Short Bow) and Rebecca (Iron Bow). Florina's Javelin went to Oswin.
- Handover: Marcus has NO weapon (Short Spear, Silver Sword and Armorslayer all broke), 14/41 HP. Pent is at 9/34, Wil 12/25, Rath 15/27, Hector's Iron Axe has about 16 uses. Wil holds the last Elixir, Louise none. Oswin has Javelin + Divine. Florina is carrying Rebecca and Heath is carrying Ninian; the game resets that at the next chapter. The convoy still has a Hammer x3; Florina and Lyn each hold a Red Gem (sell value). Gold is 0.
- Ending: one Save screen, and I chose the slot in use (it became "Ch.27: Pale Flower of Darkness"). The handover is at the Ch.27 Prep screen ("Defeat enemy").

### Chapter 27 — Pale Flower of Darkness

**Objectives:**

"Defeat enemy" — rout, 38 enemies at the start ("Left 38" on the map). Snowy town map 25x26, SNOW WEATHER: movement costs are roughly x3 for everyone (the game's grid for an enemy cavalier was 12 tiles vs 33 in fe7_threat), so fe7_threat badly OVER-states ranges here; use `verify`. We start in the SW pocket (x0-6, y16-25), which only opens north (x0-1) and east along row 16. 17 enemies stand on Roof tiles with state flag 0x81 (hidden; not drawn on the map), incl. the boss-like ch59 (Light Brand) at (21,1). No green units; no Karel and no Harken at the start.

**Recruits:**

| character  | starts as | recruit with / action                                 | important condition                                           |
| ---------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **karel**  | green npc | **hector or lyn**                                     | mutually exclusive with harken; see the note below this table |
| **harken** | enemy     | **eliwood, marcus, lowen, hector, oswin, or isadora** | mutually exclusive with karel; see the note below this table  |

Depending on various circumstances, you will only see one of the two on the map. You cannot get both.

**Agent notes:**

**s07 prep (attempt 1):** benched Sain (Javelin only) and Florina (Lv3); fielded Pent (Elfire, Physic = our only healer) and Louise (Silver Bow). Marcus got Sain's Javelin and Florina's Slim Lance (he had no weapon). Rath used the convoy's Orion's Bolt (Nomad Trooper now, swords too) and took Wil's Iron Bow. Heath's Silver Bow went to Louise. Hector's Heaven Seal could NOT be used at prep (the Use command does nothing yet). Answered "Deploy Merlinus?" with No. Watch for Harken (ch38) to appear mid-chapter; talk with Hector/Eliwood/Marcus/Oswin/Isadora.

**s07 — WON on attempt 1, turn 42. No deaths. Harken RECRUITED (arrives turn 10 at (24,9)->(23,9), Brave Sword; Oswin talked on turn 12). Karel never appears in this (Jerme/ch59) version.**
- 17 enemies start HIDDEN (state 0x81) inside sealed buildings shown as "Roof". Each building opens with a DOOR KEY (item 0x69, use effect 0x1F) used from its stairs: (16,21)/(16,22), (23,17)/(23,18), (21,5)/(21,6) boss, (5,14)/(5,15), (14,3)/(14,4). Opening a door turns the whole roof into floor and reveals everyone inside; the NW complex (doors (5,6),(6,6),(14,3)) is ONE building. Keys came from 3 drops on visible units + drops of the General (16,19), Hero (23,14) and fighter (5,12) inside: exactly enough. The stairs are one-tile chokes: park a tank there (Hawkeye, Harken, Pent with Elfire, Oswin vs archers).
- Turn events (ROM 0x08CA4D6C): reinforcements t4/t10 nomads (24,8-10), t7 falcoknights SE, t8/t15 NW wyverns (0,0-1), t14/t19 cavalry (24,8-10); NONE after 19. Weather flips every ~3-4 turns; in snow everything moves ~1/3 and enemies barely act — fe7_threat ignores snow.
- Enemies wait-in-range; bait worked every time: Oswin (Def 25), Hector (Def 20), Harken (Brave counters), Hawkeye (Halberd vs cavalry), Pent/Canas vs archers (range-2 magic counters). Boss ch59 (cls3E, Light Brand 1-2) came out to (21,5); Harken 21x2 + Rath finished it. Boss crit vs Hawkeye was 0%.
- Pent's Physic does NOT work through fe7_act (menu not located) — use raw presses: select, A, Staff, Physic, cycle targets with Left (screenshot each), A. Target cycling lags; two heals landed on the wrong unit.
- Prep: Rath promoted (Orion's Bolt, Nomad Trooper). Gains: Hector got 2 kills, Oswin Lv10, Marcus Lv19, Hawkeye Lv10, Isadora Lv2, Louise Lv5, Rath has the boss's Light Brand x25. Marcus has chest item 0x60 (value 8000, stat booster — use it at prep). Heath holds a 4-use Chest Key (0x78). Unopened chests were left: (15,10) White Gem, (16,10) Bolting, (9,23) item 0x63.
- WEAPONS ARE CRITICAL: Oswin has Javelin x1 only, Harken Brave Sword x8, Hector Iron Axe ~9 + Devil Axe 17, Pent Elfire x9, Hawkeye Halberd 12/Killer 4, Marcus Slim Lance 18. Still 0 gold and no healer staff besides Pent's Physic (~7). Canas ended at 11/28.
- Ending: the final kill's fe7_act pressed through the ending and title card itself; no Save prompt was seen (any default was taken). One Start then skipped the Ch.28 opening straight to Prep ("Guard Zephiel").

### Chapter 28 — Battle before Dawn

**Objectives:**

"Guard Zephiel" (Prep). ROM event data (header 0x08CA54A4): a turn event at TURN 16 (mode 0) runs the ending, so survive 15 turns with Zephiel alive. Map 30x28 castle; we start in the north courtyard (x9-19, y0-6). Doors (location events): (6,3), (26,6), (5,15), (13,18), (14,18), (21,16). Chests: (5,13) Goddess Icon, (6,13) BRAVE LANCE, (21,13) item 0x54, (22,14) item 0x70. Hector-mode reinforcements (mode 2 entries): assassin at stairs (8,11) t2-4; south edge (y26-27): archers t4/t7, mage+shaman t5/t7/t9/t12-14, monk+shaman t5, hero+myrmidon t6, knight+General t8. Turn 3 and turn 9 events wake the NE groups; turn 12 more. Talk: Hector->Nino (Hector mode), Lyn->Nino, Nino->Jaffar (ch24).

**Recruits:**

| character  | starts as | recruit with / action     | important condition                                              |
| ---------- | --------- | ------------------------- | ---------------------------------------------------------------- |
| **nino**   | green npc | **hector or lyn**         | keep her alive afterward                                         |
| **jaffar** | green npc | **nino must talk to him** | both must survive ch. 28; jaffar then joins automatically in 28x |

**Agent notes:**

**s08, attempt 1: LOST on turn 6 (Zephiel killed on the enemy phase; fe7_wait pressed through the Game Over to the title).**
- FOG OF WAR. Zephiel (green ch7A, HP 20, Def 8, Silver Sword, 3 Elixirs) is in the central room x10-17 y13-16 whose only entrance is (13,17)/(14,17). Enemies with AI2 0x11 (most of the SW group and all reinforcements) walk straight to him: a myrmidon, a fighter and a mage were inside his room by turn 5. Jaffar (green, (3,19)) died on the turn 2 enemy phase fighting the SW group; Nino (green, (25,16)) survived.
- Our start courtyard (x9-19, y0-6) exits only by stairs (20,3)/(20,4) into the NE room (fighter E#4 with Door Key, Hero, Hammer fighter, mage), then the locked door (26,6). Braces (3F) and walls block even fliers. The walking route to Zephiel is ~32 tiles past the door: about turn 8 at best. Too late.
- Lured E#4 onto Hector at (18,3) on turn 1 and Marcus killed it for the key on turn 2. Oswin (Def 25) plugged the stairs and the doorway, and the Hammer and the bishop died on his counters. The bishop drops an ELYSIAN WHIP.
- Tool quirk: fe7_act 'door' after a free 'trade' fails and ENDS the unit's turn. Open a door with a fresh unit.
**s08, attempt 2: LOST on turn 6 again** (Zephiel at full HP on PP6 was swarmed on EP6 off-pillar at (13,13), the same tile and turn as attempt 1). Healing between phases does not stop a 4-6 attacker burst. Notes: the convoy holds 2 Door Keys (take them at prep, Trnsfr->Take). Turn 4's player phase was SKIPPED after fe7_end_turn on turn 3 (tool/game glitch). Guides say Zephiel normally stands on a pillar (+20 avoid) and that players also lose him to swarms and restart. The east chests are (21,13) Rescue staff and (22,14) Delphi Shield; the west ones are Boots and Brave Lance.
**s08, attempt 3: LOST on turn 10** (Zephiel swarmed by 6 enemies inside his room on EP10, at full HP after Physic). The Prep screen was skipped by an extra queued Start press (default deployment, no trades): press Start ONE at a time during the opening and screenshot after each. Jaffar SURVIVED EP2 this time (RNG), plugged the room entrance and killed ~5 enemies until his Killing Edge broke (turn 8); that alone kept Zephiel alive 4 turns longer. Door opened turn 3 (Pent killed the key fighter from (19,5) on T2; Rath took the key at (19,4), rode 8 to (26,5) on T3). The boss at (28,26) has Bolting (3-10) and never moves before turn 13: never end a turn within 10 tiles of it, except Oswin as a sponge. The hall route reaches the room entrance on turn 10 at best; by then the entrance (13-14,18-20) is clogged.
- PLAN for attempt 4: Rescue staff in the (21,13) chest (room x20-23 y13-15, door (21,16), stairs (21,17) from the hall). Give Pent a convoy Door Key and Heath's Chest Key at prep, and take him south with the army: door ~T8, chest ~T9, then Rescue Zephiel out to Pent's side (from (21,14) Zephiel's pillars are about 6 away). Physic also reaches the room from there.
**s08, attempt 4: LOST on turn 8** (Zephiel at 13/20, out of Physic range because Pent was travelling south with the Rescue plan, died to two myrmidons on EP8). Best opening so far: T1 Hector bait (18,3) + Marcus to (17,5); T2 Marcus kills the key fighter from (19,4), Oswin (19,3) and Hawkeye (20,4) plug; T3 Pent Elfire + Oswin spear kill the Hero, Hector one-shots the mage, Marcus rides 8 to (26,5) and opens the door with a convoy key. Then Oswin spears the doorway mage (T5), and Marcus waits by the corridor myrmidon to reveal it (T5) and kills the corridor mage (T6). Marcus reached (25,17) on T8. The Rescue plan cannot finish before T10 (door T9, chest T10), and Zephiel gets no heals while Pent travels.
- PLAN for attempt 5: Pent goes to the row-10 corridor (17-21,10) by T6 and heals Zephiel every turn. The army rushes south to plug (13,18)/(14,18).
**s08, attempt 5: LOST on turn 8.** Zephiel was at FULL HP (Pent at (15,10)) and still died on EP8 to a myrmidon (Steel Sword 12x2 = 24 > 20 HP) plus a sniper inside his room. Healing cannot beat one myrmidon doubling him; units must be inside or at the entrance by T8. The opening is deterministic enough to repeat (Jaffar survived EP2 in attempts 3-5).
- PLAN for attempt 6: from T5 Marcus rides straight down without clearing the corridor: T5 (27,12), T6 (26,17), T7 (19,18), T8 the entrance (14,19).
**s08, attempt 6: WON (turn 16, no deaths). Nino recruited (Hector talked to her on T9); Jaffar NOT (Nino never reached him; he goes to unrecruited).**
- Prep: Lyn benched for Harken; Killing Edge to Harken; Heath's Short Spear swapped for Oswin's Javelin; Talisman used on Hector; Hammer to Hector; a convoy Door Key to Marcus.
- T1-T4 as in attempt 4 (bait at (18,3), key fighter killed T2, Hero and mage killed T3). Marcus opened (26,6) on T3 by hand, because fe7_act door failed twice; T4 he killed the doorway mage.
- T5: Marcus killed the bishop (Elysian Whip) and Ninian danced him to (28,13). T6 into the hall. T7: Pent reached (20,10) and Physicked Zephiel through the walls EVERY turn after. Marcus counter-killed the hall fighters and myrmidons on the way.
- T8: Marcus at the entrance. T9: he killed the room's assassin and took the Brave Lance chest. From T10 Marcus held (13,20) and Rath, later Hawkeye, held (14,20): sealing those two tiles shuts the room. Harken and Hawkeye later sealed the hall stairs. The Bolting boss at (28,26) never moved.
- What worked: one mounted carry plus one healer through walls beats the AI2 0x11 beeline. Do not bring the army; just seal (13,20)/(14,20) by T9-T10.
- PLAN for attempt 2: Pent's Physic range is Mag/2 = 9. From the courtyard's south edge, (13-15,6), he reaches Zephiel's room (e.g. (14,6)->(14,14) = 8) through the walls. Keep Pent there all chapter and heal Zephiel every turn. Push everyone else east for Nino.

### Chapter 28x — Night of Farewells (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Chapter 29 — Cog of Destiny

**Objectives:**

"Defeat enemy" (rout). Map 29x27; we start in the SE pocket (x22-27, y21-26) ringed by rivers, exits: north bridge (25,18), NW bridges (21-22,21), west bridge (20,25). 43 enemies at start; boss = Hero (ch66, 58 HP, Light Brand 1-2, magic at range) on the castle throne (7,5) NW, never moves. Armory (7,26) + Vendor (8,26, via the Armory tile) in the walled SW corner, entered only through (7-8,20-21). Reinforcements: NE edge (21-23,1) and forts (15,10-12) alternate every turn ~T5-T12, west forts (6-8,15) ~T12-T18, then Vaida + wyverns at the SE corner (28,24-26) from T23, 3 wyverns per turn T24-T27 (stopped by itself).

**Recruits:**

| character | starts as | recruit with / action | important condition                          |
| --------- | --------- | --------------------- | -------------------------------------------- |
| **vaida** | enemy     | **hector**            | she must have survived as an enemy in ch. 26 |

**Agent notes:**

**s09 — WON on attempt 1, turn 38. Heath died (T1 EP: I ignored a "threatened by" line; a Killing Edge myrmidon from (18,26) crossed the west bridge and crit him). Vaida RECRUITED (arrives T23 at (28,24); Hector talked the same player phase).**
- Prep: Ocean Seal (Matthew, benched) sells for 25,000G, Red Gem 2,500 — gold went 0 -> 27,500. Nino's Elixir -> Hector, her Elfire x26 -> Pent.
- What worked: Hector (Def 20) + Oswin (Def 27) as an unarmed WALL at (21,20)/(22,20) north of the NW bridges — nothing gets past and almost nothing hurts them; counters + Louise's Silver Bow from the bridge behind killed ~25 units. Generals/knights/paladins/nomads all do 0-5 to them.
- Weapons ran out (Brave Lance, Hector's axes, Oswin's spear). Shopping: Armory has Iron/Silver sword, lance, axe, Iron/Silver bow; Vendor has Heal staff (600G), Fire/Thunder/Elfire/Lightning/Shine/Flux. Buying is by hand (fe7_act has no armory action in this build): move on the tile, choose Armory, Sell first if full.
- Wyverns (S13, steel lance ATK 22, javelins): Merlinus's tent must be sealed on all sides (Oswin, Hawkeye wading in the river, Vaida). Carry fragile units (Vaida carried Eliwood, Hector carried Louise). Louise's Silver Bow and Pent's doubled Elfire one-round them.
- Boss on throne: Def 21, Light Brand hits low-Res units hard (23 to Harken). Pent at range 2 (takes ~2) + Harken one hit then rescued by Rath; Pent's counters plus 2 turns finished him.
- Handover: Hector was auto-PROMOTED to Great Lord (Lv1) by the ending and holds NO weapon — give him Isadora's Silver Axe/Iron Axe at prep. Isadora also holds Silver Lance + Iron Lance (for Oswin; Oswin and Hawkeye are unarmed). Rath holds a spare Heal staff + Flux; Canas has a Heal staff. Pent's Physic is used up. Marcus: 2 Silver Lances (16+20). Harken: Silver Sword 18, Light Brand 1. Gold ~19,000. Elysian Whip with Marcus. 2 Elixirs with Oswin.
- Save prompt: chose the slot in use ("Ch.29: Cog of Destiny" -> became "Ch.30: The Berserker"). Handover at the Ch.30 Prep screen ("Claim a space").

### Chapter 30 — The Berserker

**Objectives:**

"Claim a space": kill the boss (ch5E, cls0C, 60 HP, Tomahawk 1-2) on (4,1) in the NW room, then have a unit WAIT on (4,1) (an area event; there is no Seize command). Only Hector, Eliwood and Marcus are deployed. Map 30x16 with 14 poison-gas vents firing every turn in 3-deep cones (trap list at ROM 0x08CA73F9, 6-byte entries `05 x y dir 01 01`, dir 0=left 1=right 2=down 3=up).

**Recruits:**

None.

**Agent notes:**

**s10 played T1-T11 (crashed without notes); s11 finished. WON on attempt 1, turn 18. No deaths.**
- s10 cleared all ~22 knights, mages, fighters and thieves by baiting them onto Hector (Def 22) and Marcus. The thief took the Wolf Beil from the NE chest, and Hector holds it now (item 0x8D). Hector and Eliwood got a support (C) on T10.
- The boss NEVER leaves (4,1), even with units inside his move+range; he only hits what stands within 2 tiles. He has 0% crit vs Hector and Marcus. Marcus doubles him 18x2 and takes 20; Hector's Steel Sword does 13 and takes 10. What worked: kill the Elfire mage first by luring it onto the stairs at (1,7), which only it can reach. Then Hector attacks with the Steel Sword and stays adjacent, so his enemy-phase counter chips the boss again (60->33). Then Marcus kills him with 18x2, and Hector walks onto (4,1) and Waits, which ends the chapter.
- Poison gas: Hector and Marcus each took 1-4 HP a turn for several turns. Stay off the vents' cones.
- Handover: Hector 14/42 (levelled up), Steel Sword 6 uses, Silver Axe 16, Iron Axe 45, Wolf Beil 30. Marcus 36/43, Silver Lances 7 + 20. Eliwood 12/22, Rapier 21, Pure Water. The Elixir is used up. Everyone heals at the chapter change.
- Ending: one Save screen. I chose the slot in use ("Ch.30: The Berserker", default highlight), then Save. Handover is at the Ch.31 Prep screen ("Protect throne").

### Chapter 31 — Sands of Time

**Objectives:**

"Protect throne": survive 11 turns (the win fired as turn 12 began) without an enemy reaching the throne at (6,2). Map 22x28. The throne room (x0-12, rows 0-4) opens ONLY through two stairways: west (1-2, rows 5-7) and east (10-12, rows 5-7). A separate walled side room (x13-18, rows 11-16) holds four forced-deployed units (Pent, Canas, Wil, Hawkeye). It opens via the one-wide stairs (14,14) and the 2-wide east strip x17-18. Enemies: Poison Lance knights (Mt 4, harmless), archers, longbows (range 3, they shoot through walls), Flux/Luna shamans, druids with Sleep/Silence staves and Eclipse (3-10), thieves (they loot the chests at (3,12), (4,12) and (3,23)), and Generals. Reinforcements arrive every turn from the south edge and the NE stairs (15,2)/(20,2).

**Recruits:**

None.

**Agent notes:**

**s12: WON on attempt 1 (survived to turn 12). Wil DIED (EP7: he was asleep in the side room, and two longbow shots through the wall plus a knight finished him). No recruits.**
- What worked: Hector sat on the throne all chapter and was never touched. Seal both throne-room stairways: west Oswin (2,5) + Isadora (1,5) (only 1-2 enemies ever came); east Harken (10,5)/(10,6), Marcus (11,5), Louise (12,4). Each turn Marcus speared whatever archer/shaman stepped into (12,5) and Louise shot the one on (12,6) at range 2. About 20 enemies died on counters.
- The side room is the weak point. The druid at the south put Wil and Hawkeye to SLEEP and SILENCED Canas on EP3. Longbows hit 3 tiles through walls, so row 11-12 tiles are not safe from the hall. Next time kill the druid on turn 2-3 with Pent, and keep everyone in (14,13) (stairs top), (16,13) and (17,13). Hawkeye rescuing an 8-HP Canas kept him alive.
- Prep: benched Guy and Bartre (unarmed). Nils, Nino, Kent, Vaida and Matthew are unarmed or unavailable. Tomahawk (Marcus) and Iron Axe (Hector) went to Hawkeye; Marcus's spare Silver Lance went to Oswin. Isadora and Sain CANNOT use Silver Lances (greyed out); Sain still holds one and has no usable weapon.
- Handover: WEAPONS ARE NEARLY GONE. Louise Silver Bow x2, Marcus Silver Lance x5, Oswin Silver Lance x3, Harken Silver Sword about x1 + Light Brand x1, Hawkeye Tomahawk x4 + Iron Axe x37, Pent Elfire about x9, Canas Flux x12 + Heal x23. Hector has Steel Sword x6, Silver Axe x16, Wolf Beil x30. Isadora holds the Heaven Seal and Marcus the Elysian Whip; Florina holds a Red Gem and Thunder. Gold was 19,077, and the 31x intro gives +30,000.
- Ending: Save screen. The cursor started on the Ch.15 slot (!). I moved it Up to the slot in use ("Ch.31: Sands of Time", play time 19:42) and saved. Ch.31x loaded. An extra Start skipped its Prep and answered "Deploy Merlinus?" (Yes, the default). The handover is at **Ch.31x TURN 1**, player phase, 10 units deployed, objective "Get supplies 1/5 Turn", no enemies. Buy weapons there.

### Chapter 31x — Battle Preparations (gaiden)

**Objectives:**

"Get supplies": a 5-turn town with no enemies; the chapter ends after turn 5. Map 15x10. Armories at (10,2), (13,2), (7,3), (10,8); Vendors at (1,4), (12,5); Arena (5,7); House (13,8). Gold at start of T1: 49,077.

**Recruits:**

| character | starts as | recruit with / action | important condition                                                                                              |
| --------- | --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **karla** | npc       | **bartre**            | bartre must be a **level 5+ warrior**, be deployed, talk to her, and both must survive their forced combat round |

**Agent notes:**

**s13: WON on attempt 1 (the chapter ends by itself after turn 5). No deaths. Karla NOT recruited: s12's extra Start skipped this chapter's Prep, so Bartre was never deployed and Karla never showed up.**
- Shops: (13,2) axes (Iron/Steel/Silver/Killer/Swordreaver/Hand axe), (10,2) lances (Slim/Iron/Steel/Silver/Killer/Axereaver/Javelin), (7,3) swords (Slim/Iron/Steel/Silver/Killing Edge/Lancereaver), (10,8) bows (Iron/Steel/Silver/Killer/Short/Long?). (1,4) tomes (Fire/Thunder/Elfire/Lightning/Shine/Divine/Flux), (12,5) items (Vulnerary/Elixir 3000/Pure Water/Door Key/Heal/Mend/Recover/Restore). There is NO convoy here ("no merchant"), so a unit with 5 items cannot buy. Sell junk first. Shopping is all by hand; fe7_act has no armory/vendor action in this build. Mounted units canto after a shop, so press A on a tile, then Wait.
- Gold: 49,077 -> sold Red Gem 2,500, White Gem 10,000 and a spare Heaven Seal 10,000 -> spent to **26,232 left**. The shop list cursor remembers its last row, so press Up to the top before counting Downs (I bought a Restore by accident and sold it back).
- **Lyn PROMOTED to Blade Lord** (Heaven Seal; item 0x89).
- Purchases now held: Lyn Silver Lance x2 + Silver Sword. Eliwood Silver Lance x3 + Killer Lance. Canas Silver Sword x2 + Killing Edge. Hector Silver Sword (HE CANNOT USE IT, rank too low) + Killing Edge. Marcus Hand Axe, Killer Axe, Silver Axe, Elixir and the Elysian Whip (for Florina). Louise Silver Bow x3 + Killer Bow x2. Rath Silver Bow. Isadora Elfire x3 + Mend. Oswin Thunder (and Divine x25, for a light user if there is one). Hawkeye Elixir x3.
- **At Ch.32 Prep, redistribute**: fresh Silver Lances to Marcus/Oswin/Kent/Vaida; Hector's Killer/Hand Axe from Marcus; Elfire to Pent/Nino; Silver Swords to Harken/Guy/Lyn; Mend to Pent or Canas. Old Silver Lance x3 (Oswin) and Steel Sword x6 (Hector) are nearly spent.
- Ending: no save prompt after 31x. At Ch.32 Prep I used Prep > Save on the slot in use (it read "Ch.31x: Battle Preparations", play time 20:29), so Restart Chapter now lands on Ch.32. The handover is at the **Ch.32 Prep screen** ("Seize gate"), with 16 units auto-deployed and 32 enemies. The boss (ch85, cls5A, 68 HP) is at (24,3).

### Chapter 32 — Victory or Death

**Objectives:**

"Seize gate": Hector must seize the Gate at (24,3) in the NE; the boss (ch85, cls5A, 68 HP, Def 24 Res 27, Fimbulvetr 1-2 + Bolting 3-10, AI 0x03) sits on it. The gate is walled; (24,4) is its only adjacent open tile. Map 28x30, mostly Peaks; we start in the SW corner (x0-6, y24-29). Ruins: (5,2) NW = Renault (visit by turn 11), (11,9), (23,26). Event header 0x08CA6404 (Hector Normal list 0x08CDE280). Hector-Normal reinforcements: T5-7 wyvern (27,16); T7-9 two cls33 fliers NW corner (1,0)/(3,0); T8-10 wyvern (16,0) and nomad troopers SE (27,28)/(26,29); T10-12 falcoknight + 2 pegasi E (26-27,16-18); T14-16 more. Mode-5 lists (maybe all modes): T12-14 cavaliers on the forts (4,20)/(5,21) right by our start; T20+ more.

**Recruits:**

| character   | starts as | recruit with / action            | important condition            |
| ----------- | --------- | -------------------------------- | ------------------------------ |
| **renault** | ruins     | **visit the northwestern ruins** | must do so **within 11 turns** |

**Agent notes:**

**s14 plan (attempt 1):** Prep: benched Rebecca (Lv3) and fielded Vaida (Wyvern Lord, no weapon: give her a Silver Lance on T1). Ninian is not offered. Merlinus deploys automatically. Trades on T1 with fe7_act (silver lances from Eliwood/Lyn to Marcus, Vaida, Oswin; Killer Lance to Isadora; Silver Sword to Harken; Elfire to Pent). Then march north along the west edge (x0-4), bait the AI-0x03 knights, snipers and heroes, visit the (5,2) ruins for Renault, and go east along rows 0-4 to the gate. Most enemies have AI 0x03 (wait in range); the three SE cavalry (AI 0x00) advance.

**s14, attempt 1: LOST to the two-deaths rule on turn 26 (Nils EP24, Isadora EP25, both shot by a manned Long Ballista at (19,4), range 15).** Up to turn 24 it went well (about 60 kills, no losses). Lessons:
- BALLISTAE (Hector-mode trap list at ROM 0x08CA7450; fe7_threat does not see them): Long (3-15) at (19,4), (22,2) and (26,11); Killer (3-10) at (14,0), (21,9) and (22,10); plain (3-10) at (10,16), (9,20) and (13,18). They only fire when a sniper stands on them. Five snipers spawn around the gate on turn 23-24 and climb onto (19,4) and (22,2). Before that, the (1,19) sniper sits on (14,0) around turns 19-22.
- REINFORCEMENTS REPEAT EVERY TURN of their window (this run uses event mode 2). Turns 25-35, EVERY turn: 2 cavaliers on the forts (11,14)/(12,15), 2 lance fliers (cls33) at the NW corner (1,0)/(0,1), 2 nomad troopers at (27,28)/(26,29), and 2 pegasi at (18,29)/(20,29). Seize before turn 25. Earlier waves: turn 3, five nomad troopers in the NW (0-2,6-8); turn 9, cavaliers, a paladin and cls33 in the NW (7-9,0-1); turns 10/15/16, a General plus 4 knights on the gate forts (24,6) etc.
- RENAULT IS LOST unless the (5,2) ruins are visited by about turn 7: wyverns (AI 0x04) sit on the ruins and destroy all three (it becomes impassable "Village" terrain). Cavalry also wreck the SE ruins at (23,26) on turn 2-3.
- What worked: Oswin (Def 28-30) at (1,17), then holding the BRIDGE (1,9), the only ground link from the NW plains to the west strip. The NW horde and the whole gate garrison (2 Generals, 8 knights, paladins, cavaliers, wyverns, bishop) marched INTO it and died on counters (Oswin, Vaida, Pent). Lords, Florina, Nils and Sain were carried while the Eclipse druid and Purge bishop were alive. By turn 22 the gate held only the boss, the sage at (22,9) and the sniper at (24,9).
- The boss (cls5A, Bolting x5 + Fimbulvetr) has AI1 0x03 = never moves. The gate (24,3) is walled; (24,4) is its only melee tile. The central pegasus/falcon swarm at (14-16,15-18) never moved all game.
- Merlinus is an immobile tent at (3,29). Hawkeye, Pent and Canas around him killed about 8 cavaliers and wyverns.

**s14, attempt 2: LOST on turn 29** (Rath died EP28 and Eliwood died EP29, both to the turn-25+ lance fliers spawning at the NW corner (1,0)/(0,1)). Deployment was the same minus Florina. The opening replays exactly (the AI is deterministic): bridge hold T8-T13, NW wave dead by T13, north road cleared T17-T22. Lessons:
- The 5 gate snipers spawn when you APPROACH the gate (T19 here, when Hector reached (12,1); T23 in attempt 1). They climb the Long Ballistae (22,2)/(19,4) the next enemy phase, then walk off them after 2-3 turns to chase you. The sage (22,9) walks to (20-22,4-5) around turn 22 and Bolts, as does the druid (Eclipse). All their tomes (5 each) ran dry by T27.
- The boss used 3 Boltings (36 minus Res: 26 to Harken, 19 to Oswin) on anyone within 10 of (24,3).
- Turns 25-29 were a slaughter: 2 new lance fliers (cls33, Spd 13, 22 attack) per turn from the NW corner. They DOUBLE any carrier (carrying halves Spd), so a carrier with Def 8-12 dies to one. Carrying lords around is a liability once those waves start.
- fe7_act 'item' after a trade fails (it cannot highlight "Use"). Do it by hand: Item, then the row, then A on "Use". A mounted unit that trades after moving only gets Canto+Wait (no item). Hector holds an EARTH SEAL (item 0x87), and Sain can use it to become a Paladin.
- Harken (Def 18, avoid 58) with Silver Swords is the best killer, but he broke 2 swords and took 24 in one enemy phase from Bolting + Eclipse + snipers. Give him 3 swords at T1.
- PLAN for attempt 3: try to bench Eliwood and Lyn at Pick Units (only Hector and Nils show green = forced); if they can be benched, there is no lord besides Hector to protect. Keep Nils carried or sealed at the tent. Strike team: Hector, Oswin, Harken, Vaida, Marcus, Louise, Rath + Elixirs. Rear: Hawkeye, Pent/Canas, Isadora, Sain around Merlinus. Push east along the north road from ~T13 instead of T17, and be on the boss by ~T21-22. Seize before T25.

**s16 (resumed attempt 3 at turn 11 after s14 hit a rate limit): WON on attempt 3, seized on turn 26. Nils DIED (EP18, shot by the manned Long Ballista at (19,4) while standing at (6,4), 13 tiles away; fe7_threat had shown that tile as safe). Renault NOT recruited (the (5,2) ruins were already destroyed). 32x did not trigger; the game went straight to the final chapter's Prep screen.**
- Attempt 3 deployment: no Vaida and no Merlinus (s14 skipped Prep by accident).
- What worked: Harken at (1,5)/(1,6) above the bridge, with Oswin beside him, counter-killed the whole NW cavalry wave (6 kills in one EP). Then Oswin (Def 30, Res 18) became the corridor wall at (15,1)-(19,1), the two-wide road x15-20, rows 0-1. Knights and Generals die on his counters, and only Bolting hurts him. Snipers cannot counter in melee, so Hector, Harken and Oswin kill them for free when they step next to you.
- The boss's Bolting reaches 10 tiles from (24,3): (15,1) and (16,0) are just outside it. Keep everyone except Oswin there until its 5 Boltings are gone (the sage has 5 too). Long Ballista item 0x35: Mt 13, range 3-15. Do the distance math by hand for every soft unit.
- Boss kill: on the gate he has Def 26; Harken's Silver Sword does 12x2 from (24,4), and the boss counters for 27. Pent Mended Harken to full right after, and the boss attacked him on the enemy phase. Harken's counter crit killed it. Then Hector walked through Harken to (24,3) and Seized. Harken now holds Fimbulvetr (dropped by the boss).
- The rear group (Eliwood carried by Sain, Rebecca by Isadora, plus Lyn, Florina, Louise, Rath, Canas and Hawkeye) withdrew to the west corridor around (0-1,15-23) from turn 20, far from all the turn-25 spawn points. Nothing reached them.
- Handover: everyone heals at the chapter change. Harken's Silver Sword is down to x4 and Oswin's Silver Lance to x6. Marcus has a Silver Lance x20 and a Hand Axe; Hector a Wolf Beil x26, Silver Axe x16, Killer Axe x20 and an Earth Seal. Hawkeye still has 3 Elixirs. Athos (ch27, cls42) is deployed for the final chapter.
- Ending: one Save screen with the cursor already on the slot in use ("Ch.32: Victory or Death"). I chose Save. Handover is at the **final chapter's Prep screen ("Chapter 33", Defeat Nergal)**, with 12 units auto-deployed.

### Chapter 32x — The Value of Life (gaiden)

**Objectives:**

_(filled in by the agent)_

**Recruits:**

None.

**Agent notes:**

_(none yet)_

### Final Chapter — Light (two parts)

**Objectives:**

"Defeat Nergal" (the Prep screen calls it Chapter 33). From s16's turn-0 read: Nergal (ch44, cls45, 75 HP) is at (8,2), and we start around (6-10,19-23) with Athos deployed. Named bosses with drops are scattered across the map.

Part 2 follows straight on, with no Prep screen and HP fully restored: "Kill dragon". The Fire Dragon (ch86, cls46, 120 HP) sits at (12,5). The final blow triggers a scripted cutscene, and the ending and credits follow. B skips the ending dialogue; Start and A only step through it line by line.

**Recruits:**

None.

**Agent notes:**

**s17, attempt 1 (in progress):**
- Prep: Athos holds Durandal, Armads, Sol Katti and Aureola. Give Armads to Hector, Durandal to Eliwood and Sol Katti to Lyn in Prep > Trade (Trd). Hector, Eliwood, Lyn and Athos are forced; there are 12 slots. I swapped Rath out for Harken.
- Do NOT call fe7_wait right after pressing Start at Prep: its A/Start presses suspended the game to the title screen. Resume Chapter brought it back to turn 1 intact.
- Event data (header 0x08CA6720, unit list 0x08CE0024): morph bosses sit sealed in side rooms ("Roof"), and one room opens at the start of each turn. T2 NW (Kenneth/Luce bishop + Gespenst druid + Bolting sage), T3 W (Linus/Basilikos Mt 22 + warrior), T4 E (Rex Hasta General + General), T5 SW (Excalibur sage + Runesword Valkyrie), T6 NE (Lloyd/Regal Blade swordmaster + Brave Sword/Tomahawk hero). Kenneth and the druid never leave their room. The others charge. The SE snipers and Uhai (Rienfleche) are active from T1. No top-gate reinforcements had appeared by T11.
- What worked: the SE alcove (12-14,21-22)+(12,23)+(12,24) has ONE entrance. Oswin standing on (11,24) seals it. Tiles (13,22), (14,21) and (14,22) cannot be hit by anything; the x12 tiles only by range-2 attacks. Pack the soft units in there and carry the fragile ones. Athos (Res 28) blocking (4,24), the SW room's only exit, boxed in the Excalibur sage and the Valkyrie.
- Lloyd (Spd 27, avoid ~69, 23% crit) is the real danger: only Athos (uncarried, 96%) and Oswin hit him reliably. A unit that is CARRYING has its Skl halved (Athos dropped to 71% hit); use "take" to hand the passenger off before attacking.

**s17, attempt 1 — LOST in part 2, then restarted.** Part 1 was won on T29 with no deaths. Part 2 became unwinnable after Athos died (1 death).
- Part 1 details. The gate to Nergal opens when only 3 enemies remain (ASMC 0x08079AB5 counts living enemies; Kenneth + the Gespenst druid were the last two). Opening it spawns 3 Generals right at our south start (7-9,24) and druids at the top corners. A druid with a Berserk staff (range Mag/2 = 10 after moving 6) Berserked Oswin and then Harken. Lyn's Restore cures Berserk. Hand it to Pent early.
- Nergal never moves and never countered. Aureola does 32 to him (62 ATK, effective). Strike, then have Isadora or Marcus rescue the attacker and canto out of his range.
- PART 2 (the Fire Dragon, 120 HP, Def/Res 40 with its stone, (12,5), range 1-3, never moves): its breath does a FLAT 37 that ignores Def and Res. Spd 15 doubles Hector (AS 11 with Armads), so Hector dies on any counter. Lyn's Sol Katti does 0 (Str 9) and Eliwood's Durandal 5 (and he dies). Only Athos's AUREOLA matters: 20 per hit, 6 hits needed. KEEP 6+ AUREOLA USES FOR PART 2. Use Forblaze or other units in part 1 (I burned ~14 uses there). Harken was dropped from part 2 (only 11 deploy).
- Part 2 is a 6-caster bombardment from sealed wall pockets (Bolting, Purge, Sleep, Berserk). Keep everyone in rows 8-9 or the top area outside the dragon's 3-tile range. The cycle that worked: Athos at full HP attacks or sits at distance 2 alone in range (counter 20 on EP), Pent Mends him (Mend = +37), and a rider rescues the healer out of range.
- How Athos died: I issued Pent's Mend and Athos's attack in one batch. The Mend failed ("menu not located"), and Athos attacked at 3 HP. NEVER batch an attack behind a heal it depends on.

**s17, attempt 2 — WON.** Part 1 took 27 turns and part 2 took 8. Hawkeye died on T7 of part 1: he was carrying Louise, and the Hero's Tomahawk doubled him.
- Nergal's Ereshkigal shows "0 uses" but it is unbreakable, and he DOES counter, for 16. His 3 casters and the 2 top druids come out to you after the gate opens. Athos (Res 28) solo-kills them all on counters: Nosferatu does 3 to him, and Berserk has about 6% hit.
- Bait the Kenneth/Luce + Gespenst room with Athos alone at (5,17). Both died attacking him in one enemy phase, and the gate opened.
- The gate spawns 3 weak Generals (Res 8) at (7-9,24). Excalibur, Flux and Armads kill them in one turn.
- Oswin sealing (12,24) in the SE alcove: he takes about 18 per phase from the Rex Hasta General plus the Valkyrie. The Runesword does only about 4 at range 2. Give him Rex Hasta to counter: Lloyd and Linus both died on his counters.
- PART 2 CYCLE (1 hit per turn, no Mends, nobody exposed on enemy phase):
  1. Athos, at 40 HP, attacks from (12,7). He drops to 3.
  2. A rider (Rath or Isadora) rescues him and cantos out of range.
  3. A FOOT unit (Hector or Oswin) takes him and drops him that same turn.
  4. Next turn, Canas (Heal +23) and Pent (Heal +32) refill him, then repeat.
  - A MOUNTED taker gets canto-only (Wait) after Take and cannot drop.
  - A unit dropped this turn cannot act. (A unit dropped the previous turn can.)
- Safe parking in part 2 needs all three: 4+ tiles from the dragon, outside the Bolting/Purge map, and 9+ from the Sleep druid at (4,12). Tiles that qualify: (9,6)-(11,8) area, (12,9), (13,8), (14,7), (8,5), (9,4), (7,4).
