#!/bin/bash
# Anime Health Check — runs hourly
set -euo pipefail

API="https://api.yourdomain.com/api"
LOG="/opt/anime-scraper/logs/anime-health.log"
mkdir -p "$(dirname "$LOG")"

fetch() { curl -s --max-time 10 -H "User-Agent: AniHeist-Cron/1.0" "$1" 2>/dev/null || echo ""; }

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "=== Health Check ==="

# 1. API health
h=$(fetch "$API/health" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','?'))" 2>/dev/null || echo "down")
log "API health: $h"

# 2. Trending/popular endpoints
for ep in trending popular; do
  c=$(fetch "$API/$ep?per_page=5" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('data',[])))" 2>/dev/null || echo "0")
  log "$ep: $c items"
done

# 3. Spot-check 5 random anime
FAIL=0
for aid in 1535 16498 20 5114 9253; do
  s=$(fetch "$API/anime/$aid" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','err'))" 2>/dev/null || echo "err")
  if [ "$s" = "success" ]; then log "  ✓ $aid"; else log "  ✗ $aid ($s)"; ((FAIL++)); fi
done

# 4. Summary
if [ "$FAIL" -eq 0 ]; then log "All healthy"; else log "$FAIL anime failing"; fi
log "==="
