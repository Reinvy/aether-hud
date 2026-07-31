#!/usr/bin/env bash
# Quick endpoint connectivity check
set -euo pipefail

BASE_URL="${1:-https://aether-hud-lyart.vercel.app}"

echo "=== AETHER-HUD Endpoint Check ==="
echo "Target: $BASE_URL"
echo "Time: $(date -Iseconds)"
echo ""

curl -sI "${BASE_URL}/" | head -5
echo ""
echo "=== DNS ==="
host "$(echo "$BASE_URL" | sed 's|https://||')" 2>/dev/null || echo "DNS lookup skipped"
echo ""
echo "✅ Check complete"
