# FE7 RAM Map

Working memory map for **Fire Emblem: The Blazing Blade**, derived by live inspection
through `mcp-mgba` against a running mGBA instance.

Tooling: the forked bridge at `~/Desktop/repos/mcp-mgba` (branch
`feat/memory-search-and-input-sequence`), which adds in-emulator memory search, snapshot
/ diff, and batch input. See Method notes for the workflow these enable.

> **Version-specific.** All addresses below are for the **US** release —
> ROM title `FIREEMBLEME`, game code `AGB-AE7E`. They will not transfer to the JP or
> EU builds without re-deriving.

Every entry is tagged with how much it can be trusted:

| Tag | Meaning |
|-----|---------|
| **Confirmed** | Observed changing as predicted, or cross-validated against two independent sources |
| **Inferred** | Consistent with observation + known FE7 game data, but not directly proven |
| **Unverified** | Single observation, no corroboration — treat as a lead, not a fact |

---

## Memory map

| Structure | Address | Confidence |
|---|---|---|
| Play state (`gPlaySt`) | `0x0202BC00` | Confirmed |
| Cursor position (live) | `0x0202BBCC` | Confirmed |
| Roster mirror array — first entry | `0x020106DC` | Confirmed (purpose Unverified) |
| Last-acted-unit record | `0x0202BD48` | Inferred |
| Player unit array — first entry | `0x0202BD50` | Confirmed |
| Enemy unit array — first entry | `0x0202CEC0` | Confirmed |
| **Green / NPC array — first entry** | `0x0202DCD0` | Confirmed |
| Gold — **candidate only** | `0x0202BC00` | **Unverified** |
| Game mode byte | `0x02025080` | Unverified |
| Menu structs | **dynamic** — `0x020251E8` / `0x020252C0` / `0x02025470` seen | see Menus |
| **Combat forecast — `gBattleActor`** | `0x0203A3F0` | Confirmed |
| **Combat forecast — `gBattleTarget`** | `0x0203A470` | Confirmed |
| **Item / weapon data table (ROM)** | `0x08BE222C` | Confirmed |
| **Staff target-select proc** | **dynamic** — find by ROM script pointer `0x08B96998`; target at `+0x2C` | Confirmed |
| **Movement range grid** — row-pointer table | `0x03000440` (IWRAM) | Confirmed |
| Movement range grid — row data start / stride / row count | **PER CHAPTER — derive, never hardcode** | Confirmed |
| **Map size — `gBmMapSize`** (`u16 width`, `u16 height`) | `0x0202E3D8` | Confirmed |
| **Map layer pointer array** — 7 slots, `&table[2]` each | `0x0202E3DC` | Confirmed |
| **Terrain map — `gBmMapTerrain`** (pointer slot) | `0x0202E3E0` | Confirmed |
| **Unit occupancy map — `gBmMapUnit`** (pointer slot) | `0x0202E3DC` | Confirmed |

Unit structs are **72 bytes (`0x48`)** and packed contiguously.

**The player array begins exactly at `0x0202BD50` — Confirmed.** A byte-pattern search for
character pointers (`BD 08`) backwards from `0x0202BC00` finds nothing before `0x0202BD52`.
This **disproves** the earlier speculation that the true base was `0x0202BD08`.

**Addresses are identical across game modes.** Verified in Hector-mode Ch.22: `"Mark"` still
sits at `0x0202BC18`, and both unit arrays are at the same bases as in Lyn mode. The map in
this document transfers between modes.

### Counting live units cheaply

Every live unit has a character pointer `0x08BD....`, so its high half-word `BD 08` lands at
`slot + 2`. One search returns the population and confirms the stride in a single call:

```
search_memory(bytes=[0xBD, 0x08], address=0x0202BD50, length=4464)
```

Matches come back perfectly strided by `0x48` with no false positives, so the count is exact.
Observed in Ch.22 Hector mode: **29 player units, 35 enemy units.**

The player array has room for 62 slots before it reaches the enemy array at `0x0202CEC0`.

> **Compare the address LIST, not the count.** In Ch.22 the player count stayed at **29** across a
> turn in which one unit died and one reinforcement arrived — `0x0202C3CA` vanished from the list
> while `0x0202C57A` appeared. A stable count is *not* evidence that nothing spawned or died.
> Diff the returned addresses.

### The arrays are NOT strictly contiguous — holes appear mid-chapter — Confirmed

This file used to say the arrays are "packed contiguously, no gaps", and code written against
that assumption breaks. A unit leaving mid-chapter **zeroes its slot while later slots stay
populated**.

Observed live: on turn 2 the player array had an empty slot at index 23 (`0x0202C3CA` — the same
address that vanished in the Ch.22 observation above) while slots 24–29 still held units. A
decoder that stops at the first empty slot silently truncated the roster **30 → 23** and hid
Merlinus entirely, with no error.

**Scan every slot up to the array's bound and skip holes; never stop at the first empty one.**
The bound is where the next array starts (see the green-array section for all three).

Reinforcements do grow the arrays: the enemy array went **35 → 53** in a single enemy phase on
Ch.22 turn 2. Enemy roster indices for reinforcements ran `0xA4`+, so enemy indices are **not**
confined to `0x81`–`0x8F` as the earlier Lyn-mode sample suggested.

---

## Play state fields

| Offset | Address | Size | Field | Confidence |
|---|---|---|---|---|
| `0x07` | `0x0202BC07` | u8 | **Current phase / active faction** — see below | Confirmed |
| `0x08` | `0x0202BC08` | u8 | **Turn counter** | Confirmed |
| `0x0A` | `0x0202BC0A` | u8 | Cursor x, **lazily synced** — see Cursor section | Confirmed |
| `0x0B` | `0x0202BC0B` | u8 | Cursor y, **lazily synced** — see Cursor section | Confirmed |
| `0x18` | `0x0202BC18` | char[] | Tactician name, ASCII, NUL-padded | Confirmed |

**Turn counter** was proven by diff: ending the turn changed only two bytes in the first
128 of the struct, and this one went `01` → `02`. Byte `0x09` stayed `00` throughout, so
it may be the high byte of a u16 — irrelevant in practice, since turn counts don't reach
255.

Re-confirmed in a second session on a freshly restarted chapter, using
`mgba_snapshot_memory` + `mgba_diff_memory` over this 128-byte struct: `01` → `02` again,
on the same offset. That run showed *three* changed bytes rather than two only because
the cursor had been moved in both axes beforehand, so `0x0B` moved as well as `0x0A`.

Tactician name read as `4D 61 72 6B` = `"Mark"` on the save under test. Independently
re-found by `mgba_search_memory(text="Mark", region="EWRAM")`, which returned
`0x0202BC18` plus a second copy at `0x02020160` (purpose of the second copy unknown).

### Phase / active faction — `0x0202BC07` — Confirmed

| Value | Phase |
|---|---|
| `0x00` | Player (blue) |
| `0x40` | NPC / green |
| `0x80` | Enemy (red) |

The **complete cycle** was observed by polling this one byte across a turn boundary in Ch.22:

```
0x00 player (turn 1)  ->  0x80 enemy  ->  0x40 green  ->  0x00 player (turn 2)
```

The turn counter at `+0x08` increments on the return to the player phase, not when the player
phase ends. **The green phase runs even with no green units on the map** — it flashed by in
Lyn Ch.1 too, which is what an earlier session mistook for a "transient flag."

These values line up with the roster-index convention already in this document (player `0x01+`,
enemy `0x81+`), i.e. faction base + index — good independent corroboration.

**This is the correct wait condition for automation.** Poll `0x0202BC07` until it reads `0x00`;
do not rely on the turn counter or on wall-clock delays. A "press end turn, then act" loop that
skips this will issue inputs during the enemy phase, where they are silently swallowed.

### Units refresh at the enemy-phase start, not the player-phase start

Hector's `+0x0C` had gone to `0x42` (spent). By the time the phase byte read `0x80`, it had
already cleared to `0x00`. So a player unit's has-acted flag is wiped when the *enemy* phase
begins — which is why sampling after a full turn transition never shows it set, and is exactly
what misled the earlier `+0x43/+0x45` conclusion.

### Gold — `0x0202BC00` is a CANDIDATE ONLY (Unverified)

In Ch.22 Hector mode, `+0x00` held `0x00001CA8` (7336), a plausible gold total, and it was the
**only** address in EWRAM holding that value — so it's a clean, unambiguous candidate.

**It is not confirmed.** Gold is not displayed on the Preparations screen, so a labeling
screenshot could not settle it. The decisive test is a **spend-and-diff**: snapshot, buy
something at an on-map armoury or vendor, then `diff_memory(predicate="decreased")`. Do not
treat this address as gold until that runs.

---

## Cursor

**Confirmed.** Located by snapshotting EWRAM, pressing a direction, and diffing with
`predicate=increased`, then narrowing the stored candidate set across further moves.

| Address | Size | Field |
|---|---|---|
| `0x0202BBCC` | u16 | Cursor **x** (tile) |
| `0x0202BBCE` | u16 | Cursor **y** (tile) |
| `0x0202BBD4` | u16 | Cursor **x** in pixels (= tile × 16) |
| `0x0202BBD6` | u16 | Cursor **y** in pixels (= tile × 16) |
| `0x02025240` | u8 | Cursor x (mirror) |
| `0x02025241` | u8 | Cursor y (mirror) |

This is the **live** cursor — it updates immediately on a direction press. Prefer
`0x0202BBCC` / `0x0202BBCE`; the pixel pair right after it is a free cross-check
(`192, 144` at tile `(12, 9)`), which is how the identification was confirmed rather
than assumed.

Seven separate EWRAM locations mirror cursor x and all tracked correctly through four
moves, so the game keeps multiple copies:
`0x02025092`, `0x02025240`, `0x02025242`, `0x020252AC`, `0x020252AE`,
`0x0202BBCC`, `0x0202BBD0`.

> **Careful with `0x02025092`.** Its x tracks the cursor, but the byte *after* it
> (`0x02025093`) does **not** hold cursor y — it stayed `7` while the cursor moved to
> y=9. Don't assume an adjacent (x, y) pair just because x is right.

`0x02025090` / `0x02025091` held `(13, 7)` and stayed there while the cursor moved away,
so it tracks **Lyn / the hovered unit**, not cursor history. **Unverified.**

### Lazy sync into the play-state struct

`0x0202BC0A` / `0x0202BC0B` also hold the cursor position, but do **not** update live.
They held `(13, 7)` while the live cursor moved to `(12, 9)`, then snapped to `(12, 9)`
across the field-menu → end-turn transition.

The exact sync trigger is **not** pinned down — the observation spans opening the field
menu *and* ending the turn, so either could be responsible. Use `0x0202BBCC` when you
want the current cursor; treat the play-state copy as a stale snapshot.

### Map bounds

The cursor stops at **x = 14** in the opening Lyn-mode chapter — two Right presses from
x=13 land on 14, not 15. Worth knowing before treating a non-moving cursor as a dropped
input. Map height falls out of the movement grid's row-pointer table — see Movement range.

### The live cursor is a MENU-FOCUS detector — Confirmed

`0x0202BBCC` **does not move while a menu has focus.** A direction press is consumed by the
menu, so the map cursor holds still; with no menu, the same press walks the cursor. That makes
one read before and after a direction press a cheap, non-destructive test for "is a menu
open?", with no snapshot/diff and no risk of committing anything.

Verified on Lyn Ch.7 HM: with a unit's action menu up, `Up` navigated the menu and the cursor
stayed on the unit's tile; on a bare map the same press moved it one tile.

`src/fe7.ts` `commitWait()` relies on this. Its `Up` is *menu* navigation (the action menu
wraps, so one `Up` from the top reaches Wait, the last entry) — but fired at a bare map it
walks the cursor, and the `A` behind it then lands on the board, where empty ground opens the
**field menu whose last entry is End Turn**. That is a silent phase-ender with units unmoved.
So the press is verified rather than blind: press `Up`, re-read the cursor, and only send `A`
if the cursor held.

### Menu entries are named in the text buffer — Confirmed, but see the caveat

`0x0202A5B4` also names the **highlighted menu entry**, not just map contents. Observed on
Lyn Ch.7:

| State | Buffer reads |
|---|---|
| field menu just opened (A on empty ground) | `"End."` |
| a unit's action menu just opened | `"Wait"` |
| after backing out to the map | `"Defeat Heintz."` — the OBJECTIVE |

Two consequences.

**The objective IS readable from memory** (`"Defeat Heintz."`), so a `fe7_objective` tool needs
no new research — only a rule for when the buffer is showing it. It is state-dependent, not
absent; an earlier session caught `"Seize gate"` the same way at a turn boundary.

**⚠️ The field menu opens with End Turn ALREADY HIGHLIGHTED.** The buffer read `"End."` the
instant A was pressed on empty ground. So a single stray A on bare ground puts the phase one
press from ending. This was demonstrated accidentally, by a probe script whose cursor was not
where its author thought — which is exactly how the old `commitWait`/`awaitCommit` retry loops
behaved, only they did it dozens of presses at a time. It is the concrete justification for the
cursor-verification guard in `src/fe7.ts`.

### RESOLVED — the buffer holds the LAST entry RENDERED, not the highlighted one

Tested on Lyn Ch.7 with Lyn walked to `(5,4)`, adjacent to an enemy at `(5,5)`, so her action
menu genuinely contained Attack / Item / Wait. Stepping the highlight with six `Down` presses
left the buffer reading `"Wait"` every single time.

Three menus, three bottom entries:

| Menu | Buffer | Where that entry sits |
|---|---|---|
| field menu | `"End."` | last |
| action menu | `"Wait"` | last |
| item sub-menu | `"Discard."` | last |

The consistent model: `0x0202A5B4` is a **decode staging buffer** holding the most recently
decoded string. Painting a menu decodes its entries top to bottom, so the bottom one is what
remains. Moving a highlight inside the action menu re-renders no text, so nothing new lands and
the string never changes. Item and staff LISTS appear to "track" only because moving that
highlight redraws a description line, which is a genuine new decode.

**Consequences.**

1. **`menuFindEntry(pattern)` by reading labels is DEAD for the action menu.** You cannot learn
   where the highlight is from this buffer. Seize/Visit/Talk/Trade need either the menu's own
   index byte (which `locateMenu`/`menuGoTo` already read and verify) or the menu struct's
   entry-ID array, which is **not yet located — this is the next thing to find.**
2. **It does reliably name a menu's LAST entry**, which independently confirms the assumption
   behind the wrap-to-last-entry trick: Wait really is last on the action menu, End really is
   last on the field menu.
3. ⚠️ **It retro-corrects a claim made earlier the same day.** A Ch.1 `fe7_act(action:'item')`
   returned with the buffer reading `"Discard."`, and that was written up as "the retry loop
   walked the highlight onto Discard, one press from destroying a Vulnerary." **That reading was
   wrong.** `"Discard."` is simply the item sub-menu's bottom entry and says nothing about the
   highlight, which was most likely still on Use — the item did get used (HP 6 -> 16). A guard
   added to `src/fe7.ts` on the strength of it has been removed: it would have fired whenever the
   sub-menu was open, aborting legitimate item uses, while proving nothing.

### Identifying a menu entry WITHOUT pressing anything — Confirmed on two chapters

Since the text buffer only ever names a menu's LAST entry (above), entry identity has to come
from the menu structure itself. It can. Observed on Lyn Ch.7 HM with Lyn at `(5,4)`, adjacent to
an enemy at `(5,5)` and to an ally at `(5,3)`, giving a genuine 4-entry action menu
**Attack / Item / Trade / Wait**.

`fe7_unstick` reported the menu at `0x02024FCD` with 4 entries. Around it:

| Address | Holds |
|---|---|
| `0x02024FCC` | u8 **entry count** (`04`) |
| `0x02024FCD` | u8 **current index** (`00`, highlight on Attack) — the address unstick reports |
| `0x02024FA0` | array of u32 **pointers, one per entry, in menu order** |

Each entry pointer leads to a per-entry struct of stride `0x6C`, and **`+0x30` of that struct is
a ROM pointer that identifies the command**:

**The ROM command pointers — the stable identity, use these:**

| Command | ROM pointer |
|---|---|
| Seize | `0x08B95314` |
| Attack | `0x08B95338` |
| Item | `0x08B9562C` |
| Trade | `0x08B95650` |
| Wait | `0x08B956BC` |

There is also a menu-definition pool in ROM at `0x08B95AAC`, stride `0x24`, with a text pointer
at `+0x08` — the same neighbourhood as the per-command pointers above.

**Why this matters.** It gives a read-only way to answer "which entry is this?", so a
`menuFindEntry` can locate Seize / Visit / Talk / Trade **without pressing A on anything it
cannot name** — which is what the "derive menu indices, do not scan" rule demands and what the
text buffer cannot deliver.

> ⚠️ **The EWRAM addresses above are per-instance and MUST NOT be hardcoded** — menus are
> allocated dynamically and stale copies survive at old addresses looking perfectly plausible.
> Locate the menu by behaviour (the `fe7_unstick` probe already does), then use the *offsets*.
> The stable, reusable part is the **ROM command pointers**, which should be identical across
> chapters and saves.

**Confirmed on a second chapter, 2026-08-28.** Lyn Ch.1, lord on the gate at `(3,2)`, menu
`[Seize, Item, Wait]` — 3 entries against Ch.7's 4. Both offsets held exactly: count at
`menuAddr - 1` read `03`, entry pointers at `menuAddr - 0x2D`.

The decisive control is **Wait**: it read `0x08B956BC` on BOTH chapters, from a different arena
slot in a differently-sized menu. Same command, same pointer. Meanwhile the EWRAM slot
`0x0202547C` held **Attack** on Ch.7 and **Wait** on Ch.1 — so the per-entry struct addresses are
recycled and mean nothing on their own. Identify by the ROM pointer, never by position or
address.

**This is what makes `fe7_act(action:'seize')` work**, and Lyn Ch.1 was completed with it on the
first attempt: the tool read the menu as `[seize, item, wait]`, moved the highlight to index 0,
pressed A once, and the chapter ended. Nothing was ever pressed on an entry the tool could not
name, which is what the "derive menu indices, do not scan" rule demands.

The same primitive should unlock **Visit, Door, Chest, Talk, Rescue and Drop** — each needs one
observation of its menu to learn its ROM pointer, after which it is a constant.

### What the cursor readout contains — Confirmed

With the cursor free on the player phase, the text buffer at `0x0202A5B4` describes **whatever
is under the cursor**, and that is not always terrain. Observed on Lyn Ch.7:

| Cursor on | Buffer reads |
|---|---|
| empty plain | `"Plain."` |
| empty mountain | `"Mntn"` |
| a player unit | `"Lyn."` — the unit's NAME |
| an enemy unit | `"Black Fang"` — the faction |

So **terrain is only readable on EMPTY tiles**; a unit standing there masks it. This is what
`fe7_inspect` exposes, and why that tool returns the string verbatim instead of calling it a
terrain name. Note the buffer also carries objective text (`"Seize gate"`) and menu
descriptions, so the same read means different things in different states — always pair it with
the cursor position and the phase.

> **Caveat — the map edge gives a false "menu open".** At `y = 0`, `Up` is blocked by the
> boundary and the cursor holds still with no menu present, exactly as if one were open. The
> same applies to any direction pressed into an edge. Treat a non-moving cursor as
> *inconclusive* there, not as proof of focus — this is the same trap the "Map bounds" note
> above describes, in a different disguise.

---

## There are exactly three unit arrays

A single search for character pointers across all of EWRAM returns **93 matches in three
perfectly-strided groups** — which is a complete census, not a sample:

| Base | Slots (Ch.22 HM) | What it is |
|---|---|---|
| `0x020106DC` | 29 | **Roster mirror** — byte-identical to the player array at Preparations |
| `0x0202BD50` | 29 | Player array (live, per-chapter) |
| `0x0202CEC0` | 35 | Enemy array |

```
search_memory(bytes=[0xBD, 0x08], region="EWRAM")
```

### There IS a green / NPC array — `0x0202DCD0` — Confirmed (CORRECTION)

This file previously said no NPC array exists, based on a census that found 93 character
pointers all accounted for by three arrays. **That conclusion was wrong** — or rather, it was
correct for a chapter with no green units and got over-generalised. The caveat "re-check on a
map that actually has green units" was the right instinct and it has now been done.

On a chapter that *does* field green units, the same EWRAM census returns **103** pointers in
**four** strided groups. The fourth:

| Base | Slots | What |
|---|---|---|
| `0x0202DCD0` | 7 | **Green / NPC array** — same 72-byte struct, same layout |

Roster indices run **`0x41`–`0x47`** = faction base `0x40` + index, which lines up exactly with
the phase byte (`0x40` = green phase) and with the player `0x01+` / enemy `0x81+` convention.
That agreement across two independent encodings is what makes this Confirmed rather than a
guess.

Array bounds, each set by where the next array begins:

```
player 0x0202BD50 .. 0x0202CEC0  = 62 slots
enemy  0x0202CEC0 .. 0x0202DCD0  = 50 slots
green  0x0202DCD0 .. 0x0202E000  = 11 slots
```

**Green units act on their own during the green phase and fight the enemy.** Observed: an enemy
at `(4,10)` dropped from 30 to 15 HP with no player unit within ten tiles, and a green unit was
simultaneously damaged. If HP changes on units you never touched, the green phase did it.

### Why this mattered more than it looks

Green units are the reason a whole class of moves failed. **They occupy tiles, they appear in
the movement cost map as ordinary pass-through, and they are invisible if you only check the
player and enemy arrays.** A destination holding a green unit reads as reachable and unoccupied,
and then the game silently refuses it — indistinguishable from a dropped input.

Proven with a live control rather than inferred: with a green unit standing on `(10,1)`, a move
there reported "cost 1, unoccupied" and then did not happen — the identical signature to two
earlier failures at `(10,6)` and `(11,6)`. Those two tiles had also returned the terrain name
`"Ostia"`, which looked like a promising explanation and was a **red herring**; the terrain was
irrelevant and the green units were the cause.

> **A legal destination requires all three: `cost != 0xFF`, no unit of ANY of the three
> factions on the tile, and the game not refusing for some further reason.** Checking two of
> the three produces confident wrong answers.

### The roster mirror at `0x020106DC` — purpose Unverified

At Preparations it is byte-for-byte identical to `0x0202BD50`, including pointers, stats,
inventory, and the `x = 0xFF` benched markers.

Two plausible readings: it's the **persistent party list** that survives between chapters
(with `0x0202BD50` as the working copy), or it's a **chapter-start backup** for the
restart-chapter feature. Both predict identical contents at Preparations, so prep can't
distinguish them.

**Test run — it is a FROZEN chapter-start backup. Confirmed.** After Hector moved `(11,2) →
(12,2)` and chose Wait:

| | `+0x0C` flags | x |
|---|---|---|
| Mirror `0x020106E8` | `0x01` | 11 |
| Live `0x0202BD5C` | `0x42` | 12 |

The mirror kept the chapter-start values; a diff over its whole 2304-byte region reported
**zero** changes. So it does not track live state — consistent with backing the
restart-chapter / Suspend feature.

Practical use: it's a free "what did this unit look like at chapter start?" reference — handy
for computing damage taken or distance moved without keeping your own baseline.

---

## Decoded text lives in RAM as plain ASCII — `0x0202A5B4`

**This is the most useful discovery so far.** FE7 decompresses its text into a plain-ASCII
staging buffer, so terrain names, character names, and dialogue can all be **read directly from
memory** rather than inferred or screenshotted.

Strings are terminated by `0x00`, sometimes with a `0x1F` separator byte between them. A single
read of this region returned:

```
"Floor" 1F 00        <- terrain under the cursor
"Nils"  1F 00        <- character name (this chapter's defend target)
"tor!" 01
"We'll serve as your reinfo[rcements]"   <- dialogue
```

### Terrain under the cursor — `0x0202A5B4` — Confirmed

The first string in the buffer is the **terrain name of the tile under the cursor**, and it
updates live as the cursor moves. Verified by moving the cursor and re-reading:

| Cursor | String at `0x0202A5B4` |
|---|---|
| `(11, 3)` | `"Floor"` |
| `(11, 6)` | `"Floor"` |
| `(6, 6)` | `"Wall"` |

### It also yields unit names — Confirmed

Selecting Priscilla put `"Priscilla"` in the same buffer; backing out returned it to `"Floor"`
(the terrain she stands on). So this buffer answers **"who/what is here?"** by name.

That independently confirmed an inference made from raw stats alone: roster slot 10 (17 HP, Def 3,
Res 7, holding item `0x4B`) had been guessed to be a healer, and Priscilla is one.

**Practical consequence:** terrain can be queried by name, one read per tile, with no screenshot
and no need to locate the numeric tile array. To survey terrain, walk the cursor and read this
string. (**Superseded 2026-08-29** as the primary terrain source: the numeric terrain array
is now located at `0x0202E3E0` — see "The map layers". One read gets the whole board with no
cursor walk. This buffer remains the right tool for *naming* a tile and for identifying which
unit occupies it, and it was one of the oracles used to confirm the array.)

**It reads unit names too, which makes it a general "what is on this tile?" probe.** With the
cursor over Hector it returned `"Hector"`; over an empty wall tile, `"Wall"`. Two uses proven in
practice:

- **Pathing.** Hector could not move south from `(12,2)`; probing `(12,3)` returned `"Wall"` and
  `(11,3)` returned `"Floor"`, locating the gap in a wall line without any screenshot.
- **Identification.** Confirms which unit occupies a tile, so you can tell your own units from
  enemies without cross-referencing both arrays by coordinate.

Caveat: this is a **shared staging buffer**, not a dedicated terrain field. Other text passing
through it shifts the layout — an earlier read caught `"Turn"` at this offset during the
turn banner. So read it while the map cursor is idle, and sanity-check that the value looks like
a terrain name.

### Menu labels DO pass through this buffer — **partly wrong, see correction below**

Previously listed here as "worth pursuing, untested". It works: with the unit action menu open
and its highlight on the last entry, `0x0202A5B4` read `57 61 69 74 00` = **`"Wait"`**.

**This closes the last routine use for labeling screenshots.** The highlighted menu entry can be
read by name, so menu navigation no longer depends on the structural argument alone — you can
confirm what you are about to select *before* pressing `A`:

```
locate menu by diff  -> count / index
read 0x0202A5B4      -> the highlighted entry's label, as ASCII
```

Used exactly that way to commit a move: menu struct read `count=3, index=2`, and the text buffer
independently read `"Wait"`. Two unrelated sources agreeing on the same entry, which is a much
stronger guarantee than "Wait is always last" on its own.

#### Correction (2026-08-27): the buffer does NOT track the ACTION-menu highlight

It read `"Wait"` at index **2 of 4** and again at index **0 of 4** on the same menu. The earlier
agreement was a coincidence: `"Wait"` is simply the last label the menu drew, and the action
menu has no per-entry description panel to re-render. **Do not use this buffer to read the
action-menu highlight.**

It *does* track the highlight in lists that have a description panel, which is most of them:

| State | What `0x0202A5B4` holds |
|---|---|
| Action menu | `"Wait"`, always — the last label drawn. Useless |
| Item list / staff list | the highlighted item's **use-description**, updating per highlight (`"Restores HP."` = Heal, `"Restores some HP."` = Vulnerary) |
| Staff target select | `"Select a character to restore HP to."` |
| Rescue target select | `"…unit to rescue."` |
| Trade partner select | `"…unit to trade with."` (start often overwritten) |
| Trade screen, on open | the **partner's name** (`"Raven"`) |
| Trade screen, cursor moved | the **item name** under the cursor (`"Hand axe"`) |
| Refused action | `"There's no need for that."` (Vulnerary at full HP) |
| Level-up | the unit's name, then `"…increased."` |

Menu *labels themselves* are not in EWRAM at all: with the action menu open,
`search_memory(text="Staff")` and `text="Trade"` both returned **0 matches**. They are drawn
straight to VRAM as tiles.

---

## Telling whether the map cursor is under your control

`0x0202BBCC` and `0x0202BBD0` both hold cursor `(x, y)` and **agree while the map cursor is
live**. During dialogue, events, and nested UI they **diverge** — observed `(12,8)` vs `(11,2)`
while inputs were being swallowed, then snapping back into agreement once `B` unwound the state.

Useful as a cheap "can I drive the cursor right now?" probe. **Inferred** — it held across
several transitions but the mechanism isn't understood.

### `0x0202521B` — a real toggle, but NOT a general "modal open" flag

It reliably toggles `0 → 1 → 0`, but it does **not** mean what I first concluded. Observed:

| State | `0x0202521B` |
|---|---|
| Free cursor on the map | `0` |
| `Start` → objective window open | **`1`** |
| `A` on a unit → selection | **`1`** |
| **`A` on empty tile → field menu open** | **`0`** ← breaks the theory |

The field-menu case is decisive: `0x0202517C` read `count=5, index=1, state=1` (unambiguously
open, and `Down` moved its index instead of the cursor) while this flag sat at `0`.

**Do not use it as an "is map input live?" test.** Its actual semantics are unknown — it may
track a unit-info//full-screen panel rather than modality. Recorded as **Unverified**.

> This is the third time a promising single-mechanism theory has failed here (`0x0202BC0A`,
> `+0x43/+0x45`, now this). The pattern in all three: a flag behaved correctly across two or
> three samples, and the fourth sample broke it. Two confirmations is not enough when the
> hypothesis is about *semantics* rather than location.

### The cursor-agreement heuristic also fails

`0x0202BBCC` vs `0x0202BBD0` **agreed** at `(9,7)` while the field menu was open, so agreement
does not imply cursor control either. Demoted to a weak hint at best.

### What actually works: the input-signature probe

The only reliable test found so far. Snapshot the 8 KiB state region at `0x02024000`, press a
direction, and diff:

| Result | Meaning |
|---|---|
| **~41 changes including `0x0202BBCE`** | free cursor — the press moved the cursor |
| **~5 changes including an adjacent index/mirror pair** | a menu is open — the press moved its index |
| **~10 changes, no cursor bytes, no index pair** | input swallowed (event/dialogue/animation) |

Costs three calls, but it distinguishes all three states and simultaneously *locates* the live
menu when there is one.

---

## Unit sprite table — `~0x02039F28` onward (Inferred)

Found incidentally while hunting the movement range. An array of **12-byte records**:

```
+0x00  u32  pointer (into this same table region)
+0x04  u16  pixel x   (= tile x * 16)
+0x06  u16  pixel y   (= tile y * 16)
+0x08  u32  unknown
```

Example record: `58 9F 03 02 | A0 00 20 00 | 82 C0 00 01` — pixel `(160, 32)` = tile `(10,2)`,
which matched a real unit's position.

**This identifies unit `+0x3C`**, previously logged as "pointer, purpose unknown": it points at
that unit's record here. Lyn-mode Lyn's `+0x3C` held `0x02039F28`, and Ch.22 Hector's held the
same value — so the table base is stable across modes.

Also noted, unidentified: `0x0202E000` onward holds **80-byte records** with an incrementing
one-byte ID (`0x4D`, `0x4E`, `0x4F`, … at stride `0x50`).

---

## Movement range — FOUND, table at `0x03000440` in IWRAM — Confirmed

The game's own reachable-tile set, already accounting for terrain cost, class, and blocking
units. One read answers "can this unit reach that tile" for **every tile at once**, before
pressing anything.

### Layout

A table of 4-byte row pointers at `0x03000440`, immediately followed by the row data it
points at. **Only the table address is fixed.** The row count and the row stride are sized to
the map and are allocated fresh at map load, so they differ per chapter:

| Chapter | Rows | Stride | Data start | Data end (excl.) | Table terminator |
|---|---|---|---|---|---|
| Lyn Ch.1 HM "A Girl from the Plains" | 14 | `0x11` (17) | `0x03000478` | `0x03000566` | `0xFFFFFFFF` |
| Lyn Ch.7 HM "Siblings Abroad" | 18 | `0x16` (22) | `0x03000488` | `0x03000614` | `0x00000000` |
| Ch.22 Hector HM | 27 | `0x18` (24) | `0x030004AC` | `0x03000734` | not recorded |

> ⚠️ **Do not hardcode any row of that table.** `src/fe7.ts` originally hardcoded the Ch.22
> numbers (`0x030004AC`, stride 24, 27 rows) as universal constants. On Lyn Ch.1 that misread
> refused legal moves and made the chapter unwinnable; on Lyn Ch.7 the over-read landed in
> zeroed memory, where `0x00` decodes as *cost 0 = legal destination*, and the tool reported
> **319 tiles / 315 legal destinations against a true 39**. The two failure modes are opposite,
> so testing on one map tells you nothing about the next. Fixed 2026-08-28.

### Deriving the geometry — do this on every read

The table ends exactly where its own data begins. That single invariant gives you everything,
and it holds on all three maps above:

```
row_count = (read32(0x03000440) - 0x03000440) / 4     # 14, 18, 27
stride    =  read32(0x03000444) - read32(0x03000440)  # 17, 22, 24
row_base(y) = read32(0x03000440 + 4 * (y + 2))
addr(x, y)  = row_base(y) + x
```

**Never scan for a terminator.** Ch.1 ends the table with `0xFFFFFFFF` and Ch.7 ends it with
`0x00000000`, so no single sentinel works — derive the count from the first pointer instead.

Read exactly `row_count * stride` bytes and not one more. The data begins immediately after
the table, so **one `read_range` starting at `0x03000440` fetches the table and the whole grid
together** (756 bytes even on Ch.22, well under the 4096 cap) — the correct implementation
costs exactly the same one round trip the broken hardcoded one did.

**Map dimensions fall out of this table** — but the borders are NOT symmetric, and getting
this wrong costs legal moves:

```
playable width  = stride    - 2      # 2 trailing columns, no leading column
playable height = row_count - 4      # 2 LEADING rows (the y+2 offset) AND 2 trailing
```

| Chapter | stride / rows | Playable | Evidence |
|---|---|---|---|
| Lyn Ch.1 | 17 / 14 | 15 × 10 | cursor stops at `x = 14`; rows y=10,11 read `0xFF` in every grid decoded |
| Lyn Ch.7 | 22 / 18 | 20 × 14 | cursor stops at `x = 19` and at `y = 13`, confirmed from two separate columns |
| Ch.22 | 24 / 27 | 22 × 23 | formula only — not measured |

Both are **Inferred**. An earlier revision of this section said height = `row_count - 2`, which
is wrong: it was written from the top-border offset alone, before the bottom edge was probed.

> **Never bound array indexing by these.** Index with the RAW `row_count - 2` and `stride`
> straight off the table, and use the playable size only for reporting and for choosing a tile
> to stand on. A too-tight inference silently turns reachable tiles into `0xFF`, which is the
> Ch.1 chapter-ending bug reintroduced from the other direction. `src/fe7.ts` keeps them as
> separate fields (`indexRows`/`stride` vs `height`/`width`) for exactly this reason.

### Indexing — `col = x`, `row = y + 2`

The `+2` is **Confirmed** empirically, on all three maps above. Reading it as two top border
rows (`y = -2`, `y = -1`) is **Inferred** — it explains the offset and matches the usual
FE-GBA bordered-map allocation, but note the border is asymmetric: there is **no** left column
border, `col = x` exactly. Don't assume a symmetric border.

### Values

| Value | Meaning |
|---|---|
| `0x00` | the selected unit's own tile |
| `0x01`–`n` | **movement cost spent** to reach this tile |
| `0xFF` | **not reachable** — out of range *or* blocked by terrain/units, indistinguishable |

The maximum value present is ≤ the unit's Move.

> **`value != 0xFF` is NOT "I can stop here" — corrected.** This is the *pathfinding cost* map,
> not the legal-destination set. It includes tiles occupied by **other units**, which you may
> move *through* but not stop on.
>
> Proven with a same-moment control: with Legault at `(10,3)` selected, row `y=2` read
> `3 2 1 2 3 4` across cols 8–13 — and cols 9, 10, 12, 13 were occupied by four live allies
> (units at `(9,2)`, Eliwood `(10,2)`, Hector `(12,2)`, `(13,2)`). All four carried finite costs.
>
> **The correct legal-destination test is `value != 0xFF` AND no live unit at `(x, y)`** — check
> **all THREE** unit arrays by coordinate (player, enemy, **and green at `0x0202DCD0`**),
> remembering that a corpse (`+0x13 == 0`) does not block. Omitting the green array produces a
> tile that reads reachable-and-unoccupied and is then silently refused; see the green-array
> section. Even with all three checked, a refusal can still happen for reasons not yet mapped,
> so treat a failed move as informative rather than impossible.
>
> **Better, since 2026-08-29: use the unit occupancy map at `0x0202E3DC` instead.** One read
> per tile answers "occupied, and by whom" for all three factions at once, with no array
> scan and no way to forget the green units. See "The map layers".

Terrain cost is also visible in the grid, so don't assume Manhattan. Legault's row `y=6` read
`6 5 4 5 6` at cols 9–13 while plain Manhattan from `(10,3)` would give `3 4 3 4 5` — the direct
route down column 10 was blocked, forcing the path through column 11. **Read the value; never
recompute it as distance.**

### Confirmed on two units with different x *and* y — all on Ch.22 Hector HM

| Unit | Position | Origin (`0x00`) found at | Max value |
|---|---|---|---|
| Hector (roster 01) | `(12, 2)` | row 4, col 12 | 5 |
| Roster 08 (class `0x3C`) | `(10, 3)` | row 5, col 10 | 6 |

Both grids are pure Manhattan distance from the unit, truncated at Move, minus blocked tiles —
every one of ~30 populated cells checked out. Hector's grid, in game coordinates:

```
y=0        9,10,11,12,13 =  5  4  3  2  3
y=1      8,9,10,11,12,13 =  5  4  3  2  1  2
y=2      8,9,10,11,12,13 =  4  3  2  1  0  1   <- Hector at (12,2)
y=3           10,11      =  3  2      (12,3) is FF
y=4           10,11      =  4  3
y=5              11      =  4
y=6              11      =  5
```

> **Provenance:** every observation in this subsection is **Ch.22 Hector HM only**. It is
> rigorous along the axes it varied — two units, different x and y, ~30 cells, an independent
> cross-check — and it is precisely because it never varied the *map* that the Ch.22 stride was
> mistaken for a universal constant. The connectivity of these grids is what proves stride 24
> was genuinely right *there*: a wrong stride shears rows into diagonal streaks and throws the
> `0x00` origin off the map, which is exactly how the Ch.1 misread announced itself.

**Independent cross-validation.** This grid marks `(12,3)` unreachable while `(11,3)` costs 2 —
and an earlier session had probed those exact two tiles through the decoded text buffer and read
`"Wall"` and `"Floor"`. Two unrelated sources agreeing on the same two tiles is what upgrades
this from "plausible layout" to Confirmed.

It also **settles the old Hector-won't-move puzzle**: `(11,3)` was reachable at cost 2, so the
failed move was neither range nor terrain. Dropped/ignored input remains the only live
explanation.

### Trap: the buffer is NOT cleared on deselect — Confirmed

After `B` deselected the unit (`+0x0C` low byte back to `0x00`), the grid **still held that
unit's data**, on two successive reads seconds apart. It is zeroed at map init and thereafter
only ever overwritten by the next selection.

> **Gate every read of this grid on `+0x0C` bit 0 of the unit you think is selected.** Reading it
> while nothing is selected returns a stale, entirely plausible-looking map for whichever unit
> was picked up last — a silent wrong answer, not an obvious one.

### The map layers — SOLVED 2026-08-29. Seven of them, all statically addressed

**This supersedes the old "a second map layer exists, purpose unknown" note.** The movement
grid is one of **seven** identically-shaped map layers, and the game keeps a pointer to each
in a fixed 7-entry array. Terrain is layer 2.

#### The pointer array — `0x0202E3DC` — Confirmed

| Slot | GBAFE name | Points into | Contents on Ch.22 |
|---|---|---|---|
| `0x0202E3DC` | `gBmMapUnit` | table `0x0202E3F8` | **unit occupancy** — Confirmed |
| `0x0202E3E0` | `gBmMapTerrain` | table `0x0202EBB0` | **terrain IDs** — Confirmed |
| `0x0202E3E4` | `gBmMapMovement` | table `0x03000440` | movement cost — Confirmed (the grid documented above) |
| `0x0202E3E8` | `gBmMapRange` | table `0x03000BF8` | selected unit's attack-range overlay — Unverified |
| `0x0202E3EC` | `gBmMapFog` | table `0x0202F368` | uniformly `0x01` — Inferred (no fog on this map) |
| `0x0202E3F0` | `gBmMapHidden` | table `0x0202FB20` | all zeros — Unverified |
| `0x0202E3F4` | `gBmMapOther` | table `0x020302D8` | all zeros — Unverified (this is the old "second layer") |

The names come from the canonical GBAFE ordering. The first **three** are content-verified,
which is what makes the ordering itself trustworthy; the last three are named by position only.

Each slot holds `table + 8`, i.e. `&table[2]` — **the `+2` border row offset is already baked
in**, so you never touch it:

```
width   = read16(0x0202E3D8)          # gBmMapSize.width
height  = read16(0x0202E3DA)          # gBmMapSize.height
tile(layer, x, y) = read8( read32( read32(layer_slot) + 4*y ) + x )
```

Note the **double** indirection: dereference the slot to get the row-pointer array, *then*
index it. Reading `read32(slot + 4*y)` instead walks the pointer array itself and returns a
grid shifted by 9 rows — a plausible-looking wrong answer, and the one bug this cost.

#### Why these addresses are safe to hardcode — Confirmed

Unlike the row count and stride, the table bases are **ROM literals**, sitting together in the
map-init function's literal pool. Read straight out of the ROM file:

```
0x08018E44: 0x0202E3F8  unit table       0x08018E48: 0x0202E3DC  &gBmMapUnit
0x08018E4C: 0x0202E3D8  &gBmMapSize
0x08018E50: 0x0202EBB0  terrain table    0x08018E54: 0x0202E3E0  &gBmMapTerrain
0x08018E58: 0x03000440  movement table   0x08018E5C: 0x0202E3E4  &gBmMapMovement
0x08018E60: 0x03000BF8  range table      0x08018E64: 0x0202E3E8  &gBmMapRange
0x08018E68: 0x0202F368  fog table        0x08018E6C: 0x0202E3EC  &gBmMapFog
0x08018E70: 0x0202FB20  hidden table     0x08018E74: 0x0202E3F0  &gBmMapHidden
0x08018E78: 0x020302D8  other table      0x08018E7C: 0x0202E3F4  &gBmMapOther
```

They are compile-time constants, so they cannot vary per chapter — which is a stronger
guarantee than any two-map sample. **What still varies per chapter is the geometry**, and the
recipe above never uses it. The five EWRAM tables are spaced a fixed `0x7B8` apart.

> **Provenance.** The *addresses*, the *pointer-array convention* and *`gBmMapSize`* are
> **Confirmed on two maps**: Ch.22 "Kinship's Bond" Hector HM (22 × 23) and Lyn Ch.7
> "Siblings Abroad" (20 × 14), plus the ROM literal pool. They also survived a hard reset
> and a save-file reload.
>
> The *terrain-content* verification — the ten oracle-checked tiles, the causal write test,
> the ID → name sweep — is **Ch.22 only**. Ch.7's terrain array decodes as a coherent
> outdoor map in the same encoding (a contiguous `0x11`/`0x12` mountain range, `0x10` River
> with `0x13` Bridge tiles sitting inside it at (17,4), (13,5), (11,9), (13,12), `0x0A`
> Fort ×4, `0x05` House, `0x07` Vendor, `0x26` Cliff on a diagonal, and `0x03` Village at
> (17,2) on a chapter known to have a village).
>
> **Upgraded to Confirmed on Ch.7, 2026-08-29.** Five tiles oracle-checked against
> `fe7_inspect`, five distinct terrain types, none of which occurs in Ch.22's castle set:
> `(0,0)` `0x11`→"Mntn", `(2,3)` `0x0C`→"Forest", `(7,4)` `0x0A`→"Fort", `(10,4)` `0x10`→
> "River.", `(17,2)` `0x03`→"Village." — 5/5. So the encoding is now confirmed on two
> chapters and on outdoor terrain, not just castle interior.
>
> A sixth check demonstrates the layer's advantage over the cursor: the array reads `0x23`
> **Gate** at `(7,10)` while `fe7_inspect` there returns `"Heintz"`, the boss standing on it.
> **The terrain layer sees through units; the cursor readout cannot.** Note also that this is
> a "Defeat Heintz" chapter that still has a gate, so a Gate tile does NOT imply a Seize
> objective — read the objective separately.

#### Map dimensions are now a direct read — Confirmed on two maps

`gBmMapSize` at `0x0202E3D8` is `u16 width` then `u16 height`. This upgrades the old
**Inferred** dimension formulas to a **Confirmed** single read — keep the formulas as a
cross-check, prefer the read.

**Field order verified on two maps with opposite aspect ratios**, which is what makes it
safe. Ch.22 is taller than wide, Ch.7 is wider than tall; a swapped decode would have been
obvious on at least one of them:

| Chapter | bytes at `0x0202E3D8` | width | height | terrain table `stride-2` / `rows-4` | movement table |
|---|---|---|---|---|---|
| Ch.22 "Kinship's Bond" HM | `16 00 17 00` | 22 | 23 | 22 / 23 | 27 rows, stride 24 |
| Lyn Ch.7 "Siblings Abroad" | `14 00 0E 00` | 20 | 14 | 20 / 14 | 18 rows, stride 22 |

Both agree exactly with the movement-grid derivation and with this file's previously
recorded Ch.7 geometry. The bounds are also exactly right in both directions on Ch.7: the
two pad bytes ending each row are `00 00`, and row `y = height` — the first row past the
map — is entirely zero. Indexing with `gBmMapSize` reads all the real data and none of the
padding.

> **The pointer array is byte-identical on both chapters** (`0x0202E400`, `0x0202EBB8`,
> `0x03000448`, `0x03000C00`, `0x0202F370`, `0x0202FB28`, `0x020302E0`). Expected, since
> each slot is `&table[2]` — an offset of two *pointers*, independent of map size — but it
> means the static-base claim is now confirmed live on two differently-sized maps, not only
> from the ROM literal pool.

#### Terrain map — `0x0202E3E0` — Confirmed

Values are standard GBAFE terrain IDs, one byte per tile, valid range **`0x00`–`0x40`**.
Verification on Ch.22, four independent ways:

1. **Ten tiles, ten distinct terrain values, all matching `fe7_inspect`'s cursor readout**:
   `(18,0)=0x01 "Plain."`, `(0,8)=0x0C "Forest"`, `(12,2)=0x17 "Floor."`,
   `(12,3)=0x1A "Wall"`, `(15,11)=0x1B "Wall"`, `(13,7)=0x1D "Pillar"`,
   `(17,9)=0x1E "Door"`, `(4,17)=0x21 "Chest."`, `(11,5)=0x2D "Stairs"`,
   `(9,4)=0x3F "Brace."`.
2. **Against this file's own combat-forecast readings on the same chapter.** The forecast
   section records terrain `29` at `(8,7)` and terrain `23` at `(9,6)` and `(11,6)`; the
   array reads `0x1D`, `0x17`, `0x17` there. Two sessions, two unrelated mechanisms.
3. **Against `fe7_reachable`.** Every Wall (`0x1A`/`0x1B`) and Brace (`0x3F`) tile in range
   is `0xFF`; Floor / Plain / Stairs all cost 1 per step.
4. **Causally — write to it and the game obeys.** The decisive test:

```
write8(terrain(12,2), 0x0C)   # Forest onto a Floor tile
write8(terrain(11,3), 0x1A)   # Wall onto Hector's only route south
```
> then `fe7_inspect` reads `"Forest"` / `"Wall"`, `fe7_reachable(slot 0)` shows (12,2) go
> **cost 1 → 2**, (11,3) go **cost 2 → unreachable**, and (11,5) go **3 → 5** as the path
> detours. Restore with a state load. This proves it is the live array the pathfinder reads,
> not a render cache.

**The terrain array is mutable during a chapter — Unverified.** On Ch.22, `(10,4)` and
`(11,4)` read `0x1A` (Wall) at the Preparations screen and `0x17` (Floor) on turn 1, with
the rest of the grid identical. Something in the opening event opens that gap. Do not cache
the terrain map across turns.

#### Terrain ID → name — the complete table, Confirmed

Read out of the game by writing each ID into an empty tile and reading the cursor readout at
`0x0202A5B4`. Strings are verbatim, including the trailing separator dot the readout carries.

| ID | Name | ID | Name | ID | Name | ID | Name |
|---|---|---|---|---|---|---|---|
| `0x00` | `..` (none) | `0x11` | Mntn | `0x22` | Roof | `0x33` | Snag |
| `0x01` | Plain | `0x12` | Peak | `0x23` | Gate | `0x34` | Bridge |
| `0x02` | Road | `0x13` | Bridge | `0x24` | Church | `0x35` | Sky |
| `0x03` | Village | `0x14` | Bridge | `0x25` | Ruins | `0x36` | Deeps |
| `0x04` | Village | `0x15` | Sea | `0x26` | Cliff | `0x37` | Ruins |
| `0x05` | House | `0x16` | Lake | `0x27` | Ballista | `0x38` | Inn |
| `0x06` | Armory | `0x17` | **Floor** | `0x28` | Long B | `0x39` | Barrel |
| `0x07` | Vendor | `0x18` | Floor | `0x29` | Killer B | `0x3A` | Bone |
| `0x08` | Arena | `0x19` | Fence | `0x2A` | Flat | `0x3B` | Dark |
| `0x09` | C.Room | `0x1A` | **Wall** | `0x2B` | Wreck | `0x3C` | Water |
| `0x0A` | Fort | `0x1B` | Wall | `0x2C` | `..` (none) | `0x3D` | Gunnel |
| `0x0B` | Gate | `0x1C` | Rubble | `0x2D` | Stairs | `0x3E` | Deck |
| `0x0C` | **Forest** | `0x1D` | **Pillar** | `0x2E` | `..` (none) | `0x3F` | Brace |
| `0x0D` | Thicket | `0x1E` | Door | `0x2F` | Glacier | `0x40` | Mast |
| `0x0E` | Sand | `0x1F` | Throne | `0x30` | Arena | | |
| `0x0F` | Desert | `0x20` | Chest | `0x31` | Valley | | |
| `0x10` | River | `0x21` | Chest | `0x32` | Fence | | |

> **`0x41` and above are out of range.** `0x41` yields an empty string; `0x42` and beyond
> return garbage, hang the cursor readout, or **crash the game outright** (unit arrays fill
> with `cls-1` / HP 8/183 / coords (28,215), `gBmMapSize` reads `27649 x 18464`). If you
> write terrain IDs, clamp to `0x00`–`0x40` and save a state first.

#### Unit occupancy map — `0x0202E3DC` — Confirmed

`tile(x,y)` holds the **deployment ID** of the unit standing there, i.e. the unit struct's
`+0x0B` field: `0x01+` player, `0x41+` green, `0x81+` enemy, `0x00` empty.

Exhaustively cross-checked on Ch.22 turn 1: all **55** live units across the three arrays
appear at their own coordinates with a value equal to their `+0x0B`, and **zero** nonzero
cells have no live unit behind them. That makes it a strictly better occupancy test than
scanning three sparse arrays by coordinate — one read answers "is this tile occupied, and by
whom", including the green units that have silently broken moves before.

#### Range overlay — `0x0202E3E8` — Unverified

Populated when a unit is selected, with counts (1–7) over the tiles that unit can attack or
staff — the red/blue tile display. Selecting slot 10 (a staff user at `(9,6)`, Move 5)
produced a diamond of radius 6 centred on it. **Not cleared on deselect**, the same trap the
movement grid has. Whether the value is genuinely "number of covering attack positions" is
not established.

#### Tile-graphic map — `0x02032E90` — Unverified

Also a row-pointer table, but **24 rows of 44 bytes = 22 `u16` per row** — one 16-bit tile
graphic index per tile, not a terrain byte. Its base is likewise a ROM literal
(`0x08B932B4`). Row/column origin not established; do not assume the same `+2` convention.

#### Negative results — do not repeat

- `0x0202FB20` and `0x020302D8` are all zeros on Ch.22 turn 1; `0x020302D8` was already all
  zeros on Ch.7. `0x0202F368` is uniformly `0x01`. None of the three is terrain.
- `0x03000438` still holds a copy of `0x020302D8`, and `0x03000400`–`0x03000437` is still
  zeros. That IWRAM slot is a stale single cache, not the catalogue — the catalogue is
  `0x0202E3DC`.
- Searching the ROM for a flat `[terrainId] -> avoid` or `-> def` byte table **failed**.
  Filters keyed on `tbl[0x0C]==20 && tbl[0x1D]==20 && tbl[0x17]==0` (avoid) returned zero
  hits; the Def variant returned two, neither plausible. Either FE7 does not store these as
  flat per-ID arrays or the assumed bonus values are wrong. Read the bonuses from
  `BattleUnit +0x56/+0x57` instead.

#### How to re-find all of this in one minute

```
read32(0x0202E3DC .. 0x0202E3F4)   -> the 7 layer pointers
read16(0x0202E3D8), read16(0x0202E3DA) -> 22, 23 on Ch.22
p = read32(0x0202E3E0)             -> 0x0202EBB8 on Ch.22
read8(read32(p + 4*2) + 12)        -> 0x17 at (12,2), and fe7_inspect says "Floor."
read8(read32(p + 4*3) + 12)        -> 0x1A at (12,3), and fe7_inspect says "Wall"
```

### How it was found — noise cancellation

The earlier failure was measurement, not hypothesis. The recipe:

```
1. snapshot IWRAM as "base"          (nothing selected)
2. wait, then diff "base" -> store_as "noise"   <- this IS the noise floor
3. press A to select a unit
4. diff "base" exclude="noise"                  <- survivors are signal
```

| Measurement | Count |
|---|---|
| IWRAM bytes that churn while **idle** | **3402** of 32768 (~10%) |
| IWRAM changes on selection, raw | 4466 |
| IWRAM changes on selection, noise-cancelled | **1147** |
| EWRAM bytes that churn while idle | **9** |

The earlier session's "3580 changes on selection, IWRAM is hopeless" was **almost entirely the
idle noise floor**. The real signal was ~1100 addresses and the grid was contiguous and obvious
the moment the floor was subtracted. IWRAM is perfectly tractable with `exclude=`.

---

## Moving a unit — verified end-to-end procedure

Ran successfully start to finish: Legault `(10,3)` → `(11,6)`, a 4-cost move routed around a
blocked column. Every step is confirmed **by effect**, so a failure is attributable to the step
that failed rather than to the action as a whole.

```
 1. read 0x0202BC07                  -> must be 0x00 (player phase) or input is swallowed
 2. read unit +0x0C low byte         -> must be 0x00 (not yet acted) -- BASELINE, before input
 3. move cursor onto the unit, press A
 4. read unit +0x0C bit 0            -> 1 confirms selection landed
 5. read the movement grid row       -> row_ptr = read32(0x03000448 + 4*y); addr = row_ptr + x
    destination legal iff value != 0xFF AND no live unit on that tile
 6. move cursor to destination, verify 0x0202BBCC/0x0202BBCE
 7. press A
 8. read unit +0x10/+0x11            -> now the destination; action menu is open, +0x0C bit 0 still 1
 9. locate the action menu by diff (snapshot, press Up, diff -> adjacent index/mirror pair)
    count is at (index address - 1); Up from index 0 wraps to the last entry
10. read 0x0202A5B4                  -> confirm the highlighted label reads "Wait"
11. press A
12. read unit +0x0C low byte         -> 0x42 confirms the action committed
    read 0x0202BD48                  -> roster index of the unit + the tile it moved FROM
```

Observed at step 12: `+0x0C = 0x42`, position `(11,6)`, and `0x0202BD48` = `08 00 00 00 | 0A 00 |
03 00` — roster 8, origin `(10,3)`. The last-acted record stores the **origin**, as documented.

**Step 5 is the one that changes everything.** It converts "press A and see whether anything
happened" into a checkable prediction. The previous session's Hector failure was
undiagnosable precisely because it lacked this step — out of range, blocked path, and dropped
input all produced the same null result. With the grid read first, a move that fails despite a
non-`0xFF` destination is *necessarily* an input problem.

---

## Unit actions — staff, item, trade — verified end-to-end (2026-08-27)

Same standard as the move procedure above: every step confirmed by effect, so a failure is
attributable to the step that failed. Derived on Ch. (Hector mode) turn 5. Full working log:
`attempts/8.27.2026_staff_item_trade.md`.

### The action menu's entry order — Confirmed

FE7 builds the unit action menu by fixed priority and omits entries that don't apply, so the
**count tells you which entries are present** once you know the order. Probed entry by entry
with `A` … `B` on a 5-entry menu:

```
Attack, Staff, Rescue, Item, Trade, …, Wait   <- Wait is always LAST
```

| Unit / situation | Count | Entries |
|---|---|---|
| Lyn (11,4), no adjacent enemy, has items, adjacent allies | 3 | `Item`, `Trade`, `Wait` |
| Lucius (11,2), staff + one wounded adjacent ally | 4 | `Staff`, `Item`, `Trade`, `Wait` |
| Lucius (10,2), staff + green NPC and ally adjacent | 5 | `Staff`, …, `Item`, `Trade`, `Wait` |
| Hector (11,6), adjacent enemy + three adjacent allies | 5 | `Attack`, `Rescue`, `Item`, `Trade`, `Wait` |

Hector's menu was pinned directly: index 0 opened a weapon list of **count 3** (his three
usable axes, out of four carried items) = `Attack`; index 1 put `"…unit to rescue."` in the
ASCII buffer = `Rescue`; index 3 put `"…unit to trade with."` there and then the trade screen
= `Trade`. Indices 2 and 4 follow by elimination.

> **Do not hardcode an index.** Derive it from the count plus the order above, then *verify by
> effect* before committing — the count changes with adjacency and terrain, and the 5-entry
> Lucius case has an unidentified extra entry (see Open questions).

### Identifying a submenu once you press `A`

All of `Attack` / `Staff` / `Item` / `Rescue` / `Trade` are recoverable with `B`. Only `Wait`
commits. Distinguishing signatures, all read from memory:

| Entry | Signature after `A` |
|---|---|
| `Attack` | new menu, count = number of **equippable weapons** |
| `Staff` | new menu, count = number of **staves** (weapon type 4) in inventory; ASCII holds that staff's use-description |
| `Item` | new menu, count = number of **items**; index == inventory slot index exactly |
| `Rescue` | no menu; ASCII contains `"unit to rescue."` |
| `Trade` | no menu; ASCII contains `"unit to trade with."` |

### Staff use

```
 1. 0x0202BC07 == 0x00                         player phase
 2. unit +0x0C low byte == 0x00                BASELINE, before any input
 3. cursor onto the unit, A                    -> +0x0C bit 0 == 1
 4. read movement grid, move, A                -> +0x10/+0x11 == destination
 5. locate the action menu by diff             -> count; index 0 is Staff when count says so
 6. A                                          -> ASCII 0x0202A5B4 reads the staff's
                                                  use-description ("Restores HP." for Heal)
 7. navigate the staff list (count == staves), A
                                               -> ASCII reads
                                                  "Select a character to restore HP to."
 8. read the target pointer (below); Left/Right to cycle; re-read to confirm
 9. A                                          -> target +0x13 rises
10. press A until unit +0x0C bit 1 sets        -> a LEVEL-UP screen can block here
11. confirm: staff uses -1, staff moved to inventory slot 0, weapon rank +2
```

**Heal amount = 10 + the user's Str/Mag.** Predicted-then-observed twice: Bartre `4 → 27` and
a second unit `10 → 33`, both with Lucius at Str 13.

**Green / NPC units are valid staff targets** — Confirmed; the initial highlight at (10,2) was
`0x0202DCD0`, slot 0 of the green array.

### Item use (Vulnerary)

Self-targeted; there is **no target-select step**.

```
action menu -> Item -> item list (index == inventory slot) -> A
  -> item sub-menu, count 3, index 0 = "Use"
  -> A
```

Confirmed by a 4 KiB diff over `0x0202BB00`:

```
unit +0x0C  0x01 -> 0x02      spent
unit +0x13  10   -> 20        Vulnerary restores a FLAT 10, not Str-scaled
unit +0x25  2    -> 1         uses, decremented IN PLACE (no inventory reorder)
```

**A full-HP control was run.** With the user at 27/27 the menu counts were identical (3 / 4 / 3)
and index 0 was still `Use`, but pressing `A` changed **nothing** in the 4 KiB unit window and
the ASCII buffer read `"There's no need for that."`. So the sub-menu shape does not tell you
whether the item is usable — **verify the effect**, and treat an unchanged `+0x13` plus that
string as a refusal.

### Trade

`Trade` does **not** consume the action: after `B` exits the trade screen the unit's `+0x0C` is
still `0x01` and the action menu re-opens, so you can trade *and then* attack or wait.

Partner selection behaves like staff targeting — `Left`/`Right` cycle, and the highlighted
partner is readable (below). Opening the screen puts the **partner's name** in the ASCII buffer
(`"Raven"`), which is a free cross-check.

Trade screen driving. The two cursor fields sit inside a dynamically-allocated struct, so
locate them by diff (`Down` moves the row byte; `Left`/`Right` moves the column byte):

```
column byte   0 = the acting unit, 1 = the partner
row byte      0-based row within the current column, wraps
A on an acting-unit item  -> auto-jumps to column 1
A on a partner item       -> auto-jumps to column 0, row = first empty slot
Left/Right                -> switch column; a no-op if already there
```

Confirmed cross-unit transfer, predicted before pressing:

```
before   Hector  1F 0B | 28 0B | 3E 23 | 28 06 | 00 00
         Raven   0D 0F | 28 14 | 28 14 | 00 00 | 00 00
after    Hector  1F 0B | 28 0B | 3E 23 | 28 06 | 28 14
         Raven   0D 0F | 28 14 | 00 00 | 00 00 | 00 00
```

The donor's list **compacts**; the receiver's item lands in its first empty slot. The change is
already committed in the unit structs before `B` is pressed. **The only trustworthy check is
reading both units' 10-byte inventory blocks at `+0x1E` before and after.**

### Target readback — how to know which unit is highlighted

`gBattleTarget` is **not** the answer for staves: during staff target select
`0x0203A474` (its class pointer, the documented staleness gate) reads `0`, correctly reporting
the pair as stale. It *is* populated once the staff resolves, so it works as an after-the-fact
record, not a pre-commit readback.

**(a) Signature lookup — staff target select only, Confirmed.** The proc that runs staff
targeting has ROM script pointer `0x08B96998` at its `+0x00`, and the highlighted target's
unit-struct pointer at `+0x2C`:

```
search_memory(bytes=[0x98,0x69,0xB9,0x08], region="EWRAM", align=4)
    -> exactly 1 match while in staff target select
    -> exactly 0 matches otherwise            <- so it doubles as the state gate
target_unit = read32(match + 0x2C)
```

Samples: proc at `0x02025338` → `0x0202BEB8` (Bartre); proc at `0x0202511C` → `0x0202DCD0`
(green NPC), then `0x0202BF00` after one `Right`. The **proc address is dynamic** — search for
the signature, never hardcode.

**(b) Diff lookup — general, Confirmed on three different selection states.** In *any*
unit-target selection, one 4-byte EWRAM slot holds the highlighted unit's struct address and it
is what moves on a direction press:

```
snapshot_memory(address=0x02024000, length=8192)
press Right
diff_memory(predicate="changed", width=4)
   -> the entry whose before/after are both 0x0202xxxx unit-struct addresses is the highlight
```

Located `0x02025148` (staff target), `0x02024F2C` (trade partner) and `0x020251B4` (rescue
target) this way. This is the readback `fe7_act(action:"attack")` has been missing, and it
generalises to attack target cycling.

> **Trap, already sprung once.** `0x020253D0` — the trade proc's `+0x28` — holds the
> **initial** partner and then goes stale. It stayed on Raven across three `Right` presses
> while the real highlight moved to two other units. Location is not semantics; use (b).

### A level-up blocks the spent flag — Confirmed

After the second heal, `+0x0C` stayed at `0x01` and the staff uses stayed unchanged across two
consecutive reads. The ASCII buffer read `"Lucius"` and `"…increased."` — a level-up screen was
up. Three `A` presses later the action committed: level `2 → 3`, exp `99 → 4`, Skl `+1`, staff
uses `6 → 5`, `+0x0C → 0x02`.

**Poll `+0x0C` bit 1 and keep pressing `A` until it sets.** A single post-action read is not
enough, and this will hit any action that grants experience.


---

## Menus

Every menu shares one struct layout:

```
+0x00  u8  entry count
+0x01  u8  highlight index (0-based, WRAPS)
+0x02  u8  index mirror
+0x03  u8  state -- 0x01 seen while open, 0x05 after dismissal (UNRELIABLE, see below)
```

**Indices wrap.** Up from index 0 on the 5-entry field menu lands on 4. This is what makes
`["A", "Up", "A"]` a structurally safe end-turn: from the top entry, one Up can only reach
`Unit` or `End`, never `Suspend`. Verified from memory.

### Menus are allocated dynamically — do NOT hardcode the address

Observed slots: `0x020251E8`, `0x020252C0`, `0x02025470`, and — in one 2026-08-27 session, for
the **action menu alone** — `0x0202532C`, `0x02024F60`, `0x020256F8`, `0x020250A4`. The *same*
logical menu appears in a different slot almost every time. Sub-menus and item lists shared the
same arena (`0x02025548`, `0x020255B4`, `0x020256F8` all seen).

`+0x03` is **not** a trustworthy open/closed test, and it fails in *both* directions:
`0x020251E8` read `0x05` while its menu was demonstrably live, and the item sub-menu read
`03 01 01 00` — state `0x00` — while it was the menu accepting input.

Stale copies survive. `0x020252C0` still held a plausible-looking `03 00 00 05` sub-menu while
the live sub-menu was at `0x020256F8`. Reading the address you used last time gives a
believable wrong answer, not an obvious one.

**Locate the live menu by behaviour instead** (3 calls, always correct):

```
snapshot_memory(address=0x02024000, length=8192)   # the UI arena; EWRAM-wide also works
press Down
diff_memory(predicate="changed", width=1)
   -> index byte + its mirror appear as an adjacent pair
   -> entry count is at (index address - 1)
```

> **Diff twice.** `press_sequence` returns when the input queue drains, not when the game has
> settled. The first diff after a press routinely catches a mid-transition frame — 30-70
> changes of sprite/OAM churn with no index pair in sight. Re-running the *same* diff a moment
> later returned the settled 4-7 changes with the pair obvious. This burned three lookups
> before it was recognised.

**Idle noise floor for the 8 KiB window at `0x02024000` is ~5 bytes**: `0x02024C84`,
`0x02024C8A`, `0x02024C8B`, plus one 16-bit counter whose address moves with allocation
(`0x02025154/55`, `0x02025010/11`, `0x020253DC/DD` all observed). Everything else in a
post-direction-press diff is signal.

Also useful as a cross-check: the highlight is drawn as tile rows near `0x020235A4` /
`0x02023624` with stride `0x80`, so a menu move shows up there too.

### Known menu contents

| Menu | Entries | Order |
|---|---|---|
| Field menu (cursor on empty tile) | 5 | `Unit`, `Status`, `Options`, **`Suspend`**, `End` |
| Unit action menu (Lyn, no adjacent enemy) | 2 | `Item`, `Wait` |
| Item list | = item count | the unit's inventory slots, **index == slot index** |
| Staff list | = staff count | only items of weapon type 4, in inventory order |
| Attack weapon list | = equippable weapons | subset of the inventory |
| Item sub-menu (after picking an item) | 3 | `Use`/`Equip`, …, and `Discard` last |
| **Preparations menu** | 5 | `Pick Units`, `Trade`, `Fortune`, `Check Map`, `Save` |

Full action-menu ordering (`Attack, Staff, Rescue, Item, Trade, …, Wait`) and the per-entry
signatures are in **Unit actions — staff, item, trade**, above.

### The Preparations menu uses a DIFFERENT layout

Not every menu follows the in-map struct. The prep menu stores:

```
0x0202543A  u8  highlight index
0x0202543B  u8  entry count (5)
```

Count comes **after** index here, the reverse of in-map menus. Verified by stepping the index
`0 → 1 → 2` and back to `1`, with the count byte holding steady at `5`.

Takeaway: **don't assume the layout — find the index by diff and then look at neighbours in
both directions** to work out where the count lives.

Action-menu and item-list labels **Confirmed** by labeling screenshot. Entry count varies with
context — expect a third action-menu entry (`Attack`) when an enemy is in range. FE7 orders the
action menu by priority with `Wait` always last, so **index = count-1 is reliably `Wait`**.

---

## Game mode byte — `0x02025080` (Unverified)

| Value | Meaning |
|---|---|
| `0x01` | map, cursor free *or* unit selected |
| `0x1A` | unit action in progress (after confirming a move) |
| `0x00` | seen with byte `+0x01 = 0x02` while a submenu was open |

Selecting a unit does **not** change this byte — use unit `+0x0C` bit 0 for that. Useful as a
cheap "did the game state move at all?" probe, but too coarse to identify a specific screen.

---

## Unit struct

Offsets are relative to the start of each 72-byte entry.

```
0x00  u32   character data pointer  -> ROM (0x08xxxxxx)
0x04  u32   class data pointer      -> ROM (0x08xxxxxx)
0x08  u8    level
0x09  u8    exp            (0xFF on enemies = does not accrue exp)
0x0A  u8    unknown        (0x00 in all observations)
0x0B  u8    roster index   (player 0x01+, enemy 0x81+)
0x0C  u32   state flags    (0x00400000 base; bit 0 = unit is selected/in motion)
0x10  u8    x position
0x11  u8    y position
0x12  u8    max HP
0x13  u8    current HP
0x14  u8    Str
0x15  u8    Skl
0x16  u8    Spd
0x17  u8    Def
0x18  u8    Res
0x19  u8    Lck
0x1A  u8[4] unknown        (zeros in all observations)
0x1E  u16[5] inventory     -> 5 slots, see encoding below
0x28  u8[8] weapon ranks   -> inferred, see below
0x3C  u32   pointer        -> this unit's sprite record (see Sprite table)
0x43  u8    unknown, persists across phases -- NOT has-acted (see below)
0x45  u8    unknown, companion to 0x43
```

### "Has acted" lives in the `+0x0C` flags — Confirmed

**Low byte of `+0x0C` = `0x42` (bits 1 and 6) once a unit has acted this phase.**

Observed in Ch.22 Hector mode with a same-moment control inside the same array, which is what
makes this solid:

| Unit | `+0x0C` low byte | State |
|---|---|---|
| Eliwood | `0x00` | has not acted |
| Hector (just chose Wait) | `0x42` | spent |

Bit 0 (`0x01`) is transient and means **selected / in motion** — it sets when you pick the unit
up and clears when the action resolves.

> **Read the baseline before you press anything.** I twice mis-set the baseline by reading
> `+0x0C` *after* an input and concluded bit 0 was already set for deployed units. It wasn't —
> at the start of a player phase the low byte is `0x00`.

### `+0x43` / `+0x45` — NOT has-acted (corrected)

An earlier session recorded these as the has-acted marker, "Confirmed for enemies." **That was
wrong**, and the correction matters because it was the more confident-looking entry.

Disproof: after Hector moved and chose Wait, his entire `+0x40..+0x47` range read **all zeros**
while his `+0x0C` flags went to `0x42`. A spent player unit does not set these bytes.

Why the original evidence misled: the enemy sample was taken *after* the enemy phase had
finished and the player phase begun — by which point the real has-acted flags had already been
**cleared**. `+0x43`/`+0x45` were still set, so they looked like the marker. In fact they are
something that **survives a phase change**, which has-acted by definition does not.

What they actually are is unresolved. "Has moved from its starting tile" is a candidate worth
testing, since Brigand A (which never moved) also had them set — which would rule that out too.
Treat as unknown.

### Last-acted-unit record — `0x0202BD48` — Confirmed

Sits 8 bytes *before* the player unit array.

```
0x0202BD48  u32  roster index of the unit that last acted  (0x01 Lyn -> 0x82 Brigand B)
0x0202BD4C  u16  x of the tile it acted FROM
0x0202BD4E  u16  y of the tile it acted FROM
```

It stores the **origin**, not the destination (Brigand B moved to `(7,6)` but this read
`(2,6)`), which suggests it backs the move-undo feature.

**Upgraded from Inferred to Confirmed** by a move made deliberately to test it: Legault
(roster `0x08`) moved `(10,3)` → `(11,6)` and chose Wait, after which this record read
`08 00 00 00 | 0A 00 | 03 00` — his roster index and his *origin*, on a move whose start and
end tiles were both known in advance. The earlier reading was an after-the-fact interpretation
of an enemy move; this one was a prediction that held.

**Confidence: Confirmed** for `0x00`–`0x19` and the inventory block. The stat offsets
were validated two independent ways — Lyn's values match her canonical level-1 bases
exactly (16 HP / 4 Str / 7 Skl / 9 Spd / 2 Def / 0 Res / 5 Lck), *and* the HP fields
matched the 16/16 shown on screen. Two independent confirmations landing on the same
offsets is what separates this from pattern-matching noise.

### Deployment: `x = 0xFF` means benched — Confirmed

The player array holds the **entire recruited roster**, deployed and benched alike, with no
gaps. Undeployed units are marked by **`+0x10` (x) = `0xFF`**.

In Ch.22 Hector mode: slots 0–10 carried real coordinates (their map start positions) and
slots 11–28 all read `x = 0xFF`. So "who is deployed" is simply `x != 0xFF`, and the roster
never needs a separate list.

Deployment also shows in the state flags at `+0x0C`:

| `+0x0C` value | Meaning |
|---|---|
| `0x00200001` | deployed |
| `0x00200009` | benched (bit 3 set) |
| `0x0020000D` | benched, plus bit 2 |
| `0x04210009` | benched, extra high bits — seen on 3 units, one with Str 0 / Skl 0 (a dancer/bard) |
| `0x00000008` | one unit with Str 0, no items, `exp = 0xFF` |

**Bit 3 (`0x08`) = not deployed** is the reliable part (Inferred). The high half-word differs
between modes (`0x0040....` in Lyn mode, `0x0020....` here), so it is **not** an allegiance
field — do not use it to tell friend from foe. Use which array the unit is in for that.

### Detecting a live slot

Empty slots are fully zeroed **except** they retain a stale roster index byte at `0x0B`.
So don't test liveness on `0x0B`. Test the character data pointer at `0x00` — a live
unit always has a nonzero `0x08xxxxxx` value there.

### Inventory encoding

Each of the 5 slots is a u16, little-endian:

```
low byte  = item ID
high byte = uses remaining
```

Example — Lyn's slot 1 read `01 2E` → item `0x01`, `0x2E` (46) uses.

### Weapon ranks — `+0x28` — Confirmed

An identical value `0x1F` (31 = E rank worth of weapon exp) appeared at `0x28` on Lyn
and at `0x2A` on both brigands — consistent with an 8-byte rank array ordered
sword / lance / axe / bow / staff / anima / light / dark.

**Upgraded from Inferred to Confirmed** by watching it move: a unit that fought during an enemy
phase had `+0x28` go `181 → 184` (+3 weapon exp) in the same diff that showed it lose HP and
weapon uses. Weapon experience accruing exactly when a weapon is used is the behaviour this
field must have.

### What one round of combat changes

Read off a single unit that was attacked during an enemy phase:

| Offset | Change | Meaning |
|---|---|---|
| `+0x13` | 28 → 19 | current HP — 9 damage taken |
| `+0x09` | 0 → 6 | experience gained |
| `+0x1F` | 20 → 18 | weapon uses (high byte of the item u16), −2 |
| `+0x28` | 181 → 184 | weapon rank exp, +3 |

All four in one narrow diff, which makes this the cheapest way to detect "did combat happen and
what did it cost."

### Unit death

Observed on a unit killed during an enemy phase:

```
+0x13  current HP  -> 0
+0x0C  flags       -> 0x05
+0x32..+0x36       -> zeroed  (inventory tail)
+0x3C  pointer     -> zeroed
```

The character pointer at `+0x00` was **not** immediately cleared, so `+0x00` alone does not detect
death — test `+0x13 == 0`.

### `+0x46` — likely a distance/threat metric (Unverified)

When 18 enemy reinforcements spawned, `+0x46` **decreased on roughly a dozen player units at
once** (`15→12`, `14→12`, `16→14`, …). A field that moves on nearly every unit the instant enemies
appear closer looks like cached distance-to-nearest-enemy or a threat value. Worth confirming —
it would be directly useful for AI decisions.

---

## Combat forecast — FOUND, `0x0203A3F0` / `0x0203A470` — Confirmed

The derived combat stats (Atk / Hit / Crit / Avoid / AS) are **not computed at draw time** —
FE7 keeps two 128-byte `BattleUnit` structs, one per combatant, and the forecast panel is
just a rendering of them. Both are static globals, present at the same addresses across
save-state reloads and across both units tested.

| Struct | Address | What |
|---|---|---|
| `gBattleActor` | `0x0203A3F0` | the attacking unit |
| `gBattleTarget` | `0x0203A470` | the unit being attacked |

Size is `0x80` (128) bytes each, and they are adjacent.

### How to re-find them in one call

Each struct **begins with a copy of the 72-byte unit struct**, so the character pointer is
at `+0x00`. Searching EWRAM for a unit's character pointer therefore returns its live array
slot *and* its battle copy:

```
search_memory(bytes=[0xE8,0xCE,0xBD,0x08], region="EWRAM", align=4)
  -> 0x202BFD8  (live player slot 9)   0x203A3F0  (gBattleActor)
```

This is how they were located, and it is the robust way to re-derive them if a future
build or chapter moves them. Do **not** hunt for the numbers themselves.

### Layout

Offsets `0x00`–`0x47` are the ordinary unit struct, with three differences from the live copy:

| Offset | In the battle copy |
|---|---|
| `+0x13` current HP | **projected post-battle HP** — see the projection section below |
| `+0x1A` | **total Con** (the live unit reads `0` here) |
| `+0x1D` | **total Mov** (the live unit reads `0` here) |
| `+0x1E` inventory | reordered so the **equipped weapon is slot 0** |

`+0x1A` / `+0x1D` are worth knowing on their own — Con and Mov are not otherwise readable
from the live unit struct. Observed: Hero Con 9 / Mov 6, Mage Con 6 / Mov 5, Lord (Hector)
Con 13 / Mov 5, Armour Con 13 / Mov 4.

Offsets `0x48`–`0x7F` are the battle fields. All the stat fields are **u16**:

| Offset | Actor addr | Target addr | Field |
|---|---|---|---|
| `+0x48` | `0x0203A438` | `0x0203A4B8` | u16 weapon **after** the projected battle (low = item ID, high = uses) |
| `+0x4A` | `0x0203A43A` | `0x0203A4BA` | u16 weapon **before** (low = item ID, high = uses) |
| `+0x50` | `0x0203A440` | `0x0203A4C0` | u8 weapon **type** — 0 sword, 1 lance, 2 axe, 3 bow, 4 staff, 5 anima, 6 light, 7 dark |
| `+0x53` | `0x0203A443` | `0x0203A4C3` | s8 weapon-triangle **HIT** bonus |
| `+0x54` | `0x0203A444` | `0x0203A4C4` | s8 weapon-triangle **DMG** bonus |
| `+0x55` | `0x0203A445` | `0x0203A4C5` | u8 **terrain ID** of the tile this unit stands on |
| `+0x56` | `0x0203A446` | `0x0203A4C6` | u8 terrain **DEF** bonus |
| `+0x57` | `0x0203A447` | `0x0203A4C7` | u8 terrain **AVO** bonus |
| `+0x5A` | `0x0203A44A` | `0x0203A4CA` | **ATK** |
| `+0x5C` | `0x0203A44C` | `0x0203A4CC` | **DEF** — Def *or* Res, picked by the **opponent's** weapon type |
| `+0x5E` | `0x0203A44E` | `0x0203A4CE` | **AS** (attack speed) |
| `+0x60` | `0x0203A450` | `0x0203A4D0` | **HIT** |
| `+0x62` | `0x0203A452` | `0x0203A4D2` | **AVO** |
| `+0x64` | `0x0203A454` | `0x0203A4D4` | **effective HIT** — this is the number on screen |
| `+0x66` | `0x0203A456` | `0x0203A4D6` | **CRIT** |
| `+0x68` | `0x0203A458` | `0x0203A4D8` | **DODGE** (critical avoid) |
| `+0x6A` | `0x0203A45A` | `0x0203A4DA` | **effective CRIT** — this is the number on screen |
| `+0x70` | `0x0203A460` | `0x0203A4E0` | u8 level at battle start |
| `+0x71` | `0x0203A461` | `0x0203A4E1` | u8 exp at battle start |
| `+0x72` | `0x0203A462` | `0x0203A4E2` | u8 HP at battle start |

`+0x4C`, `+0x4D`, `+0x52` carry small values (`1`/`3`/`1`) whose meaning was not pinned
down. `+0x7B` / `+0x7C` also move during a forecast. Treat all of these as unknown.

**Displayed damage is not stored** — it is `my ATK − opponent DEF`, computed at draw time.
Both commits in this session confirmed it against real HP loss.

### The formulas — Confirmed

Every one of these was verified by *predicting the value first* and then reading it, and
then again by writing a stat and predicting how the field would move. Integer division
truncates.

```
ATK   = Str (or Mag) + weapon Mt + triangleDmg + supportAtk
DEF   = (opponent's weapon is magic ? Res : Def) + terrainDef + supportDef
AS    = Spd - max(0, weapon Wt - Con)
HIT   = weapon Hit + Skl*2 + Lck/2 + triangleHit + supportHit
AVO   = AS*2 + Lck + terrainAvo + supportAvo
CRIT  = weapon Crit + Skl/2 + supportCrit
DODGE = Lck + supportDdg

effHIT  = HIT - opponent AVO,   clamped to [0, 100]
effCRIT = CRIT - opponent DODGE, floor 0        <- when this unit is the ATTACKER
effCRIT = CRIT - opponent DODGE - 4, floor 0    <- when this unit is the DEFENDER
```

> **The defender's effective crit carries a constant `-4`.** This is not a mistake and not
> a one-off: it held across six readings spanning two attackers, three weapons, and
> changing values on both sides — including one where the attacker's DODGE was changed from
> 3 to 0 (defender effCRIT went 1 → 4) and one where the defender's CRIT was raised to 25
> against DODGE 9 (effCRIT = 12 = 25 − 9 − 4). The attacker never gets the `-4`.
>
> **Where the 4 comes from is unknown.** It is *not* a support bonus (supports land in
> `DODGE` itself, see below) and not terrain. It is also **not established whether the rule
> is "defender" or "enemy"** — every sample was a player unit attacking an enemy, so the
> two readings are indistinguishable. Testing it needs a forecast where an enemy is the
> actor, i.e. during the enemy phase.
>
> Practical consequence: **read `+0x6A`, do not recompute it.**

### Support bonuses are folded in — Confirmed by a live control

Recomputing these stats from base stats will silently disagree for any unit standing near
allies. Hector at `(11,6)` read DEF 15 / AVO 31 / CRIT 8 / DODGE 9 while his base formulas
give 14 / 26 / 6 / 4 — `+1 Def, +5 Avo, +2 Crit, +5 Ddg`, with ATK and HIT unaffected.

Proven, not assumed: writing `x = 20` into the five player units within three tiles and
re-entering the forecast dropped every one of those fields to **exactly** the base-formula
value. Raven, who had no allies in support range, matched the bare formulas from the start.

**So `+0x5A`–`+0x6A` are the game's own numbers, and they are the only trustworthy source.**
The formulas above are for sanity-checking a read, not for replacing it.

### Terrain is folded in too — Confirmed

The enemy mage at `(8,7)` carried terrain ID `29` with `terrainDef = 1`, `terrainAvo = 20`
at `+0x56` / `+0x57`, and its DEF and AVO were exactly base `+1` and `+20`. Terrain ID `23`
(the tiles at `(9,6)` and `(11,6)`) gives `0` / `0`.

This makes `+0x55` a **second, independent read of the terrain ID** for two tiles at once.

> **Both readings were re-confirmed against the terrain array on 2026-08-29** (same chapter):
> `(8,7)` is `0x1D` and `(9,6)` / `(11,6)` are `0x17`. And the ID → name table is now fully
> enumerated — `29` = `0x1D` is a **Pillar**, not a forest. The guess from bonuses alone was
> wrong; see "The map layers → Terrain ID → name".

### Weapon triangle — Confirmed, including reaver weapons

Hector (Iron Axe) vs an enemy holding an **Axereaver** read `+0x53 = 0xE2` (−30 hit) and
`+0x54 = 0xFE` (−2 dmg) on Hector, and `+30` / `+2` on the enemy — the reaver's reversed,
doubled triangle, exactly. A plain axe-vs-anima matchup read `0` / `0` on both sides.

### `+0x13` is a projection, NOT a prediction — Confirmed, and this matters

At target select, both `+0x13` fields hold post-battle HP and both weapon-uses counts have
been decremented. It is very tempting to read this as an outcome oracle. **It is not.**

It is a deterministic **"every blow connects, no criticals"** projection:

- It is byte-identical across a `B` → `A` round trip out of and back into target select
  (a 512-byte diff over the whole pair returned **0 changes**).
- Setting the target's Lck to 90 drove the actor's `effHIT` to **0** — and the projection
  *still* showed the target at 0 HP. A 0%-to-hit attacker cannot roll two hits.

Two attacks were committed to check it against reality, and both diverged:

| | projection | actual |
|---|---|---|
| Raven → mage | Raven 26→16, mage 22→**0** | Raven 26→16, mage 22→**22** (both swings missed) |
| Hector → armour | Hector 14→7, enemy 15→**0** | Hector 14→7, enemy 15→**4** (one of two swings missed) |

The *attacker's* HP matched both times only because the single enemy counter happened to
connect both times. Do not read that as reliability.

**What it is genuinely good for:** `uses(+0x4A) − uses(+0x48)` is the **number of attacks
that side will make**, which is the doubling indicator. Verified on five samples including
a negative one (Raven with a Tomahawk, AS 4 vs AS 7, showed 1 attack; with a Hand Axe,
AS 16 vs AS 7, showed 2). And `+0x13` answers *"can this kill at all?"* — if the projection
does not reach 0, no sequence of rolls will.

### Target readback — solved

`gBattleTarget` identifies the enemy currently under the target cursor, by its own copy of
the unit struct: `+0x0B` roster index, `+0x10`/`+0x11` tile. Reading `0x0203A47B` and
`0x0203A480`/`0x0203A481` at target select returned `0x91` and `(8,7)` — the correct enemy.
This is the readback `fe7_act(action:"attack")` has been missing.

**Not demonstrated: that it updates as you cycle targets with Left/Right.** No board
position with two valid targets was available, and manufacturing one by writing an enemy's
coordinates failed (see negative results). The mechanism makes updating near-certain, but
it is **Unverified** and should be checked the first time two targets are genuinely in range.

### Gating a read — the structs go stale, they are not cleared

The pair persists after you back out, holding a mixture of old and scratch values, exactly
like the movement grid does. Backing out to the weapon list **zeroes `gBattleTarget +0x04`**
(the class pointer) and overwrites some of the target's stat fields with the *actor's*
weapon-preview numbers.

```
gate: read32(0x0203A474)  (gBattleTarget +0x04, class pointer)
      nonzero and 0x08xxxxxx  ->  a target is selected, the pair is live
      zero                    ->  stale, do not read
```

Cross-check available for free: at target select the ASCII buffer at `0x0202A5B4` holds
**the target's equipped weapon name** ("Thunder", "Axereaver" both observed).

### Reproduction recipe

From the saved board (turn 5, player phase, Raven = player slot 9 at `(9,6)` with his
action menu open, enemy slot 16 = a Mage at `(8,7)` holding Thunder):

```
press_sequence(["A","A"], frames=4, release_frames=40)   # Attack -> weapon -> target select
read_range(0x0203A3F0, 256)
```

Expected, exactly:

```
gBattleActor  (Raven, Hand Axe Mt7/Hit60/Wt12/Crit0, Str13 Skl19 Spd19 Def9 Res5 Lck3 Con9)
  ATK 20   DEF 5    AS 16   HIT 99   AVO 35   effHIT 65   CRIT 9   DODGE 3   effCRIT 9
gBattleTarget (Mage, Thunder Mt8/Hit80/Wt6/Crit5, Str7 Skl7 Spd7 Def3 Res8 Lck0 Con6, forest)
  ATK 15   DEF 4    AS 7    HIT 94   AVO 34   effHIT 59   CRIT 8   DODGE 0   effCRIT 1
```

Note `DEF 5` on the actor — that is Raven's **Res**, because the mage attacks with magic;
his Def of 9 is not used. Back out with `B`; **a third `A` commits the attack.**

The whole pair is reproducible from a cold read in about three calls.

---

## Known IDs

Class and character IDs were read directly from the ROM structs (offset `0x04` of each);
the **names** attached to them are inferred from game knowledge.

### Class data struct

```
0x00  u16  name text ID
0x02  u16  description text ID
0x04  u8   class ID
```

**Class ID is computable from the pointer — no ROM read needed.** Class structs are `0x54`
(84) bytes apart:

```
class ID = (class_ptr - 0x08BE015C) / 0x54
```

**Confirmed** by back-testing against a value derived independently in an earlier session: the
Lyn-mode Brigand pointer `0x08BE1410` yields exactly `0x39`, matching the Brigand ID already
in this document. Division came out exact on every pointer tested, which is itself evidence
the base and stride are right.

| Class ID | Class | Class pointer | Confidence |
|---|---|---|---|
| `0x01` | Lord (Eliwood) | `0x08BE01B0` | Inferred |
| `0x02` | Lord (Lyn) | `0x08BE0204` | Inferred |
| `0x03` | Lord (Hector) | `0x08BE0258` | Inferred |
| `0x12` | — (heavy armour: HP 40, Def 17) | `0x08BE0744` | Unverified |
| `0x2A` | — (promoted: HP 36, Str/Skl 20) | `0x08BE0F24` | Unverified |
| `0x39` | Brigand | `0x08BE1410` | Inferred |

The three Lord IDs cross-validate nicely: slots 0/1/2 of the Ch.22 roster compute to classes
3/1/2 and carry roster indices 1/2/3, which is exactly Hector / Eliwood / Lyn in a Hector-mode
file.

### Character data struct

```
0x00  u16  name text ID
0x02  u16  description text ID
0x04  u8   character ID
0x05  u8   default class ID
0x06  u8   portrait ID
```

**Struct stride is `0x34` (52 bytes) — Confirmed.** Originally inferred from two brigands
sitting `0x34` apart; re-confirmed across a 29-unit roster in Ch.22, where consecutive
character pointers were consistently `0x34`-aligned.

By analogy with the class formula, `char ID = (char_ptr - 0x08BDCE18) / 0x34` (base derived
from Lyn-mode Lyn: pointer `0x08BDCEB4`, known ID `0x03`). Division is exact on every pointer
tested, **but this formula is Unverified** and there is a live contradiction:

> In Ch.22 the unit whose *class* is unmistakably Lyn's Lord (`0x08BE0204`, class `0x02` — a
> class only Lyn has) carries character pointer `0x08BDD73C`, which the formula maps to ID
> `0x2D`, **not** `0x03`. Either FE7 stores two separate character entries for Lyn (a
> Lyn-mode version and a main-mode version), or the base is wrong. Unresolved — do not rely on
> character IDs until this is settled.

| Character ID | Who | Confidence |
|---|---|---|
| `0x03` | Lyn | Confirmed (name visible on screen) |
| `0x87`, `0x88` | Generic brigands | Unverified |

### The item table — `0x08BE222C` in ROM — Confirmed

Every weapon's Mt / Hit / Wt / Crit / range / durability is readable straight out of ROM,
which is what makes the combat forecast *predictable* rather than merely readable.

```
entry(itemID) = 0x08BE222C + 0x24 * itemID        (36-byte entries, item 0 is a null entry)
```

| Offset | Size | Field |
|---|---|---|
| `0x00` | u16 | name text ID |
| `0x02` | u16 | description text ID |
| `0x04` | u16 | use-description text ID |
| `0x06` | u8 | **item ID** (redundant, good for validating the base) |
| `0x07` | u8 | **weapon type** — 0 sword, 1 lance, 2 axe, 3 bow, 4 staff, 5 anima, 6 light, 7 dark, **9 = consumable / non-weapon item**; bit 7 set = ballista |
| `0x08` | u32 | attribute flags |
| `0x14` | u8 | **max uses** |
| `0x15` | u8 | **Mt** |
| `0x16` | u8 | **Hit** |
| `0x17` | u8 | **Wt** |
| `0x18` | u8 | **Crit** |
| `0x19` | u8 | **range**, packed — **high nibble = min, low nibble = max** |
| `0x1A` | u16 | cost per use |

Found by searching ROM for Iron Sword's stat block, which is unique:

```
search_memory(bytes=[0x2E,0x05,0x5A,0x05,0x00,0x11,0x0A,0x00],
              address=0x08000000, length=16777216)   -> exactly 1 match, 0x08BE2264
entry base = 0x08BE2264 - 0x14 = 0x08BE2250 = entry(1)
```

**Confirmed** by decoding five consecutive entries and matching all of them against known
FE7 values: Iron Sword 5/90/5/46, Slim Sword 3/100/2/30, Steel Sword 8/75/10/30,
Silver Sword 13/80/8/20, Iron Blade 9/70/12/35. The range nibble order was settled by the
ballista entries (`0x34`–`0x36`), which read `0x3A` = 3–10.

Item IDs confirmed this session by reading the name out of `0x0202A5B4` while the item was
equipped in a forecast:

| ID | Item | Mt | Hit | Wt | Crit | Range | Uses |
|---|---|---|---|---|---|---|---|
| `0x01` | Iron Sword | 5 | 90 | 5 | 0 | 1 | 46 |
| `0x0D` | (sword) | 9 | 75 | 7 | 30 | 1 | 20 |
| `0x1E` | **Axereaver** | 10 | 70 | 11 | 5 | 1 | 15 |
| `0x1F` | **Iron Axe** | 8 | 75 | 10 | 0 | 1 | 45 |
| `0x28` | **Hand Axe** | 7 | 60 | 12 | 0 | 1–2 | 20 |
| `0x29` | Tomahawk (A rank) | 13 | 65 | 14 | 0 | 1–2 | 15 |
| `0x38` | **Thunder** | 8 | 80 | 6 | 5 | 1–2 | 35 |

`0x1F` was previously **Inferred** as Iron Axe from two brigands; the ROM entry matches
FE7's Iron Axe exactly, so it is now **Confirmed**. `0x1E`, `0x28` and `0x38` were named
directly from the text buffer during a forecast.

#### The offsets above are correct — re-verified 2026-08-27

A later session suspected the block was off by one (uses at `+0x15` rather than `+0x14`). It is
not; the table as written is right. Four more entries were decoded and every field, **including
the `+0x1A` cost-per-use**, matches canonical FE7:

| ID | Item | type | uses `+0x14` | Mt | Hit | Wt | Crit | range `+0x19` | g/use `+0x1A` |
|---|---|---|---|---|---|---|---|---|---|
| `0x28` | Hand Axe | 2 axe | 20 | 7 | 60 | 12 | 0 | `0x12` 1–2 | 15 |
| `0x3E` | **Lightning** | 6 light | 35 | 4 | 95 | 6 | 5 | `0x12` 1–2 | 18 |
| `0x4A` | **Heal** | 4 staff | 30 | 0 | 100 | 2 | 0 | `0x11` 1–1 | 20 |
| `0x6B` | Vulnerary | **9** | 3 | 0 | 0 | 0 | 0 | `0x11` | 100 |

`uses × cost` reproduces the shop price in every case (Hand Axe 300, Lightning 630, Heal 600,
Vulnerary 300), which is an independent check on the whole block's alignment.

**Filtering by `+0x07` is how you build the staff list and the attack weapon list** — the
in-game staff list contains exactly the type-4 entries of the unit's inventory, in inventory
order. Confirmed: Lucius carried `0x3E` (type 6) and `0x4A` (type 4), and his staff list had
count 1.

### Item IDs

| Item ID | Item | Max uses | Confidence |
|---|---|---|---|
| `0x01` | Iron Sword | 46 | **Confirmed** |
| `0x6B` | Vulnerary | 3 | **Confirmed** |
| `0x1F` | Iron Axe | 45 | Inferred |
| `0x3E` | **Lightning** (light tome) | 35 | **Confirmed** — ROM stats + price match |
| `0x4A` | **Heal** (staff) | 30 | **Confirmed** — ROM stats + price match, and using it healed `10 + Mag` |

`0x01` and `0x6B` were upgraded from Inferred to Confirmed by a labeling screenshot of Lyn's
item list, which rendered them as "Iron sword 46 / Vulnerary 3 / Vulnerary 3" — matching the
IDs and durabilities already read from her inventory block.

`0x1F` (Iron Axe) is now **Confirmed** — see the item table section immediately above; its
ROM entry reads 8 Mt / 75 Hit / 10 Wt / 45 uses, which is FE7's Iron Axe exactly.

> **Prefer the ROM item table to this list.** It is complete, authoritative, and one read
> away. This table is only a convenience index of IDs seen in play.

---

## Worked example

The state these offsets were derived against — useful as a regression fixture.

**Lyn** — `0x0202BD50`, char `0x03`, class `0x02`, at `(13, 7)`
Lv 1, HP 16/16, Str 4, Skl 7, Spd 9, Def 2, Res 0, Lck 5
Inventory: Iron Sword (46), Vulnerary (3), Vulnerary (3)

**Brigand A** — `0x0202CEC0`, class `0x39`, at `(3, 2)`
Lv 2, HP 21/21, Str 5, Skl 1, Spd 3, Def 3, Res 0, Lck 2 — Iron Axe (45)

**Brigand B** — `0x0202CF08`, class `0x39`, at `(2, 6)`
Lv 1, HP 20/20, Str 5, Skl 1, Spd 2, Def 3, Res 0, Lck 0 — Iron Axe (45)

Lyn was the only unit in the player array; every other slot was zeroed. Objective was
"Seize gate", tactician "Mark", early Lyn-mode chapter.

---

## Corrected findings

- **`0x0202BC0A` IS the cursor position** — this file previously recorded the opposite,
  and that entry was wrong.

  The original reasoning: it read `(13, 7)` while Lyn stood at `(13, 7)`, which looked
  like a coincidence; moving the cursor two tiles right didn't change it; and it later
  went `13` → `14` exactly when the turn advanced, suggesting an event counter.

  What actually happened is two separate effects stacking:

  1. The field **does not update live** — it syncs only across a menu/turn transition,
     which is why cursor movement appeared to leave it untouched.
  2. The value that "disproved" it was misread. Two Right presses from x=13 were expected
     to give 15, and 14 was treated as a mismatch — but **the map edge is x=14**, so the
     cursor was blocked and 14 was correct all along.

  So a stale-looking field plus an unrecognised map boundary produced a confident wrong
  conclusion. The real lesson isn't the original "one sample isn't a match" — it's that
  **a failed prediction has at least two explanations** (the hypothesis is wrong, or the
  prediction was), and ruling out the second needs its own check.

  Re-derived and confirmed in the follow-up session; see the Cursor section.

---

## Open questions

- ~~**Objective text**~~ — **RESOLVED by screenshot, 2026-08-27.** The status window renders
  the objective and the turn limit directly: this chapter reads **"Defend Nils"** with
  **"5 / 11 Turn"**. So it is a DEFEND map on an 11-turn limit, not a rout — which changes
  how it should be played. Still not located in RAM as ASCII (the text buffer never held it),
  so this is a rendering-only find; locating the encoding is still open, but the gameplay
  question it was blocking is answered

- Gold
- Chapter / map ID
- ~~**Terrain / map tile array**~~ — **RESOLVED 2026-08-29: `0x0202E3E0`**, one of seven
  statically-addressed map layers catalogued at `0x0202E3DC`. Found exactly by the suggested
  method — a shape sweep of IWRAM + EWRAM for evenly-spaced row-pointer tables — which
  returned 8 hits and no noise. See "The map layers". Follow-ups that are now cheap and still
  open: what `gBmMapHidden` / `gBmMapOther` are for (both all-zero here), confirming
  `gBmMapFog` on an actual fog-of-war chapter, and what event mutates the terrain array
  between Preparations and turn 1
- ~~**True map dimensions**~~ — **RESOLVED TWICE. 2026-08-29: read them directly from
  `gBmMapSize` at `0x0202E3D8` (`u16 width`, `u16 height`) — Confirmed, and it agrees exactly
  with the older derivation below, which is now a cross-check rather than the source.**
  2026-08-28: they fall out of the movement grid's row-pointer table. width = `stride - 2`, height = `row_count - 4` (borders are asymmetric —
  2 leading rows AND 2 trailing, but no leading column). Ch.1 = 15×10, Ch.7 = 20×14,
  Ch.22 = 22×23 by formula. Both Inferred; the raw stride and row count are Confirmed. See
  Movement range for the evidence and for why indexing must not use these
- ~~**Derived combat stats** (Atk / Crit / Hit / Avoid)~~ — **RESOLVED: the `BattleUnit`
  pair at `0x0203A3F0` / `0x0203A470`.** See the Combat forecast section. Three follow-ups
  remain open:
  - **Where the defender's `-4` effective-crit constant comes from**, and whether the rule
    is "defender" or "enemy" — every sample was a player attacking an enemy, so the two are
    indistinguishable. Needs a forecast captured during the **enemy phase**
  - **Whether `gBattleTarget` updates as Left/Right cycle targets.** Near-certain but
    undemonstrated for *attack*. For **staff** targeting the equivalent question is now
    **resolved**: the highlighted target pointer does update on `Right`, and the general
    diff-based locator in "Unit actions" finds it for attack targeting too
  - **`+0x4C` / `+0x4D` / `+0x52` / `+0x7B` / `+0x7C`** in the `BattleUnit` tail
- **Whether weapon durability is consumed on a miss.** Two committed battles say **no** —
  Raven missed every swing and his Hand Axe stayed at 20/20 uses, while Hector landed one
  of two swings and spent exactly 1. This contradicts the usual understanding of FE7 and
  rests on 2 observations; treat as **Inferred** and re-test
- ~~**Terrain ID → name mapping**~~ — **RESOLVED 2026-08-29, all 65 entries `0x00`–`0x40`.**
  See "The map layers → Terrain ID → name". Note the correction: `29` is **Pillar**, not
  forest. What is still missing is the numeric **terrain bonus** table (avoid / def / res /
  heal) as a lookup — a ROM search for it failed, so read the bonuses per-tile from
  `BattleUnit +0x56/+0x57`
- Whether `+0x43` vs `+0x45` encode different things (moved vs acted?), and confirming either
  on a *player* unit
- Purpose of the second `"Mark"` copy at `0x02020160`
- Exact sync trigger for the play-state cursor copy at `0x0202BC0A`
- Meaning of the remaining `0x00400000` state flag bits at unit `+0x0C` (bit 0 is known:
  selected/in motion)
- The menu allocator — which slot a given menu lands in, and why it varies between runs
- **The 5th entry of Lucius's action menu at (10,2)** — count went 4 → 5 when a green NPC
  became adjacent. `Talk` and `Rescue` are both plausible; not probed because his action had
  already been spent. Matters only if a tool derives indices from the count
- **Whether green / NPC units can be traded with.** They *can* be staff-targeted (Confirmed);
  the trade probe only ever had blue candidates
- **What the `Attack` weapon list does with a weapon the unit cannot wield.** Hector's list had
  count 3 against 4 carried items, which is consistent with "equippable only", but the rule was
  not tested against rank restrictions
- **The trade-screen cursor struct.** The column and row bytes were located by diff and their
  semantics confirmed by effect, but the enclosing struct was not decoded — no count field was
  found next to either byte, so the row count has to come from the inventory, not the UI
- ~~Whether a separate NPC / green-unit array exists~~ — **RESOLVED: it does, at `0x0202DCD0`.**
  See the green-array section.
- What else besides occupancy and `0xFF` can make the game refuse a destination that the cost
  map says is reachable. Green units accounted for every case observed so far, but that is not
  proof there is no other cause

---

## Method notes

- **Dump all of RAM to disk in one call and analyse it locally.** `bridge.lua` drains its
  whole request buffer every frame, so `read_range` calls can be **pipelined**. A Node script
  that fires 8 + 64 of them with `Promise.all` dumps IWRAM (32 KiB) *and* EWRAM (256 KiB) in
  **0.2 s wall-clock** — against ~15 minutes doing it one MCP call at a time. This is what
  made the map-layer sweep practical, and it should be the default opening move for any
  structural hunt: dump, then grep/scan the files with ordinary tooling.

  ```js
  import { MgbaClient } from "~/Desktop/repos/mcp-mgba/dist/mgba.js";
  const m = new MgbaClient("127.0.0.1", 8765);
  const proms = [];
  for (let off = 0; off < 0x40000; off += 4096)
    proms.push(m.call("read_range", { address: 0x02000000 + off, length: 4096 }));
  const ewram = Buffer.concat((await Promise.all(proms)).map(Buffer.from));
  ```

- **Search the ROM as a file, not through the emulator.** `Fire Emblem (USA, Australia).gba`
  is on disk. Scanning it for a 32-bit literal instantly answers "is this RAM address a
  compile-time global or a runtime allocation?" — which is exactly the question that decides
  whether an address is safe to hardcode across chapters. The seven map-layer bases were all
  found sitting together in one literal pool this way, which settled their per-chapter
  stability more convincingly than a second map would have.

- **Search and diff run inside the emulator now.** The forked `mcp-mgba`
  (`~/Desktop/repos/mcp-mgba`, branch `feat/memory-search-and-input-sequence`) adds
  `mgba_search_memory`, `mgba_snapshot_memory`, `mgba_diff_memory`, and
  `mgba_press_sequence`. An EWRAM sweep is one call instead of 64, and there's no
  4096-byte cap because only the matching addresses cross the wire.

- **The narrowing loop is what actually finds things.** This is how the cursor was
  located, start to finish:

  1. `mgba_snapshot_memory(name="cur0", region="EWRAM")`
  2. `mgba_press_sequence(["Right"])`
  3. `mgba_diff_memory(name="cur0", predicate="increased", width=1, store_as="curA")`
     → 41 hits, of which 7 read `13 → 14`
  4. Move again, then `mgba_search_memory(value=<new value>, width=1, candidates="curA")`
     to intersect by value

  `store_as` keeps the full candidate set inside mGBA, so a first pass matching thousands
  of addresses costs nothing to carry forward. `predicate="increased"` is far more
  selective than `"changed"` and is usually the right first filter.

- **Beware the "adjacent pair" heuristic.** In-map menus store index and mirror side by side,
  so an adjacent pair of bytes that both changed looks like a strong signal. It produced a
  false positive on the Preparations screen: `0x02024F16`/`0x02024F17` both "increased to 2"
  and looked exactly like an index+mirror, but they are the **high bytes of a pointer**
  (`0x020254E8`) that happened to move. The reliable filter is **consistency across two
  successive steps** — press Down twice and keep only addresses that read 1 then 2. That left
  the single correct answer.

- **A unique value makes a labeling screenshot unambiguous.** Before labeling a candidate,
  search EWRAM for its value. If exactly one address holds it, a screenshot showing that number
  can only be referring to that address, so the label carries no ambiguity. If many addresses
  hold it, a screenshot proves nothing about *which* one.

- **Measure the noise floor before believing a diff count.** In a hot region, "N changes on
  action X" is meaningless until you know how many bytes change when you do *nothing*. IWRAM
  churns **3402 of its 32768 bytes** while the game sits idle on the map; EWRAM churns **9**.
  So an IWRAM diff reporting ~3500 changes is reporting *approximately nothing*. Snapshot, wait,
  diff with `store_as` to capture the floor, then diff again after the real action with
  `exclude=` naming it. This is what finally produced the movement grid after four failed hunts.

- **You don't need `advance_frames` to let time pass.** This build has no `pause`, so the
  emulator free-runs between tool calls and each round-trip is already tens of frames. Use
  `advance_frames` only for frame-precise timing — it costs a round-trip *per frame* here, so a
  120-frame call takes over two minutes, while simply issuing the next call gives you a
  perfectly good noise window for free.

- **Narrow the region when you can guess the struct.** Diffing the 128-byte play-state
  struct across a turn returned 3 changes. Diffing all of EWRAM across the same turn
  returned 4073, nearly all dialogue and tile buffers around `0x02004000`. EWRAM-wide is
  for when you have no idea where to look.

- **Timing trap: a turn is not over when the input finishes.** `mgba_press_sequence`
  waits for the *input queue* to drain, not for the game to respond. Diffing immediately
  after an end-turn showed the turn counter unchanged — the enemy phase was still running.
  It only incremented on a later read. Any automation that acts on a post-turn diff must
  wait for the game to settle, not just for the buttons to land. (Finding the phase
  indicator would make this checkable instead of a guess — see Open questions.)

- **Predict the value, then search for it.** The strongest single move available, and the
  one that found the combat forecast. Weapon stats are in ROM and unit stats are in RAM, so
  Atk / Hit / Crit / AS can all be *computed* before you look — an address holding a number
  you derived from first principles is far better evidence than an address that merely
  changed. Every forecast field here was confirmed that way, and then re-confirmed by
  writing a stat and predicting how the field would move.

- **A struct that starts with a copy of another struct is findable for free.** The
  `BattleUnit` pair was located in one call by searching EWRAM for a unit's character
  pointer: the live slot and the battle copy both came back. Before running a diff, ask
  whether the thing you want *embeds* something you can already address.

- **"It reproduces exactly" is not "it is correct."** The forecast's projected HP was
  byte-identical across a menu round trip, which made it look like a reliable outcome
  oracle. It is a deterministic all-hits projection, and both committed attacks diverged
  from it. Determinism only rules out randomness; it says nothing about meaning. The test
  that settled it was forcing the attacker's hit rate to 0 and watching the projection
  still kill the target.

- **A struct you cannot address can still be found by what moves in it.** Every unit-target
  selection state (staff target, trade partner, rescue target) keeps the highlighted unit's
  struct pointer in a dynamically-allocated slot. Snapshot `0x02024000`+8192, press `Right`,
  diff `width=4`, and take the entry whose before *and* after are both `0x0202xxxx` unit
  addresses. Three different selection states, three correct hits, no hardcoded address.

- **Confirm from memory, not from the screen.** Screenshots invite misreading pixels.
  Everything here was cross-validated against memory instead: Lyn's stats match her
  canonical level-1 bases on the same offsets that hold her on-screen HP; the cursor's
  pixel coordinates equal its tile coordinates × 16; seven independent mirrors agreed
  through four moves. Two independent things landing on the same offsets is what turns a
  plausible offset into a confirmed one.

- **Capabilities on this mGBA build** (via `mgba_get_info`): `pause`, `unpause`, and
  `frameAdvance` are **missing**, so reads come from a running emulator and are not atomic
  snapshots — fine for turn-based states, be wary mid-animation. `runFrame` and `step`
  *are* present, and the bridge falls back to them, so `mgba_advance_frames` still works.

- **Save state before anything destructive.** `mgba_save_state` to an explicit *path*
  rather than a numbered slot avoids clobbering your own saves.

- **Menu navigation blind is safe by structure, not by luck.** In the field menu,
  **Suspend** sits directly above **End** — picking it save-quits the chapter. The menu
  wraps, so a single **Up** from the top entry (`Unit`) can only ever land on `Unit` or
  `End`, never `Suspend`. `["A", "Up", "A"]` from an empty tile is therefore a verified-safe
  end-turn, and was used as such. Confirm the outcome by reading the turn counter
  afterwards rather than by looking at the screen.

- **Open `A` on an empty tile, not on a unit.** `A` over a unit selects it for movement;
  over empty ground it opens the field menu. Check the unit arrays for occupancy first —
  cheaper and more reliable than assuming.
