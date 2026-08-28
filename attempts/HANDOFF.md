> **SUPERSEDED — kept for history.** Written 2026-08-11. Several claims here are now known
> to be wrong or stale: the combat forecast has since been found, staff and item actions
> exist, and the chapter objective is known ("Defend Nils", 11-turn limit). Read the repo
> `README.md` and `BACKLOG.md` instead.

# Handoff — FE7

**Written:** 2026-08-11 (supersedes the 2026-08-10 handoff)
**Read this, then `llm_plays_fe7/RAM.md`.**

---

## What changed today

The previous handoff's task — find the movement range map — is **done**, and the project moved
from *mapping RAM* to *actually playing*. There is now a game-specific tool layer.

### 1. Movement range map — FOUND

IWRAM `0x030004AC`, row-pointer table at `0x03000440` (base `0x03000448` for `y=0`), 27 rows ×
24 bytes, `row = y + 2`, `col = x`. Value = movement cost spent, `0xFF` = unreachable. Full
write-up in `RAM.md`.

The earlier failure was **measurement, not hypothesis**: IWRAM churns 3402 of its 32768 bytes
while the game sits idle, so the old "3580 changes on selection, IWRAM is hopeless" verdict was
~3400 noise + ~180 signal. `exclude=` (noise-floor subtraction) made it trivial.

### 2. FE7 tool layer — `mcp-mgba/src/fe7.ts`

Five tools: `fe7_state`, `fe7_reachable`, `fe7_act`, `fe7_end_turn`, `fe7_wait`.

**All orchestration is TypeScript, not Lua, and that is deliberate.** bridge.lua's RPC handlers
run *inside* mGBA's frame callback, so a Lua handler that waited for frames would deadlock the
emulator. Node is a separate process and can press → poll memory → press again. Consequence:
**editing fe7.ts needs `npm run build` + a Claude Code restart, but NOT an mGBA restart.**

Everything confirms **by effect**: cursor against the live cursor, selection against `+0x0C`
bit 0, a completed walk against `+0x10/+0x11`, a commit against the spent flag.

---

## Discoveries that broke previously-documented "facts"

These all came from the tools failing in production. Each was a documented claim that was wrong.

| Old claim | Reality |
|---|---|
| "No NPC/green array exists" | **It does — `0x0202DCD0`**, roster `0x41`–`0x47` |
| Arrays are "packed contiguously, no gaps" | Holes appear mid-chapter; slot 23 was empty while 24–29 held units |
| Has-acted is `+0x0C == 0x42` | After **combat** a spent unit sits at `0x02`. Test bit 1, not equality |
| `cost != 0xFF` means you can stop there | It's a *pathfinding cost* map; it includes tiles occupied by units |
| Text buffer shows the highlighted menu entry | It shows the **last label rendered**, which only coincidentally matched |

**The green array is the big one.** Green units occupy tiles, appear in the cost map as ordinary
pass-through, and were invisible to an occupancy check that only read the player and enemy
arrays. A destination read as reachable-and-unoccupied and was then silently refused —
indistinguishable from a dropped input. Proven with a live control: a green unit on `(10,1)`,
move there → *"cost 1, unoccupied"* → nothing happens.

I also chased a **red herring** on this: two refused tiles both returned terrain name `"Ostia"`,
which looked like a great explanation. The terrain was irrelevant. Don't trust the first
coherent story.

---

## Current game state

Mid-chapter, **turn 5**, player phase. Hector-mode chapter with the Four Fangs opening; green
allies present; objective never identified (objective text is not exposed as ASCII).

- **11 player units alive.** Lost #10 (healer, turn 2) and #8 (turn 4).
- **Hector `#0` at 14/30** — his death ends the run.
- Bartre `#5` at **4/40** and **unhealable** (healer dead, he carries no vulnerary).
- **47 enemies and still growing** — reinforcements arrive most turns. Only 1 green left.

**It is going badly and that is fine** — Grant's position is that losses are inevitable and
restarts are free. The goal is turns survived, not victory.

Suggested plan for turn 5: stop holding the open y=6–7 line (enemies flank west through y=7)
and pull into the y=3–5 corridor, which is only two tiles wide.

---

## Known gaps in the tools

1. **Target selection can't be read back.** With two adjacent enemies, `fe7_act(action:"attack")`
   can't tell which one is selected — `target_cycle` presses Right blindly and you verify from
   the returned HP deltas. This cost a kill on turn 4: Bartre at 4 HP was next to a 4-HP enemy
   *and* a full-health one, and a wrong pick would have killed him, so I retreated instead.
   **Fixing this is the same problem as the combat forecast** (below).
2. **No item / staff / trade actions.** `fe7_act` does `wait` and `attack` only. This is why the
   healer couldn't heal and why vulneraries go unused. Highest-value addition.
3. **Combat forecast still unmapped** — the last big RAM unknown. You get very close to it
   naturally: during an attack the buffer at `0x0202A5B4` shows the weapon name, then the
   target's class. Snapshot before opening the attack menu and diff once the forecast is up.

---

## Practical notes

- **Enemy phase runs ~4 minutes** with ~45 enemies. That is the floor — **battle animations are
  already off**; what remains is map movement and health bars. Don't suggest turning them off.
  Grant is explicitly unbothered by the wait; don't optimise for speed over correctness.
- `fe7_end_turn` returns in ~12s and hands off to `fe7_wait` (~90s chunks) because any single
  tool call is force-backgrounded at ~120s. `fe7_wait` presses A about once a second, which
  clears death quotes and event text without needing to detect them.
- **Hex→decimal conversion is a genuine hazard** — I got it wrong three times today. Convert
  with a shell one-liner, don't do it in your head. Better: use the `fe7_*` tools, which take
  tile coordinates and slot numbers.
- Screenshots: Grant offered to allow them as a diagnostic exception. I declined for now, on the
  grounds that a screenshot speeds up *diagnosis* but the *fix* still has to be memory- or
  input-based, and the autonomous run won't have eyes. The offer stands if memory genuinely
  can't separate two states — log any use.

## The meta-lesson, again

Every bug today was **a semantics claim asserted from a structure that only supported a location
claim**, and each one survived two or three samples before breaking on the fourth. The tool
layer helps because it forces the claim into code where it fails loudly — but it also *encodes*
the wrong claim, so a tool that says "unoccupied" with confidence is worse than one that reports
cost and occupancy separately. Keep tools reporting raw facts alongside interpretations.
