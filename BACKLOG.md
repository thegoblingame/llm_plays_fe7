# FE7 Backlog

**Consolidated 2026-08-26. Substantially revised 2026-08-29** — see "Closed" at the bottom. Single ranked list of what we don't know and what we can't
do yet, merged from `RAM.md` ("Open questions") and `attempts/HANDOFF.md` ("Known gaps in
the tools"). Those sections remain authoritative for detail; this file is the entry point.

Each item is tagged with its lane:

- **[mem]** — needs live snapshot/diff against the emulator → `memory-investigator` agent
- **[tool]** — needs code in `mcp-mgba/src/fe7.ts` → implementer session
- **[both]** — a memory find that then needs a tool built on top of it

---

## P0 — blocking real play

### 1. Combat forecast / derived stats — [both]

**Status: LOCATED (2026-08-26). The memory half is done; the tool half is not built.**
Full write-up in `RAM.md` → "Combat forecast".

FE7 keeps two 128-byte `BattleUnit` structs and the forecast panel is just a rendering of
them. Both are static globals:

| Struct | Address |
|---|---|
| `gBattleActor` | `0x0203A3F0` |
| `gBattleTarget` | `0x0203A470` |

Stat fields are u16 at `+0x5A` ATK, `+0x5C` DEF, `+0x5E` AS, `+0x60` HIT, `+0x62` AVO,
`+0x64` **effective HIT** (the on-screen number), `+0x66` CRIT, `+0x68` DODGE, `+0x6A`
**effective CRIT** (the on-screen number). Displayed damage is `my ATK − opponent DEF`.
All formulas are confirmed and written up, including terrain, weapon triangle (reavers
included) and support bonuses.

**Target readback is solved too.** `gBattleTarget` embeds a copy of the target's unit
struct, so `+0x0B` is the roster index and `+0x10`/`+0x11` the tile. That is the readback
`fe7_act(action:"attack")` has been missing.

**What is left — [tool]:**

- Build `fe7_forecast` — read the pair, decode, and report both sides. Gate the read on
  `read32(0x0203A474) != 0`, which is false whenever the pair is stale.
- Wire the readback into `fe7_act(action:"attack")` so target cycling stops being blind.

**Two traps for whoever builds it:**

1. **`+0x13` (projected HP) is not an outcome oracle.** It is a deterministic
   "every blow lands, no crits" projection. Proven: forcing the attacker's effective hit to
   0 still showed the target at 0 HP, and both committed test attacks diverged from it.
   Report it as *best case* / "can this kill at all", never as "this will happen".
   `uses(+0x4A) − uses(+0x48)` **is** reliable — it is the number of attacks that side
   makes, i.e. the doubling indicator.
2. **Do not recompute the stats from base stats.** Support bonuses are folded in and are
   invisible from the unit struct — Hector read +1 Def / +5 Avo / +2 Crit / +5 Ddg over his
   base formulas purely from nearby allies. Read the fields.

**Still open — [mem]:** the defender's effective crit carries an unexplained constant `−4`
(the attacker's does not); whether that is a *defender* rule or an *enemy* rule needs a
forecast captured during the enemy phase. And `gBattleTarget` updating on Left/Right target
cycling is expected but **undemonstrated**.

### 2. Item / staff / trade actions — [both]

**Status: MAPPED (2026-08-27). The memory half is done; the tool half is not built.**
Full write-up in `RAM.md` → "Unit actions — staff, item, trade"; working log in
`attempts/8.27.2026_staff_item_trade.md`.

All three flows were driven end to end against the live game, every step confirmed by effect.
Bartre was healed 4 → 27 for real, which was the concrete thing this item existed to unblock.

**Action menu order — Confirmed:** `Attack, Staff, Rescue, Item, Trade, …, Wait` with `Wait`
always last. Entry counts observed: 3 (Lyn, `Item/Trade/Wait`), 4 (Lucius, `Staff/Item/Trade/
Wait`), 5 (Hector, `Attack/Rescue/Item/Trade/Wait`). Derive the index from the count plus the
order — do not hardcode — then verify by effect before committing.

**What each entry does, checkable from memory after pressing `A`:**

| Entry | Signature |
|---|---|
| `Attack` | new menu, count = equippable weapons |
| `Staff` | new menu, count = type-4 items; ASCII = that staff's use-description |
| `Item` | new menu, count = item count; **index == inventory slot** |
| `Rescue` | no menu; ASCII contains `"unit to rescue."` |
| `Trade` | no menu; ASCII contains `"unit to trade with."` |

**Target readback is solved for staves and generalises to attack.** `gBattleTarget` is *stale*
during staff target select (`read32(0x0203A474) == 0`, the documented gate). Instead:
`search_memory(bytes=[0x98,0x69,0xB9,0x08], region="EWRAM", align=4)` returns exactly 1 match
while in staff target select and 0 otherwise, and `read32(match + 0x2C)` is the highlighted
target's unit-struct pointer. The general form — snapshot `0x02024000`+8192, press `Right`,
diff `width=4`, take the slot whose value is a unit-struct address — worked for staff target,
trade partner **and** rescue target, so it is the readback `fe7_act("attack")` needs too.

**What is left — [tool]:**

- `fe7_act(action:"staff")` — target by slot or tile, cycle with `Right` until the target
  pointer matches, then commit. Heal restores `10 + Str/Mag`; the staff list is the type-4
  subset of the inventory, so read `+0x07` from the ROM item table to build it.
- `fe7_act(action:"item")` — self-targeted, no target step; item list index == inventory slot;
  item sub-menu index 0 is `Use`.
- `fe7_act(action:"trade")` — column byte 0/1, row byte, `A` auto-jumps between columns; verify
  by reading both units' 10-byte inventory blocks at `+0x1E`. Trade does **not** spend the
  action, so the tool should return with the action menu still open.

**Four traps for whoever builds it:**

1. **A level-up blocks the spent flag.** `+0x0C` bit 1 stays clear and the item uses stay
   unchanged until the level-up screen is dismissed. Poll and press `A` until bit 1 sets.
2. **`0x0202A5B4` does not track the action-menu highlight** — it reads `"Wait"` at every
   index. It *does* track item/staff-list highlights and holds the prompts and refusal
   messages. See the corrected table in RAM.md.
3. **Menu sub-structures are stale-prone.** A plausible-looking sub-menu sat at `0x020252C0`
   while the live one was at `0x020256F8`; the trade proc's `+0x28` held the *initial* partner
   across three `Right` presses. Locate by diff every time.
4. **Diff twice.** The first diff after `press_sequence` returns routinely catches a
   mid-transition frame with 30-70 sprite-churn changes and no index pair.

**Still open — [mem]:** the identity of the 5th entry in Lucius's (10,2) menu (count went 4 → 5
when a green NPC became adjacent); whether green units can be *traded* with (they can be
staff-targeted, Confirmed); the trade-screen cursor struct's remaining fields.

### 3. Input-state probe as a tool — [tool]

**Status:** **solved in RAM.md, never built.** Not an open question — an unbuilt one.

The input-signature probe distinguishes all three states in three calls. Snapshot the 8 KiB
at `0x02024000`, press a direction, diff:

| Result | Meaning |
|---|---|
| ~41 changes including `0x0202BBCE` | free cursor — the press moved the cursor |
| ~5 changes including an adjacent index/mirror pair | a menu is open (and this locates it) |
| ~10 changes, no cursor bytes, no index pair | input swallowed — event, dialogue, animation |

This is the answer to "how do we detect dialogue," which stalled turn 2. Note that
`fe7_wait` currently sidesteps the problem by mashing A about once a second, which clears
death quotes and event text without ever detecting them — good enough for waiting, useless
for deciding.

Do **not** use `0x0202521B` or cursor-mirror agreement for this. Both were tried and both
break; see RAM.md.

---

## P1 — worth having, not blocking

### 4. `gBmMapFog` is unverified — [mem]

Slot 4 of the map-layer array. Named only from its position in the canonical ordering; it
reads uniformly `0x01` on Ch.22 and Ch.7, which is consistent with "no fog" and proves
nothing. **A fog-of-war chapter would settle it in one read.** Same for `gBmMapHidden` and
`gBmMapOther`, both all-zero on every map seen so far.

### 5. Fold the unit-occupancy layer into `fe7_state` — [tool]

`gBmMapUnit` (slot 0) gives every live unit's deployment ID by tile in ONE read — verified
exhaustively on Ch.22: all 55 units present, zero spurious cells. It would replace scanning
three sparse arrays, and structurally **cannot forget the green units**, which this file and
RAM.md both record as a whole class of past bugs.

### 6. The rest of the contextual action menu — [tool]

`fe7_act` now has `seize`, built on reading each menu entry's ROM command pointer. The same
primitive should give **Visit, Door, Chest, Talk, Rescue, Drop**. Each needs exactly one
observation of a menu containing it to learn its pointer, after which it is a constant.
Known so far: seize `0x08B95314`, attack `0x08B95338`, item `0x08B9562C`, trade `0x08B95650`,
wait `0x08B956BC`.

### 7. Terrain content beyond Ch.22 and Ch.7 — [mem]

The ID → name table is complete and Confirmed, but it was built by *writing* IDs into a tile.
Natural occurrence is confirmed for castle terrain (Ch.22) and outdoor terrain (Ch.7). Desert,
snow, ship and fog maps would each be a fresh check — low value, do it opportunistically.

### 8. What else can refuse a legal destination — [mem]

Green units accounted for every case observed, but that is not proof there is no other
cause. Currently indistinguishable from a dropped input, which makes it expensive to
debug when it happens.

---

## P2 — curiosity tier

- **Gold** — `0x0202BC00` is a candidate only, Unverified
- **Chapter / map ID** — unlocated
- **`+0x43` vs `+0x45`** — whether they encode different things (moved vs acted?); neither
  confirmed on a *player* unit
- **Why terrain mutates mid-chapter** — `(10,4)`/`(11,4)` on Ch.22 read Wall at Preparations
  and Floor on turn 1. Cause Unverified. Practical consequence is already handled: don't
  cache terrain across turns
- **The tile-graphic map at `0x02032E90`** — 24 rows × 44 bytes, Unverified; its y-origin was
  never established

---

## Closed 2026-08-29

- ~~**Terrain array**~~ — **FOUND.** `gBmMapTerrain`, slot 1 of a seven-layer array at
  `0x0202E3DC`. Layer bases are ROM literals, confirmed byte-identical on two chapters.
  `fe7_terrain` ships. See RAM.md → "The map layers"
- ~~**True map dimensions**~~ — **RESOLVED.** `gBmMapSize` at `0x0202E3D8` is `u16 width`
  then `u16 height`, a direct read. Confirmed on two chapters of opposite shape
- ~~**No seize action**~~ — **BUILT.** `fe7_act(action:'seize')` completed Lyn Ch.1
- ~~**Combat forecast tool**~~ — **BUILT.** `fe7_forecast` ships
- ~~**Movement grid decoded with hardcoded geometry**~~ — **FIXED.** It is derived per chapter
  from the row-pointer table. This was chapter-blocking: it made Lyn Ch.1 unwinnable and
  invented ~300 phantom destinations on Ch.7
- **Remaining `0x00400000` state-flag bits at unit `+0x0C`** — bit 0 is known
  (selected/in motion); the rest are unmapped
- **The menu allocator** — which slot a given menu lands in, and why it varies between runs
- **Purpose of the second `"Mark"` copy at `0x02020160`**
- **Exact sync trigger for the play-state cursor copy at `0x0202BC0A`**
- ~~**Objective text**~~ — **ANSWERED 2026-08-27** via `fe7_unstick`'s screenshot: this chapter
  is **"Defend Nils", turn limit 11**. A defend map, so survival to turn 11 is the win condition,
  not killing 50 enemies. The RAM encoding is still unlocated, but the gameplay question is closed

---

## Standing method notes

Full versions in RAM.md. The three that have cost the most time:

1. **Measure the noise floor before believing a diff count.** IWRAM churns 3402 of 32768
   bytes while idle; EWRAM churns 9. Four movement-map hunts failed on this before anyone
   measured it.
2. **Location is not semantics.** Every disproven claim in this project established an
   address's *location* by diff, then asserted its *meaning* without a separate test. Each
   survived two or three samples and broke on the fourth.
3. **A failed prediction has two explanations** — the hypothesis is wrong, or the
   prediction was. Ruling out the second needs its own check.
