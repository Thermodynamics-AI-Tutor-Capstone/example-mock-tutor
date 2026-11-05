#!/bin/bash
set -euo pipefail
cd /Users/lancestreuber/kelvin-mcp
export PATH=/opt/homebrew/bin:/usr/bin:/bin
export PORT=3337
export KELVIN_MCP_DATA_DIR=/Users/lancestreuber/kelvin-mcp-data
export KELVIN_PUBLIC_ORIGIN=https://kelvin-mcp-account.vercel.app
key_file=/Users/lancestreuber/.config/kelvin-mcp/deepseek-key
if [[ -s "$key_file" ]]; then
  export DEEPSEEK_API_KEY="$(cat "$key_file")"
fi
exec /opt/homebrew/bin/node mcp/server.mjs
