# Setup

Getting from a bare clone to a session that can actually play. Assumes a machine with
nothing installed.

Once it runs, `README.md` → "How to actually run anything" is the **runtime** checklist —
the three things that must be true every session. This file is how you get there the first
time.

---

## What a clone does not give you

Everything here is deliberate, and each one fails differently when missing.

| Missing | Why it isn't in the repo | Symptom if you skip it |
|---|---|---|
| The ROM | Copyrighted; not ours to distribute | `fe7_state` returns turn 0 and no units |
| `.sav` / savestates | Derived from the ROM, and binary churn | No progress to resume from |
| `node_modules/`, `dist/` | Build artifacts | The MCP server won't start |
| MCP registration | Lives in `~/.claude.json`, not either repo | **A session with zero `mgba_*` tools and no error** |
| `runs/videos/`, `misc/` | Gitignored — large, and scratch | Nothing; they are not needed to run |

---

## 1. Prerequisites

- **mGBA 0.10 or newer** with Lua scripting. Confirmed on 0.10.5.
- **Node 22+** (the MCP server is ESM and targets modern Node).
- **The ROM** — Fire Emblem: The Blazing Blade, **US release, `AGB-AE7E`**. Supply your own.

**The region is not negotiable.** Every address in `RAM.md` is US-release specific. A EU or
JP ROM will decode to plausible-looking garbage rather than failing loudly, which is the
worst failure mode available. Check the ROM code before anything else.

---

## 2. Clone both repos

```bash
mkdir -p ~/Desktop/repos && cd ~/Desktop/repos
git clone git@github.com:thegoblingame/llm_plays_fe7.git
git clone git@github.com:thegoblingame/mcp-mgba.git
```

**The path matters more than it should.** `src/fe7.ts` defaults the run log to
`$HOME/Desktop/repos/llm_plays_fe7/runs/<date>.jsonl`. Clone somewhere else and logging
still "works" — it creates the directory it expects — so your runs quietly land in a
directory you are not reading. Either use the path above, or set `FE7_RUN_LOG` in step 4.

---

## 3. Build the machinery

```bash
cd ~/Desktop/repos/mcp-mgba
npm install
npm run build
```

`dist/` is gitignored, so this is required on every fresh clone, not just the first.

---

## 4. Register the MCP server

```bash
claude mcp add mgba -- node ~/Desktop/repos/mcp-mgba/dist/index.js
claude mcp list          # verify it resolves
```

Two things go wrong here, and both are silent:

- **The path must be absolute and must match this machine.** Copying the JSON from another
  computer carries that computer's username with it.
- **Do not register a bare `mcp-mgba` command.** There is no global install; it resolves to
  nothing, the server never starts, and the session comes up with no `mgba_*` tools and no
  error explaining why.

Optional environment overrides, set under the server's `env` key:

| Variable | Default | Use |
|---|---|---|
| `MGBA_HOST` / `MGBA_PORT` | `127.0.0.1` / `8765` | Point at a different mGBA instance |
| `FE7_RUN_LOG` | `~/Desktop/repos/llm_plays_fe7/runs/<date>.jsonl` | Send run logs elsewhere |

---

## 5. Load the Lua bridge

In mGBA: load the ROM, then **Tools → Scripting → File → Load script** →
`~/Desktop/repos/mcp-mgba/lua/bridge.lua`.

This step is manual and cannot currently be scripted — **mGBA 0.10.5 has no `--script`
command-line flag** (`--help` lists none). It must be redone after every mGBA restart.

The bridge binds `127.0.0.1:8765`. Only one instance can hold that port, so a second copy of
the script — or a second emulator — fails to bind until the port is freed or `PORT` in
`bridge.lua` is changed.

---

## 6. Verify

```bash
lsof -nP -iTCP:8765 | grep LISTEN     # the bridge is up
```

Then, in a **fresh** Claude Code session, call `fe7_state`. A battlefield with units in it
means every layer is connected. Turn 0 with no units means no chapter is loaded.

---

## Things that will bite you

- **After editing any `src/*.ts`: `npm run build` *and restart Claude Code*.** The MCP server
  is a subprocess spawned at session start, so a running session keeps using the old `dist/`.
  The change appears to do nothing, with no error. This is the single most time-wasting
  gotcha in the project.
- **After editing `lua/bridge.lua`: restart mGBA.** The old script still holds port 8765, so
  a reload fails to bind. (Prefer not to edit it at all — see `mcp-mgba/CLAUDE.md`.)
- **Port 8765 is single-occupancy.** Two emulators cannot both serve the bridge unmodified.
- **Two mGBA instances on one ROM will corrupt the save.** They share the `.sav` file unless
  each is given its own `savegamePath` via `-C`.
