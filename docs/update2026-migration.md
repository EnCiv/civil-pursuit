# update2026 Migration Guide — Consuming Repos

**Date:** May 2026  
**Branch:** `update2026` on `civil-server`, `civil-client`, and consumer repos  
**Reference:** `civil-server-update/doc/migration-plan.md` — full detail on every internal civil-server change

This guide covers what a repo that consumes `civil-server` and `civil-client` as peer dependencies must do to migrate to the `update2026` branch of both.

---

## Prerequisites

- Node.js **20 LTS** (civil-server `engines` now requires `>=20.0.0`)
- npm 9+
- The `update2026` branch of both `civil-server` and `civil-client` checked out / published

---

## Step 1 — Upgrade Node to 20

Update `.nvmrc` and `package.json`:

```diff
# .nvmrc
-18
+20
```

```diff
// package.json
  "engines": {
-   "node": "18.13.0"
+   "node": ">=20.0.0"
  },
```

Update any CI config (GitHub Actions, Heroku, Render) to use Node 20.

---

## Step 2 — Install updated peer dependencies

```bash
npm update civil-server civil-client --legacy-peer-deps
```

> **Known issue:** During install, civil-client's `packbuild` step may emit `Module not found: Can't resolve 'color'`. This is a missing dependency in civil-client that needs to be fixed in that repo. The install still completes and the package is usable at runtime.

---

## Step 3 — Upgrade React to 19

```diff
// package.json
-  "react": "^16.14.0",
-  "react-dom": "^16.14.0",
-  "react-hot-loader": "^4.8.4",
+  "react": "^19",
+  "react-dom": "^19",
```

Remove `react-hot-loader` entirely — it is incompatible with React 19 and civil-server no longer uses it. Webpack 5's built-in HMR replaces it.

Grep for any remaining imports:

```bash
grep -r "react-hot-loader" app/
```

If found, remove the import and any `hot(module)(Component)` wrapper — just export the component directly.

---

## Step 4 — Replace `ReactDOM.render()` if used

`ReactDOM.render()` is removed in React 19. If your app has a custom client entry point that calls it directly, replace with `createRoot`:

```diff
-ReactDOM.render(<App />, document.getElementById('root'))
+import { createRoot } from 'react-dom/client'
+createRoot(document.getElementById('root')).render(<App />)
```

If you use `civil-client`'s `clientMain`, this is already handled — no change needed.

---

## Step 5 — Fix JSS hydration mismatch in client entry point

civil-server's SSR renderer (`server-react-render.js`) uses a counter-based JSS `generateId` to produce stable class names (e.g. `topNavBar-1`). The client must use the same function or React will log hydration warnings about mismatched `className` attributes.

If your repo has a custom `app/client/main-app.js` (or equivalent) that calls `clientMain(App)`, wrap `App` in a `JssProvider`:

```js
// app/client/main-app.js
import React from 'react'
import { clientMain } from 'civil-client'
import { JssProvider } from 'react-jss'
import App from '../components/app'

// Mirror createStableGenerateId from civil-server's server-react-render.js
let _jssCounter = 0
const generateId = (rule, sheet) => {
  const prefix = (sheet && sheet.options && sheet.options.classNamePrefix) || ''
  return `${prefix}${rule.key}-${_jssCounter++}`
}

function AppWithJss(props) {
  return (
    <JssProvider generateId={generateId}>
      <App {...props} />
    </JssProvider>
  )
}

clientMain(AppWithJss)
```

---

## Step 6 — Add `suppressHydrationWarning` to any SSR-vs-client dynamic text

If a component reads live data (from a context, socket, etc.) that differs from what the server rendered from the initial `iotas.json` snapshot, React 19 will throw a hard hydration error. Add `suppressHydrationWarning` to the element that contains the dynamic text.

**Example — a badge that shows a live participant count:**

```jsx
// The server renders the value from iotas.json; the client gets the live value
// from DeliberationContext before hydration completes.
<span suppressHydrationWarning>{liveCount} participants</span>
```

---

## Step 7 — Fix webpack aliases

civil-server's webpack config sets `resolve.alias['react']` to a path inside civil-server's `node_modules` that does not exist once React is hoisted to the project root. Override it in your own webpack config **after** merging civil-server's config:

```js
// webpack-dev.config.js (and webpack-prod.config.js)
const path = require('path')
// ... (merge civil-server config as before) ...
module.exports.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react')
module.exports.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom')
module.exports.resolve.alias['process/browser'] = require.resolve('process/browser')
```

The `process/browser` alias is needed because `tiny-invariant`'s ESM build imports it without a `.js` extension, which webpack 5 strict ESM resolution rejects.

---

## Step 8 — Replace `@codastic/react-positioning-portal` (if used)

`@codastic/react-positioning-portal` is unmaintained and its `main` field resolves incorrectly under React 19's module resolution. If your repo uses it, replace it with a `createPortal`-based tooltip (see `app/components/tooltip-portal.jsx` in civil-pursuit for a reference implementation).

```bash
npm uninstall @codastic/react-positioning-portal
```

---

## Step 9 — Remove `log4js`

civil-server no longer configures `log4js`. The global `logger` is now set up by civil-server's own `the-civil-server.js`. Remove it from your `package.json`:

```diff
-  "log4js": "git+https://github.com/ddfridley/log4js-node.git#onbrowser",
-  "log4js-extend": "^0.2.1",
```

The `logger.info(...)`, `logger.warn(...)`, `logger.error(...)` API is unchanged.

---

## Step 10 — Remove Enzyme; add @testing-library/react

Enzyme does not support React 18+ and will not work with React 19.

```bash
npm uninstall enzyme enzyme-adapter-react-16 jest-enzyme
```

```bash
npm install --save-optional @testing-library/react @testing-library/jest-dom @testing-library/dom
```

**`jest-test-setup.js`:**

```diff
-import { configure } from 'enzyme'
-import Adapter from 'enzyme-adapter-react-16'
-configure({ adapter: new Adapter() })
+import '@testing-library/jest-dom'
+import { TextEncoder, TextDecoder } from 'util'
+if (!global.TextEncoder) global.TextEncoder = TextEncoder
+if (!global.TextDecoder) global.TextDecoder = TextDecoder
```

**`jest.config.js`:**

```diff
  setupFilesAfterEnv: [
    '<rootDir>/jest-test-setup.js',
-   '<rootDir>/node_modules/jest-enzyme/lib/index.js',
  ],
```

Any test file that uses `shallow`, `mount`, or `wrapper.find(...)` must be rewritten to use `@testing-library/react`.

---

## Step 11 — Rename deprecated Babel plugins

```diff
// package.json devDependencies
-  "@babel/plugin-proposal-class-properties": "^7.16.0",
-  "@babel/plugin-proposal-object-rest-spread": "^7.16.0",
+  "@babel/plugin-transform-class-properties": "^7",
+  "@babel/plugin-transform-object-rest-spread": "^7",
```

```diff
// babel.config.json (or .babelrc)
-  "plugins": ["@babel/plugin-proposal-class-properties", ...]
+  "plugins": ["@babel/plugin-transform-class-properties", ...]
```

Do **not** have both `.babelrc` and `babel.config.json` present at the same time — Babel will merge them and you will get duplicate transforms. Use `babel.config.json` as the single source of truth (it applies project-wide, which is correct for a single-package repo).

---

## Step 12 — Migrate `brevoDefaultFromEmail` (if you send email)

civil-server now exports `brevoDefaultFromEmail` which resolves `BREVO_DEFAULT_FROM_EMAIL` (preferred) or `SENDINBLUE_DEFAULT_FROM_EMAIL` (legacy fallback). Replace any direct `process.env.SENDINBLUE_DEFAULT_FROM_EMAIL` reads in your job/route files:

```diff
-import { SibGetTemplateId, SibSendTransacEmail, Iota, User } from 'civil-server'
+import { SibGetTemplateId, SibSendTransacEmail, brevoDefaultFromEmail, Iota, User } from 'civil-server'

-  email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
+  email: brevoDefaultFromEmail,
```

The `Sib*` function names still work (deprecated aliases). Rename to `Brevo*` at your convenience:

```diff
-import { SibGetTemplateId, SibSendTransacEmail } from 'civil-server'
+import { BrevoGetTemplateId, BrevoSendTransacEmail } from 'civil-server'
```

Update your `.env` / deployment config when convenient:

| Legacy                          | Preferred                  |
| ------------------------------- | -------------------------- |
| `SENDINBLUE_API_KEY`            | `BREVO_API_KEY`            |
| `SENDINBLUE_DEFAULT_FROM_EMAIL` | `BREVO_DEFAULT_FROM_EMAIL` |

Both still work; `BREVO_*` takes precedence if both are set.

---

## Step 13 — Migrate `jest-socket-api-setup` (if used)

civil-server now ships a canonical socket-API test helper that handles port collisions and correct `window.socket` getter setup. If your repo has a local copy (`app/jest-socket-api-setup.js` or similar), replace the import in each test file:

```diff
-import jestSocketApiSetup, { jestSocketApiTeardown } from '../../jest-socket-api-setup'
+import jestSocketApiSetup, { jestSocketApiTeardown } from 'civil-server/dist/server/util/jest-socket-api-setup'
```

Delete the local file.

---

## Step 14 — Audit `body-parser` usage

civil-server's Express 5 upgrade removed `body-parser` from its middleware stack. If any of your route files import it directly:

```bash
grep -r "body-parser" app/routes/
```

Replace with Express 5 built-ins:

```diff
-import bodyParser from 'body-parser'
-app.use(bodyParser.json())
+app.use(express.json())
```

---

## Step 15 — Upgrade other React-19-incompatible packages

The following packages used internal React APIs that were removed in React 19. Upgrade them before running tests:

| Package                   | Issue                                 | Fix                                                                                                                                                                            |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `recharts` v2             | Used `ReactDOM.findDOMNode` (removed) | Upgrade to `^3.8.1`                                                                                                                                                            |
| `react-share` v4          | React 19 peer-dep not declared        | Upgrade to `^5.3.0`; remove `quote` prop from `FacebookShareButton`; rename `title` → `htmlTitle` on share buttons (the button tooltip attribute, not the share-content title) |
| `@jsonforms/*` v3.3       | React 19 peer-dep not declared        | Upgrade to `^3.7.0` (API-compatible)                                                                                                                                           |
| `react-perfect-scrollbar` | Unmaintained; unused                  | Remove if not imported anywhere                                                                                                                                                |

---

## Step 16 — Storybook story assertion pattern

If your repo has Storybook stories that use the `onDoneResult(canvas)` DOM-based assertion helper, this pattern is brittle under React 19's concurrent rendering and should be replaced:

```js
// Before (DOM-based, brittle)
const result = onDoneResult(canvas)
expect(result.valid).toBe(true)

// After (stable mock-call inspection)
await waitFor(() => {
  expect(args.onDone.mock.calls.at(-1)?.[0]).toMatchObject({ valid: true, value: ... })
})
```

Make sure story `args` declares `onDone: fn()` in the meta or story args so the mock is available.

---

## Step 17 — Fix Storybook HMR loop (if using Storybook)

After multiple hot-reloads, Storybook can enter an infinite reload loop due to a stale Service Worker. Add SW unregister scripts to both `.storybook/manager-head.html` and `.storybook/preview-head.html`:

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

## Step 18 — Align dependencies with civil-server and civil-client

After completing the above steps, review and update `package.json` to align with the versions used by civil-server and civil-client. Use this priority order:

**High-impact upgrades (test carefully after)**

```bash
npm install --save-optional \
  storybook@^10.0.0 \
  @storybook/addon-links@^10.0.0 \
  @storybook/react-webpack5@^10.0.0 \
  webpack-dev-server@^5.2.2 \
  concurrently@^9.2.1 \
  nodemon@^3.1.9
```

**Minor version refinements**

```bash
npm install --save-dev \
  @babel/core@^7.16.5 \
  @babel/plugin-transform-regenerator@^7.16.5 \
  @babel/plugin-transform-runtime@^7.16.5 \
  @babel/preset-env@^7.16.5 \
  @babel/preset-react@^7.16.5
```

```bash
npm install --save-optional \
  @testing-library/dom@^10.4.1 \
  @testing-library/jest-dom@^6.6.3 \
  @testing-library/react@^16.3.0
```

**Optional: tighter parity (review for compatibility first)**

```bash
npm install \
  classnames@^2.3.1 \
  lodash@^4.17.21 \
  color@^4.2.3
```

| Package                     | Current → Target                                    | Reason                                   |
| --------------------------- | --------------------------------------------------- | ---------------------------------------- |
| `storybook`, `@storybook/*` | `^8.6.14` → `^10.0.0`                               | civil-client uses v10; major upgrade     |
| `webpack-dev-server`        | `^4.15.1` → `^5.2.2`                                | civil-server uses v5; major upgrade      |
| `concurrently`              | `3.6.1` → `^9.2.1`                                  | civil-server uses v9; large upgrade      |
| `nodemon`                   | `^2.0.15` → `^3.1.9`                                | civil-server uses v3                     |
| `@babel/*` (several)        | `^7.16.x` → `^7.16.5`                               | civil-client uses `.5` patch             |
| `@testing-library/*`        | `^10`, `^6`, `^16` → `^10.4.1`, `^6.6.3`, `^16.3.0` | civil-server uses more specific versions |
| `classnames`                | `^2.2.6` → `^2.3.1`                                 | Both upstream repos use 2.3.1            |
| `lodash`                    | `^4.17.11` → `^4.17.21`                             | civil-server uses 4.17.21                |
| `color`                     | `^3.2.1` → `^4.2.3`                                 | civil-client uses v4                     |

After each batch, run:

```bash
npm test
npm run dev  # if applicable
```

to verify nothing breaks.

---

## Step 19 — Migrate Storybook from v8 to v10

Storybook 10 restructured addons so that what were previously separate npm packages are now built into the framework. The upgrade has several breaking changes.

### 19a — `main.js` must be CommonJS

Storybook 10 evaluates `.storybook/main.js` using Node.js native module loading. If your `main.js` uses ESM syntax (`import`/`export default`), Node tries to reparse it and then fails to resolve relative paths correctly (Windows: `\webpack-dev.config` instead of `../webpack-dev.config`). Convert to CommonJS:

```diff
-import { merge } from 'webpack-merge'
-import path from 'path'
-import webpackDevConfig from '../webpack-dev.config'
-export default config
+const { merge } = require('webpack-merge')
+const path = require('path')
+const webpackDevConfig = require('../webpack-dev.config')
+module.exports = config
```

### 19b — Remove merged addons from `package.json` and `addons` list

Storybook 10 built the "essentials" addons directly into `@storybook/react-webpack5`. Remove these packages entirely:

```bash
npm uninstall @storybook/addon-essentials @storybook/addon-actions \
  @storybook/addon-interactions @storybook/addon-viewport @storybook/blocks \
  @storybook/cli @storybook/react
```

Add to your `package.json` `optionalDependencies`:

```json
"storybook": "^10.0.0",
"@storybook/addon-a11y": "^10.0.0",
"@storybook/addon-links": "^10.0.0",
"@storybook/addon-webpack5-compiler-babel": "^4.0.1",
"@storybook/react-webpack5": "^10.0.0",
"@storybook/test": "^8.6.15",
"@storybook/test-runner": "^0.24.4"
```

Note: `@storybook/test` stayed on v8 versioning (it's a standalone testing-library wrapper, not part of the core versioning).

In `.storybook/main.js`, update the `addons` array to only the packages that remain separate:

```js
addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-webpack5-compiler-babel'],
```

### 19c — Viewport import path changed

`INITIAL_VIEWPORTS` moved from `@storybook/addon-viewport` into the core `storybook` package:

```diff
-import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
+import { INITIAL_VIEWPORTS } from 'storybook/viewport'
```

If `preview.js` already sets `viewports: INITIAL_VIEWPORTS` globally, remove the import and the `parameters.viewport.viewports` block from each story's default export entirely — it's redundant.

### 19d — Fix `process.env` DefinePlugin corruption

Storybook's webpack `DefinePlugin` replaces `process.env` with a literal object everywhere — including on the LEFT-HAND SIDE of assignments like `if (!process.env) process.env = {}`. This produces `({"NODE_ENV":...}) = {}` which is a `SyntaxError` that prevents civil-client's bundle from loading. Fix in `webpackFinal`:

```js
// .storybook/main.js — inside webpackFinal
for (const plugin of newConfig.plugins) {
  if (plugin.definitions && plugin.definitions['process.env']) {
    delete plugin.definitions['process.env']
  }
}
```

### 19e — Strip `mode` and `devtool` from merged civil-server config

When merging civil-server's webpack config into Storybook's `webpackFinal`, strip `mode` and `devtool` so Storybook manages them itself:

```js
const { entry, output, mode, devtool, ...rest } = webpackDevConfig
const storyDevConfig = { ...rest }
```

### 19f — Fix `@storybook/test-runner` v0.24 transform

The test-runner's `playwright/transform.js` uses ESM syntax and only exports `processAsync`. The test-runner's own bundled `@jest/transform` calls `assertSyncTransformer` which requires a synchronous `process` export. Create a CJS wrapper at `.storybook/test-runner-transform.js`:

```js
// .storybook/test-runner-transform.js
const { transformPlaywright } = require('@storybook/test-runner')
const swc = require('@swc/core')

module.exports = {
  process(src, filename) {
    // synchronous path via spawnSync (Jest requires sync process())
    const { spawnSync } = require('child_process')
    const WORKER = `
      var chunks = []
      process.stdin.on('data', c => chunks.push(c))
      process.stdin.on('end', () => {
        var p = JSON.parse(Buffer.concat(chunks).toString())
        require(${JSON.stringify(require.resolve('@storybook/test-runner/dist/index.js'))})
          .transformPlaywright(p.src, p.filename)
          .then(code => process.stdout.write(JSON.stringify({ code: code || p.src })))
          .catch(() => process.stdout.write(JSON.stringify({ code: p.src })))
      })`
    const r = spawnSync(process.execPath, ['-e', WORKER], {
      input: JSON.stringify({ src, filename }),
      encoding: 'utf8',
      timeout: 30000,
      cwd: process.cwd(),
    })
    try {
      return JSON.parse(r.stdout)
    } catch {
      return { code: src }
    }
  },
  async processAsync(src, filename) {
    const code = await transformPlaywright(src, filename)
    return { code: code || src }
  },
}
```

Create `test-runner-jest.config.js` at the project root:

```js
const { getJestConfig } = require('@storybook/test-runner')
const path = require('path')
const testRunnerConfig = getJestConfig()
module.exports = {
  ...testRunnerConfig,
  transform: {
    ...testRunnerConfig.transform,
    '^.+\\.(story|stories)\\.[jt]sx?$': path.resolve(__dirname, '.storybook/test-runner-transform.js'),
  },
}
```

---

## Step 20 — Fix `Button` click event propagation

The `Button` component fires its primary action via `onMouseDown`/`onMouseUp` (not `onClick`). The native `click` event that follows is "orphaned" — it serves no purpose but bubbles to any parent `onClick` handler, causing unintended double-actions when buttons are nested inside clickable containers (e.g., `<Point onClick={handler}>`).

In `Button`'s `handleClick`, always stop propagation regardless of disabled state:

```diff
 const handleClick = e => {
-  if (isDisabled) {
-    e.preventDefault()
-    e.stopPropagation()
-  }
+  // Always stop: Button fires via onMouseDown/onMouseUp so the native click
+  // is orphaned and must not reach parent onClick handlers.
+  e.stopPropagation()
+  if (isDisabled) e.preventDefault()
 }
```

---

## Step 21 — Replace `react-accessible-headings` with fork

The upstream `react-accessible-headings` package fires a `setTimeout(querySelectorAll(...))` DOM scan on every `<H>` render and every `useLevel()` call. In component-level Storybook testing, each story renders a partial document tree, so the scan produces spurious WCAG console errors that obscure real test failures.

Use the EnCiv fork which removes the automatic scan while keeping `checkHeadingLevels()` available for explicit use:

```diff
-"react-accessible-headings": "^4.2.0",
+"react-accessible-headings": "github:EnCiv/react-accessible-headings",
```

---

## Step 22 — Storybook story patterns for React 19

React 19's concurrent rendering and async event handling require updated patterns in Storybook play functions.

### `userEvent.click` skips `aria-disabled` buttons

`userEvent` v14 treats `aria-disabled="true"` as disabled and skips `mousedown`/`mouseup` entirely. If your component depends on mousedown/mouseup events on a button that starts disabled, use `fireEvent` instead:

```js
import { fireEvent } from '@storybook/test'

// Instead of: await userEvent.click(button)
fireEvent.mouseDown(button)
fireEvent.focusOut(input) // see note below
fireEvent.mouseUp(button)
```

### React 19 `onBlur` uses `focusout`, not `blur`

React 19's event delegation for `onBlur` listens for the bubbling `focusout` event. `fireEvent.blur(element)` dispatches a non-bubbling `blur` event that never reaches React's root listener and does not trigger `onBlur`. Use `fireEvent.focusOut(element)` instead:

```diff
-fireEvent.blur(input)
+fireEvent.focusOut(input)
```

### Use `waitFor` for animation timing instead of `asyncSleep`

`asyncSleep(N)` races with the component's own animation timers. If both timers are scheduled for the same duration, the test may click a button that is still in a CSS transition / disabled-hidden state. Wait for a specific DOM condition instead:

```diff
-await asyncSleep(500)
-const Point3 = await waitFor(() => canvas.getByText('Point 3'))
+// Wait for the button that wraps Point 3 — only exists when idxRight is committed
+const Point3 = await waitFor(() => canvas.getByTitle('Choose as more important: Point 3'))
```

### Remove redundant `viewports: INITIAL_VIEWPORTS` from story files

`preview.js` sets `INITIAL_VIEWPORTS` globally. Remove it from every story's default export `parameters` block and remove the corresponding import — it is redundant noise:

```diff
-import { INITIAL_VIEWPORTS } from 'storybook/viewport'
 // ...
 export default {
   component: MyComponent,
-  parameters: {
-    viewport: {
-      viewports: INITIAL_VIEWPORTS,
-    },
-  },
 }
```

Individual story `parameters.viewport.defaultViewport` overrides are still needed and should be kept.

---

## Step 23 — VS Code format-on-save configuration

If you use Prettier format-on-save in VS Code, set `"editor.formatOnSaveMode": "modificationsIfAvailable"` in `.vscode/settings.json`. Without this, saving a file after an agent edit reformats the entire file, creating large diffs of whitespace-only changes that pollute git history:

```diff
 "editor.formatOnSave": true,
+"editor.formatOnSaveMode": "modificationsIfAvailable",
```

With this setting, only the lines actually modified in the current save are formatted.

---

**High-impact upgrades (test carefully after)**

```bash
npm install --save-optional \
  storybook@^10.0.0 \
  @storybook/addon-links@^10.0.0 \
  @storybook/react-webpack5@^10.0.0 \
  webpack-dev-server@^5.2.2 \
  concurrently@^9.2.1 \
  nodemon@^3.1.9
```

**Minor version refinements**

```bash
npm install --save-dev \
  @babel/core@^7.16.5 \
  @babel/plugin-transform-regenerator@^7.16.5 \
  @babel/plugin-transform-runtime@^7.16.5 \
  @babel/preset-env@^7.16.5 \
  @babel/preset-react@^7.16.5
```

```bash
npm install --save-optional \
  @testing-library/dom@^10.4.1 \
  @testing-library/jest-dom@^6.6.3 \
  @testing-library/react@^16.3.0
```

**Optional: tighter parity (review for compatibility first)**

```bash
npm install \
  classnames@^2.3.1 \
  lodash@^4.17.21 \
  color@^4.2.3
```

| Package                     | Current → Target                                    | Reason                                   |
| --------------------------- | --------------------------------------------------- | ---------------------------------------- |
| `storybook`, `@storybook/*` | `^8.6.14` → `^10.0.0`                               | civil-client uses v10; major upgrade     |
| `webpack-dev-server`        | `^4.15.1` → `^5.2.2`                                | civil-server uses v5; major upgrade      |
| `concurrently`              | `3.6.1` → `^9.2.1`                                  | civil-server uses v9; large upgrade      |
| `nodemon`                   | `^2.0.15` → `^3.1.9`                                | civil-server uses v3                     |
| `@babel/*` (several)        | `^7.16.x` → `^7.16.5`                               | civil-client uses `.5` patch             |
| `@testing-library/*`        | `^10`, `^6`, `^16` → `^10.4.1`, `^6.6.3`, `^16.3.0` | civil-server uses more specific versions |
| `classnames`                | `^2.2.6` → `^2.3.1`                                 | Both upstream repos use 2.3.1            |
| `lodash`                    | `^4.17.11` → `^4.17.21`                             | civil-server uses 4.17.21                |
| `color`                     | `^3.2.1` → `^4.2.3`                                 | civil-client uses v4                     |

After each batch, run:

```bash
npm test
npm run dev  # if applicable
```

to verify nothing breaks.

---

## Verification Checklist

After completing all steps:

- [ ] `node --version` → v20.x
- [ ] `npm test` — all suites pass
- [ ] `npm run dev` — server starts, browser loads without console errors
- [ ] No `Hydration failed` errors in the browser console
- [ ] No `Can't resolve 'react'` webpack errors
- [ ] No `Module not found: process/browser` webpack errors
- [ ] Storybook runs without HMR loop
- [ ] Email sending works with `BREVO_API_KEY` or legacy `SENDINBLUE_API_KEY`

---

## Windows Dev Setup Note

On Windows, if you see "invalid hook call" errors or JSS class name mismatches in the dev server, run the junction script from civil-server to ensure a single `react-jss` instance is shared:

```bash
cd ../civil-server-update
npm run link-civil-client
```

This creates Windows junction points (not symlinks) so civil-client shares civil-server's `react`, `react-dom`, and `react-jss` from `node_modules`.
