# FE7 Backlog

**Consolidated 2026-08-26.** Single ranked list of what we don't know and what we can't
do yet, merged from `RAM.md` ("Open questions") and `attempts/HANDOFF.md` ("Known gaps in
the tools"). Those sections remain authoritative for detail; this file is the entry point.

Each item is tagged with its lane:

- **[mem]** — needs live snapshot/diff against the emulator → `memory-investigator` agent
- **[tool]** — needs code in `mcp-mgba/src/fe7.ts` → implementer session
- **[both]** — a memory find that then needs a tool built on top of it

---

## P0 — blocking real play

### 1. Combat forecast / derived stats — [both]

**Status:** unlocated. The last big RAM unknown.

Atk / Crit / Hit / Avoid are computed and displayed by the game, so they exist in RAM.
Finding them solves *two* problems at once:

- Lets us evaluate a trade before committing to it, instead of swinging blind.
- Fixes **target readback**. `fe7_act(action:"attack")` currently presses Right blindly to
  cycle targets and cannot tell which enemy is selected. On turn 4 this cost a kill:
  Bartre at 4 HP stood between a 4-HP enemy and a full-health one, and a wrong pick would
  have killed him, so the turn was wasted retreating.

**Lever:** the text buffer at `0x0202A5B4` already shows the weapon name and then the
target's class during an attack, so the forecast is being assembled nearby. Snapshot before
opening the attack menu, diff once the forecast is on screen.

### 2. Item / staff / trade actions — [tool]

**Status:** not implemented. `fe7_act` supports `wait` and `attack` only.

Highest-value pure-tool addition. This is why the healer could never heal and why
vulneraries go unused — Bartre sat at 4/40 and *unhealable* not because of game state but
because the tool layer has no verb for it.

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

### 4. Terrain array — [mem]

Lower value than it sounds: the movement grid at `0x030004AC` already answers "is this a
legal destination and what does it cost," so pathing is unblocked. Wanted for terrain
defense/avoid bonuses once the combat forecast makes those meaningful.

**Lever:** look for another row-pointer table shaped like the two already found — 27 rows ×
`0x18`, table ending at its own data. Do *not* search for terrain IDs directly.

### 5. True map dimensions — [mem]

The grid buffer is 24 wide × 27 rows *including* a 2-row top border, so the real map is
smaller. Exact width/height not yet derived. Matters for bounds-checking cursor moves.

### 6. What else can refuse a legal destination — [mem]

Green units accounted for every case observed, but that is not proof there is no other
cause. Currently indistinguishable from a dropped input, which makes it expensive to
debug when it happens.

---

## P2 — curiosity tier

- **Gold** — `0x0202BC00` is a candidate only, Unverified
- **Chapter / map ID** — unlocated
- **`+0x43` vs `+0x45`** — whether they encode different things (moved vs acted?); neither
  confirmed on a *player* unit
- **Remaining `0x00400000` state-flag bits at unit `+0x0C`** — bit 0 is known
  (selected/in motion); the rest are unmapped
- **The menu allocator** — which slot a given menu lands in, and why it varies between runs
- **Purpose of the second `"Mark"` copy at `0x02020160`**
- **Exact sync trigger for the play-state cursor copy at `0x0202BC0A`**
- **Objective text** — not exposed as ASCII; the chapter objective has never been read

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
