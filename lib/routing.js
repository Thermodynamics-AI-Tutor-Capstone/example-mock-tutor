import { loadConnections } from './agent.js';

// Routing: which connection answers a message. The caller (the server's turn handler, and the
// persona eval) asks chooseConnection() and passes the result into runAgentTurn as `connection`
// and `route`, so each turn is billed to the connection it actually used.
//
// The rules, in order (connections.json "routing" block):
//   - routing disabled → the style's connection, reason 'style'
//   - the student (or app) is past 80% of a usage limit → budget_connection, reason 'budget'
//   - the decider's intent maps to a connection (intent_connections, overlaid with any caller
//     overrides) → that connection, reason 'intent:<label>'
//   - otherwise → the style's connection, reason 'style'
// A null read (Jev off or failed) simply skips the intent step.

export function routingConfig(connections = loadConnections()) {
  return connections.routing ?? { enabled: false, intent_connections: {}, budget_connection: null };
}

export function chooseConnection({ read, style, reduced = false, overrides = {}, connections = loadConnections() }) {
  const routing = routingConfig(connections);
  if (!routing.enabled) return { connection: style?.connection ?? null, reason: 'style' };
  if (reduced && routing.budget_connection) return { connection: routing.budget_connection, reason: 'budget' };
  const label = read?.intent?.label;
  const mapped = { ...routing.intent_connections, ...overrides };
  if (label && mapped[label]) return { connection: mapped[label], reason: `intent:${label}` };
  return { connection: style?.connection ?? null, reason: 'style' };
}
