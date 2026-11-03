# Kelvin MCP pilot

Claude Free can connect to this hosted Streamable HTTP MCP server as its one custom connector. For public course help, set the URL to the deployed `/mcp` endpoint and choose **No sign in**; no token or request header is needed. For personal learning records or instructor trends, obtain an individual token and add request header `Authorization: Bearer <your token>`. Do not share a class-wide token.

The server offers course cards, misconception cards, and selected teaching skills from `../agent/` to everyone. An authenticated student can explicitly save a learning reflection; a direct DeepSeek API call classifies it when configured. The server never sees ordinary Claude messages unless Claude invokes a tool with that text. Instructors receive only aggregates from at least five students.

## Local run

Use Node 22+ and `npm ci` in this directory. Set `DEEPSEEK_API_KEY` in the process environment using the existing Kelvin secret source. Set `KELVIN_MCP_DATA_DIR` to a private persistent directory. Run `node admin.mjs provision-student ID` to generate a test token, then `npm start`. Keep the token out of logs and chat. The server binds to `127.0.0.1:3337` by default.

## Mac mini deployment

The launch agent starts the service from a private directory on the Mac mini. Tailscale Funnel on HTTPS port 8443 proxies to local port 3337. Port 443 is reserved for an existing private Tailscale Serve service. Run `tailscale funnel status` to verify that only port 8443 is public and that 443 remains tailnet-only.

Student records are in `users.json` and `events.jsonl` under `KELVIN_MCP_DATA_DIR`. On the Mac mini, use `mcp/deploy/admin-mac-mini.sh revoke ID` to revoke access and `mcp/deploy/admin-mac-mini.sh delete-student ID` to remove a student's events and revoke their token. This wrapper points at the service's data directory. Back up the data directory privately if the pilot lasts beyond testing.

See [PRD.md](PRD.md) for scope and acceptance criteria.
