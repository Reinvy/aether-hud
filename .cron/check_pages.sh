#!/usr/bin/env bash
# Check that all main pages return 200
set -euo pipefail

BASE_URL="${1:-https://aether-hud.vercel.app}"
PAGES=(
  "/"
  "/dashboard"
  "/dashboard/projects"
  "/dashboard/skills"
  "/dashboard/settings"
)

echo "=== AETHER-HUD Page Check ==="
echo "Base URL: $BASE_URL"
echo ""

FAILED=0
for page in "${PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${page}")
  if [[ "$STATUS" == "200" || "$STATUS" == "304" ]]; then
    echo "✅ ${page} → ${STATUS}"
  else
    echo "❌ ${page} → ${STATUS}"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
if [[ $FAILED -eq 0 ]]; then
  echo "✅ All pages OK"
else
  echo "❌ ${FAILED} page(s) failed"
fi
exit $FAILED
