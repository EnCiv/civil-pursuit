# civil-pursuit Migration Plan — update2026

**Date:** May 2026
**Tracking:** civil-server and civil-client `update2026` branches
**Reference:** [`../civil-server-update/doc/migration-plan.md`](../../civil-server-update/doc/migration-plan.md) — full details on every change made in those repos; this document covers only what civil-pursuit itself must change.

---

## Work Completed (React 19 / update2026 phase — 2025–2026)

The following items have been fully implemented and committed on the `update2026` branch.

### C1 — Storybook assertion pattern migration

All Storybook story files migrated from the React 19–incompatible DOM-based `onDoneResult(canvas)` assertion helper to the stable `args.onDone.mock.calls` pattern.

**Files changed (15):**
`answer-step`, `button`, `grouping-step`, `intermission`, `jsform`, `point-group`,
`point-input`, `rank-points`, `rank-step`, `ranking`, `rerank-step`, `review-point`,
`step-footer`, `why-input`, `why-step`

**Pattern used:**
```js
// Before (DOM-based, brittle under React 19)
const result = onDoneResult(canvas)
expect(result.valid).toBe(true)

// After (stable mock-call inspection)
expect(args.onDone.mock.calls[0][0]).toMatchObject({ valid: true, value: ... })
// For timing-uncertain cases:
await waitFor(() => {
  expect(args.onDone.mock.calls.at(-1)?.[0]).toMatchObject({ ... })
})
```

**Key edge case:** `rank-step › rankStepWithPartialDataAndUserUpdate` — when `round: 1` the component fires an initial `onDone({valid:false, value:0})` before ranks load, then a later call with the correct value.  `.at(-1)?.[0]` inside `waitFor` is used to assert the final call.

**Committed:** `ca1af030e` — "migrate story onDone assertions from DOM-based to args.onDone.mock.calls pattern"

**Status:** All 420 Storybook tests passing ✅

---

### C2 — Webpack react alias fix

`civil-server`'s webpack config aliased `react` → `civil-server/node_modules/react`, which is a directory that doesn't exist (React is hoisted to the project root). This caused a browser error: `Can't resolve 'react' in '@codastic/react-positioning-portal'`.

**Fix — `webpack-dev.config.js` and `webpack-prod.config.js`:**
```js
// Override broken alias from civil-server
module.exports.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react')
module.exports.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom')
```

---

### C3 — Footer SSR ThemeProvider fix

`app/components/app.jsx` — in the no-`iota` else-branch, `<Footer />` was rendered outside `<ThemeProvider>`, causing an SSR crash:
```
Cannot read properties of undefined (reading 'white')
```

**Fix:** Wrap the else-branch content in `<ThemeProvider theme={theme}>`.

---

### C4 — Replace `@codastic/react-positioning-portal` with custom `TooltipPortal`

`@codastic/react-positioning-portal` (v0.8.0) is unmaintained and has an open React 19 support issue. Its `main` field resolves incorrectly under the project's module resolution. Replaced with a bespoke `TooltipPortal` component.

**New file:** `app/components/tooltip-portal.jsx`

- Uses `React.createPortal` to mount tooltip into `document.body`
- Calculates anchor position via `getBoundingClientRect()` with `useLayoutEffect`
- Chooses above/below and left/right alignment based on available viewport space
- Renders tooltip with `role="tooltip"`, `position: fixed`, and JSS styling
- No wrapper element added around the anchor child (layout-transparent, matching the old library's behaviour)

**Updated files:**
- `app/components/button.jsx` — replaced `PositioningPortal` import and JSX with `TooltipPortal`
- `app/components/step.jsx` — same replacement

**New story file:** `stories/button-tooltip.stories.jsx`

Covers 14 corner-case stories:
- Tooltip appears on long-press (≥500 ms)
- Tooltip does NOT appear on short click (<500 ms)
- Tooltip renders in `document.body` portal (not inside canvas)
- Auto-dismiss wiring verified
- Short title auto-dismiss content check
- Mouse-leave before long-press cancels tooltip
- Long title stays within viewport width
- Positional: top-left, top-right, bottom-left, bottom-right, centre
- Disabled button — tooltip still works
- PrimaryButton variant
- SecondaryButton variant
- Empty `title` prop — no tooltip (or empty tooltip)

---

### C5 — `recharts` v2 → v3.8.1

recharts v2 used `ReactDOM.findDOMNode` which was removed in React 19, causing `ranking-results` to silently render nothing.

**Changes:**
- `package.json`: `"recharts": "^2.12.0"` → `"^3.8.1"`
- `app/components/ranking-results.jsx`: fixed `{...props}` spread on `<div>` and `<ResponsiveContainer>` to `{...otherProps}` so `resultList` is not forwarded to DOM elements. `ResponsiveContainer` now uses `height` prop driven by the parent (no hardcoded pixels).

---

### C6 — Storybook HMR loop fix

After multiple hot-reloads Storybook could enter an infinite `[HMR] Reloading page` loop because a stale Service Worker served a cached bundle with an old hash. A Control+Shift+R hard reload was insufficient; only a Storybook process restart cleared it.

**Fix:** `.storybook/manager-head.html` and `.storybook/preview-head.html` now each run a script on every page load that unregisters all Service Workers for the origin before the HMR client initialises:
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister())
    })
  }
</script>
```

---

### C7 — `tiny-invariant` ESM `process/browser` alias

`tiny-invariant`'s ESM build imports `process/browser` without the `.js` extension. webpack 5 fully-specified ESM resolution requires the extension and aborted the build with:
```
Module not found: Error: Can't resolve 'process/browser'
BREAKING CHANGE: The request 'process/browser' failed to resolve only because it was resolved as fully specified
```

**Fix — `webpack-dev.config.js` and `webpack-prod.config.js`:**
```js
module.exports.resolve.alias['process/browser'] = require.resolve('process/browser')
```

---

### C8 — `react-share` v4 → v5.3.0; remove `react-perfect-scrollbar`; `@jsonforms` 3.3 → 3.7.0

**`react-share` v4 → v5.3.0** — v5 dropped React 16 support and removed the `quote` prop from `FacebookShareButton` (Meta no longer supports it). The `title` prop on share buttons no longer sets the native button tooltip (use `htmlTitle` instead). React 19 peer-dep support added in v5.1.2.

Changes in `app/components/share-buttons.jsx`:
- `<FacebookShareButton quote={shareTitle} title="...">` → `<FacebookShareButton htmlTitle="...">`  (removed `quote`, renamed `title` → `htmlTitle`)
- `<EmailShareButton title="...">` → `<EmailShareButton htmlTitle="...">`

**`react-perfect-scrollbar` removed** — package was not imported anywhere in `app/`. Zero-risk removal.

**`@jsonforms/core`, `@jsonforms/react`, `@jsonforms/vanilla-renderers` 3.3 → 3.7.0** — API-compatible upgrade; React 19 compatible.

---

### C9 — Babel plugin renames; remove `log4js`; `brevoDefaultFromEmail`; migrate `jest-socket-api-setup`

**Babel plugin renames** — `@babel/plugin-proposal-*` packages are deprecated; renamed to `@babel/plugin-transform-*`:
- `package.json`: `plugin-proposal-class-properties` → `plugin-transform-class-properties`; `plugin-proposal-object-rest-spread` → `plugin-transform-object-rest-spread`
- `babel.config.json`: updated plugin reference to `@babel/plugin-transform-class-properties`

**Remove `log4js`** — `log4js` (ddfridley git fork) and `log4js-extend` removed from `package.json` `dependencies`. `global.logger` is now configured entirely by civil-server.

**`brevoDefaultFromEmail`** — `invite-users-back.js` now imports `brevoDefaultFromEmail` from `civil-server` instead of reading `process.env.SENDINBLUE_DEFAULT_FROM_EMAIL` directly. civil-server resolves `BREVO_DEFAULT_FROM_EMAIL` (preferred) or `SENDINBLUE_DEFAULT_FROM_EMAIL` (legacy fallback).

**`jest-socket-api-setup` migration** — `app/socket-apis/__tests__/subscribe-deliberation.js` updated to import from `civil-server/dist/server/util/jest-socket-api-setup` instead of the local `../../jest-socket-api-setup`. The local file is retained for reference but no longer used by any test.

---

## Remaining Work

The following items are planned but not yet implemented:

| # | Item | Notes |
|---|------|-------|
| R1 | ~~Remove `@codastic/react-positioning-portal` from `package.json`~~ | ✅ Done |
| R2 | ~~Commit webpack + app.jsx fixes (C2, C3)~~ | ✅ Done |
| R3 | ~~`react-share` → v5.3.0~~ | ✅ Done (C8) |
| R4 | ~~`recharts` → v3.x~~ | ✅ Done (C5) |
| R5 | ~~Remove `react-perfect-scrollbar`~~ | ✅ Done (C8) |
| R6 | ~~`@jsonforms/*` → 3.7.0~~ | ✅ Done (C8) |
| R7 | ~~Items 1–9 from original plan below~~ | ✅ Done (C9) — Node 20, log4js removed, Babel plugins renamed, brevoDefaultFromEmail, jest-socket-api-setup migrated |

---

## Background

The `update2026` branches of `civil-server` and `civil-client` completed a 12-phase dependency modernisation. civil-pursuit consumes both as peer dependencies and must be updated to stay compatible.

**Install errors observed:**
1. `npm install --save-dev github:EnCiv/civil-server#update2026 github:EnCiv/civil-client#update2026` failed because civil-server now requires **Node ≥ 20** and its `packbuild` step could not resolve `civil-client` from within npm's cache clone during prep.
2. `npm update civil-server civil-client` works but fails during civil-client's `packbuild` with `Module not found: Error: Can't resolve 'color'` — the `color` package is a missing dependency in civil-client's `update2026` branch that needs to be fixed there. This error occurs inside the npm cache clone build and does not affect runtime use of civil-client in civil-pursuit; the install still completes usably.

**Recommended install command:**
```bash
npm update civil-server civil-client --legacy-peer-deps
```

---

## Items Required in civil-pursuit

---

### 1 — Node.js 18 → 20 LTS  _(blocking — do first)_

civil-server's `engines` field now requires `>=20.0.0`. civil-pursuit must match.

**Changes:**
- `package.json` `engines.node`: `"18.13.0"` → `">=20.0.0"`
- `.nvmrc` (if present): update to `20` or the specific LTS patch.
- Any CI configuration (GitHub Actions matrix, Heroku/Render runtime config): set Node 20.
- Re-run the Node environment setup in the terminal:
  ```bash
  export NODE_VERSION=20
  export NVS_HOME="$HOME/AppData/Local/nvs/"
  $NVS_HOME/nvs add $NODE_VERSION
  source $NVS_HOME/nvs.sh use $NODE_VERSION
  ```

**Verify:** `node --version` shows v20.x; `npm test` still passes.

---

### 2 — peer dependency version pins

`package.json` `peerDependencies` already updated to:
```json
"civil-client": "github:EnCiv/civil-client#update2026",
"civil-server": "github:EnCiv/civil-server#update2026"
```

After upgrading Node, pull in the updated packages with:
```bash
npm update civil-server civil-client --legacy-peer-deps
```

> **Known issue:** civil-client's `packbuild` prep step emits `Module not found: Can't resolve 'color'`. This is a missing dependency in civil-client's `update2026` branch and needs to be fixed in that repo. The install still completes and civil-pursuit can use the package at runtime.

---

### 3 — React 16 → React 19  _(Phase 9 of civil-server migration)_

civil-server and civil-client both upgraded to React 19.2.6. civil-pursuit must do the same.

**Changes in `package.json`:**
```diff
- "react": "^16.14.0",
- "react-dom": "^16.14.0",
- "react-hot-loader": "^4.8.4",
+ "react": "^19",
+ "react-dom": "^19",
```
Remove `react-hot-loader` entirely — it does not support React 19 and civil-server already dropped it.

**Code changes:**
- Any component file that imports `hot` from `react-hot-loader` must be cleaned up (grep the `app/` tree for `react-hot-loader`).
- `ReactDOM.render()` is removed in React 19. If civil-pursuit has any direct render calls outside civil-client, replace with `ReactDOM.createRoot().render()`.

**JSS class-name hydration (Windows dev):**
civil-server's migration notes include a Windows-specific junction script (`npm run link-civil-client`) that ensures a single `react-jss` module instance is shared between civil-server and civil-client. If running the dev server locally on Windows, run:
```bash
cd ../civil-server-update   # or wherever civil-server is checked out
npm run link-civil-client
```

**Storybook stories:**
civil-pursuit already uses Storybook v8 (not v6 as civil-client was), so the Storybook v10 upgrade is **not** required here. However, check that any story imports use `import React, { useState } from 'react'` (default export), not `import { React, useState } from 'react'`.

**Verify:** `npm test`; run storybook and confirm no React version errors.

---

### 4 — Enzyme → @testing-library/react  _(Phase 9c of civil-server migration)_

Enzyme is dead for React 18+ and will not work with React 19.

**Remove from `package.json`:**
```diff
- "enzyme": "^3.11.0",
- "enzyme-adapter-react-16": "^1.15.7",
- "jest-enzyme": "^7.1.2",
```

**Add to `package.json` `optionalDependencies`:**
```diff
+ "@testing-library/react": "^16",
+ "@testing-library/jest-dom": "^6",
+ "@testing-library/dom": "^10",
```

**`jest-test-setup.js`** — replace the entire file:
```diff
- import { configure } from 'enzyme'
- import Adapter from 'enzyme-adapter-react-16'
- configure({ adapter: new Adapter() })
+ import '@testing-library/jest-dom'
```

**`jest.config.js`** — remove `jest-enzyme` from setup files and add `moduleNameMapper` for the socket-api test helper:
```diff
  setupFilesAfterEnv: [
    '<rootDir>/jest-test-setup.js',
-   '<rootDir>/node_modules/jest-enzyme/lib/index.js',
  ],
+ moduleNameMapper: {
+   '^ws$': '<rootDir>/node_modules/ws/index.js',
+ },
```

**Existing tests:** Any test that uses Enzyme (`shallow`, `mount`, `wrapper.find(...)`) must be rewritten to use `@testing-library/react` (`render`, `screen.getBy*`, `userEvent`). Review all files under `app/` that import from `enzyme`.

**Verify:** `npm test` — all test suites pass.

---

### 5 — `log4js` removal  _(Phase 11 of civil-server migration)_

The custom `log4js` git fork (`ddfridley/log4js-node#onbrowser`) has been removed from civil-server. civil-pursuit should also remove it from `dependencies`.

**`package.json`:**
```diff
- "log4js": "git+https://github.com/ddfridley/log4js-node.git#onbrowser",
- "log4js-extend": "^0.2.1",
```

**Runtime:** `global.logger` and `global.bslogger` are now configured by civil-server's `the-civil-server.js` using the new thin logger (`civil-server/app/server/util/logger.js`). The API (`logger.info(...)`, `logger.warn(...)`, `logger.error(...)`, etc.) is identical. No call-site changes required in civil-pursuit code unless civil-pursuit itself calls `log4js.configure(...)` directly (audit `app/start.js` and any custom event/route files).

---

### 6 — Brevo / SendinBlue function names  _(Phase 6 of civil-server migration)_

civil-server now exports `BrevoSendTransacEmail` and `BrevoGetTemplateId` as the preferred names. The old `Sib*` names are still exported as deprecated aliases, so no immediate breakage — but civil-pursuit should migrate proactively.

**Files to update:**
- `app/jobs/invite-users-back.js`
- `app/jobs/__tests__/invite-users-back.test.js`
- `app/jobs/__tests__/invite-users-back.integration.test.js`

**Changes:**
```diff
- import { SibGetTemplateId, SibSendTransacEmail, Iota, User } from 'civil-server'
+ import { BrevoGetTemplateId, BrevoSendTransacEmail, brevoDefaultFromEmail, Iota, User } from 'civil-server'
```

And in `invite-users-back.js`, replace the hard-coded env var read:
```diff
- email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
+ email: brevoDefaultFromEmail,
```

civil-server now accepts both `BREVO_API_KEY` / `BREVO_DEFAULT_FROM_EMAIL` (preferred) and the legacy `SENDINBLUE_*` env vars. `BREVO_*` takes precedence if both are set. Update `.env` / deployment config to use the new names when convenient.

---

### 7 — `jest-socket-api-setup` — use the shared civil-server helper  _(Phase 11 of civil-server migration)_

civil-server now ships a battle-tested socket-api test helper at `civil-server/app/server/util/jest-socket-api-setup.js`. The local copy in `app/jest-socket-api-setup.js` can be replaced.

**Why migrate:** The shared helper handles `EADDRINUSE` port collisions (ports auto-increment from 3100), correctly defines the `window.socket` getter for `jest.spyOn`, and is the canonical implementation going forward.

**Changes:**
1. Delete (or keep but deprecate) `app/jest-socket-api-setup.js`.
2. In any test file that imports it:
   ```diff
   - import jestSocketApiSetup, { jestSocketApiTeardown } from '../../jest-socket-api-setup'
   + import jestSocketApiSetup, { jestSocketApiTeardown } from 'civil-server/app/server/util/jest-socket-api-setup'
   ```
3. Add to `jest.config.js` `testEnvironment` for those suites: `@jest-environment jsdom`.
4. Add to `jest-test-setup.js`:
   ```js
   import { TextEncoder, TextDecoder } from 'util'
   if (!global.TextEncoder) global.TextEncoder = TextEncoder
   if (!global.TextDecoder) global.TextDecoder = TextDecoder
   ```

---

### 8 — Babel plugin renames  _(Phase 7 of civil-server migration)_

The `@babel/plugin-proposal-*` packages are deprecated.

**`package.json` `devDependencies`:**
```diff
- "@babel/plugin-proposal-class-properties": "^7.16.0",
- "@babel/plugin-proposal-object-rest-spread": "^7.16.0",
+ "@babel/plugin-transform-class-properties": "^7",
+ "@babel/plugin-transform-object-rest-spread": "^7",
```

**`.babelrc` / `babel.config.js`** — rename plugin references to match. If civil-pursuit uses `babel.config.json` (preferred for monorepo-style setups where transform applies outside the project root), rename `.babelrc` → `babel.config.json`.

**Verify:** `npm run transpile` succeeds; `npm run packbuild` (if applicable) succeeds.

---

### 9 — `body-parser` (informational)  _(Phase 10 of civil-server migration)_

`body-parser` was removed from civil-server's dependencies; Express 5's built-ins (`express.json()`, `express.urlencoded()`) are used instead. civil-pursuit's routes should not rely on `body-parser` being mounted by civil-server. Audit `app/routes/` for any direct `body-parser` imports and replace with Express 5 equivalents if found.

---

## Suggested Order of Work

| Step | Task | Risk |
|------|------|------|
| 1 | Upgrade Node to 20 | Low |
| 2 | Install peer deps from update2026 branches | Low |
| 3 | Remove `log4js`, `log4js-extend` | Low |
| 4 | Rename Babel plugins | Low |
| 5 | Remove `react-hot-loader`; upgrade React to 19 | High |
| 6 | Replace Enzyme with @testing-library/react | High |
| 7 | Migrate Sib* → Brevo* function names | Low |
| 8 | Migrate jest-socket-api-setup to civil-server helper | Medium |
| 9 | Audit body-parser usage | Low |

Run `npm test` after each step.

---

## Environment Variables — New Names

| Legacy (still works) | Preferred (update when convenient) |
|---|---|
| `SENDINBLUE_API_KEY` | `BREVO_API_KEY` |
| `SENDINBLUE_DEFAULT_FROM_EMAIL` | `BREVO_DEFAULT_FROM_EMAIL` |
