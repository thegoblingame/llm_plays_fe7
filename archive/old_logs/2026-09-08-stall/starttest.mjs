import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
import { copyFile } from "node:fs/promises";
const m = new MgbaClient("127.0.0.1", 8765);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const D="/private/tmp/claude-501/-Users-grantnathanielbrown-Desktop-repos-mcp-mgba/231d78d5-bb93-4c7e-9e48-9eeb31588289/scratchpad/";
const shot=async n=>{const p=await m.call("screenshot",{}); await copyFile(p,D+n); return p;};
const u16=(b,o)=>b[o]|(b[o+1]<<8);
const cur=async()=>{const c=await m.call("read_range",{address:0x0202bbcc,length:4});return`(${u16(c,0)},${u16(c,2)})`;};
const ph=await m.call("read_range",{address:0x0202bc07,length:2});
console.log(`phase 0x${ph[0].toString(16)} turn ${ph[1]} cursor ${await cur()}`);

await m.call("snapshot_memory",{name:"st",address:0x02024000,length:8192});
await shot("st_before.png");
console.log("\npressing Start exactly as awaitPlayerPhase does (frames 4, release 12)...");
await m.call("press_sequence",{presses:[{buttons:["Start"],frames:4,release_frames:12}]});
await sleep(900);
await shot("st_after4.png");
const d1=await m.call("diff_memory",{name:"st",predicate:"changed",width:1,max_results:512});
console.log(`  UI-arena bytes changed: ${(d1.changes||[]).length}   cursor ${await cur()}`);

console.log("\npressing Start again, longer hold (frames 12, release 20)...");
await m.call("snapshot_memory",{name:"st2",address:0x02024000,length:8192});
await m.call("press_sequence",{presses:[{buttons:["Start"],frames:12,release_frames:20}]});
await sleep(900);
await shot("st_after12.png");
const d2=await m.call("diff_memory",{name:"st2",predicate:"changed",width:1,max_results:512});
console.log(`  UI-arena bytes changed: ${(d2.changes||[]).length}   cursor ${await cur()}`);
process.exit(0);
