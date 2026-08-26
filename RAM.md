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
| **Movement range grid** — row data | `0x030004AC` (IWRAM) | Confirmed |
| Movement range grid — row pointer base for `y=0` | `0x03000448` (IWRAM) | Confirmed |
| Second map layer, purpose unknown | `0x020302D8` → `0x02030344` | Unverified |

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
input. Map height not yet probed.

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
string. (A numeric terrain ID and the underlying map array are still unlocated — but for
pathing purposes this may be sufficient, and it is far easier to interpret.)

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

### Menu labels DO pass through this buffer — Confirmed

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

## Movement range — FOUND, `0x030004AC` in IWRAM — Confirmed

The game's own reachable-tile set, already accounting for terrain cost, class, and blocking
units. One read answers "can this unit reach that tile" for **every tile at once**, before
pressing anything.

### Layout

A row-pointer table immediately followed by its own row data:

| What | Address |
|---|---|
| Row pointer table (physical start) | `0x03000440` |
| **Row pointer base for `y = 0`** | **`0x03000448`** |
| Row data start | `0x030004AC` |
| Row data end (exclusive) | `0x03000734` |

27 pointers × 4 bytes, each row **24 bytes** (`0x18`) — so 648 bytes of grid. The table ends
exactly where its data begins, which is what makes the structure recognisable.

### Indexing — `col = x`, `row = y + 2`

```
addr(x, y) = 0x030004AC + 24 * (y + 2) + x
```

Or, preferred, dereference the table instead of hardcoding the data base:

```
row_ptr = read32(0x03000448 + 4 * y)
addr    = row_ptr + x
```

The `+2` is **Confirmed** empirically. Reading it as two top border rows (`y = -2`, `y = -1` at
`0x03000440` / `0x03000444`) is **Inferred** — it explains the offset and matches the usual
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

Terrain cost is also visible in the grid, so don't assume Manhattan. Legault's row `y=6` read
`6 5 4 5 6` at cols 9–13 while plain Manhattan from `(10,3)` would give `3 4 3 4 5` — the direct
route down column 10 was blocked, forcing the path through column 11. **Read the value; never
recompute it as distance.**

### Confirmed on two units with different x *and* y

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

### A second map layer exists — EWRAM `0x020302D8` (purpose unknown)

Identical geometry: 27 pointers, stride `0x18`, table ending exactly at its data start
`0x02030344`, 648 bytes. Read **all zeros** while a unit was selected, so it is not terrain and
not the movement grid. Candidates: attack-range overlay, fog, or unit occupancy.

Its table pointer is stored at `0x03000438`, immediately *before* the movement grid's table —
so the map layers are catalogued together and **more layers are likely reachable the same way**.
That is the obvious lever for the still-missing terrain array: look for another table of this
shape rather than searching for terrain IDs directly.

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

Observed slots so far: `0x020251E8`, `0x020252C0`, `0x02025470`. The *same* logical menu
(Lyn's action menu) appeared at `0x020252C0` on one run and `0x020251E8` on another.

`+0x03` is **not** a trustworthy open/closed test either: `0x020251E8` read `0x05` while its
menu was demonstrably live — the next `A` press selected its index-0 entry and opened the
item list.

**Locate the live menu by behaviour instead** (3 calls, always correct):

```
snapshot_memory(region="EWRAM")
press Down
diff_memory(predicate="changed", width=1)
   -> index byte + its mirror appear as an adjacent pair
   -> entry count is at (index address - 1)
```

Also useful as a cross-check: the highlight is drawn as tile rows near `0x020235A4` /
`0x02023624` with stride `0x80`, so a menu move shows up there too.

### Known menu contents

| Menu | Entries | Order |
|---|---|---|
| Field menu (cursor on empty tile) | 5 | `Unit`, `Status`, `Options`, **`Suspend`**, `End` |
| Unit action menu (Lyn, no adjacent enemy) | 2 | `Item`, `Wait` |
| Item list (Lyn) | 3 | her three inventory slots, in inventory order |
| **Preparations menu** | 5 | `Pick Units`, `Trade`, `Fortune`, `Check Map`, `Save` |

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

### Item IDs

| Item ID | Item | Max uses | Confidence |
|---|---|---|---|
| `0x01` | Iron Sword | 46 | **Confirmed** |
| `0x6B` | Vulnerary | 3 | **Confirmed** |
| `0x1F` | Iron Axe | 45 | Inferred |

`0x01` and `0x6B` were upgraded from Inferred to Confirmed by a labeling screenshot of Lyn's
item list, which rendered them as "Iron sword 46 / Vulnerary 3 / Vulnerary 3" — matching the
IDs and durabilities already read from her inventory block.

`0x1F` (Iron Axe) remains **Inferred**: the ID and its 45 uses are real reads off both
brigands, but no screen has yet shown an enemy's inventory by name.

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

- Gold
- Chapter / map ID
- **Terrain / map tile array** — still unlocated, but no longer blocks pathing: the movement
  range grid answers "is this a legal destination, and what does it cost" directly. Best lever
  now is to look for another row-pointer table shaped like the two already found (27 × `0x18`,
  table ending at its own data), not to search for terrain IDs
- **True map dimensions** — the grid buffer is 24 wide × 27 rows *including* a 2-row top border,
  so the real map is smaller; exact width/height not yet derived
- **Derived combat stats** (Atk / Crit / Hit / Avoid) — a labeling screenshot showed the game
  computes and displays these, so they exist in RAM. Locating them would enable combat
  prediction without simulating the formulas
- Whether `+0x43` vs `+0x45` encode different things (moved vs acted?), and confirming either
  on a *player* unit
- Purpose of the second `"Mark"` copy at `0x02020160`
- Exact sync trigger for the play-state cursor copy at `0x0202BC0A`
- Meaning of the remaining `0x00400000` state flag bits at unit `+0x0C` (bit 0 is known:
  selected/in motion)
- The menu allocator — which slot a given menu lands in, and why it varies between runs
- ~~Whether a separate NPC / green-unit array exists~~ — **RESOLVED: it does, at `0x0202DCD0`.**
  See the green-array section.
- What else besides occupancy and `0xFF` can make the game refuse a destination that the cost
  map says is reachable. Green units accounted for every case observed so far, but that is not
  proof there is no other cause

---

## Method notes

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
