import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
import { handleFe7 } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/fe7.js";
const m = new MgbaClient("127.0.0.1", 8765);
const txt=r=>r.content.map(c=>c.type==="text"?c.text:`[${c.type}]`).join("\n");
console.log(txt(await handleFe7("fe7_end_turn",{timeout_ms:5000},m)).split("\n")[0]);
console.log("\n--- fe7_wait ---");
const t=Date.now();
const out = txt(await handleFe7("fe7_wait",{timeout_ms:110000},m));
console.log(out);
console.log(`(${((Date.now()-t)/1000).toFixed(1)}s)`);
// sanity: no HP line may show a large positive jump now
const hp = (out.match(/^  HP: +(.*)$/m)||[])[1] ?? "";
const jumps = [...hp.matchAll(/\(\+(\d+)\)/g)].map(x=>+x[1]).filter(v=>v>10);
console.log(`\nimplausible heals (>+10) still reported as HP deltas: ${jumps.length ? jumps.join(",") : "none"}`);
process.exit(0);
