<!-- .github/copilot-instructions.md -->
# Copilot instructions (project-specific)

This repository is a minimal Node.js (ESM) API project using Fastify. The goal of these instructions is to help AI coding agents get productive quickly by highlighting the big-picture architecture, important files, and concrete examples from the codebase.

1) Big picture
- Single entrypoint: `index.js` (ES module style, `type: "module"` in `package.json`).
- Lightweight HTTP API built with Fastify (`fastify` dependency). The project currently exposes a single route `GET /` that returns a small JSON payload.
- No runtime configuration system, tests, or CI are present — the repository is intentionally minimal.

2) Key files to read first
- `package.json` — confirms project name (`deepl-api`), ESM mode, and dependencies (Fastify).
- `index.js` — the entire server implementation: Fastify initialization, route registration, and the listen call on port 3000.

3) How to run (explicit commands AI agents can use)
- Install dependencies: `npm install` (project uses the default package manager).
- Run server: `node index.js` (the file listens on port 3000 by default).
- Note: there are no npm scripts defined. If you add scripts, prefer `start` for production and `dev` for a nodemon-based workflow.

4) Concrete code patterns and examples (from `index.js`)
- Fastify initialization with logging enabled:
  - import: `import Fastify from 'fastify'`
  - create: `const fastify = Fastify({ logger: true })`
- Route shape: `fastify.get('/', function (request, reply) { reply.send({ hello: 'world' }) })`
  - Use `request` / `reply` objects rather than Express-style `req/res` naming.
- Starting the server: `fastify.listen({ port: 3000 }, (err, address) => { ... })`
  - Listen callback logs and exits on error: `fastify.log.error(err); process.exit(1)`.

5) Project-specific conventions and notes
- ESM modules only: `package.json` contains `"type": "module"`. Use `import`/`export` and top-level ESM semantics.
- Explicit port and configuration live in code (`index.js`) — there is no dotenv/env loader yet. If you modify the server to use environment variables, document expected env names (e.g., `PORT`, `NODE_ENV`, `DEEPL_API_KEY`).
- Minimal error handling pattern: the listen callback handles fatal listen errors by logging and exiting. Follow that simple pattern for other startup failures.

6) Integration points & external dependencies
- Only dependency is `fastify` (check `package.json` for version). There are currently no API keys, database configs, or external HTTP clients configured.

7) Recommended first tasks for AI agents (low-risk, high-value)
- Add `scripts` to `package.json` (e.g., `start` and `dev`) so running the app is explicit.
- Extract route handlers and register them as Fastify plugins/files (`routes/*.js`) if you expand the API.
- Introduce a small `.env` + config loader if you add third-party integrations so secrets aren't hard-coded.

8) When making changes, prioritize discoverability
- Keep `index.js` tiny and add new code under `routes/`, `lib/`, or `config/` with clear README notes. An AI agent should update this instructions file when any of the above structural conventions change.

If anything above is unclear or you want this guidance expanded (examples for adding routes, testing, or CI), tell me which area to flesh out and I will iterate.
