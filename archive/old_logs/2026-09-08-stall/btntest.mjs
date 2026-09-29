import { MgbaClient } from "/Users/grantnathanielbrown/Desktop/repos/mcp-mgba/dist/mgba.js";
const m = new MgbaClient("127.0.0.1", 8765);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const txt=async()=>{const b=await m.call("read_range",{address:0x0202a5b4,length:64});
  let s=""; for(const c of b){if(!c)break; s+=(c>=0x20&&c<0x7f)?String.fromCharCode(c):".";} return s;};
const ph=async()=>{const b=await m.call("read_range",{address:0x0202bc07,length:2});return`0x${b[0].toString(16)}/t${b[1]}`;};

console.log(`start: phase ${await ph()} text ${JSON.stringify(await txt())}`);
console.log("\n--- 3x Start ---");
for(let i=1;i<=3;i++){
  await m.call("press_sequence",{presses:[{buttons:["Start"],frames:4,release_frames:20}]});
  await sleep(900);
  console.log(`  Start ${i}: phase ${await ph()} text ${JSON.stringify(await txt())}`);
}
console.log("\n--- 3x A ---");
for(let i=1;i<=3;i++){
  await m.call("press_sequence",{presses:[{buttons:["A"],frames:4,release_frames:20}]});
  await sleep(900);
  console.log(`  A ${i}: phase ${await ph()} text ${JSON.stringify(await txt())}`);
}
process.exit(0);
