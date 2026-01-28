## Purpose

Short guidance to help an AI coding agent be productive in this repository.

## Big picture (what runs where)

- Server entry: `app/start.js` — builds a `theCivilServer` from `civil-server`, sets `server.App = App`, and registers `app/routes`, `app/socket-apis`, and `app/events` directories. Add server-side endpoints or socket APIs there.
- Client: `app/` contains React components (JSX) and client code. `app/index.js` exports top-level `Components` used by the server to render UI.
- Build: source lives in `app/`. The repo uses Babel to transpile ES modules (and some CommonJS) into `dist/` and Webpack for client bundles.

## Terminal environment setup (CRITICAL)

**IMPORTANT**: When opening a new bash terminal, Node.js and npm are NOT available until the environment is properly configured. The following commands from `.bashrc` must be run to set up the Node.js environment:

```bash
if [ ! -f .nvmrc ];then
    export NODE_VERSION=$(cat ./package.json | grep '\"node\":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
else
    export NODE_VERSION=`cat .nvmrc`
fi
export NVS_HOME="$HOME/AppData/Local/nvs/"
$NVS_HOME/nvs add $NODE_VERSION
source $NVS_HOME/nvs.sh use $NODE_VERSION
```

**Without running these commands, `node` and `npm` commands will fail.** The user may need to manually enter these commands in new terminal sessions. While executing `./.bashrc` would be ideal, it can disconnect the agent from terminal output. If you encounter "command not found" errors for `node` or `npm`, this environment setup is likely the issue.

## Key files and directories

- `app/start.js` — server bootstrap (important for runtime wiring).
- `app/components/*` — React UI; prefer existing component patterns (many default exports).
- `app/components/theme.js` — central theme configuration with colors, fonts, and styling constants. Use `encivYellow: '#FFC315'` for brand consistency.
- `app/dturn/dturn.js` — critical tournament clustering logic (in-memory Discussions, Uitems, Gitems). Read before changing ranking/grouping behavior.
- `app/jobs/` — background job implementations (e.g., email invitations).
- `app/models/` — data models and database schemas.
- `app/socket-apis/` — socket API handlers registered by the server (integration point with clients).
- `app/routes/` and `app/events/` — server routes and lifecycle events.
- `assets/email-templates/` — HTML email templates using EnCiv branding and styling.
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

- **React coding style**: Follow the [EnCiv React Coding and Style Guidelines](https://github.com/EnCiv/.github/wiki/React-Coding-and-Style-Guidelines). Key points:
  - Use `react-jss` with `createUseStyles` for styling; place styles at bottom of file
  - Accept `className` prop and combine with component classes using `cx(classes.componentName, className)`
  - Destructure `{ className, ...otherProps }` and spread `{...otherProps}` to outer tag for extensibility
  - Use theme from `app/components/theme.js` for colors, spacing, and other shared values
  - File names: lowercase with hyphens, `.js` extension (`.jsx` only for class components)
  - Components take width from parent, have no margin; use padding for internal spacing
  - Avoid `px` units; use `rem`, `em`, `vw`, `vh` for responsiveness
  - Include GitHub issue link at top of component and story files
  - Components with user input accept `onDone` callback: `onDone({valid: bool, value: any})`
  - Create Storybook stories for each component with multiple test scenarios
- dturn in-memory model: `Discussions[discussionId]` holds per-discussion state: `ShownStatements`, `ShownGroups`, `Gitems`, `Uitems`. The module exposes `initDiscussion`, `insertStatementId`, `getStatementIds`, `finishRound`, `putGroupings`, `rankMostImportant`, and `getDiscussionStatus`. Tests import `Discussions` for inspection — the export is intended for tests only.
- Persistence hooks: `initDiscussion` accepts `updateUInfo` and `getAllUInfo` callbacks. `updateUInfo` is expected to write incremental user state; `getAllUInfo` is used to rehydrate memory on startup. Never assume DB access is inside dturn — it relies on provided callbacks.
- Deterministic tests: `getRandomUniqueList` checks `process.env.JEST_TEST_ENV` to return deterministic sequences for Jest tests.
- Ranking/grouping thresholds and parameters are configured via the options object passed to `initDiscussion` (see `app/dturn/dturn.js`). `getInitOptions` defines the default values (e.g. `group_size`, `gmajority`, `min_rank`).
- ObjectId handling: Property names ending in "Id" (like `userId`) are always strings. On the client side, `_id` is always a string. In the database, `_id` is always an ObjectId object. Server-side code must be careful and clear about when `_id` is an ObjectId or a string - use `new ObjectId(stringId)` to convert strings for database queries.
- Models and mongo-collections: Data models are located in `app/models/` and use the `@enciv/mongo-collections` package. Models define MongoDB collection schemas and provide methods for database operations. Import models directly (e.g., `import InviteLog from '../../models/invite-log'`) and use standard MongoDB methods like `insertOne`, `findOne`, `updateOne`. Collections are automatically created on first use.
- Email templates: Located in `assets/email-templates/`. Follow the styling pattern from `node_modules/civil-server/assets/email-templates/reset-password.html` for consistency with EnCiv branding (logo, footer, social links).
- Background jobs: Implement in `app/jobs/` with proper error handling, logging, and throttling. Use real MongoDB integration in tests rather than mocks when testing job functionality.

## Testing notes

- Jest roots are `app/` (see `jest.config.js`). Setup files include `jest-test-setup.js` and `jest-enzyme` integration.
- DB tests rely on `@shelf/jest-mongodb` and `mongodb-memory-server`.
- Use `npm run dbtest` for debug-friendly runs.
- Integration tests: For complex functionality involving dturn, MongoDB, and civil-server components, prefer integration tests using MongoMemoryServer over mocked tests. This provides better coverage and catches real-world issues.
- Mock management: Use `jest.clearAllMocks()` in test cleanup to ensure proper isolation between tests.
- - Logger mocking: When mocking `global.logger`, info should be silent `jest.fn()`, while warn/error should console the arguments for debugging visibility: `jest.fn((...args) => console.warn('Logger WARN:', ...args))`. Exception: Unit tests specifically testing error scenarios should use silent mocks (`jest.fn()`) to avoid console noise and should verify the exact logger calls with `expect(logger.error).toHaveBeenCalledWith(...)`.

## Integration points and external dependencies

- Peer packages: `civil-client` and `civil-server` are peerDependencies — the runtime expects `civil-server` available for bootstrapping.
- The server relies on socket APIs under `app/socket-apis`. When adding real-time flows, register handlers there and use `server.socketAPIsDirPaths` in `start.js`.

## Pitfalls & quick warnings

- Don't mix module styles within a single file — follow the file's existing pattern (some files are CommonJS, others ESM). New files should prefer ES modules.
- `Discussions` is in-memory; in production you must implement `updateUInfo`/`getAllUInfo` to persist user interactions and rehydrate on restart.
- `structuredClone` is used in `dturn.js` — Node >= 17/18 is expected (package.json specifies Node 18.13.0).

## Example call sites to inspect before edits

- `app/start.js` — how App, routes, socket-apis, events are wired into `theCivilServer`.
- `app/dturn/dturn.js` — state machine and hooks for tournaments. Look for `updateUInfo` and `getAllUInfo` usage.
