#!/usr/bin/env bash
# One fresh Claude session per chapter, until the game is beaten, a session reports
# LOST or STUCK, a STOP file appears, or MAX_SESSIONS is reached.
#
#   usage:  playthroughs/run.sh [--runbook PATH] [--max-attempts N] <chapter> [model] [effort]
#           e.g.  playthroughs/run.sh 13 fable medium
#                 playthroughs/run.sh --runbook vision_runbook.md 13 fable medium
#           <chapter> is the chapter loaded in the emulator right now: a number (13), a gaiden
#           (7x, 19xx), "prologue" or "final". It is matched against the "### ..." headings of
#           PLAYTHROUGH_STRATEGY_TEMPLATE.md and written to run_state.json. When continuing a
#           playthrough that already has a run_state.json, pass "-" and the file is left alone.
#           --runbook is the runbook every session is given (default PLAYTHROUGH_RUNBOOK.md). A
#           relative PATH is tried from the current directory first, then from llm_plays_fe7/.
#           --max-attempts is how many attempts at a chapter one session may start before it
#           hands over to a fresh session (PLAYTHROUGH_RESULT=RETRY), to keep sessions short of
#           compaction. Counted from run_state.json's `attempts` when the session starts.
#           Default: no limit.
#   stop:   touch playthroughs/STOP    (takes effect between sessions; delete it to resume)
#   env:    MAX_SESSIONS (default 45)  RETRY_WAIT seconds (default 900)  MAX_FAILS (default 6)
#           RETRY_WAIT_MAX seconds (default 14400). The wait after a session with no result line
#           doubles with each failure in a row (15m, 30m, 1h, 2h, 4h with the defaults), capped
#           at RETRY_WAIT_MAX, so a run that hits the usage limit outlasts the 5-hour window.
#           PLAYTHROUGH_DIR to continue an existing playthrough folder instead of starting a
#           new one (e.g. PLAYTHROUGH_DIR=playthroughs/2026-09-26_14-30).
#           QUOTA_WAIT=1 to check plan usage before each session and sleep until the 5-hour /
#           7-day window resets when either is at or above QUOTA_THRESHOLD (default 95). Off by
#           default; see playthroughs/quota.py.
#
# Every launch of this script is one PLAYTHROUGH, and gets its own folder named for the moment
# it started:  playthroughs/<YYYY-MM-DD_HH-MM>/   containing
#   CURRENT_RUN_STRATEGY.md   the run's strategy file: a copy of PLAYTHROUGH_STRATEGY_TEMPLATE.md made
#                  when the folder is created, read by every session and written to at the end of each
#   run_state.json the run's machine-readable state: current chapter, attempts at it, chapters
#                  completed, the dead and the unrecruited. Created here, maintained by the sessions
#   states/        save states, one per won chapter
#   sessions/      stream-json transcript and MCP config per session
#   screenshots/   every screenshot the agent takes
#   runs/          the fe7 tool log per session, playthrough-<date>-<tag>.jsonl
#   usage.tsv      token usage and cost per session
#
# Each session gets the runbook (PLAYTHROUGH_RUNBOOK.md unless --runbook says otherwise) on stdin with a one-line header naming its tag and
# its playthrough folder, its own MCP config (so the fe7 tool log lands in that folder's runs/
# instead of the single file hardcoded in ~/.claude.json), and a fresh MCP server process.
#
# The session's last line must be PLAYTHROUGH_RESULT=WON|RETRY|LOST|STUCK (see the runbook).
# WON  -> next session.   LOST / STUCK -> halt for the human (older runbooks only).
# RETRY -> the attempt limit was reached; start a fresh session on the same chapter at once.
#          If `attempts` did not grow during the session, it is treated as a failure instead.
# none -> the session died; wait (RETRY_WAIT, doubling per failure in a row) and start a fresh
#         session on the same chapter.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"          # llm_plays_fe7
PT="$ROOT/playthroughs"
MCP_SERVER="$(cd "$ROOT/../mcp-mgba" && pwd)/dist/index.js"
# Paths handed to node must be Windows-style: Git Bash's /c/Users/... is read by node as C:\c\Users\...
winpath() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s' "$1"; fi; }
# --runbook PATH (or --runbook=PATH) may appear anywhere; everything else stays positional.
RUNBOOK="$ROOT/PLAYTHROUGH_RUNBOOK.md"
MAX_ATTEMPTS=""
args=()
while (( $# )); do
  case "$1" in
    --max-attempts)   [[ $# -ge 2 ]] || { echo "ERROR: --max-attempts needs a number" >&2; exit 1; }
                      MAX_ATTEMPTS="$2"; shift 2 ;;
    --max-attempts=*) MAX_ATTEMPTS="${1#--max-attempts=}"; shift ;;
    --runbook)   [[ $# -ge 2 ]] || { echo "ERROR: --runbook needs a path" >&2; exit 1; }
                 RUNBOOK="$2"; shift 2 ;;
    --runbook=*) RUNBOOK="${1#--runbook=}"; shift ;;
    *)           args+=("$1"); shift ;;
  esac
done
set -- "${args[@]+"${args[@]}"}"
# Resolve the runbook to an absolute path now, before anything changes directory.
if [[ ! -f "$RUNBOOK" && "$RUNBOOK" != /* && -f "$ROOT/$RUNBOOK" ]]; then RUNBOOK="$ROOT/$RUNBOOK"; fi
[[ -f "$RUNBOOK" ]] || { echo "ERROR: runbook $RUNBOOK not found" >&2; exit 1; }
RUNBOOK="$(cd "$(dirname "$RUNBOOK")" && pwd)/$(basename "$RUNBOOK")"
[[ -z "$MAX_ATTEMPTS" || "$MAX_ATTEMPTS" =~ ^[1-9][0-9]*$ ]] || { echo "ERROR: --max-attempts must be a positive whole number, not '$MAX_ATTEMPTS'" >&2; exit 1; }
CHAPTER_ARG="${1:-}"
MODEL="${2:-fable}"
EFFORT="${3:-medium}"
MAX_SESSIONS="${MAX_SESSIONS:-45}"
RETRY_WAIT="${RETRY_WAIT:-900}"
RETRY_WAIT_MAX="${RETRY_WAIT_MAX:-14400}"
MAX_FAILS="${MAX_FAILS:-6}"
QUOTA_WAIT="${QUOTA_WAIT:-0}"

# Optional quota gate. With QUOTA_WAIT=1, ask playthroughs/quota.py before each session and
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

# `attempts` from run_state.json, or nothing if the file is missing or does not parse.
read_attempts() {
  python -c 'import json,sys; a=json.load(open(sys.argv[1],encoding="utf-8")).get("attempts"); print(a if isinstance(a,int) else "")' \
    "$1" 2>/dev/null
}

[[ -f "$MCP_SERVER" ]] || { echo "ERROR: $MCP_SERVER not found — run npm run build in mcp-mgba" >&2; exit 1; }
[[ -f "$ROOT/PLAYTHROUGH_STRATEGY_TEMPLATE.md" ]] || { echo "ERROR: PLAYTHROUGH_STRATEGY_TEMPLATE.md missing" >&2; exit 1; }
[[ -n "$CHAPTER_ARG" ]] || { echo "usage: playthroughs/run.sh [--runbook PATH] <chapter> [model] [effort]   (chapter: 13, 7x, prologue, final; or - to keep an existing run_state.json)" >&2; exit 1; }

# Resolve a chapter argument to the exact "### ..." heading in the template, and the mode
# ("## Lyn mode" / "## Hector mode") that heading sits under. Prints "mode<TAB>heading".
resolve_chapter() {
  local want
  case "${1,,}" in
    prologue) want='^### prologue ' ;;
    final)    want='^### final chapter ' ;;
    *)        want="^### chapter ${1,,} " ;;
  esac
  # The template may carry CRLF line endings; strip the CR before matching.
  awk -v pat="$want" '
    { sub(/\r$/, "") }
    /^## /  { mode = tolower($0); sub(/^## /, "", mode); sub(/ mode$/, "", mode) }
    tolower($0) ~ pat { sub(/^### /, ""); print mode "\t" $0; exit }
  ' "$ROOT/PLAYTHROUGH_STRATEGY_TEMPLATE.md"
}
# The playthrough folder: a new one per launch, named for the start time, unless the human
# points PLAYTHROUGH_DIR at an existing one to continue it.
if [[ -n "${PLAYTHROUGH_DIR:-}" ]]; then
  RUN="$(cd "$PLAYTHROUGH_DIR" 2>/dev/null && pwd)" || { echo "ERROR: PLAYTHROUGH_DIR=$PLAYTHROUGH_DIR does not exist" >&2; exit 1; }
else
  RUN="$PT/$(date +%F_%H-%M)"
fi
mkdir -p "$RUN/states" "$RUN/sessions" "$RUN/screenshots" "$RUN/runs"
# The run's strategy file: a fresh copy of the template for a new playthrough, left alone when continuing one.
[[ -f "$RUN/CURRENT_RUN_STRATEGY.md" ]] || cp "$ROOT/PLAYTHROUGH_STRATEGY_TEMPLATE.md" "$RUN/CURRENT_RUN_STRATEGY.md"
# The run's state file. Written once here with the chapter the human says is loaded; from
# then on the sessions own it (attempts, completed, dead, unrecruited).
STATE_JSON="$RUN/run_state.json"
if [[ -f "$STATE_JSON" ]]; then
  [[ "$CHAPTER_ARG" == "-" ]] || echo "note: $STATE_JSON already exists; ignoring chapter argument '$CHAPTER_ARG'."
else
  [[ "$CHAPTER_ARG" != "-" ]] || { echo "ERROR: no run_state.json in $RUN; name the chapter that is loaded." >&2; exit 1; }
  IFS=$'\t' read -r mode heading <<< "$(resolve_chapter "$CHAPTER_ARG")"
  [[ -n "$heading" ]] || { echo "ERROR: no '### Chapter $CHAPTER_ARG — ...' heading in PLAYTHROUGH_STRATEGY_TEMPLATE.md" >&2; exit 1; }
  python - "$STATE_JSON" "$mode" "$heading" <<'EOF'
import json, sys
path, mode, heading = sys.argv[1:4]
state = {"mode": mode, "current_chapter": heading, "attempts": 0, "completed": [], "dead": [], "unrecruited": []}
with open(path, "w", encoding="utf-8") as f:
    json.dump(state, f, ensure_ascii=False, indent=2); f.write("\n")
EOF
  echo "--- run_state.json: $mode mode, starting at '$heading'"
fi
# Record this launch's model and effort as the first two keys, replacing any earlier values,
# so a continued playthrough shows what it is running on now. Everything else is kept as is.
python - "$STATE_JSON" "$MODEL" "$EFFORT" <<'EOF' || echo "warning: could not write model/effort into $STATE_JSON; it was left as it was."
import json, sys
path, model, effort = sys.argv[1:4]
with open(path, encoding="utf-8") as f:
    old = json.load(f)
state = {"model": model, "effort": effort}
state.update((k, v) for k, v in old.items() if k not in state)
with open(path, "w", encoding="utf-8") as f:
    json.dump(state, f, ensure_ascii=False, indent=2); f.write("\n")
EOF
echo "--- playthrough folder: $RUN"
echo "--- runbook: $RUNBOOK"
echo "--- attempts per session: ${MAX_ATTEMPTS:-no limit}"

# Continue numbering from the last session on disk, so a restarted loop does not reuse tags.
n=$(ls "$RUN/sessions" 2>/dev/null | grep -oE '^s[0-9]+' | sed 's/^s//' | sort -n | tail -1)
n=${n:-0}
fails=0
USAGE_TSV="$RUN/usage.tsv"
[[ -f "$USAGE_TSV" ]] || printf 'date\ttag\tresult\tinput\tcache_write\tcache_read\toutput\tthinking\tcost_usd\tturns\tduration_s\n' > "$USAGE_TSV"
tot_in=0 tot_cw=0 tot_cr=0 tot_out=0 tot_cost=0

while :; do
  if [[ -f "$PT/STOP" ]]; then echo "STOP file present; halting."; break; fi
  n=$((n + 1))
  if (( n > MAX_SESSIONS )); then echo "Reached MAX_SESSIONS=$MAX_SESSIONS; halting."; break; fi

  wait_for_quota
  tag=$(printf 's%02d' "$n")
  today=$(date +%F)
  runlog="$RUN/runs/playthrough-${today}-${tag}.jsonl"
  cfg="$RUN/sessions/${tag}.mcp.json"
  transcript="$RUN/sessions/${tag}.jsonl"

  printf '{"mcpServers":{"mgba":{"type":"stdio","command":"node","args":["%s"],"env":{"FE7_RUN_LOG":"%s"}}}}\n' \
    "$(winpath "$MCP_SERVER")" "$(winpath "$runlog")" > "$cfg"

  # The attempt limit for this session: MAX_ATTEMPTS more than the attempts already made.
  attempts_before=$(read_attempts "$STATE_JSON")
  limit_line=""
  if [[ -n "$MAX_ATTEMPTS" ]]; then
    if [[ -n "$attempts_before" ]]; then
      limit=$((attempts_before + MAX_ATTEMPTS))
      limit_line=$(printf 'Attempt limit for this session: %s. run_state.json shows %s attempts so far; once a lost attempt leaves `attempts` at %s, end the session with PLAYTHROUGH_RESULT=RETRY as the runbook describes under "When the attempt limit is reached".' "$limit" "$attempts_before" "$limit")
    else
      echo "warning: could not read attempts from $STATE_JSON; $tag runs with no attempt limit."
    fi
  fi

  echo "--- $(date '+%F %T') | $tag starting (model=$MODEL effort=$EFFORT attempts=${attempts_before:-?}${limit_line:+ limit=$limit})"
  {
    printf 'You are session %s of the whole-game playthrough. Your session tag is %s. Your playthrough folder is %s (it already exists, with CURRENT_RUN_STRATEGY.md, run_state.json, states/, sessions/, screenshots/ and runs/ inside).%s The runbook follows; read all of it and follow it.\n\n' "$tag" "$tag" "$(winpath "$RUN")" "${limit_line:+ $limit_line}"
    cat "$RUNBOOK"
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
  result=$(grep '"type":"result"' "$transcript" | tail -1 | grep -oE 'PLAYTHROUGH_RESULT=(WON|RETRY|LOST|STUCK)' | tail -1 | cut -d= -f2)
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

  # A RETRY only counts if the session really played: `attempts` must have grown. Otherwise
  # it is handled like a missing result line, so a session that says RETRY without playing
  # cannot spin the loop through MAX_SESSIONS.
  if [[ "$result" == "RETRY" ]]; then
    attempts_after=$(read_attempts "$STATE_JSON")
    if [[ -z "$attempts_before" || -z "$attempts_after" ]] || (( attempts_after <= attempts_before )); then
      echo "RETRY, but attempts went ${attempts_before:-?} -> ${attempts_after:-?}; treating it as a failure."
      result=""
    fi
  fi

  case "${result:-none}" in
    WON)
      fails=0 ;;
    RETRY)
      fails=0
      echo "Attempt limit reached ($attempts_after attempts). Starting a fresh session on the same chapter." ;;
    LOST|STUCK)
      echo "Session $tag reported $result. Halting for the human. See $RUN/run_state.json, $RUN/CURRENT_RUN_STRATEGY.md and $transcript."
      break ;;
    *)
      fails=$((fails + 1))
      if (( fails >= MAX_FAILS )); then
        echo "$fails sessions in a row ended without a result line. Halting. Last transcript: $transcript"
        break
      fi
      # Double the wait for each failure in a row: 1x, 2x, 4x, ... RETRY_WAIT, capped.
      wait_s=$(( RETRY_WAIT << (fails - 1) ))
      (( wait_s <= RETRY_WAIT_MAX )) || wait_s=$RETRY_WAIT_MAX
      echo "No result line (exit $rc). Waiting ${wait_s}s, then starting a fresh session on the same chapter ($fails/$MAX_FAILS)."
      sleep "$wait_s" ;;
  esac
done
