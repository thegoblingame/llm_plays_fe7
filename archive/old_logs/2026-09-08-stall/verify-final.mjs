import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
import { handleFe7 } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/fe7.js";
const m = new MgbaClient("127.0.0.1", 8765);
const txt=r=>r.content.map(c=>c.type==="text"?c.text:`[${c.type}]`).join("\n");
for (let i=1;i<=3;i++){
  const t=Date.now();
  const out = txt(await handleFe7("fe7_wait",{timeout_ms:110000},m));
  console.log(`--- call ${i} (${((Date.now()-t)/1000).toFixed(0)}s) ---\n${out}\n`);
  if (/^(Player phase resumed|Already the player phase)/.test(out)) break;
}
process.exit(0);
