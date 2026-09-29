import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
import { handleFe7 } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/fe7.js";
const m = new MgbaClient("127.0.0.1", 8765);
const r = await handleFe7("fe7_unstick",{},m);
console.log(r.content.filter(c=>c.type==="text").map(c=>c.text).join("\n"));
process.exit(0);
