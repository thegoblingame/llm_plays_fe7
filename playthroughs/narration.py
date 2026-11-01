"""Pull the PLAN / ACTION narration lines out of a playthrough's session transcripts.

    usage:  python playthroughs/narration.py <playthrough folder> [> narration.txt]
            e.g. python playthroughs/narration.py playthroughs/2026-10-30_20-15

Reads every sessions/sNN.jsonl (the stream-json transcripts run.sh writes), in session
order, and prints each narration line the agent wrote (see "Narrate your decisions" in
vision_runbook.md), tagged with its session. Ends with a per-session tally: narration
lines, screenshots and press sequences, so you can see how often the agent explained itself
relative to how much it looked and pressed.
"""

import json
import re
import sys
from pathlib import Path

# A narration line starts the line with PLAN or ACTION; tolerate a stray bullet, bold or
# backtick in front of the word, which the runbook asks the agent not to add.
NARRATION = re.compile(r"^[\s>*`_-]*(PLAN|ACTION)\b[*`_]*\s*(.*)$")


def session_number(path):
    m = re.match(r"s(\d+)", path.stem)
    return int(m.group(1)) if m else 0


def read_session(path):
    """Return (narration lines, counts) for one stream-json transcript."""
    lines = []
    counts = {"plan": 0, "action": 0, "screenshot": 0, "press": 0}
    seen_tools = set()
    seen_text = set()
    with open(path, encoding="utf-8", errors="replace") as f:
        for raw in f:
            try:
                record = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if record.get("type") != "assistant":
                continue
            message = record.get("message") or {}
            for block in message.get("content") or []:
                kind = block.get("type")
                if kind == "tool_use" and block.get("id") not in seen_tools:
                    seen_tools.add(block.get("id"))
                    name = block.get("name", "")
                    if name.endswith("mgba_screenshot"):
                        counts["screenshot"] += 1
                    elif name.endswith("mgba_press_sequence"):
                        counts["press"] += 1
                elif kind == "text":
                    key = (message.get("id"), block.get("text"))
                    if key in seen_text:
                        continue
                    seen_text.add(key)
                    for text_line in (block.get("text") or "").splitlines():
                        m = NARRATION.match(text_line)
                        if m:
                            word, rest = m.groups()
                            counts[word.lower()] += 1
                            lines.append(f"{word} {rest.strip()}")
    return lines, counts


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    # The agent writes em dashes and the like; Windows consoles default to cp1252.
    sys.stdout.reconfigure(encoding="utf-8")
    sessions = Path(sys.argv[1]) / "sessions"
    transcripts = sorted(sessions.glob("s*.jsonl"), key=session_number)
    if not transcripts:
        sys.exit(f"no sessions/s*.jsonl under {sys.argv[1]}")

    tallies = []
    for path in transcripts:
        lines, counts = read_session(path)
        tallies.append((path.stem, counts))
        for line in lines:
            print(f"{path.stem}  {line}")

    print()
    print("session  plan  action  screenshots  presses")
    for tag, c in tallies:
        print(f"{tag:<7}  {c['plan']:>4}  {c['action']:>6}  {c['screenshot']:>11}  {c['press']:>7}")


if __name__ == "__main__":
    main()
