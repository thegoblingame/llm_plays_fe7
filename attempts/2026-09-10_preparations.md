# Preparations screen — working log, 2026-09-10

Chapter 7x "The Black Shadow", Lyn mode, US release. 12-unit roster, 10-unit deployment
cap, map 15×17 (`gBmMapSize` = 15,17). Everything below is Ch.7x unless stated. Findings
are written up in RAM.md under "The Preparations screen — mapped 2026-09-10"; this file is
the process, including what did not work.

## Method that made it cheap

The pipelined EWRAM dump from RAM.md's method notes was the whole game here: **256 KiB in
~250 ms**, then all narrowing done locally in Node. One correction to that note — firing
all 64 `read_range` calls in a single `Promise.all` **hung the bridge** (no response, no
error, killed at 120 s). Batching 8 at a time works and is still ~250 ms. Use:

```js
for (let off = 0; off < len; off += 4096*8) { const p = [];
  for (let k = 0; k < 8; k++) p.push(m.call("read_range", {address: base+off+k*4096, length: 4096}));
  parts.push(...(await Promise.all(p)).map(Buffer.from)); }
```

The dominant technique was **three-snapshot stepwise consistency**: dump, press a
direction, dump, press again, dump, then keep offsets where `B == A+d && C == B+d`. On the
prep menu (`d = 1`) it returned exactly **1** address out of 262 144. On Pick Units
(`d = 2`, two-column list) exactly **2** (index + mirror). No noise filtering was needed at
all, which is a much better signal-to-noise ratio than a single-step `changed` diff.

## Sequence of experiments

1. Dumped the prep state. Player array = 12 live slots, 10 with coordinates, slots 10/11 at
   `x = 0xFF`. Confirmed `fe7_state`'s "10/12" denominator is `players.length`, not a cap.
2. Three-snapshot on the prep menu → `0x020250DA`. Neighbours: `+1` = count 5, `+2` = 0xFF.
   No mirror byte ⇒ `locateMenu()` in `fe7.ts` structurally cannot find this menu.
3. Stepped the highlight and read `0x0202A5B4` each time — the prep menu writes the
   **highlighted** entry's help text there, which is the opposite of the in-map action menu.
   That gave all five entry names for free. Fortune reads "This command cannot be used at
   this time." on this chapter.
4. Pressed Start, sampled `0x0202BC00`+16 at 0.5/1.5/3/6 s. phase `0x40 -> 0x00`, turn
   `0 -> 1`, settled by 1.5 s. Rolled back.
5. Opened Pick Units (index 0, A) → confirmed index 0 by effect.
6. Three-snapshot on Pick Units. First pass with `d = 1` found nothing useful; `d = 2`
   found `0x02025658` / `0x0202565A`. Left/Right = ∓1, Up/Down = ∓2, clamping at both
   column edges ⇒ two columns, index = array slot.
7. Pressed A at index 6 and diffed EWRAM: **one** byte in the unit arrays moved,
   `0x0202BF0C` = slot 6's `+0x0C`, `0x01 -> 0x0B`. Also `0x02025655` 10 → 9. That single
   result gave the deploy flag, the deployed counter, and index == slot at once.
8. Toggled slots 4/10/11 and read flags, x and the counter each time. The counter tracked;
   `0x02025656` never moved off 10 ⇒ cap candidate. **x never moved** — the deploy flag and
   x disagree for the whole time you are in prep.
9. Cap enforcement: at 10/10, A on a benched unit was a total no-op. Then wrote 12 to
   `0x02025656` and the same press succeeded, twice. Cap Confirmed by writing.
10. Left Pick Units with B → **the player array had been re-sorted** (deployed first) and
    `+0x0B` renumbered. Pressed Start → the two newly deployed units appeared on the tiles
    the two newly benched ones had vacated.
11. Reloaded a clean prep state and repeated the whole thing **with two `write32`s and no
    UI**: benched Matthew, deployed Lucius, pressed Start. Lucius came out on the map at
    Matthew's tile. That is the P1.5 proof.
12. Over-deploy test: cap forced to 12, all 12 flagged deployed, left prep. The game
    silently dropped the two with no start tile, clearing the `0x0020....` half-word of
    their flags (`0x00000008`, then `0x00000009` after Start).
13. Prep Trade (index 1, A): the grid is **units, 3 wide**, not items. Found the cursor at
    `0x02025655` and — decisively — a unit-struct pointer at `0x0202566C` that moved
    `0x0202BF00 -> 0x0202BF48` on one Right press. The ASCII buffer shows item names here
    and is not a usable readback.

## Traps hit, for the next session

- **Reading the cursor immediately after a press races the game.** Two runs of the same
  cap test disagreed because `goto(4)` returned 4 while the cursor was still travelling and
  A landed on a different unit. Fixed by requiring the index to read the same value on two
  reads ~260 ms apart before pressing anything. Every ambiguous result in this run traced
  back to this.
- **The prep menu proc survives at its old address after prep ends.** After Start,
  `0x020250DA` still read a plausible `idx 2 / count 5`. Presence of the struct is not a
  "prep is open" test; `phase == 0x40 && turn == 0` is.
- **The prep menu highlight is on index 1, not 0, when Preparations opens.** A locator that
  assumes the initial index is 0 will reject the right address.
- **`+0x0B` is not a character identity.** It is renumbered on every array re-sort. The
  character-data pointer at `+0x00` is the only stable id; the names in this log were
  resolved by keeping a pointer→name map built from the ASCII buffer while stepping the
  Pick Units cursor. Two of them were initially assigned backwards (`0x08BDD1F4` is Erk,
  `0x08BDD18C` is Serra) and only the re-sort test caught it.

## Failed hunts — do not repeat as written

- **Convoy, approach 1 — shape scan.** Scanned all EWRAM for runs of ≥6 consecutive u16s
  looking like `id | uses<<8` with `id ∈ 1..0x9F`, `uses ∈ 1..60`. Returned 300- and
  190-entry runs inside graphics buffers (`0x02022380`, `0x0202F3BA`, `0x02022740`) and
  nothing convoy-shaped. The encoding filter is too weak to beat tile data; a diff across a
  real transfer is the way.
- **Convoy, approach 2 — persistent regions.** Dumped `0x02010680`, `0x02010FDC`–
  `0x02011200` (just past the 2304-byte roster mirror) and `0x0202BC00`–`0x0202BD50`. All
  zeros or unrelated. Worth noting `0x0202BC48`–`0x0202BC5D` holds
  `00 01 01 02 02 03 03 04 04 05 05 06 06 07 07 08 08 08 08 08 08 08`, an obvious paired
  ramp that nobody has explained; it is not the convoy.
- **Convoy, approach 3 — the prep Trade item grid.** It looked like an item list because
  the ASCII buffer kept showing item names. It is a unit picker. ~5 calls wasted before the
  unit-pointer diff settled it.
- **Deployment cap source.** Only ever found in the Pick Units proc. No ROM lookup
  attempted beyond noticing that `cap == number of chapter start positions` fits every
  observation. Next lever: find the chapter's ROM unit-placement list (16-byte entries,
  `+0x04`/`+0x05` = x,y) by searching the ROM file on disk for the ten known Ch.7x start
  tiles `(12,14) (7,16) (13,14) (10,14) (11,15) (12,16) (8,15) (9,16) (7,15) (11,13)` at a
  stride of 16 — that would give both the cap's true source and a chapter id.
- **Gold.** `0x0202BC00` = 7000 here vs 7336 at Ch.22. Consistent with gold, still no spend
  event available on this chapter. Unverified.

## Scratch files

All under the session scratchpad
`/private/tmp/claude-501/-Users-grantnathanielbrown-Desktop-repos-mcp-mgba/87d8ab2c-b236-4e19-8ada-ecab48784e68/scratchpad/prep/`
— `lib.mjs`, `lib2.mjs` and ~14 one-shot probes, plus save states `base_prep.ss`,
`pre_start.ss`, `pickunits.ss`, `prep_toggled.ss`, `prep_trade.ss`. Nothing was written
into either repo except RAM.md and this file. The emulator was left on `base_prep.ss`, the
untouched Ch.7x Preparations screen.
