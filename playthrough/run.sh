#!/usr/bin/env bash
# One fresh Claude session per chapter, until the game is beaten, a session reports
# LOST or STUCK, a STOP file appears, or MAX_SESSIONS is reached.
#
#   usage:  playthrough/run.sh [model] [effort]        e.g.  playthrough/run.sh fable medium
#   stop:   touch playthrough/STOP    (takes effect between sessions; delete it to resume)
#   env:    MAX_SESSIONS (default 45)  RETRY_WAIT seconds (default 900)  MAX_FAILS (default 6)
#           QUOTA_WAIT=1 to check plan usage before each session and sleep until the 5-hour /
#           7-day window resets when either is at or above QUOTA_THRESHOLD (default 95). Off by
#           default; see playthrough/quota.py.
#
# Each session gets PLAYTHROUGH_RUNBOOK.md on stdin with a one-line header naming its tag,
# its own MCP config (so the fe7 tool log lands in runs/playthrough-<date>-<tag>.jsonl
# instead of the single file hardcoded in ~/.claude.json), and a fresh MCP server process.
# The full stream-json transcript is kept in playthrough/sessions/<tag>.jsonl.
#
# After each session the token usage and cost from the transcript's final "result" record are
# printed and appended to playthrough/usage.tsv, with running totals for the whole run.
#
# The session's last line must be PLAYTHROUGH_RESULT=WON|LOST|STUCK (see the runbook).
# WON  -> next session.   LOST / STUCK -> halt for the human.
# none -> the session died; wait RETRY_WAIT and start a fresh session on the same chapter.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"          # llm_plays_fe7
PT="$ROOT/playthrough"
MCP_SERVER="$(cd "$ROOT/../mcp-mgba" && pwd)/dist/index.js"
# Paths handed to node must be Windows-style: Git Bash's /c/Users/... is read by node as C:\c\Users\...
winpath() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s' "$1"; fi; }
MODEL="${1:-fable}"
EFFORT="${2:-medium}"
MAX_SESSIONS="${MAX_SESSIONS:-45}"
RETRY_WAIT="${RETRY_WAIT:-900}"
MAX_FAILS="${MAX_FAILS:-6}"
QUOTA_WAIT="${QUOTA_WAIT:-0}"

# Optional quota gate. With QUOTA_WAIT=1, ask playthrough/quota.py before each session and
# sleep as long as it says. If the check itself fails, say so and carry on rather than stall.
wait_for_quota() {
  [[ "$QUOTA_WAIT" == "1" ]] || return 0
  while :; do
    local verdict
    verdict=$(python "$PT/quota.py") || { echo "quota check failed; starting the session anyway."; return 0; }
    case "$verdict" in
      ok) return 0 ;;
      wait\ *) local secs=${verdict#wait }; echo "Quota above threshold. Sleeping ${secs}s until the window resets."; sleep "$secs" ;;
      *) echo "quota.py said '$verdict'; starting the session anyway."; return 0 ;;
    esac
  done
}

# Token usage of one session, read from the last "result" record of its stream-json transcript.
# Prints: input cache_write cache_read output thinking cost_usd turns duration_s  (all-zero if absent).
session_usage() {
  local rec; rec=$(grep '"type":"result"' "$1" 2>/dev/null | tail -1)
  [[ -n "$rec" ]] || { echo "0 0 0 0 0 0 0 0"; return; }
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$rec" | jq -r '[ .usage.input_tokens // 0, .usage.cache_creation_input_tokens // 0,
      .usage.cache_read_input_tokens // 0, .usage.output_tokens // 0,
      .usage.output_tokens_details.thinking_tokens // 0, .total_cost_usd // 0,
      .num_turns // 0, ((.duration_ms // 0) / 1000 | floor) ] | @sh' | tr -d "'"
  else
    printf '%s' "$rec" | python -c 'import sys,json; d=json.loads(sys.stdin.read()); u=d.get("usage",{})
print(u.get("input_tokens",0), u.get("cache_creation_input_tokens",0), u.get("cache_read_input_tokens",0),
      u.get("output_tokens",0), u.get("output_tokens_details",{}).get("thinking_tokens",0),
      d.get("total_cost_usd",0), d.get("num_turns",0), int(d.get("duration_ms",0)//1000))'
  fi
}

[[ -f "$MCP_SERVER" ]] || { echo "ERROR: $MCP_SERVER not found — run npm run build in mcp-mgba" >&2; exit 1; }
[[ -f "$ROOT/PLAYTHROUGH_RUNBOOK.md" ]] || { echo "ERROR: PLAYTHROUGH_RUNBOOK.md missing" >&2; exit 1; }
mkdir -p "$PT/states" "$PT/sessions" "$ROOT/runs"
[[ -f "$PT/LOG.md" ]] || printf '# Playthrough log\n\nOne entry per session, appended by the agent at the end of each chapter.\n' > "$PT/LOG.md"

# Continue numbering from the last session on disk, so a restarted loop does not reuse tags.
n=$(ls "$PT/sessions" 2>/dev/null | grep -oE '^s[0-9]+' | sed 's/^s//' | sort -n | tail -1)
n=${n:-0}
fails=0
USAGE_TSV="$PT/usage.tsv"
[[ -f "$USAGE_TSV" ]] || printf 'date\ttag\tresult\tinput\tcache_write\tcache_read\toutput\tthinking\tcost_usd\tturns\tduration_s\n' > "$USAGE_TSV"
tot_in=0 tot_cw=0 tot_cr=0 tot_out=0 tot_cost=0

while :; do
  if [[ -f "$PT/STOP" ]]; then echo "STOP file present; halting."; break; fi
  n=$((n + 1))
  if (( n > MAX_SESSIONS )); then echo "Reached MAX_SESSIONS=$MAX_SESSIONS; halting."; break; fi

  wait_for_quota
  tag=$(printf 's%02d' "$n")
  today=$(date +%F)
  runlog="$ROOT/runs/playthrough-${today}-${tag}.jsonl"
  cfg="$PT/sessions/${tag}.mcp.json"
  transcript="$PT/sessions/${tag}.jsonl"

  printf '{"mcpServers":{"mgba":{"type":"stdio","command":"node","args":["%s"],"env":{"FE7_RUN_LOG":"%s"}}}}\n' \
    "$(winpath "$MCP_SERVER")" "$(winpath "$runlog")" > "$cfg"

  echo "--- $(date '+%F %T') | $tag starting (model=$MODEL effort=$EFFORT)"
  {
    printf 'You are session %s of the whole-game playthrough. Your session tag is %s. The runbook follows; read all of it and follow it.\n\n' "$tag" "$tag"
    cat "$ROOT/PLAYTHROUGH_RUNBOOK.md"
  } | (
    cd "$ROOT" && claude -p \
      --model "$MODEL" --effort "$EFFORT" \
      --dangerously-skip-permissions \
      --mcp-config "$cfg" --strict-mcp-config \
      --output-format stream-json --verbose
  ) > "$transcript" 2>&1
  rc=$?

  # Only the final "result" record counts, so the runbook text (which names all three
  # values) or a mid-session mention cannot masquerade as the verdict.
  result=$(grep '"type":"result"' "$transcript" | tail -1 | grep -oE 'PLAYTHROUGH_RESULT=(WON|LOST|STUCK)' | tail -1 | cut -d= -f2)
  echo "--- $(date '+%F %T') | $tag finished  exit=$rc  result=${result:-none}"

  read -r u_in u_cw u_cr u_out u_think u_cost u_turns u_secs <<< "$(session_usage "$transcript")"
  tot_in=$((tot_in + u_in)); tot_cw=$((tot_cw + u_cw)); tot_cr=$((tot_cr + u_cr)); tot_out=$((tot_out + u_out))
  tot_cost=$(awk -v a="$tot_cost" -v b="$u_cost" 'BEGIN{printf "%.4f", a+b}')
  printf -- '--- %s tokens: input=%s cache_write=%s cache_read=%s output=%s (thinking=%s)  cost=$%s  turns=%s  %ss\n' \
    "$tag" "$u_in" "$u_cw" "$u_cr" "$u_out" "$u_think" "$u_cost" "$u_turns" "$u_secs"
  printf -- '--- run total: input=%s cache_write=%s cache_read=%s output=%s  cost=$%s\n' \
    "$tot_in" "$tot_cw" "$tot_cr" "$tot_out" "$tot_cost"
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$(date '+%F %T')" "$tag" "${result:-none}" \
    "$u_in" "$u_cw" "$u_cr" "$u_out" "$u_think" "$u_cost" "$u_turns" "$u_secs" >> "$USAGE_TSV"

  case "${result:-none}" in
    WON)
      fails=0 ;;
    LOST|STUCK)
      echo "Session $tag reported $result. Halting for the human. See $PT/LOG.md and $transcript."
      break ;;
    *)
      fails=$((fails + 1))
      if (( fails >= MAX_FAILS )); then
        echo "$fails sessions in a row ended without a result line. Halting. Last transcript: $transcript"
        break
      fi
      echo "No result line (exit $rc). Waiting ${RETRY_WAIT}s, then starting a fresh session on the same chapter ($fails/$MAX_FAILS)."
      sleep "$RETRY_WAIT" ;;
  esac
done
