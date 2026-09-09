import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
import { copyFile } from "node:fs/promises";
const m = new MgbaClient("127.0.0.1", 8765);
const p = await m.call("screenshot", {});
await copyFile(p, "/private/tmp/claude-501/-Users-grantnathanielbrown-Desktop-repos-mcp-mgba/231d78d5-bb93-4c7e-9e48-9eeb31588289/scratchpad/stuck.png");
console.log("saved");
process.exit(0);
