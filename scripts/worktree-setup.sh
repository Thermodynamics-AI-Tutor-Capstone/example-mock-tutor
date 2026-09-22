#!/usr/bin/env bash
# Makes a fresh worktree of this repo runnable. Run it once, from inside the worktree:
#   scripts/worktree-setup.sh
#
# - copies .env (secrets) and the Vercel project link from the main checkout; neither is committed
# - gives this worktree its own local port, so several sessions can run `npm start` at once
#   (each worktree already has its own data/ folder, so the embedded database never collides)
# - installs dependencies and builds the knowledge index
set -euo pipefail

WT=$(git rev-parse --show-toplevel)
MAIN=$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')
if [ "$WT" = "$MAIN" ]; then
  echo "Run this inside a worktree, not the main checkout ($MAIN)."
  echo "Create one first:  git worktree add .claude/worktrees/<name> -b <type>/<YYYYMMDD>-<desc> origin/main"
  exit 1
fi
cd "$WT"

[ -f .env ] || cp "$MAIN/.env" .env
mkdir -p .vercel
[ -f .vercel/project.json ] || cp "$MAIN/.vercel/project.json" .vercel/project.json

# A port no other worktree has claimed (3300 is left to the main checkout).
PORT=$(grep -E '^PORT=' .env | tail -1 | cut -d= -f2 || true)
if [ -z "$PORT" ]; then
  USED=$(git worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r w; do
    grep -hE '^PORT=' "$w/.env" 2>/dev/null | cut -d= -f2 || true; done)
  for p in $(seq 3301 3399); do
    if ! printf '%s\n' "$USED" | grep -qx "$p"; then PORT=$p; break; fi
  done
  printf '\nPORT=%s\n' "$PORT" >> .env
fi

npm ci --silent
npm run build --silent > /dev/null

echo "Ready: $(git branch --show-current) in $WT"
echo "  npm start  → http://127.0.0.1:$PORT   (database in $WT/data/)"
