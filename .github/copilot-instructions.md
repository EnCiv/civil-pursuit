## Purpose

Short guidance to help an AI coding agent be productive in this repository.

## Big picture (what runs where)

- Server entry: `app/start.js` — builds a `theCivilServer` from `civil-server`, sets `server.App = App`, and registers `app/routes`, `app/socket-apis`, and `app/events` directories. Add server-side endpoints or socket APIs there.
- Client: `app/` contains React components (JSX) and client code. `app/index.js` exports top-level `Components` used by the server to render UI.
- Build: source lives in `app/`. The repo uses Babel to transpile ES modules (and some CommonJS) into `dist/` and Webpack for client bundles.

## Key files and directories

- `app/start.js` — server bootstrap (important for runtime wiring).
- `app/components/*` — React UI; prefer existing component patterns (many default exports).
- `app/dturn/dturn.js` — critical tournament clustering logic (in-memory Discussions, Uitems, Gitems). Read before changing ranking/grouping behavior.
- `app/socket-apis/` — socket API handlers registered by the server (integration point with clients).
- `app/routes/` and `app/events/` — server routes and lifecycle events.
- `iotas.json` — preloaded by `Iota.preload()` in `start.js`.
- `webpack-dev.config.js`, `webpack-prod.config.js` — client build and production config; `assets/webpack` is the output path.
- `jest.config.js`, `jest-db.config.js` — test configuration (note `@shelf/jest-mongodb` preset).
- `package.json` — canonical scripts and dependency hints (see scripts section below).

## Developer workflows & important npm scripts

- Local dev (hot rebuild + server + client): `npm run dev` (runs `hot-transpile`, `hot-server`, `hot-client` via `concurrently`).
- Transpile source to `dist`: `npm run transpile` (uses Babel). Production start uses `node dist/start.js`.
- Production build & start: `npm run packstart` (runs `packbuild` -> `webpack --config webpack-prod.config.js`, then `node dist/server/start.js`).
- Storybook: `npm run storybook` (dev) and `npm run build-storybook` (static build).
  -- Tests: `npm test` (Jest).
- `npm run dbtest` is a "debug test" helper: it runs Jest in-band with Node's inspector enabled so you can attach a debugger to tests (useful when stepping through test execution).

Note: some tests require a MongoDB environment; those tests use `@shelf/jest-mongodb` and `mongodb-memory-server`. `jest-db.config.js` is the Jest config used for those DB tests.

Notes: many files mix `import`/`export` and `module.exports` — respect the existing style in a file when editing.

## Project-specific conventions & patterns

- dturn in-memory model: `Discussions[discussionId]` holds per-discussion state: `ShownStatements`, `ShownGroups`, `Gitems`, `Uitems`. The module exposes `initDiscussion`, `insertStatementId`, `getStatementIds`, `finishRound`, `putGroupings`, `rankMostImportant`, and `getDiscussionStatus`. Tests import `Discussions` for inspection — the export is intended for tests only.
- Persistence hooks: `initDiscussion` accepts `updateUInfo` and `getAllUInfo` callbacks. `updateUInfo` is expected to write incremental user state; `getAllUInfo` is used to rehydrate memory on startup. Never assume DB access is inside dturn — it relies on provided callbacks.
- Deterministic tests: `getRandomUniqueList` checks `process.env.JEST_TEST_ENV` to return deterministic sequences for Jest tests.
- Ranking/grouping thresholds and parameters are configured via the options object passed to `initDiscussion` (see `app/dturn/dturn.js`). `getInitOptions` defines the default values (e.g. `group_size`, `gmajority`, `min_rank`).

## Testing notes

- Jest roots are `app/` (see `jest.config.js`). Setup files include `jest-test-setup.js` and `jest-enzyme` integration.
- DB tests rely on `@shelf/jest-mongodb` and `mongodb-memory-server`.
- Use `npm run dbtest` for debug-friendly runs.

## Integration points and external dependencies

- Peer packages: `civil-client` and `civil-server` are peerDependencies — the runtime expects `civil-server` available for bootstrapping.
- The server relies on socket APIs under `app/socket-apis`. When adding real-time flows, register handlers there and use `server.socketAPIsDirPaths` in `start.js`.

## Pitfalls & quick warnings

- Don't mix module styles within a single file — follow the file's existing pattern (some files are CommonJS, others ESM).
- `Discussions` is in-memory; in production you must implement `updateUInfo`/`getAllUInfo` to persist user interactions and rehydrate on restart.
- `structuredClone` is used in `dturn.js` — Node >= 17/18 is expected (package.json specifies Node 18.13.0).

## Example call sites to inspect before edits

- `app/start.js` — how App, routes, socket-apis, events are wired into `theCivilServer`.
- `app/dturn/dturn.js` — state machine and hooks for tournaments. Look for `updateUInfo` and `getAllUInfo` usage.
