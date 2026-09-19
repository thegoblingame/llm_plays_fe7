"""Optional quota gate for playthrough/run.sh.

Prints one line:  ok            -> start the next session
                  wait <secs>   -> both/either rate-limit window is above THRESHOLD; sleep this long
Exit code 1 with a message on stderr if the usage endpoint or credentials cannot be read.

Same idea as scripts/anthropic_wrapper.sh, which only worked on macOS (Keychain, BSD date):
read the Claude Code OAuth token, ask Anthropic's usage endpoint for the 5-hour and 7-day
utilization, and if either is at or above the threshold, report how long until it resets.

Known limitation (checked 2026-09-19): the endpoint requires the OAuth scope `user:profile`,
and the token Claude Code stored on this machine only carries `user:inference`, so it answers
403 "oauth_scope_insufficient". A fresh `/login` may grant the extra scope. Until then this
script fails, and run.sh treats a failed check as "start the session anyway".
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone

THRESHOLD = float(os.environ.get("QUOTA_THRESHOLD", "95"))
BUFFER_SECONDS = 30
MIN_WAIT = 60


def token() -> str:
    path = os.path.expanduser("~/.claude/.credentials.json")
    with open(path, encoding="utf-8") as f:
        tok = json.load(f).get("claudeAiOauth", {}).get("accessToken")
    if not tok:
        sys.exit("quota.py: no accessToken in ~/.claude/.credentials.json")
    return tok


def usage() -> dict:
    req = urllib.request.Request(
        "https://api.anthropic.com/api/oauth/usage",
        headers={
            "Authorization": f"Bearer {token()}",
            "Content-Type": "application/json",
            "anthropic-beta": "oauth-2025-04-20",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def seconds_until(iso: str) -> int:
    reset = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return int((reset - datetime.now(timezone.utc)).total_seconds()) + BUFFER_SECONDS


def main() -> None:
    try:
        u = usage()
    except Exception as e:  # noqa: BLE001 - any failure means "cannot gate", and the caller decides
        sys.exit(f"quota.py: usage request failed: {e}")

    waits = []
    for window in ("five_hour", "seven_day"):
        w = u.get(window) or {}
        util = float(w.get("utilization") or 0)
        print(f"{window}: {util:.0f}%", file=sys.stderr)
        if util >= THRESHOLD and w.get("resets_at"):
            waits.append(seconds_until(w["resets_at"]))

    if not waits:
        print("ok")
    else:
        print(f"wait {max(max(waits), MIN_WAIT)}")


if __name__ == "__main__":
    main()
