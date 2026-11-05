# Kelvin MCP pilot

Claude Free can connect to this hosted Streamable HTTP MCP server as its one custom connector. For a course account with personal learning records, use `https://mac.tailfb765c.ts.net:8443/mcp/account`, choose **Sign in now** and **Register automatically** for the OAuth client, then claim a course invite or sign in with an existing Kelvin account. For public course help without an account, use `https://mac.tailfb765c.ts.net:8443/mcp` and **No sign in**. A Free account can use one custom connector, so students should choose the account URL if they plan to save their work.

The professor dashboard is at `https://kelvin-professor-dashboard.vercel.app`. The demo login is `username` / `password` and contains made-up records only. **Sign in as an instructor** uses a separate invite-based instructor account to show live records. The Vercel dashboard sends registration, token exchange, and instructor data requests through a fixed-route serverless proxy to the Mac mini. OAuth sign-in opens the Mac mini directly, and student records remain stored on the Mac mini. The dashboard does not grant live access from the demo credentials.

The server offers course cards, misconception cards, and selected teaching skills from `../agent/` to everyone. An invited student can explicitly save a learning reflection; a direct DeepSeek API call classifies it when configured. The server never sees ordinary Claude messages unless Claude invokes a tool with that text. Instructors receive aggregates from at least five students, plus named records only for students who enabled instructor sharing.

## Local run

Use Node 22+ and `npm ci` in this directory. Set `DEEPSEEK_API_KEY` in the process environment using the existing Kelvin secret source. Set `KELVIN_MCP_DATA_DIR` to a private persistent directory. Run `node admin.mjs provision-student ID` to generate a test token, then `npm start`. Keep the token out of logs and chat. The server binds to `127.0.0.1:3337` by default.

## Mac mini deployment

The launch agent starts the service from a private directory on the Mac mini. Tailscale Funnel on HTTPS port 8443 proxies to local port 3337. Port 443 is reserved for an existing private Tailscale Serve service. Run `tailscale funnel status` to verify that only port 8443 is public and that 443 remains tailnet-only.

Course accounts, OAuth client registrations, and learning records live in private JSON files under `KELVIN_MCP_DATA_DIR`. On the Mac mini, use `mcp/deploy/admin-mac-mini.sh invite-hash ID NAME student|instructor SHA256` to register the hash of a course invite code you generated and will deliver to the intended person. The invite code itself must stay out of the server's logs and repository. Use `disable-account ID` to block sign-in, or `delete-student ID` to remove a student's records. The admin wrapper points at the service's data directory. Back up that directory privately if the pilot lasts beyond testing.

An invite binds the account to the name chosen by the course operator. Kelvin does not currently verify Penn State identity or import a roster. The student can enable instructor sharing on the sign-in page and change it later with the `share_with_instructor` tool. Authenticated instructors can see named records only for students who enabled sharing.

See [PRD.md](PRD.md) for scope and acceptance criteria.
