# Enemy-phase stall — Ch.22, turn 4 — 2026-09-08 ~20:11–20:17 EDT

Reconstructed from `runs/2026-09-09.jsonl` (the run log rolled to the next UTC day at
20:00 EDT, which is why the incident is not in `2026-09-08.jsonl`), plus the scratchpad
scripts and `stuck.png`, all copied here.

All times EDT. Tool calls are from the run log; script runs are from file mtimes.

| Time | What | Result |
|---|---|---|
| 20:05:27 | `fe7_end_turn` | turn 3 ends |
| 20:06:49 | `fe7_wait` 82.2s | **player phase turn 4, "cleared 2 event sequences with Start"** |
| 20:07:49 | `fe7_end_turn` | turn 4 ends, enemy phase begins |
| 20:09:40 | `fe7_wait` 110.6s | "Units **did** move" — enemies 49→47, green 4→3, #8 and #9 damaged |
| 20:11:42 | `fe7_wait` 112.0s | **NOTHING CHANGED** |
| 20:13:34 | `fe7_wait` 112.0s | **NOTHING CHANGED** |
| 20:15:26 | `fe7_wait` 112.0s | **NOTHING CHANGED** |
| 20:15:37 | `fe7_unstick` | phase `0x80`, turn 4, cursor (17,8), no unit selected, **text buffer `"Avoid."`**, Up moved nothing, only 11 bytes changed in the UI arena |
| 20:15:54 | `frames.mjs` | emulator running at **~61 fps** — not paused |
| 20:16:23 | `unblock.mjs` | pressed **B**, then **Start**, then **A**; reported "no movement" after each — but it measured *enemy positions*, which a dialogue advancing would not change |
| 20:16:52 | `shot.mjs` | `stuck.png`: dialogue box **`"...Urggh..."`** with the ▼ continue marker and a red-haired portrait |
| 20:17:18 | `btntest.mjs` | buffer `"........Urggh....."`; **3× Start → unchanged**; **1st A → `"Merc"`** |
| 20:19:59 | `fe7_wait` | "Already the player phase (turn 5)" |
| 20:21:23 | `fe7_wait` 64.7s | player phase turn 6, cleared 1 event sequence — normal again |

Freeze began between 20:11:30 and 20:11:42. Duration to first A ≈ **5 min 50 s**.
During it `awaitPlayerPhase` was **Start-only** (pre-alternation), ~1 press/sec ≈ **300 presses**.

## The correction that matters

At 20:15:37 — four minutes into the stall — the text buffer read **`"Avoid."`**, a stat
label, not a death quote. The `"...Urggh..."` box is first evidenced at 20:16:52, **after**
`unblock.mjs` had pressed B, Start and A.

So the ~300 Start presses were **not** sent at a death quote. Two different screens were
involved, and the claim "300 Start presses failed to clear a death quote" is not supported
by this log.

The `btntest.mjs` result (3× Start no-op, then A clears) *is* a direct test against the
death quote — but taken ~6 minutes into an already-wedged state and after `unblock.mjs`
had already sent an A. It is suggestive, not clean. Manual testing on 2026-09-09 found
Start **does** skip death dialogue, green units included.

## CAUSE UNDETERMINED — open work for the next agent

Two explanations were proposed during the session and **both are dead**:

1. ~~"The bridge's Start press never reached the game."~~ Disproved: `KEY_BIT.Start = 3`
   is correct and a press with the loop's exact parameters (`frames:4, release_frames:12`)
   demonstrably works — see `starttest.mjs` and `st_before/after4/after12.png`.
2. ~~"Start is a minimap toggle, so ~300 presses cancelled each other out."~~ Disproved:
   Start **does not open the minimap during the enemy phase** (Grant, confirmed by hand
   2026-09-09), and this stall was on the enemy phase (`0x80`) from start to finish.

**So the cause is undetermined.** Do not repeat either theory as fact.

### Established facts to work from

- The board did not move for ~5 m 50 s; phase pinned at `0x80`; emulator running at 61 fps.
- The tooling was healthy throughout: all three `fe7_wait` calls returned normally
  (~112 s against a 110 s timeout) and `fe7_unstick` completed mid-stall in 1166 ms
  including a screenshot. Not a hang, not a dropped press, not an unresolved call.
- A green unit died in the window ending exactly as the board stopped (green 4 → 3).
- `stuck.png` (20:16:52) shows a death quote — Wrath, a green unit — with the ▼ marker.
- `btntest.mjs` (20:17:18): 3× Start left the buffer unchanged; the first A cleared it.
- Grant has since confirmed by hand that **Start does skip a green unit's death dialog**,
  so the btntest observation is not a general rule about Start.
- `"cleared 2 event sequences with Start"` in the 20:06:49 log line is **player-phase**
  evidence only — that counter lives in the post-flip loop, which runs when the phase byte
  already reads `0x00`. It says nothing about Start during the enemy phase.
- The `"Avoid."` buffer read at 20:15:37 is unexplained. That buffer is a stale-prone
  staging buffer; do not build a theory on it.

### No save state exists for the window

### Earlier notes (superseded)

Why the enemy phase froze at all, with the emulator running at 61 fps, phase stuck at
`0x80`, and `"Avoid."` on screen. `"Avoid"` is a combat-forecast / unit-info stat label,
which suggests the game was sitting on a battle display rather than a conversation.

**Leading hypothesis worth testing:** a Start press landing at a particular moment during
the enemy phase (a battle transition, say) wedges it. Note this risk is NOT retired — the
current code still presses Start during the enemy phase, now alternating with A.

Counter-evidence: the immediately preceding wait (20:06:49) pressed ~80 Starts through a
full enemy phase with no problem, and the following one (20:21:23) completed in 64.7 s.

## No save state exists for this window

Nearest are `pre-start-probe.ss` (16:58, turn 3 enemy phase) and `raven-handaxe.ss`
(17:45, turn 1) — both hours earlier and on a different board state. Nothing was saved
between 20:05 and 20:22.

## Files here

- `stuck.png` — the screen at 20:16:52
- `calls.jsonl` — the 12 logged tool calls, 20:05–20:22, full results
- the scripts that ran, in order: `verify-p3b`, `verify-p3c`, `diag`, `frames`, `unblock`, `shot`, `btntest`, `verify-final`
