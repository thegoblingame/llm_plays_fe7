import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
const m = new MgbaClient("127.0.0.1", 8765);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const u32=(b,o)=>(b[o]|(b[o+1]<<8)|(b[o+2]<<16)|(b[o+3]<<24))>>>0;
const fp=async()=>{ // positions+HP of every live enemy, plus phase/turn
  const b=await m.call("read_range",{address:0x0202cec0,length:50*0x48});
  const ph=await m.call("read_range",{address:0x0202bc07,length:2});
  let s=`${ph[0]}/${ph[1]}`;
  for(let i=0;i<50;i++){const o=i*0x48; if(u32(b,o)===0)continue; if(b[o+0x10]===0xff||b[o+0x13]===0)continue;
    s+=`|${i}:${b[o+0x10]},${b[o+0x11]}:${b[o+0x13]}`;}
  return s;};

const a=await fp(); await sleep(4000); const b=await fp();
console.log("baseline: board moving without any input?", a!==b ? "YES" : "NO");

console.log("\npressing B once...");
await m.call("press_sequence",{presses:[{buttons:["B"],frames:4,release_frames:20}]});
await sleep(4000);
const c=await fp();
console.log("after B: board moving?", c!==b ? "YES — something modal was blocking it" : "NO");

if (c===b) {
  console.log("\npressing Start once (toggles the minimap shut if that is what is up)...");
  await m.call("press_sequence",{presses:[{buttons:["Start"],frames:4,release_frames:20}]});
  await sleep(4000);
  const d=await fp();
  console.log("after Start: board moving?", d!==c ? "YES — a Start-toggled screen was blocking it" : "NO");
  if (d===c) {
    console.log("\npressing A once...");
    await m.call("press_sequence",{presses:[{buttons:["A"],frames:4,release_frames:20}]});
    await sleep(4000);
    console.log("after A: board moving?", (await fp())!==d ? "YES" : "NO — still frozen");
  }
}
process.exit(0);
