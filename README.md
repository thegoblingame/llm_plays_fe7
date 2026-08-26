# Claude Starterkit

A minimal template for spinning up vibe-coding projects with Claude. Copy this repo, rename it, and start building.

---

## Getting Started

1. Copy this repo into a new folder with your project name
2. Rename the folder to match your new project
3. Run `/github-init` to push it to GitHub

That's it. Claude handles the rest.

---

## Skills

Skills are slash commands that Claude can invoke on your behalf. They live in `.claude/skills/` and are available in any Claude Code session inside this project.

### `/github-init`

Initializes the current directory as a git repo, makes an initial commit, and pushes to a GitHub remote with the same name as the folder.

```
/github-init
```

> Requires the `gh` CLI to be installed and authenticated (`brew install gh && gh auth login`). The repo is created as public under `thegoblingame`.

---

### `/commit-push`

Stages all changes, commits with your message, and pushes to the current remote branch in one step.

```
/commit-push "your commit message"
```

---

### `/new-branch`

Checks out `main`, pulls the latest, then creates and switches to a new branch.

```
/new-branch "feature/my-feature"
```

---

## Scripts

Standalone shell scripts in `scripts/` for automation outside of Claude Code sessions.

### `ralph_wrapper_claude.sh`

A quota-aware Claude runner that loops continuously, feeding `prompt.md` to Claude and writing output to `output.txt`. It monitors your 5-hour and 7-day usage windows via the Anthropic OAuth API and automatically waits until quota resets before running again.

**Use this when you want Claude to run autonomously and repeatedly on a prompt without hitting rate limits.**

**Requirements:**
- `jq` installed (`brew install jq`)
- Claude Code credentials in macOS Keychain (standard Claude Code install provides this)
- A `prompt.md` file in the same directory as the script

**Usage:**
```bash
# Write your prompt
echo "Your task here" > prompt.md

# Run the wrapper (loops indefinitely)
./scripts/ralph_wrapper_claude.sh
```

Output is appended to `output.txt` with timestamps. The script uses `--dangerously-skip-permissions` and runs on Opus by default.

**Quota thresholds:**

| Window  | Threshold | Behavior                          |
|---------|-----------|-----------------------------------|
| 5-hour  | 95%       | Waits until 5-hour window resets  |
| 7-day   | 95%       | Waits until 7-day window resets   |

---

## File Structure

```
claude_starterkit/
├── .claude/
│   └── skills/
│       ├── github-init/        # /github-init skill
│       ├── commit-push/        # /commit-push skill
│       └── new-branch/         # /new-branch skill
├── scripts/
│   └── ralph_wrapper_claude.sh # Quota-aware autonomous Claude runner
├── misc/                       # Scratch space / garbage drawer
├── prompt.md                   # Prompt file for ralph_wrapper_claude.sh
└── README.md
```

---

## Workflow

```
Copy repo -> Rename folder -> /github-init -> start building
```

When you want to run Claude autonomously on a repeating task, write your instructions to `prompt.md` and run `ralph_wrapper_claude.sh`. It will keep running until you kill it, respecting rate limits automatically.
