#!/usr/bin/env bash
# ==============================================================================
# AETHER-HUD Git Helper — for cron agents
#
# Extracts GITHUB_TOKEN, clones/pulls repo, creates branches, PRs, squash-merges.
# ==============================================================================
set -euo pipefail

REPO_OWNER="Reinvy"
REPO_NAME="aether-hud"
REPO_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
WORKDIR="${WORKDIR:-/opt/data/workspace/aether-hud}"
API_BASE="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $*"; }

trap '_err=$?; log_error "Fatal error on line $LINENO (exit $_err)"; exit $_err' ERR

extract_token() {
    local cred_file="${HOME}/.git-credentials"
    local token=""
    if [[ -f "$cred_file" ]]; then
        token=$(grep -E '^https?://[^:]+:[^@]+@github\.com' "$cred_file" \
                | sed -E 's|^https?://[^:]+:([^@]+)@github\.com$|\1|' \
                | head -1)
    fi
    if [[ -z "$token" ]]; then
        token=$(echo -e "protocol=https\nhost=github.com" \
                | git credential fill 2>/dev/null \
                | grep -E '^password=' \
                | sed 's/^password=//')
    fi
    if [[ -z "$token" && -n "${GITHUB_TOKEN:-}" ]]; then
        token="$GITHUB_TOKEN"
    fi
    if [[ -z "$token" ]]; then
        log_error "Could not extract GITHUB_TOKEN."
        exit 1
    fi
    echo "$token"
}

ensure_repo() {
    local workdir="$1"
    if [[ ! -d "$workdir/.git" ]]; then
        log_step "Cloning repository into ${workdir}..."
        mkdir -p "$(dirname "$workdir")"
        git clone "$REPO_URL" "$workdir"
        cd "$workdir"
    else
        log_step "Repository exists. Fetching latest..."
        cd "$workdir"
        git fetch origin
    fi
    log_step "Checking out main and fast-forwarding..."
    git checkout main
    git pull --ff-only origin main
    log_info "Repo at $(git rev-parse --short HEAD) on $(git branch --show-current)"
}

create_branch() {
    local branch="$1"
    if [[ -z "$branch" ]]; then
        log_error "create_branch requires a branch name."
        exit 1
    fi
    if git show-ref --verify --quiet "refs/heads/${branch}"; then
        git branch -D "$branch"
    fi
    if git show-ref --verify --quiet "refs/remotes/origin/${branch}"; then
        git push origin --delete "$branch" 2>/dev/null || true
    fi
    git checkout -b "$branch" main
    log_info "Created branch '${branch}'"
}

create_pr() {
    local title="$1"
    local body_file="${2:-}"
    local token="$3"
    local body=""
    if [[ -n "$body_file" && -f "$body_file" ]]; then
        body=$(cat "$body_file")
    else
        body="Automated PR by AETHER-HUD cron agent.\n\n## What\n${title}\n\n## Why\nAutomated workflow.\n\n## Testing\nVerify build and deployment."
    fi
    local branch; branch=$(git branch --show-current)
    log_step "Creating PR: '${title}' from '${branch}' → main..."
    local response
    response=$(curl -s -f -X POST "$API_BASE/pulls" \
        -H "Authorization: token ${token}" \
        -H "Accept: application/vnd.github+json" \
        -H "Content-Type: application/json" \
        -d "$(cat <<EOF
{
  "title": "${title}",
  "head": "${branch}",
  "base": "main",
  "body": "${body}",
  "maintainer_can_modify": true
}
EOF
)") || {
        log_error "Failed to create PR."
        exit 1
    }
    local pr_number; pr_number=$(echo "$response" | grep -o '"number":[0-9]*' | head -1 | cut -d: -f2)
    local pr_url; pr_url=$(echo "$response" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)
    log_info "✅ PR #${pr_number} created: ${pr_url}"
    echo "$pr_number"
}

squash_merge() {
    local pr_number="$1"
    local commit_title="$2"
    local token="$3"
    log_step "Squash-merging PR #${pr_number}..."
    local response
    response=$(curl -s -f -X PUT "${API_BASE}/pulls/${pr_number}/merge" \
        -H "Authorization: token ${token}" \
        -H "Accept: application/vnd.github+json" \
        -H "Content-Type: application/json" \
        -d "$(cat <<EOF
{
  "commit_title": "${commit_title}",
  "merge_method": "squash"
}
EOF
)") || {
        log_error "Squash-merge failed for PR #${pr_number}."
        return 1
    }
    local merged; merged=$(echo "$response" | grep -o '"merged":true' || true)
    if [[ -n "$merged" ]]; then
        log_info "✅ PR #${pr_number} squash-merged."
    else
        log_warn "Merge may have failed."
        return 1
    fi
}

push_branch() {
    local branch; branch=$(git branch --show-current)
    log_step "Pushing '${branch}' to origin..."
    git push -u origin "$branch" 2>&1 || {
        log_error "Failed to push."
        exit 1
    }
}

cleanup_branch() {
    local branch="${1:-$(git branch --show-current)}"
    git checkout main 2>/dev/null || true
    git push origin --delete "$branch" 2>/dev/null || true
    git branch -D "$branch" 2>/dev/null || true
    log_info "Cleaned up branch '${branch}'."
}

usage() {
    cat <<EOF
Usage: $(basename "$0") <command> [args...]

Commands:
  extract-token           Print the GitHub token
  ensure-repo [workdir]   Clone or pull the repo
  create-branch <name>    Create a feature branch from latest main
  push-branch             Push current branch to origin
  create-pr <title> [body_file]  Create a PR
  squash-merge <pr> <title>      Squash-merge a PR
  cleanup [branch]        Delete local and remote branch
EOF
    exit 0
}

main() {
    local cmd="${1:-help}"
    shift 2>/dev/null || true
    case "$cmd" in
        extract-token) extract_token ;;
        ensure-repo) ensure_repo "${1:-$WORKDIR}" ;;
        create-branch) create_branch "$1" ;;
        push-branch) push_branch ;;
        create-pr)
            local title="$1"; local body_file="${2:-}"; local token
            if [[ ! -t 0 ]]; then read -r token; else token=$(extract_token); fi
            create_pr "$title" "$body_file" "$token" ;;
        squash-merge)
            local pr_number="$1"; local commit_title="$2"; local token
            if [[ ! -t 0 ]]; then read -r token; else token=$(extract_token); fi
            squash_merge "$pr_number" "$commit_title" "$token" ;;
        cleanup) cleanup_branch "${1:-}" ;;
        help|--help|-h) usage ;;
        *) log_error "Unknown command: ${cmd}"; usage ;;
    esac
}

main "$@"
