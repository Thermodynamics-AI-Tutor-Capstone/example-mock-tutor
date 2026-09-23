#!/usr/bin/env bash
# Deploys what is on origin/main to production, and nothing else.
#
# `vercel deploy` uploads whatever is on disk, including other sessions' uncommitted work. That is
# how unfinished code reached production on 2026-09-22. This script never deploys a working tree:
# it checks out origin/main in a dedicated, clean worktree (<main checkout>/.claude/worktrees/deploy),
# runs the same checks as CI there, and deploys from it.
#
# Usage (from any worktree of this repo):  scripts/deploy-prod.sh --yes
set -euo pipefail

[ "${1:-}" = "--yes" ] || { echo "Deploys origin/main to PRODUCTION. Re-run with --yes to confirm."; exit 1; }

MAIN=$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')
DEPLOY="$MAIN/.claude/worktrees/deploy"

git -C "$MAIN" fetch -q origin main
if [ ! -d "$DEPLOY" ]; then
  git -C "$MAIN" worktree add -q --detach "$DEPLOY" origin/main
fi
cd "$DEPLOY"

# Refuse anything but an exact, clean copy of origin/main (gitignored build output is fine).
if [ -n "$(git status --porcelain --untracked-files=all)" ]; then
  echo "Refusing: $DEPLOY has changes that are not on origin/main:"; git status --short; exit 1
fi
git checkout -q --detach origin/main
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  echo "Refusing: $DEPLOY is not at origin/main."; exit 1
fi

# The Vercel project link is not committed; copy it from the main checkout.
mkdir -p .vercel && cp "$MAIN/.vercel/project.json" .vercel/project.json

echo "Checking $(git log --oneline -1) ..."
npm ci --silent
npm run build --silent > /dev/null
node scripts/smoke-imports.mjs
node scripts/kb/validate.mjs > /tmp/kelvin-validate.$$ 2>&1 || { cat /tmp/kelvin-validate.$$; exit 1; }
tail -1 /tmp/kelvin-validate.$$; rm -f /tmp/kelvin-validate.$$
node scripts/validate-agent.mjs

echo "Deploying $(git log --oneline -1) to production ..."
# `vercel deploy` can print an error and still exit 0, so judge it by what it printed: a
# successful production deploy ends with the deployment URL.
out=$(VERCEL_TELEMETRY_DISABLED=1 npx -y vercel@latest deploy --prod --yes 2>&1) || true
echo "$out"
url=$(printf '%s' "$out" | grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' | tail -1)
if [ -z "$url" ]; then
  echo "Deploy FAILED: Vercel returned no deployment URL (see the output above). Production is unchanged."
  exit 1
fi
echo "Deployed: $url"
