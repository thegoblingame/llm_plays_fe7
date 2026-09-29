import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
const m = new MgbaClient("127.0.0.1", 8765);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const f=async()=>(await m.call("get_info",{})).frame;
const a=await f(); await sleep(1500); const b=await f();
console.log(`frame ${a} -> ${b} after 1.5s  (delta ${b-a})`);
console.log(b===a ? "\nTHE EMULATOR IS NOT ADVANCING FRAMES — it is paused or the window is inactive.\nNo amount of button pressing can matter; nothing is being simulated."
                  : `\nemulator is running (~${Math.round((b-a)/1.5)} fps)`);
process.exit(0);
