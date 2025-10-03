<!-- .github/copilot-instructions.md -->
6) Project-specific conventions & gotchas
- Expect CommonJS modules (`module.exports`/`require`). The repository was scaffolded with Fastify-CLI and follows that layout.
- Autoload will register everything under `plugins/` and `routes/` — avoid side-effects in files that shouldn't be registered.
- Configuration is attached to the Fastify instance (`fastify.config`). Use that instead of reading `process.env` directly where possible.
- `/translate` depends on `DEEPL_AUTH_KEY`. When developing locally, copy `.env.example` to `.env` and add your DeepL API key, or export it in your shell. Without it the endpoint returns a 500 with a clear message.
- Plugin load order: `plugins/` load before `routes/`, so decorators (like `fastify.deepl`) are available to route handlers.ilot instructions (project-specific)

This repository is a small Fastify API that exposes a DeepL translation endpoint. The goal here is to get an AI coding agent productive quickly by describing the actual architecture, run/test workflows, and local conventions you’ll see in the code.

1) Big picture (read these files first)
- Entrypoint: `app.js` — registers plugins (autoload) and starts the server.
- Autoload: `@fastify/autoload` loads everything under `plugins/` and `routes/` automatically.
- Routes live under `routes/` (each file or `index.js` in a folder is a Fastify plugin).
- Cross-cutting code (decorators, sensible helpers) lives under `plugins/` and uses `fastify-plugin`.

2) Key files to inspect
- `package.json` — scripts and dependencies (uses `fastify-cli` in scripts).
- `app.js` — application wiring: uses `@fastify/autoload` to register plugins and routes.
- `plugins/deepl.js` — initializes DeepL client using `@fastify/env` for config, decorates `fastify.deepl`.
- `routes/root.js` and `routes/example/index.js` — canonical route plugin examples (return values vs `reply.send`).
- `routes/translate.js` — DeepL translation endpoint, uses `fastify.deepl` decorator.
- `plugins/sensible.js`, `plugins/support.js` — show `fastify-plugin`, decorators, and registering `@fastify/sensible`.
- `test/helper.js` and `test/**/*.test.js` — how tests build an app instance and use `app.inject()`.
- `.env.example` — documents required environment variables (`DEEPL_AUTH_KEY`, `PORT`).

3) How to run and test (explicit commands)
- Install deps: npm install
- Run in dev/watch mode (fastify-cli): npm run dev
- Start production-style (fastify-cli): npm start
- Run tests: npm run test (runs `node --test test/**/*.test.js`)

Note: the scripts are implemented with `fastify start` (provided by `fastify-cli`). You can also invoke `fastify` directly if it helps while developing.

4) Important code patterns seen in this repo
- CommonJS-style Fastify plugins: `module.exports = async function (fastify, opts) { ... }`
- Use `fastify-autoload` to keep `app.js` minimal — place route plugins in `routes/` and reusable helpers in `plugins/`.
- Plugins that expose functionality use `fastify-plugin` so decorators are available to the application (see `plugins/support.js` and `plugins/deepl.js`).
- Configuration via `@fastify/env`: registered in `plugins/deepl.js` and exposes values on `fastify.config`. `DEEPL_AUTH_KEY` and `PORT` are read here; `.env` is enabled.
- DeepL integration: `deepl-node` Translator is initialized in `plugins/deepl.js` and exposed as `fastify.deepl` decorator. Route `routes/translate.js` expects `{ text, target_lang, source_lang?, options? }` and returns the raw DeepL result (or 500/502 on missing key or API failure).

5) Tests and test helpers
- Tests use Node’s built-in test runner (`node:test`) and `assert`.
- `test/helper.js` uses `fastify-cli/helper` to build an app instance for integration-style tests and sets `skipOverride: true` to ensure decorators are available for tests.
- Use `app.inject({ url: '/' })` to call routes in tests (see `test/routes/root.test.js`). Tests call `t.after(() => app.close())` to cleanup.

6) Project-specific conventions & gotchas
- Expect CommonJS modules (`module.exports`/`require`). The repository was scaffolded with Fastify-CLI and follows that layout.
- Autoload will register everything under `plugins/` and `routes/` — avoid side-effects in files that shouldn’t be registered.
- Configuration is attached to the Fastify instance (`fastify.config`). Use that instead of reading `process.env` directly where possible.
- `/translate` depends on `DEEPL_AUTH_KEY`. When developing locally, add a `.env` with `DEEPL_AUTH_KEY` or export it in your shell to enable translate calls. Without it the endpoint returns a 500 with a clear message.

7) Quick examples (copy/paste patterns)
- Route plugin (`routes/any.js`):

  module.exports = async function (fastify, opts) {
    fastify.get('/ping', async () => ({ ok: true }))
  }

- Plugin exposing a decorator (`plugins/support.js`):

  const fp = require('fastify-plugin')
  module.exports = fp(async function (fastify, opts) {
    fastify.decorate('someSupport', () => 'hugs')
  })

8) When making changes
- Keep `app.js` focused on wiring and delegating work to `plugins/` and `routes/`.
- Update `README.md` and this instructions file when you add new top-level behaviors (new env vars, external integrations, or CI).

If anything in these notes is unclear or you want short examples for expanding routes, adding CI, or improving tests, tell me which area to expand and I will iterate.
