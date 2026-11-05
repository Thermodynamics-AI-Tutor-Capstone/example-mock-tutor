#!/bin/bash
set -euo pipefail
cd /Users/lancestreuber/kelvin-mcp/mcp
export KELVIN_MCP_DATA_DIR=/Users/lancestreuber/kelvin-mcp-data
exec /opt/homebrew/bin/node admin.mjs "$@"
