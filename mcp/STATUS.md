# Pilot deployment status — 2026-11-03

- Mac mini (`mac`): launch agent `com.kelvin.mcp`, local port 3337, public Tailscale Funnel HTTPS port 8443.
- Student MCP URL: `https://mac.tailfb765c.ts.net:8443/mcp`.
- Existing Tailscale Serve service on port 443 remains tailnet-only.
- Public endpoint tested with the MCP SDK: initialization, tool listing, course search, and a saved reflection. The synthetic reflection was removed after the check. Course help is now anonymous; student and instructor records still require individual tokens. An unauthenticated MCP initialization also succeeded through Tailscale's public relay IP.
- The Mac mini has no DeepSeek key configured. The existing Kelvin `.env` key returned HTTP 402 during a live classification probe; `.env.local` returned HTTP 401. Reflections still save with `classificationStatus: pending` and no inferred labels. Set up a working credential directly on the Mac mini at `~/.config/kelvin-mcp/deepseek-key` to activate classification; the launch agent reads it on start.
- A personal test student token was generated on Lance's MacBook at `~/.config/kelvin-mcp/lance-test-token`; the Mac mini stores only its SHA-256 hash. No credential was copied between hosts.
- Claude.ai itself has not yet been used to connect to this server. Its documented custom connector accepts remote MCP URLs and fixed request headers, but the actual Free account setup should be checked by Lance.
