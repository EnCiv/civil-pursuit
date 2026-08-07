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

### Phase 3 — webpack-cli 5 → 7, webpack-dev-server 5 → 6, webpack-merge 5 → 6

**Why:** civil-server's `webpack-dev.config.js` (which civil-pursuit clones) now uses webpack-dev-server 6 syntax. Using webpack-dev-server 5 to run a v6-format config causes silent failures.

**Changes in `package.json`:**

```diff
// devDependencies
-  "webpack-cli": "^5.1.4",
-  "webpack-merge": "^5.10.0",
+  "webpack-cli": "^7.2.2",
+  "webpack-merge": "^6.0.1",
```

```diff
// optionalDependencies
-  "webpack-dev-server": "^5.2.5",
+  "webpack-dev-server": "^6.0.0",
```

**`webpack-dev.config.js` change:** Update the `process/browser` alias to use the explicit `.js` extension, matching civil-server's config. Without this, webpack-dev-server 6's ESM resolution rejects the import from `tiny-invariant`:

```diff
-module.exports.resolve.alias['process/browser'] = require.resolve('process/browser')
+module.exports.resolve.alias['process/browser'] = require.resolve('process/browser.js')
```

> **Note:** No proxy config change is needed in civil-pursuit's own `webpack-dev.config.js` because it clones civil-server's base config, which already uses the array-format proxy required by webpack-dev-server 5+/6. Do not re-add an object-format `proxy` property.

**Commands:**

```bash
npm install --save-dev webpack-cli@^7 webpack-merge@^6
npm install --save-optional webpack-dev-server@^6
```

**Verify:** `npm run hot-client` starts webpack-dev-server; browser loads the app; no "proxy" config errors in the terminal.

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

### Phase 5 — Jest 29 → 30

**Why:** civil-server uses jest@^30. Test infrastructure packages like `@shelf/jest-mongodb` v6 and `mongodb-memory-server` v11 are validated against jest 30. Running jest 29 against those packages may work but is untested combination.

**Changes in `package.json` `optionalDependencies`:**

```diff
-  "@jest/globals": "^29.7.0",
-  "jest": "^29.7.0",
-  "expect": "^23.6.0",
+  "@jest/globals": "^30.4.1",
+  "jest": "^30.4.2",
```

Remove the standalone `expect` package entirely — it is a very old version (23.6.0) pinned independently of jest, provides no value when jest ships its own `expect`, and can cause version conflicts with jest 30:

```diff
-  "expect": "^23.6.0",
```

Upgrade `@testing-library/jest-dom` to match civil-server:

```diff
-  "@testing-library/jest-dom": "^6.9.1",
+  "@testing-library/jest-dom": "^7.0.0",
```

**Commands:**

```bash
npm install --save-optional jest@^30 @jest/globals@^30 @testing-library/jest-dom@^7
npm uninstall expect
```

**Verify:** `npm test` — all suites pass. If any test imports `expect` from the standalone package, change the import to `import { expect } from '@jest/globals'` or use jest's built-in global.

---

### Phase 6 — joi 17 → 18

**Why:** civil-server uses `joi@^18`. If civil-pursuit's validation schemas pass joi objects across the module boundary, version mismatch causes silent failures. Even if they don't, staying in sync avoids future surprises.

**Changes in `package.json` `dependencies`:**

```diff
-  "joi": "^17.13.3",
+  "joi": "^18.2.3",
```

**`joi-objectid` compatibility:** `joi-objectid@^4.0.2` was written for joi 17. Check whether it works with joi 18 by running the tests. If it fails, the fix is to replace it with a custom Joi extension:

```js
// replaces joi-objectid
const objectId = joi => joi.string().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
```

**Commands:**

```bash
npm install joi@^18
```

**Verify:** `npm test` — all tests that use joi schemas pass; joi-objectid compatibility confirmed.

---

### Phase 7 — Minor Semver-Compatible Updates

These can be applied in a single `npm update` pass. They are within the declared semver range or are straightforward minor/patch bumps with no breaking changes:

| Package                               | Current | Wanted / Latest | Notes                                    |
| ------------------------------------- | ------- | --------------- | ---------------------------------------- |
| `react`                               | 19.2.6  | 19.2.8          | patch                                    |
| `react-dom`                           | 19.2.6  | 19.2.8          | patch                                    |
| `recharts`                            | 3.8.1   | 3.10.1          | minor                                    |
| `@jsonforms/core`                     | 3.7.0   | 3.8.0           | minor                                    |
| `@jsonforms/react`                    | 3.7.0   | 3.8.0           | minor                                    |
| `@jsonforms/vanilla-renderers`        | 3.7.0   | 3.8.0           | minor                                    |
| `concurrently`                        | 9.2.1   | 9.2.4 (wanted)  | patch; bump to ^10 to match civil-server |
| `@babel/plugin-transform-regenerator` | 7.29.7  | 7.29.8          | patch (already done as part of Phase 2)  |
| `@storybook/addon-a11y`               | 10.4.6  | 10.5.7          | minor                                    |
| `@storybook/addon-links`              | 10.4.6  | 10.5.7          | minor                                    |
| `@storybook/react-webpack5`           | 10.4.6  | 10.5.7          | minor                                    |
| `storybook`                           | 10.4.6  | 10.5.7          | minor                                    |
| `nodemon`                             | 3.1.14  | latest 3.x      | patch                                    |

Also bump `concurrently` to match civil-server:

```diff
// optionalDependencies
-  "concurrently": "^9.2.1",
+  "concurrently": "^10.0.4",
```

**Command:**

```bash
npm update
```

---

### Phase 8 — Breaking Dependency Assessments

These packages have major-version latests that require code changes. Each must be assessed and migrated individually.

#### 8a — `color` ^3 → ^5

civil-client already uses `color@^5`. Civil-pursuit uses `color@^3` directly in `app/components/theme.js` (likely). The v5 API is mostly backwards-compatible for the common `.lighten()`, `.darken()`, `.hex()` patterns. However, v4 changed the ES module export style.

**Check:** Grep for all `color` usage, confirm the API calls still work, then update:

```diff
-  "color": "^3.2.1",
+  "color": "^5.0.3",
```

#### 8b — `bson-objectid` ^1 → ^2

`bson-objectid` is used in `pair-compare.jsx`, `point-input.jsx`, `steps/answer.js`, `steps/rank.js`, `dturn/test.js`, and `socket-apis/__tests__/get-conclusion.js`. Version 2.x changed the constructor to require explicit `new`:

- v1: `ObjectId()` (with or without `new`)
- v2: requires `new ObjectId()`; calling without `new` throws

All existing `new ObjectId()` usage is already correct. Calls like `ObjectId.createFromHexString()` or `ObjectId.isValid()` are the same in v2.

**Grep for bare `ObjectId(` without `new`:**

```bash
grep -rn "ObjectId(" app/ | grep -v "new ObjectId"
```

Once confirmed safe:

```diff
-  "bson-objectid": "^1.2.4",
+  "bson-objectid": "^2.0.4",
```

#### 8c — `autosize` ^3 → ^6

`autosize` is used in `jsform.jsx` and `point-input.jsx` via `autosize(ref)` and `autosize.destroy(ref)`. The v4/v5/v6 API is unchanged for these two calls. The main difference is that v6 requires an explicit ResizeObserver in the environment, which Node 24 / jsdom 24 provide.

**Test:** Confirm storybook stories for these components render without errors after upgrade.

```diff
-  "autosize": "^3.0.15",
+  "autosize": "^6.0.1",
```

#### 8d — `markdown-to-jsx` 7.7.6 → 9.x

`markdown-to-jsx` is used in `intermission.jsx` and `question-box.jsx` with the default `<Markdown>` component. Version 9.x requires React 18+ (already satisfied) and has no breaking API changes for basic usage of `<Markdown>{content}</Markdown>`. Custom overrides via the `options` prop continue to work.

**Check:** Run the storybook stories for both components and confirm rendering is correct.

```diff
-  "markdown-to-jsx": "7.7.6",
+  "markdown-to-jsx": "^9.10.2",
```

Remove the pinned version and allow minor updates:

#### 8e — `chromatic` ^11 → ^16

Chromatic's CLI API is stable across major versions. The large version jump (11 → 16) is primarily cloud-service compatibility. No code changes are expected.

```diff
-  "chromatic": "^11.3.0",
+  "chromatic": "^16.10.1",
```

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
| `webpack-cli` | 5.1.4 | ^7.2.2 | 3 |
| `webpack-dev-server` | 5.2.5 | ^6.0.0 | 3 |
| `webpack-merge` | 5.10.0 | ^6.0.1 | 3 |
| `@enciv/mongo-collections` | ~~0.0.3~~ **0.0.5** | ^0.0.5 | **4 ✅** |
| `mongodb` | ~~5.9.2~~ **7.x** | ^7.5.0 | **4 ✅** |
| `mongodb-memory-server` | ~~10.1.2~~ **11.x** | ^11.2.0 | **4 ✅** |
| `@shelf/jest-mongodb` | ~~4.3.2~~ **6.x** | ^6.0.2 | **4 ✅** |
| `jest` | 29.7.0 | ^30.4.2 | 5 |
| `@jest/globals` | 29.7.0 | ^30.4.1 | 5 |
| `@testing-library/jest-dom` | 6.9.1 | ^7.0.0 | 5 |
| `expect` (standalone) | 23.6.0 | **remove** | 5 |
| `joi` | 17.13.3 | ^18.2.3 | 6 |
| `react` | 19.2.6 | 19.2.8 | 7 |
| `react-dom` | 19.2.6 | 19.2.8 | 7 |
| `recharts` | 3.8.1 | ^3.10.1 | 7 |
| `@jsonforms/core` | 3.7.0 | ^3.8.0 | 7 |
| `@jsonforms/react` | 3.7.0 | ^3.8.0 | 7 |
| `@jsonforms/vanilla-renderers` | 3.7.0 | ^3.8.0 | 7 |
| `concurrently` | 9.2.1 | ^10.0.4 | 7 |
| `@storybook/addon-a11y` | 10.4.6 | ^10.5.7 | 7 |
| `@storybook/addon-links` | 10.4.6 | ^10.5.7 | 7 |
| `@storybook/react-webpack5` | 10.4.6 | ^10.5.7 | 7 |
| `storybook` | 10.4.6 | ^10.5.7 | 7 |
| `color` | 3.2.1 | ^5.0.3 | 8a |
| `bson-objectid` | 1.3.1 | ^2.0.4 | 8b |
| `autosize` | 3.0.21 | ^6.0.1 | 8c |
| `markdown-to-jsx` | 7.7.6 | ^9.10.2 | 8d |
| `chromatic` | 11.7.0 | ^16.10.1 | 8e |

---

## Phase Order and Branching Strategy

Phases are ordered by dependency — each phase's install must succeed before the next phase is validated. Do not combine phases 2–6 into a single PR; each phase should be verified independently so regressions are bisectable.

```
update2026  (current state)
 └── phase/1-node24              ✅ DONE: .nvmrc, engines, start.js; ESM color transforms; ObjectId bsontype fix; window SSR guard
 └── phase/2-babel8              ✅ DONE: @babel/core ^8, babel-loader ^10, babel.config.js, removed regenerator plugin, allowScripts
 └── phase/3-webpack-toolchain   webpack-cli ^7, webpack-dev-server ^6, webpack-merge ^6
 └── phase/4-mongodb7            ✅ DONE: mongo-collections ^0.0.5, mongodb ^7, jest-mongodb ^6, useUnifiedTopology/useNewUrlParser removed, SWC+JSX transform
 └── phase/5-jest30              jest ^30, @jest/globals ^30, @testing-library/jest-dom ^7
 └── phase/6-joi18               joi ^18, verify joi-objectid
 └── phase/7-minor-updates       npm update on semver-compatible ranges
 └── phase/8-breaking-deps       color ^5, bson-objectid ^2, autosize ^6, markdown-to-jsx ^9
 └── phase/9-cleanup             Brevo* rename, peerDep refs, allowScripts
 └── phase/10-windows-linking    link-civil-server.js
```

**Execution notes:**

- Commit each phase individually; no PR needed until the phases are complete.
- For each phase: apply changes → `npm test` → `npm run dev` (verify `/join` loads in browser) → start `npm run storybook` in one shell and run `npm run test-storybook` in a second shell to verify all stories pass. Allow at least 41 seconds for `test-storybook` to complete.
- If a phase fails verification, make at most **2 fix attempts** before stopping and explaining the problem. Do not loop indefinitely.
- All fixes are scoped to **civil-pursuit-new only**. If a problem requires changes to civil-server or civil-client, stop and document the issue instead of patching those repos.
