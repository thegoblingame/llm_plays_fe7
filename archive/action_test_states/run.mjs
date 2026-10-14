// Live regression for fe7_act's actions. Needs mGBA running the US ROM with the
// bridge script loaded, and `npm run build` done in mcp-mgba.
//
//   node archive/action_test_states/run.mjs            every case
//   node archive/action_test_states/run.mjs talk dance only cases whose name contains a word
//
// It LOADS SAVE STATES, so whatever the emulator was doing is replaced. Each case
// loads one of the .ss files beside this script, optionally applies a cheat to set
// the scene (named in the case), calls the BUILT fe7_act directly — no MCP server,
// so no restart is needed after a rebuild — and matches the result text.
//
// The states (Lyn Ch.3/4/8, Hector Ch.14/15) are gitignored like every other state.

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = process.env.MCP_MGBA_DIST ?? resolve(HERE, "../../../mcp-mgba/dist");
process.env.FE7_RUN_LOG ??= join(tmpdir(), "fe7-action-regression.jsonl"); // keep test calls out of the run logs

const { MgbaClient } = await import(pathToFileURL(join(DIST, "mgba.js")).href);
const { handleFe7 } = await import(pathToFileURL(join(DIST, "fe7.js")).href);
const m = new MgbaClient("127.0.0.1", 8765);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rd = (address, length) => m.call("read_range", { address, length });
const wr = (address, ...bytes) => m.call("write_range", { address, bytes });
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const PLAYER = 0x0202bd50, STRIDE = 0x48;
const unitAddr = (slot) => PLAYER + slot * STRIDE;

/** CHEAT: teleport a player unit, keeping the unit-occupancy layer consistent. */
async function teleport(slot, x, y) {
  const b = await rd(unitAddr(slot), 0x14);
  const rows = u32(await rd(0x0202e3dc, 4), 0);
  const tile = async (tx, ty) => u32(await rd(rows + 4 * ty, 4), 0) + tx;
  await wr(await tile(b[0x10], b[0x11]), 0);
  await wr(await tile(x, y), b[0x0b]);
  await wr(unitAddr(slot) + 0x10, x, y);
}

const act = async (p) => (await handleFe7("fe7_act", { reason: "action regression", ...p }, m)).content.map((c) => c.text ?? "").join("\n");

// Cheats, named for what they stand in for.
const nilsIsADancer   = () => wr(unitAddr(5) + 0x04, 0x5c, 0x16, 0xbe, 0x08);   // class ptr -> Dancer (0x40): menu offers Dance, not Play
const nilsHasTwoRings = () => wr(unitAddr(5) + 0x20, 0x7c, 0x0f, 0x7d, 0x0f);   // Filla's Might, Ninis's Grace in slots 1 and 2
const lynIsMounted    = () => wr(unitAddr(0) + 0x04, 0x7c, 0x0e, 0xbe, 0x08);   // class ptr -> Cavalier: Talk then hands her a canto
const unspend         = (slot, low) => wr(unitAddr(slot) + 0x0c, low);
const woundOswin      = () => wr(unitAddr(5) + 0x13, 0x0a);

// One entry per step. `state` starts a fresh scene; steps without it continue the previous one.
const CASES = [
  { name: "play",                       state: "lyn8_play_ready",  call: { slot: 5, x: 3, y: 1, action: "play" }, expect: /REFRESHED/ },
  { name: "dance (Dancer class)",       state: "lyn8_play_ready",  pre: nilsIsADancer, call: { slot: 5, x: 3, y: 1, action: "dance", target_slot: 3 }, expect: /REFRESHED/ },
  { name: "dance, wrong target",        state: "lyn8_play_ready",  call: { slot: 5, x: 3, y: 1, action: "dance", target_slot: 0 }, expect: /is not a Dance\/Play target.*unspent/s },
  { name: "dance, nobody has acted",    call: { slot: 5, x: 4, y: 2, action: "dance" }, expect: /No Dance\/Play entry/ },
  { name: "dance past the ring menu",   state: "lyn8_play_ready",  pre: nilsHasTwoRings, call: { slot: 5, x: 3, y: 1, action: "play" }, expect: /REFRESHED/ },
  { name: "dance, use a ring",          state: "lyn8_play_ready",  pre: nilsHasTwoRings, call: { slot: 5, x: 3, y: 1, action: "play", item_slot: 2, target_slot: 3 }, expect: /USED: the ring went 15 -> 14/ },

  { name: "talk, wrong speaker",        state: "lyn4_talk_ready",  call: { slot: 4, x: 8, y: 6, action: "talk" }, expect: /No Talk entry/ },
  { name: "talk, enemy recruit",        call: { slot: 0, x: 7, y: 5, action: "talk", target_slot: 13, target_faction: "enemy" }, expect: /RECRUITED: ch08 .* PLAYER #5/ },
  { name: "talk, mounted + canto",      state: "lyn4_talk_ready",  pre: lynIsMounted, call: { slot: 0, x: 7, y: 5, action: "talk", canto_x: 7, canto_y: 4 }, expect: /RECRUITED.*moved on to \(7,4\) and Wait committed/s },
  { name: "talk, green recruit",        state: "hec14_talk_green", call: { slot: 7, x: 11, y: 2, action: "talk", target_slot: 0, target_faction: "green" }, expect: /RECRUITED: ch13 left the green side/ },

  { name: "visit village",              state: "lyn3_ready",       call: { slot: 3, x: 3, y: 6, action: "visit" }, expect: /VISITED.*CLOSED.*JOINED: ch0D/s },
  { name: "visit, not a village",       call: { slot: 0, x: 1, y: 7, action: "visit" }, expect: /No Visit entry/ },
  { name: "door, no key",               state: "hec15_ready",      call: { slot: 3, x: 9, y: 5, action: "door" }, expect: /No Door entry/ },
  { name: "door",                       call: { slot: 7, x: 9, y: 5, action: "door" }, expect: /OPENED: \(9,4\) Door 0x1E -> Floor 0x17/ },
  { name: "chest",                      state: "hec15_ready",      pre: () => teleport(7, 3, 14), call: { slot: 7, x: 2, y: 14, action: "chest" }, expect: /OPENED: \(2,14\) Chest 0x21 -> Chest 0x20/ },

  { name: "steal, a weapon",            state: "hec15_steal_ready", call: { slot: 7, x: 12, y: 2, action: "steal", target_slot: 4, item_slot: 0 }, expect: /cannot be stolen.*unspent/s },
  { name: "steal",                      call: { slot: 7, x: 12, y: 2, action: "steal" }, expect: /STOLEN: item 0x6Bx3/ },
  { name: "support",                    state: "hec15_support_ready", call: { slot: 7, x: 5, y: 3, action: "support" }, expect: /SUPPORT GAINED/ },

  { name: "rescue, target not named",   state: "lyn8_play_ready",  call: { slot: 4, x: 2, y: 3, action: "rescue" }, expect: /has 2 possible targets.*unspent/s },
  { name: "rescue + canto",             call: { slot: 4, x: 2, y: 3, action: "rescue", target_slot: 0, canto_x: 4, canto_y: 3 }, expect: /RESCUED.*moved on to \(4,3\) and Wait committed/s },
  { name: "carried unit cannot act",    call: { slot: 0, x: 4, y: 3, action: "wait" }, expect: /is being CARRIED by player #4/ },
  { name: "take (free action)",         call: { slot: 6, x: 3, y: 3, action: "take" }, expect: /#6 is now CARRYING player #0.*FREE action/s },
  { name: "resumed: cannot move",       call: { slot: 6, x: 3, y: 4, action: "wait" }, expect: /already used a free action/ },
  { name: "resumed: drop, no tile",     call: { slot: 6, x: 3, y: 3, action: "drop" }, expect: /has 3 possible targets.*STILL MID-TURN/s },
  { name: "resumed: drop",              call: { slot: 6, x: 3, y: 3, action: "drop", target_x: 3, target_y: 4 }, expect: /DROPPED: player #0 now stands at \(3,4\)/ },
  { name: "give (free action)",         state: "lyn8_play_ready",  pre: async () => { await act({ slot: 4, x: 2, y: 3, action: "rescue", target_slot: 0 }); await unspend(4, 0x10); },
                                        call: { slot: 4, x: 2, y: 3, action: "give", target_slot: 6 }, expect: /#4 is now carrying nobody, and player #6 ch10 is CARRYING player #0/ },
  { name: "other unit while menu open", call: { slot: 5, x: 3, y: 1, action: "play" }, expect: /REFRESHED/ },

  { name: "trade, nothing named",       state: "lyn8_play_ready",  call: { slot: 0, x: 2, y: 2, action: "trade", target_slot: 3 }, expect: /say what to move.*unspent/s },
  { name: "trade, give",                call: { slot: 0, x: 2, y: 2, action: "trade", target_slot: 3, item_slot: 2 }, expect: /TRADED.*\[2Cx26\] -> \[2Cx26,6Bx2\]/s },
  { name: "resumed: wait",              call: { slot: 0, x: 2, y: 2, action: "wait" }, expect: /Wait committed.*SPENT/s },
  { name: "trade, take",                state: "lyn8_play_ready",  call: { slot: 0, x: 2, y: 2, action: "trade", target_slot: 2, take_item_slot: 1 }, expect: /TRADED.*-> \[15x18,69x1\]/s },
  { name: "trade, swap after a move",   state: "lyn8_play_ready",  call: { slot: 4, x: 3, y: 2, action: "trade", target_x: 2, target_y: 2, item_slot: 0, take_item_slot: 3 }, expect: /TRADED.*\[32x2,6Bx3\] -> \[1Fx45,6Bx3\]/s },

  // The actions that already worked, to prove the shared opening still does.
  { name: "attack (regression)",        state: "lyn4_talk_ready",  call: { slot: 0, x: 7, y: 5, action: "attack", target_slot: 13 }, expect: /attacked from \(7,5\)/ },
  { name: "staff (regression)",         state: "hec15_ready",      pre: woundOswin, call: { slot: 6, x: 4, y: 4, action: "staff", target_slot: 5 }, expect: /used staff 4A on player #5 — HP 10 -> / },
  { name: "wait (regression)",          call: { slot: 3, x: 9, y: 5, action: "wait" }, expect: /Wait committed/ },
];

const only = process.argv.slice(2).map((w) => w.toLowerCase());
let pass = 0, fail = 0, skipping = false;
for (const c of CASES) {
  // A continuation step only makes sense if the step that set its scene ran.
  if (c.state) skipping = only.length > 0 && !only.some((w) => c.name.toLowerCase().includes(w));
  else if (only.length && !only.some((w) => c.name.toLowerCase().includes(w)) && skipping) continue;
  if (skipping) continue;

  if (c.state) { await m.call("load_state", { path: join(HERE, `${c.state}.ss`).replace(/\\/g, "/") }); await sleep(500); }
  if (c.pre) await c.pre();
  const started = Date.now();
  const text = await act(c.call);
  const ok = c.expect.test(text);
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.name.padEnd(28)} ${((Date.now() - started) / 1000).toFixed(1)}s`);
  if (!ok) console.log(`      expected ${c.expect}\n      got: ${text.replace(/\n/g, "\n           ")}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
m.disconnect();
process.exit(fail ? 1 : 0);
