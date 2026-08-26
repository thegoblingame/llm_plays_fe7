#!/usr/bin/env bash
set -euo pipefail

# --- Configuration ---
THRESHOLD=95
BUFFER_SECONDS=30
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESET_FILE="${SCRIPT_DIR}/.claude_reset_timestamps"
OUTPUT_FILE="${SCRIPT_DIR}/output.txt"
PROMPTS_DIR="${SCRIPT_DIR}/prompts"

# --- Dependencies ---
if ! command -v jq &>/dev/null; then
    echo "ERROR: jq is required. Install with: brew install jq" >&2
    exit 1
fi

# --- Functions ---

get_oauth_token() {
    local raw
    raw=$(security find-generic-password -s "Claude Code-credentials" -w 2>/dev/null) || {
        echo "ERROR: Failed to retrieve credentials from Keychain." >&2
        return 1
    }
    local token
    token=$(echo "$raw" | jq -r '.claudeAiOauth.accessToken // empty') || {
        echo "ERROR: Failed to parse credentials JSON." >&2
        return 1
    }
    if [[ -z "$token" ]]; then
        echo "ERROR: No accessToken found in credentials." >&2
        return 1
    fi
    echo "$token"
}

query_usage() {
    local token
    token=$(get_oauth_token) || return 1
    curl -sf "https://api.anthropic.com/api/oauth/usage" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -H "anthropic-beta: oauth-2025-04-20" \
        2>/dev/null || {
        echo "ERROR: API request failed." >&2
        return 1
    }
}

iso_to_unix() {
    local clean_ts
    clean_ts=$(echo "$1" | sed 's/\.[0-9]*+00:00$//')
    TZ=UTC date -jf "%Y-%m-%dT%H:%M:%S" "$clean_ts" +%s 2>/dev/null
}

format_duration() {
    local total=$1
    local hours=$((total / 3600))
    local minutes=$(( (total % 3600) / 60 ))
    local seconds=$((total % 60))
    echo "${hours}h ${minutes}m ${seconds}s"
}

wait_for_quota() {
    local backoff=60
    local max_backoff=1800

    while true; do
        echo "Checking usage..."

        local response
        response=$(query_usage) || exit 1

        local five_hour_util seven_day_util
        five_hour_util=$(echo "$response" | jq -r '.five_hour.utilization // 0')
        seven_day_util=$(echo "$response" | jq -r '.seven_day.utilization // 0')

        local five_hour_reset seven_day_reset
        five_hour_reset=$(echo "$response" | jq -r '.five_hour.resets_at // empty')
        seven_day_reset=$(echo "$response" | jq -r '.seven_day.resets_at // empty')

        echo "5-hour: ${five_hour_util}% | 7-day: ${seven_day_util}%"

        local five_hour_unix=0 seven_day_unix=0
        if [[ -n "$five_hour_reset" && "$five_hour_reset" != "null" ]]; then
            five_hour_unix=$(iso_to_unix "$five_hour_reset")
        fi
        if [[ -n "$seven_day_reset" && "$seven_day_reset" != "null" ]]; then
            seven_day_unix=$(iso_to_unix "$seven_day_reset")
        fi

        echo "five_hour_reset_unix=${five_hour_unix}" > "$RESET_FILE"
        echo "seven_day_reset_unix=${seven_day_unix}" >> "$RESET_FILE"

        local now
        now=$(date +%s)

        local five_over seven_over
        five_over=$(awk "BEGIN { print ($five_hour_util >= $THRESHOLD) }")
        seven_over=$(awk "BEGIN { print ($seven_day_util >= $THRESHOLD) }")

        # Quota available
        if [[ "$five_over" == "0" && "$seven_over" == "0" ]]; then
            return 0
        fi

        # Calculate wait
        local wait_seconds=0
        if [[ "$five_over" == "1" && "$seven_over" == "1" ]]; then
            local five_wait=$((five_hour_unix - now + BUFFER_SECONDS))
            local seven_wait=$((seven_day_unix - now + BUFFER_SECONDS))
            wait_seconds=$(( five_wait > seven_wait ? five_wait : seven_wait ))
            echo "Both windows above ${THRESHOLD}%."
        elif [[ "$five_over" == "1" ]]; then
            wait_seconds=$((five_hour_unix - now + BUFFER_SECONDS))
            echo "5-hour window above ${THRESHOLD}%."
        else
            wait_seconds=$((seven_day_unix - now + BUFFER_SECONDS))
            echo "7-day window above ${THRESHOLD}%."
        fi

        if (( wait_seconds <= 0 )); then
            echo "Reset time passed but still over limit. Backing off $(format_duration $backoff)..."
            sleep "$backoff"
            backoff=$(( backoff * 2 ))
            if (( backoff > max_backoff )); then
                backoff=$max_backoff
            fi
            continue
        fi

        backoff=60
        echo "Waiting $(format_duration $wait_seconds) until reset..."
        sleep "$wait_seconds"
        echo "Re-checking..."
    done
}

# --- Main ---
if [[ $# -eq 0 ]]; then
    echo "Usage: $(basename "$0") <model>"
    echo "  e.g. $(basename "$0") opus"
    echo "  e.g. $(basename "$0") sonnet"
    exit 1
fi

MODEL="$1"

if [[ ! -d "$PROMPTS_DIR" ]]; then
    echo "ERROR: No prompts/ directory found. Create it with numbered .md files (001.md, 002.md, etc.)" >&2
    exit 1
fi

prompt_files=("$PROMPTS_DIR"/*.md)

if [[ ${#prompt_files[@]} -eq 0 ]]; then
    echo "ERROR: No .md files found in prompts/" >&2
    exit 1
fi

echo "Found ${#prompt_files[@]} prompt(s) to run."

for prompt_file in "${prompt_files[@]}"; do
    prompt_name=$(basename "$prompt_file")
    wait_for_quota
    echo "--- $(date '+%Y-%m-%d %H:%M:%S') | ${prompt_name} ---" >> "$OUTPUT_FILE"
    echo "Running claude with ${prompt_name}..."
    cat "$prompt_file" | claude --dangerously-skip-permissions -p --model "$MODEL" >> "$OUTPUT_FILE" 2>&1
    echo "Finished ${prompt_name}."
done

echo "All prompts complete."
