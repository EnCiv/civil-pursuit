# civil-pursuit Node 24 Migration Plan

**Date:** August 2026  
**Current Node:** 24 (`.nvmrc`, `engines >= 24.0.0`)  
**Target Node:** 24 ✅  
**Reference:** `civil-server-update/doc/migration-plan.md` — full detail on every civil-server change; `docs/update2026-migration.md` — prior update2026 work

---

## What Is Already Complete

The `update2026` branch of civil-pursuit-new already incorporates all the consuming-project steps from `docs/update2026-migration.md`:

| Item | Status |
| ---- | ------ |
| Node 20, engines `>=20.0.0` | ✅ done |
| React 19, react-dom 19 | ✅ done |
| `@testing-library/react` replacing Enzyme | ✅ done |
| `jest-test-setup.js` — jest-dom import, TextEncoder polyfill | ✅ done |
| `jest.config.js` — `transformIgnorePatterns` for civil-server/civil-client, `moduleNameMapper` for ws | ✅ done |
| `JssProvider` + stable `generateId` in `app/client/main-app.js` | ✅ done |
| `webpack-dev.config.js` — react/react-dom aliases, `process/browser` alias | ✅ done |
| Babel `plugin-transform-*` names (not deprecated `plugin-proposal-*`) | ✅ done |
| `brevoDefaultFromEmail` import in `app/jobs/invite-users-back.js` | ✅ done |
| `npm update civil-server civil-client` — peer deps installed | ✅ done |

The following phases from this plan have also been completed:

| Phase | Status | Notes |
| ----- | ------ | ----- |
| Phase 1 — Node 20 → 24 | ✅ done | See details below |
| Phase 4 — MongoDB 5 → 7 | ✅ done | Pulled forward — required to fix test failures caused by dual `@enciv/mongo-collections` instances after `npm update civil-server` |

---

## Remaining Phases

---

### Phase 1 — Node 20 → 24 ✅ DONE

**Files changed:**

- `.nvmrc`: `20` → `24`
- `package.json` engines: `>=20.0.0` → `>=24.0.0`
- `app/start.js`: updated DNS fix comment to say "Node 20+" (fix applies to 20 and beyond)
- `jest.config.js`: added `color`, `color-string`, `color-convert`, `color-name` to `transformIgnorePatterns` — after `npm update civil-client`, civil-client gained a nested `node_modules/color@5` (ESM/`"type":"module"`); Jest could not execute it without transformation because it was a nested `node_modules` path. All four color packages under civil-client are ESM-only and need the same exception.
- `app/lib/doc-to-set-unset.js`: replaced `instanceof ObjectId` (from `mongodb`) with `_bsontype === 'ObjectId'` check — `instanceof` fails when civil-server uses a different mongodb driver version than civil-pursuit. The check is called only when the value is already a non-null object, so the redundant null/type guards were removed.
- `app/components/sign-up.jsx`: guarded `window.location.pathname` with `typeof window !== 'undefined'` — caused `ReferenceError: window is not defined` during server-side render of `/join`.

**Verified:** 49/49 jest suites pass; 33/33 storybook story suites pass; `/join` returns HTTP 200.

---

### Phase 2 — Babel 7 → 8

**Why:** civil-server now ships with `@babel/core@^8`. Both repos use the same transpile pipeline. Keeping Babel 7 in civil-pursuit risks subtle incompatibilities when importing from civil-server source (via junctions in dev; via transpiled dist in production — but in dev both Babel instances must agree on the transform output).

**Changes in `package.json` `devDependencies`:**

```diff
-  "@babel/cli": "^7.16.0",
-  "@babel/core": "^7.29.7",
-  "@babel/plugin-transform-class-properties": "^7.29.7",
-  "@babel/plugin-transform-object-rest-spread": "^7.29.7",
-  "@babel/plugin-transform-react-inline-elements": "^7.16.0",
-  "@babel/plugin-transform-regenerator": "^7.29.7",
-  "@babel/plugin-transform-runtime": "^7.29.7",
-  "@babel/preset-env": "^7.29.7",
-  "@babel/preset-react": "^7.29.7",
+  "@babel/cli": "^8.0.4",
+  "@babel/core": "^8.0.1",
+  "@babel/plugin-transform-class-properties": "^8.0.1",
+  "@babel/plugin-transform-object-rest-spread": "^8.0.1",
+  "@babel/plugin-transform-react-inline-elements": "^8.0.1",
+  "@babel/plugin-transform-regenerator": "^8.0.2",
+  "@babel/plugin-transform-runtime": "^8.0.1",
+  "@babel/preset-env": "^8.0.2",
+  "@babel/preset-react": "^8.0.1",
```

Also upgrade `babel-loader` (must match Babel 8):

```diff
// devDependencies
-  "babel-loader": "^8.2.3",
+  "babel-loader": "^10.1.1",
```

**`babel.config.json` → `babel.config.js`:** Rename `babel.config.json` to `babel.config.js` and convert it to a function-based config. This allows the Storybook/webpack context to receive `modules: false` (ESM, required for webpack tree-shaking) while the CLI transpile and jest still receive `modules: commonjs`. This is the same pattern civil-client uses with its `.babelrc.js`, adapted as a project-wide file so jest can still transform civil-server and civil-client via junctions.

Delete `babel.config.json` and create `babel.config.js`:

```js
// Use ESM for webpack/Storybook (babel-loader sets caller.name = 'babel-loader');
// use commonjs for CLI transpile and jest.
module.exports = function (api) {
  const isWebpack = api.caller(c => c && c.name === 'babel-loader')
  const isTest = api.env('test')
  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: isTest ? { node: 'current' } : { node: '24' },
          modules: isTest || !isWebpack ? 'commonjs' : false,
        },
      ],
    ],
    plugins: ['@babel/plugin-transform-class-properties', '@babel/plugin-transform-regenerator'],
    sourceMap: 'inline',
  }
}
```

**`.storybook/addons.js` cleanup:** This file (`import 'storybook-addon-specifications/register'`) is a Storybook v5/v6 artifact. Storybook 10 ignores it entirely, but it should be deleted to avoid confusion.

```bash
git rm .storybook/addons.js
```

**Commands:**

```bash
npm install --save-dev \
  @babel/cli@^8 \
  @babel/core@^8 \
  @babel/plugin-transform-class-properties@^8 \
  @babel/plugin-transform-object-rest-spread@^8 \
  @babel/plugin-transform-react-inline-elements@^8 \
  @babel/plugin-transform-regenerator@^8 \
  @babel/plugin-transform-runtime@^8 \
  @babel/preset-env@^8 \
  @babel/preset-react@^8 \
  babel-loader@^10
```

**Verify:** `npm run transpile` produces output without errors; `npm test` passes.

---

### Phase 3 — webpack-cli 5 → 7, webpack-dev-server 5 → 6, webpack-merge 5 → 6 ✅ DONE

**Files changed:**

- `package.json` devDependencies: `webpack-cli` `^5.1.4` → `^7.2.2`; `webpack-merge` `^5.10.0` → `^6.0.1`
- `package.json` optionalDependencies: `webpack-dev-server` `^5.2.5` → `^6.0.0`
- `webpack-dev.config.js`: `process/browser` alias updated to `require.resolve('process/browser.js')` (explicit `.js` extension required by webpack-dev-server 6 ESM resolution)

**Note on `allowScripts`:** After adding `civil-client`, `civil-server`, and `use-methods` version-pinned entries, npm showed 3 remaining warnings. These were resolved by npm approve — no code change needed. All packages execute their prepare/postinstall scripts.

**Verified:** 49/49 jest suites pass; 33/33 storybook story suites pass; `/join` returns HTTP 200; no allowScripts warnings from `npm install`.

---

### Phase 4 — MongoDB 5 → 7 + related packages ✅ DONE

**Why pulled forward:** After `npm update civil-server`, the installed civil-server uses `@enciv/mongo-collections@0.0.5` internally. Civil-pursuit's own `@enciv/mongo-collections@0.0.3` is a different module instance; `Mongo.connect()` called in test setup did not propagate to the civil-server model instances, causing `TypeError: Iota.insertOne is not a function` in every test that imports from civil-server.

**Files changed:**

- `package.json` dependencies:
  - `@enciv/mongo-collections`: `^0.0.3` → `^0.0.5`
  - `mongodb`: `^5.9.2` → `^7.5.0`
  - `@shelf/jest-mongodb`: `^4.3.2` → `^6.0.2` (moved from `dependencies` to `optionalDependencies`)
- `package.json` optionalDependencies:
  - `mongodb-memory-server`: `^10.1.2` → `^11.2.0`
- `jest.config.js`:
  - Added `bson` to `transformIgnorePatterns` — mongodb@7 ships `bson` as ESM (`.mjs`), which Jest cannot execute without transformation.
  - Added explicit `transform` using `@swc/jest` with `jsx: true` — `@shelf/jest-mongodb@6` installs `@swc/jest` as its default transformer but does not enable JSX; this caused `Expected \'>\', got \'{\''` syntax errors in all component tests that use spread in JSX.
- `jest-db.config.js`: removed stale `jest-enzyme/lib/index.js` from `setupFilesAfterEnv`
- `app/models/__tests__/dturns.js`, `invite-log.test.js`, `jsforms.js`, `ranks.js`: removed `{ useUnifiedTopology: true }` — this option was silently ignored in mongodb@5 but throws `MongoParseError` in mongodb@7.
- `app/socket-apis/__tests__/get-user-whys.js`: removed `{ useNewUrlParser: true }` — same reason.

**Verified:** 49/49 jest suites pass; 33/33 storybook story suites pass; `/join` returns HTTP 200.

---

### Phase 5 — Jest 29 → 30 ✅ DONE

**Files changed:**

- `package.json` optionalDependencies:
  - `jest`: `^29.7.0` → `^30.4.2`
  - `@jest/globals`: `^29.7.0` → `^30.4.1`
  - `@testing-library/jest-dom`: `^6.9.1` → `^7.0.0`
  - `expect` (standalone `^23.6.0`): **removed**
  - `@shelf/jest-mongodb` re-added to optionalDependencies (was in a wrong location)
- `stories/*.stories.jsx` (10 files): `import expect from 'expect'` → `import { expect } from 'storybook/test'` — jest 30's `expect` package internally imports `node:url` which webpack cannot bundle; Storybook's own bundled `expect` (from `storybook/test`) is browser-compatible.

---

### Phase 6 — joi 17 → 18 ✅ DONE

**Files changed:**

- `package.json` dependencies: `joi` `^17.13.3` → `^18.2.3`

`joi-objectid@^4.0.2` is compatible with joi 18 — all tests pass without modification.

---

### Phase 7 — Minor Semver-Compatible Updates ✅ DONE

`npm update` + `npm install concurrently@^10` applied. `concurrently` bumped to `^10.0.4` to match civil-server. All package.json ranges bumped to reflect installed versions.

| Package | Before | After |
| ------- | ------ | ----- |
| `react` | ^19 | ^19.2.8 |
| `react-dom` | ^19 | ^19.2.8 |
| `recharts` | ^3.8.1 | ^3.10.1 |
| `@jsonforms/core` | ^3.7.0 | ^3.8.0 |
| `@jsonforms/react` | ^3.7.0 | ^3.8.0 |
| `@jsonforms/vanilla-renderers` | ^3.7.0 | ^3.8.0 |
| `concurrently` | ^9.2.1 | ^10.0.4 |
| `@storybook/addon-a11y` | ^10.4.6 | ^10.5.7 |
| `@storybook/addon-links` | ^10.4.6 | ^10.5.7 |
| `@storybook/react-webpack5` | ^10.4.6 | ^10.5.7 |
| `storybook` | ^10.4.6 | ^10.5.7 |

---

### Phase 8 — Breaking Dependency Assessments ✅ DONE

#### 8a — `color` ^3 → ^5 ✅

Civil-pursuit-new has `color` in `package.json` but **no file in `app/` directly imports it**. The package was pulled in as a transitive dependency. Upgrading from `^3` to `^5` eliminates the nested `civil-client/node_modules/color@5` by hoisting a single shared ESM-compatible copy. No code changes needed.

#### 8b — `bson-objectid` ^1 → ^2 ✅

Version 2.x requires explicit `new ObjectId()` — calling without `new` throws. Found 5 bare `ObjectId().toString()` calls in source:

- `app/components/pair-compare.jsx`
- `app/components/point-input.jsx`
- `app/components/steps/answer.js` (2 occurrences)
- `app/components/steps/rank.js`

All fixed by adding `new` keyword.

#### 8c — `autosize` ^3 → ^6 ✅

`autosize(ref)` and `autosize.destroy(ref)` API unchanged. No code changes needed.

#### 8d — `markdown-to-jsx` 7.7.6 → 9.x ✅

No breaking API changes for `<Markdown>{content}</Markdown>` usage. Pinned version removed to allow minor updates.

#### 8e — `chromatic` ^11 → ^16 ✅

CLI API unchanged. No code changes needed.

---

### Phase 9 — Code Cleanup

These are non-breaking cleanup items that should be done at convenient times, not blockers.

#### 9a — Rename Sib* imports to Brevo*

`app/jobs/invite-users-back.js` and its tests import `SibGetTemplateId` and `SibSendTransacEmail` from civil-server. These aliases still work (they are kept for backwards compatibility) but are deprecated. Rename to `BrevoGetTemplateId` and `BrevoSendTransacEmail`:

```diff
-import { SibGetTemplateId, SibSendTransacEmail, brevoDefaultFromEmail, Iota, User } from 'civil-server'
+import { BrevoGetTemplateId, BrevoSendTransacEmail, brevoDefaultFromEmail, Iota, User } from 'civil-server'
```

Update all call sites and test mocks accordingly. Also update the error log message:

```diff
-  logger.error('Failed to send invite email via SibSendTransacEmail:', error)
+  logger.error('Failed to send invite email via BrevoSendTransacEmail:', error)
```

#### 9b — peerDependencies branch references

Once civil-server and civil-client publish tagged releases from the `update2026` branch (or the branch is merged to main), update `package.json` `peerDependencies` from branch refs to version ranges:

```diff
  "peerDependencies": {
-   "civil-client": "github:EnCiv/civil-client#update2026",
-   "civil-server": "github:EnCiv/civil-server#update2026"
+   "civil-client": "github:EnCiv/civil-client#main",
+   "civil-server": "github:EnCiv/civil-server#main"
  },
```

#### 9c — `allowScripts` in package.json

civil-server and civil-client use an `allowScripts` map to permit postinstall scripts for packages that need native compilation (bcrypt, core-js, @swc/core). Add this to civil-pursuit's `package.json` so that `npm ci` in a strict environment does not silently skip build scripts:

```json
"allowScripts": {
  "mongodb-memory-server@11.x.x": true,
  "bcrypt@6.0.0": true,
  "core-js@3.x.x": true,
  "esbuild@0.x.x": true
}
```

Confirm exact versions after install and update accordingly.

---

### Phase 10 — Windows Dev Linking (link-civil-server.js) _(Deferred)_

> Deferred — not needed until all phases are complete and local multi-repo dev is the active workflow.

For Windows development where civil-server, civil-client, and civil-pursuit-new are all checked out side by side, standard `npm link` uses symlinks that Node.js does not follow correctly. A junction script is needed, similar to `civil-server-update/link-civil-client.js`.

Create `link-civil-server.js` in civil-pursuit-new root:

```
civil-pursuit-new/node_modules/civil-server  → civil-server-update/
civil-pursuit-new/node_modules/civil-client  → civil-client/
civil-client/node_modules/react              → civil-pursuit-new/node_modules/react
civil-client/node_modules/react-dom          → civil-pursuit-new/node_modules/react-dom
civil-client/node_modules/react-jss          → civil-pursuit-new/node_modules/react-jss
```

Add to `package.json` scripts:

```diff
+  "link-civil-server": "node link-civil-server.js"
```

See `civil-server-update/link-civil-client.js` for the junction implementation pattern.

---

## Package Version Summary (npm outdated → target)

| Package | Current | Target | Phase |
| ------- | ------- | ------ | ----- |
| `@babel/cli` | ~~7.24.8~~ **8.x** | ^8.0.4 | **2 ✅** |
| `@babel/core` | (transitive) **8.x** | ^8.0.1 | **2 ✅** |
| `@babel/plugin-transform-react-inline-elements` | ~~7.24.7~~ **8.x** | ^8.0.1 | **2 ✅** |
| `@babel/plugin-transform-regenerator` | 7.29.7 | **removed** | **2 ✅** |
| `@babel/plugin-transform-runtime` | (transitive) | **removed** | **2 ✅** |
| `@babel/preset-env` | (transitive) **8.x** | ^8.0.2 | **2 ✅** |
| `@babel/preset-react` | (transitive) **8.x** | ^8.0.1 | **2 ✅** |
| `babel-loader` | ~~8.3.0~~ **10.x** | ^10.1.1 | **2 ✅** |
| `webpack-cli` | ~~5.1.4~~ **7.x** | ^7.2.2 | **3 ✅** |
| `webpack-dev-server` | ~~5.2.5~~ **6.x** | ^6.0.0 | **3 ✅** |
| `webpack-merge` | ~~5.10.0~~ **6.x** | ^6.0.1 | **3 ✅** |
| `@enciv/mongo-collections` | ~~0.0.3~~ **0.0.5** | ^0.0.5 | **4 ✅** |
| `mongodb` | ~~5.9.2~~ **7.x** | ^7.5.0 | **4 ✅** |
| `mongodb-memory-server` | ~~10.1.2~~ **11.x** | ^11.2.0 | **4 ✅** |
| `@shelf/jest-mongodb` | ~~4.3.2~~ **6.x** | ^6.0.2 | **4 ✅** |
| `jest` | ~~29.7.0~~ **30.x** | ^30.4.2 | **5 ✅** |
| `@jest/globals` | ~~29.7.0~~ **30.x** | ^30.4.1 | **5 ✅** |
| `@testing-library/jest-dom` | ~~6.9.1~~ **7.x** | ^7.0.0 | **5 ✅** |
| `expect` (standalone) | 23.6.0 | **removed** | **5 ✅** |
| `joi` | ~~17.13.3~~ **18.x** | ^18.2.3 | **6 ✅** |
| `react` | ~~19.2.6~~ **19.2.8** | 19.2.8 | **7 ✅** |
| `react-dom` | ~~19.2.6~~ **19.2.8** | 19.2.8 | **7 ✅** |
| `recharts` | ~~3.8.1~~ **3.10.1** | ^3.10.1 | **7 ✅** |
| `@jsonforms/core` | ~~3.7.0~~ **3.8.0** | ^3.8.0 | **7 ✅** |
| `@jsonforms/react` | ~~3.7.0~~ **3.8.0** | ^3.8.0 | **7 ✅** |
| `@jsonforms/vanilla-renderers` | ~~3.7.0~~ **3.8.0** | ^3.8.0 | **7 ✅** |
| `concurrently` | ~~9.2.1~~ **10.0.4** | ^10.0.4 | **7 ✅** |
| `@storybook/addon-a11y` | ~~10.4.6~~ **10.5.7** | ^10.5.7 | **7 ✅** |
| `@storybook/addon-links` | ~~10.4.6~~ **10.5.7** | ^10.5.7 | **7 ✅** |
| `@storybook/react-webpack5` | ~~10.4.6~~ **10.5.7** | ^10.5.7 | **7 ✅** |
| `storybook` | ~~10.4.6~~ **10.5.7** | ^10.5.7 | **7 ✅** |
| `color` | ~~3.2.1~~ **5.x** | ^5.0.3 | **8a ✅** |
| `bson-objectid` | ~~1.3.1~~ **2.x** | ^2.0.4 | **8b ✅** |
| `autosize` | ~~3.0.21~~ **6.x** | ^6.0.1 | **8c ✅** |
| `markdown-to-jsx` | ~~7.7.6~~ **9.x** | ^9.10.2 | **8d ✅** |
| `chromatic` | ~~11.7.0~~ **16.x** | ^16.10.1 | **8e ✅** |

---

## Phase Order and Branching Strategy

Phases are ordered by dependency — each phase's install must succeed before the next phase is validated. Do not combine phases 2–6 into a single PR; each phase should be verified independently so regressions are bisectable.

```
update2026  (current state)
 └── phase/1-node24              ✅ DONE: .nvmrc, engines, start.js; ESM color transforms; ObjectId bsontype fix; window SSR guard
 └── phase/2-babel8              ✅ DONE: @babel/core ^8, babel-loader ^10, babel.config.js, removed regenerator plugin, allowScripts
 └── phase/3-webpack-toolchain   ✅ DONE: webpack-cli ^7, webpack-dev-server ^6, webpack-merge ^6, process/browser.js alias
 └── phase/4-mongodb7            ✅ DONE: mongo-collections ^0.0.5, mongodb ^7, jest-mongodb ^6, useUnifiedTopology/useNewUrlParser removed, SWC+JSX transform
 └── phase/5-jest30              ✅ DONE: jest ^30, @jest/globals ^30, @testing-library/jest-dom ^7, removed standalone expect, fixed story imports to storybook/test
 └── phase/6-joi18               ✅ DONE: joi ^18, joi-objectid@4 compatible
 └── phase/7-minor-updates       ✅ DONE: npm update + concurrently ^10
 └── phase/8-breaking-deps       ✅ DONE: color ^5, bson-objectid ^2 (added new keyword), autosize ^6, markdown-to-jsx ^9, chromatic ^16
 └── phase/9-cleanup             Brevo* rename, peerDep refs, allowScripts
 └── phase/10-windows-linking    link-civil-server.js
```

**Execution notes:**

- Commit each phase individually; no PR needed until the phases are complete.
- For each phase: apply changes → `npm test` → `npm run dev` (verify `/join` loads in browser) → start `npm run storybook` in one shell and run `npm run test-storybook` in a second shell to verify all stories pass. Allow at least 41 seconds for `test-storybook` to complete.
- If a phase fails verification, make at most **2 fix attempts** before stopping and explaining the problem. Do not loop indefinitely.
- All fixes are scoped to **civil-pursuit-new only**. If a problem requires changes to civil-server or civil-client, stop and document the issue instead of patching those repos.
