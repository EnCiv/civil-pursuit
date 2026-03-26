# LinkedIn OAuth Authentication — Specification

## Overview

Add LinkedIn OAuth as a login/sign-up mechanism in two places:

1. **`app/components/intermission.jsx`** — for unauthenticated (temporary) users who have completed a round and need to authenticate before continuing.
2. **`app/components/sign-up.jsx`** — as an alternative to email/password sign-up and login.

When a user authenticates via LinkedIn, the server retrieves their **email address**, **first name**, and **last name** from the LinkedIn API and stores them in the `users` collection (managed by `civil-server`). A `linkedinId` field is also stored to allow future re-association of the same LinkedIn account.

---

## LinkedIn Developer Setup

### 1. Create a LinkedIn App

1. Go to [https://www.linkedin.com/developers/apps](https://www.linkedin.com/developers/apps) and click **Create app**.
2. Fill in:
   - **App name**: e.g. `CivilPursuit (Dev)` or `CivilPursuit (Prod)`
   - **LinkedIn Page**: associate with your organization's LinkedIn page (required; create one if needed)
   - **App logo**: upload a square logo (required)
3. Click **Create app**.

### 2. Configure OAuth Products

1. On the app's **Products** tab, request access to **Sign In with LinkedIn using OpenID Connect**. This grants the `openid`, `profile`, and `email` OIDC scopes, which expose `sub` (LinkedIn user ID), `given_name`, `family_name`, and `email`.
2. After approval (usually instant for OpenID Connect), the scopes `openid`, `profile`, and `email` will appear on the **Auth** tab.

### 3. Configure Redirect URLs

1. On the **Auth** tab, under **OAuth 2.0 settings**, add Authorized Redirect URLs:
   - Development: `http://localhost:3011/linkedinOauthCallback`
   - Staging: `https://civilpursuit.herokuapp.com/linkedinOauthCallback`
   - Production: `https://enciv.org/linkedinOauthCallback`
2. Note the **Client ID** and **Client Secret** values.

### 4. Environment Variables

This project stores environment variables in `~/.bashrc` (not in a `.env` file). Add the following:

```bash
export LINKEDIN_CLIENT_ID=<your-client-id>
export LINKEDIN_CLIENT_SECRET=<your-client-secret>
# HOSTNAME is already required by civil-server; set to match your redirect URL host
export HOSTNAME=localhost:3011          # development
# export HOSTNAME=civilpursuit.herokuapp.com  # staging/production
```

After editing `~/.bashrc`, reload it: `source ~/.bashrc`

---

## Architecture

The implementation uses a **server-side redirect flow** — no popup windows and no socket API round-trips for the OAuth handshake. This ensures compatibility on all browsers and devices including mobile.

```
Browser                    Server (HTTP)                    LinkedIn
  |                             |                                |
  |--GET /linkedinAuth?-------->|                                |
  |     return=/tournament/abc  |                                |
  |                             |--generate csrfToken            |
  |                             |--store {csrfToken,returnPath}  |
  |                             |  in req.session                |
  |                             |--build LinkedIn authUrl        |
  |                             |  (state = csrfToken)           |
  |<--302 → LinkedIn authUrl----|                                |
  |                             |                                |
  |--navigate to LinkedIn authUrl-------------------------------->|
  |                             |                         user consents
  |                             |                                |
  |<--302 /linkedinOauthCallback?code=...&state=csrfToken--------|
  |                             |                                |
  |--GET /linkedinOauthCallback-|                                |
  |                             |--verify state == session CSRF  |
  |                             |--POST token exchange---------->|
  |                             |<--access_token-----------------|
  |                             |--GET /v2/userinfo------------>|
  |                             |<--{sub, email, name}-----------|
  |                             |--upsert user in DB             |
  |                             |--req.user = user               |
  |                             |--this.setUserCookie            |
  |                             |  (sets synuser cookie)         |
  |<--302 returnPath?n=1--------|                                |
  |                             |                                |
  |--navigate to returnPath?n=1-|                                |
  (Tournament detects n=1, jumps to intermission tab)
  (intermission sees user is authenticated + localStorage has round data)
  (calls batch-upsert to save round data under the new user account)
```

Key design points:

- **`req.user = user` + `this.setUserCookie`**: Follows exactly the pattern in `civil-server`'s own sign-in and sign-up routes. `setUserCookie` reads `req.user` and writes the `synuser` cookie. Route registers as `this.app.get('/linkedinOauthCallback', linkedinOauthCallback, this.setUserCookie, redirectAfterLinkedinAuth)`.
- **CSRF protection via `state`**: A random token is stored in `req.session.linkedinCsrf` and sent as the OAuth `state` parameter. The callback verifies the token before processing to prevent CSRF attacks.
- **`?n=1` return parameter**: After a successful OAuth callback, the server redirects back to `returnPath?n=1`. The Tournament component detects `n=1` and jumps to the intermission tab. Intermission detects the authenticated user, reads round data from localStorage, and calls `batch-upsert-deliberation-data` automatically.
- **`returnPath` validation**: The `return` query parameter is validated to be a relative path (must start with `/`) to prevent open redirect attacks.

---

## Files to Create

### `app/routes/linkedin-auth.js`

Initiates the OAuth flow. Generates a CSRF token, stores it in the session along with the return path, then redirects the browser to the LinkedIn authorization URL.

```javascript
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { randomUUID } from 'crypto'
import scheme from 'civil-server/dist/lib/scheme'

const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2/authorization'
const SCOPES = ['openid', 'profile', 'email']

export const linkedinRedirectRoute = '/linkedinOauthCallback'
export const getLinkedinRedirectUrl = () => scheme() + process.env.HOSTNAME + linkedinRedirectRoute

export async function startLinkedinAuth(req, res) {
  // Validate that the return path is relative (prevent open redirect)
  const returnPath = req.query.return || '/'
  if (!returnPath.startsWith('/')) {
    return res.status(400).send('Invalid return path')
  }
  const csrfToken = randomUUID()
  req.session.linkedinCsrf = csrfToken
  req.session.linkedinReturn = returnPath
  await new Promise((resolve, reject) => req.session.save(err => (err ? reject(err) : resolve())))

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: getLinkedinRedirectUrl(),
    scope: SCOPES.join(' '),
    state: csrfToken,
  })
  res.redirect(`${LINKEDIN_AUTH_BASE}?${params}`)
}

export default function route() {
  this.app.get('/linkedinAuth', startLinkedinAuth)
}

;['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'].forEach(name => {
  if (!process.env[name]) {
    logger.error('env', name, 'not set. LinkedIn OAuth authentication will not work.')
  }
})
```

---

### `app/routes/linkedin-oauth-callback.js`

Handles the OAuth redirect from LinkedIn. Verifies the CSRF state, exchanges the authorization code for tokens, fetches the user's OpenID Connect profile, upserts the user record, sets `req.user`, then chains to `this.setUserCookie` (which writes the `synuser` cookie) and redirects back to the return path with `?n=1`.

```javascript
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { User } from 'civil-server'
import { getLinkedinRedirectUrl } from './linkedin-auth'

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo' // OpenID Connect userinfo endpoint

export async function linkedinOauthCallback(req, res, next) {
  if (!req.query.code || !req.query.state) return next()

  // CSRF check
  if (!req.session.linkedinCsrf || req.query.state !== req.session.linkedinCsrf) {
    logger.error('linkedinOauthCallback: CSRF state mismatch')
    return res.status(403).send('Invalid state parameter. Please try again.')
  }

  const returnPath = req.session.linkedinReturn || '/'
  // Clean up CSRF data from session
  delete req.session.linkedinCsrf
  delete req.session.linkedinReturn
  req.session.save(() => {}) // fire-and-forget session cleanup

  // 1. Exchange authorization code for access token
  const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: getLinkedinRedirectUrl(),
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  })
  if (!tokenResponse.ok) {
    logger.error('linkedinOauthCallback: token exchange failed', tokenResponse.status)
    return res.status(500).send('Authentication failed. Please go back and try again.')
  }
  const { access_token } = await tokenResponse.json()

  // 2. Fetch user profile via OpenID Connect userinfo endpoint
  const profileResponse = await fetch(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!profileResponse.ok) {
    logger.error('linkedinOauthCallback: profile fetch failed', profileResponse.status)
    return res.status(500).send('Authentication failed. Please go back and try again.')
  }
  const profile = await profileResponse.json()
  // profile: { sub, given_name, family_name, email, email_verified, ... }

  // 3. Upsert user in the database
  const linkedinId = profile.sub
  const email = (profile.email || '').toLowerCase().trim()
  const firstName = profile.given_name || ''
  const lastName = profile.family_name || ''

  if (!email) {
    logger.error('linkedinOauthCallback: LinkedIn did not return an email address', { linkedinId })
    return res.status(500).send('Authentication failed: no email address returned. Please go back and try again.')
  }

  let user
  try {
    user = await User.findOne({ email })
    if (user) {
      // Update existing user with LinkedIn ID and name if missing
      const updates = {}
      if (!user.linkedinId) updates.linkedinId = linkedinId
      if (!user.firstName) updates.firstName = firstName
      if (!user.lastName) updates.lastName = lastName
      if (Object.keys(updates).length) {
        await User.updateOne({ _id: user._id }, { $set: updates })
        Object.assign(user, updates)
      }
    } else {
      // Create new user
      const newUser = { email, firstName, lastName, linkedinId }
      const result = await User.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    }
  } catch (err) {
    logger.error('linkedinOauthCallback: database error', err)
    return res.status(500).send('Authentication failed. Please go back and try again.')
  }

  // 4. Set req.user so civil-server's setUserCookie middleware writes the synuser cookie
  //    (same pattern as civil-server sign-in.js: set req.user, call next(),
  //     setUserCookie reads req.user and sets the cookie, then redirectAfterLinkedinAuth redirects)
  req.user = user
  req.linkedinReturnPath = returnPath
  next()
}

export function redirectAfterLinkedinAuth(req, res) {
  const returnPath = req.linkedinReturnPath || '/'
  const separator = returnPath.includes('?') ? '&' : '?'
  res.redirect(`${returnPath}${separator}n=1`)
}

export default function route() {
  this.app.get('/linkedinOauthCallback', linkedinOauthCallback, this.setUserCookie, redirectAfterLinkedinAuth)
}
```

---

### No Socket APIs Needed

Because the OAuth flow is fully handled over HTTP (redirect-based), no socket APIs are required for the LinkedIn authentication handshake itself. The `app/socket-apis/` directory is unchanged.

---

### `app/components/linkedin-sign-in-button.js`

A reusable button component that starts the LinkedIn OAuth redirect flow. On click it navigates the browser to `/linkedinAuth?return=<encodedReturnPath>`. The server handles the entire OAuth exchange and redirects back to `returnPath?n=1`. Used in both `intermission.jsx` and `sign-up.jsx`.

**Props:**

- `returnPath` — the path to redirect back to after auth (defaults to `window.location.pathname + window.location.search`)
- `children` — button label (default: `"Sign in with LinkedIn"`)
- `className` — merged with component class
- `disabled` — disables the button

**Behavior:**

1. On click, navigates to `/linkedinAuth?return=<encodedReturnPath>`.
2. The server (`linkedin-auth.js`) generates a CSRF token, stores the return path in the session, and redirects the browser to LinkedIn.
3. After the user consents, LinkedIn redirects to the server (`linkedin-oauth-callback.js`), which upserts the user, sets the `synuser` cookie, and redirects back to `returnPath?n=1`.
4. The receiving page (Tournament) detects `?n=1` and jumps to the intermission tab.
5. Intermission detects the authenticated user + localStorage data and calls `batch-upsert-deliberation-data`.

```javascript
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { PrimaryButton } from './button'
import LinkedInIcon from '../svgr/linkedin-icon' // see notes below

export default function LinkedInSignInButton({ returnPath, children = 'Sign in with LinkedIn', className, disabled = false }) {
  const classes = useStyles()

  const handleClick = () => {
    const path = returnPath || window.location.pathname + window.location.search
    window.location.href = '/linkedinAuth?return=' + encodeURIComponent(path)
  }

  return (
    <PrimaryButton className={cx(classes.linkedInButton, className)} onDone={handleClick} disabled={disabled}>
      <LinkedInIcon className={classes.icon} />
      {children}
    </PrimaryButton>
  )
}

const useStyles = createUseStyles(theme => ({
  linkedInButton: {
    backgroundColor: '#0A66C2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': { backgroundColor: '#004182' },
  },
  icon: {
    width: '1.25rem',
    height: '1.25rem',
  },
}))
```

**Note on LinkedIn SVG icon:** LinkedIn's brand guidelines allow use of the official "In" logo. Download `LinkedIn_icon.svg` from [https://brand.linkedin.com/downloads](https://brand.linkedin.com/downloads) and save as `app/svgr/linkedin-icon.js` by running it through SVGR (`npx @svgr/cli --out-dir app/svgr -- LinkedIn_icon.svg`), or create a simple inline SVG component.

---

### Changes to `app/components/intermission.jsx`

Add a "Sign in with LinkedIn" option inside the block rendered for **temporary (unauthenticated) users** who have completed a round. This is shown alongside the existing email field.

**Handle the `?n=1` return parameter:** On mount, if `?n=1` is in the URL and the user is now authenticated, automatically call `handleBatchUpsert` with the authenticated user's email — no manual input needed.

**Location in the component:** In the JSX block that currently renders the "enter your email to save your work" form, add a divider and the `LinkedInSignInButton`.

**Illustrative changes:**

```jsx
// Add import
import LinkedInSignInButton from './linkedin-sign-in-button'

// Near the top of the component, detect the post-LinkedIn-auth return:
useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('n') === '1' && user?.email && !uInfo?.[round]?.finished) {
        // User just returned from LinkedIn auth; run batch-upsert automatically
        handleBatchUpsert(user.email)
        // Remove n=1 from the URL without a page reload
        const cleanUrl = window.location.pathname + window.location.search.replace(/[?&]n=1/, '')
        window.history.replaceState({}, '', cleanUrl)
    }
}, [user?.email])

// Inside the temporary-user JSX block, after the email form:
<div className={classes.divider}><span>or</span></div>
<LinkedInSignInButton
    returnPath={window.location.pathname + window.location.search}
/>
```

---

### Changes to `app/components/sign-up.jsx`

Add a "Sign in with LinkedIn" button as an alternative authentication path, displayed in both the "Sign Up" and "Log In" tabs above the existing form with a divider.

**After LinkedIn redirect returns (`?n=1`):** The user is already authenticated (the `synuser` cookie is set). The `useAuth` hook or `user` prop will reflect the logged-in user, and the existing `useEffect` that calls `onDone` when `user?.id` is truthy will fire automatically — no additional handling needed.

**Illustrative changes:**

```jsx
// Add import
import LinkedInSignInButton from './linkedin-sign-in-button'

// In the return JSX, after the tabs and above the <form>:
<div className={classes.oauthSection}>
    <LinkedInSignInButton
        returnPath={props.destination || window.location.pathname}
    />
</div>
<div className={classes.divider}><span>or continue with email</span></div>
```

---

### Changes to Tournament (or top-level page component)

Detect `?n=1` in the URL on mount and jump to the intermission tab:

```jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('n') === '1') {
    setActiveStep('intermission') // or equivalent tab navigation
  }
}, [])
```

---

### Database: `linkedinId` field on the User document

The `users` collection is managed by `civil-server`. The `linkedinId` field does not need a dedicated model migration — it is written with `User.updateOne` / `User.insertOne` in the route. However, adding a sparse index on `linkedinId` is recommended for future lookups:

```javascript
// In a startup script or model enhancement (optional):
User.collection.createIndex({ linkedinId: 1 }, { unique: true, sparse: true })
```

If `civil-server`'s `User` model exposes a schema validation step that rejects unknown fields, coordinate with that package's maintainers to add `linkedinId`, `firstName`, and `lastName` as accepted fields.

---

## Storybook Stories

Note on `buildApiDecorator`: The function signature is `buildApiDecorator(handle, result)` where `handle` is a string (the socket emit event name) and `result` is either a value or a function. When `result` is a function, it is called with all arguments from `socket.emit` (with the callback appended as the last argument). Always check the actual signature of helpers in `stories/common.js` before using them, and check what the function returns.

Because the LinkedIn OAuth flow is now redirect-based (no socket APIs), stories cannot simulate the full OAuth round-trip. Instead, stories test:

1. The button's appearance and prop variants.
2. The post-redirect state — rendering the component as if `?n=1` is already in the URL and the user is authenticated — to verify that intermission's auto-batch-upsert logic fires correctly.

### `stories/linkedin-sign-in-button.stories.jsx`

```jsx
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import React from 'react'
import LinkedInSignInButton from '../app/components/linkedin-sign-in-button'

export default {
  title: 'LinkedInSignInButton',
  component: LinkedInSignInButton,
}

// Default idle state
export const Default = { args: { returnPath: '/tournament/test' } }

// Custom button label
export const CustomLabel = { args: { returnPath: '/tournament/test', children: 'Continue with LinkedIn' } }

// Disabled state
export const Disabled = { args: { returnPath: '/tournament/test', disabled: true } }
```

---

### Additions to `stories/intermission.stories.jsx`

Add stories that exercise the post-LinkedIn-redirect path (simulating state after user returns from LinkedIn with `?n=1` and is authenticated):

```jsx
// Add to existing intermission.stories.jsx

// Simulates returning from LinkedIn auth: user is authenticated, round data is in context.
// Intermission should detect n=1, call batch-upsert automatically, and show success.
export const LinkedInReturnAutoUpsert = {
  decorators: [
    mockBatchUpsertDeliberationDataRoute,
    // Override window.location.search to include ?n=1
    Story => {
      useState(() => {
        Object.defineProperty(window, 'location', {
          value: { ...window.location, search: '?n=1', pathname: '/tournament/test' },
          writable: true,
        })
      })
      return <Story />
    },
    authFlowDecorator, // sets user with email
    DeliberationContextDecorator,
    clearGlobalStateDecorator,
  ],
  args: { round: 1 },
}

// Shows the LinkedIn button option in the temporary-user block (no auth yet)
export const TemporaryUserWithLinkedInOption = {
  decorators: [authFlowDecorator, DeliberationContextDecorator, clearGlobalStateDecorator],
  args: { round: 1 },
}
```

---

### Additions to `stories/sign-up.stories.jsx`

```jsx
// Simulates sign-up page after returning from LinkedIn (user is already logged in).
// The existing useEffect in sign-up calls onDone when user?.id is present.
export const LinkedInReturnLoggedIn = {
  args: {
    user: { id: '789', email: 'carol@example.com', firstName: 'Carol', lastName: 'Kane' },
    onDone: user => console.log('onDone', user),
  },
}
```

---

## Jest Tests

### `app/routes/__tests__/linkedin-auth.test.js`

```javascript
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { startLinkedinAuth } from '../linkedin-auth'

describe('startLinkedinAuth', () => {
  beforeEach(() => {
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id'
    process.env.HOSTNAME = 'localhost:3011'
  })

  it('redirects to LinkedIn auth URL with state and scopes', async () => {
    const req = { query: { return: '/tournament/abc' }, session: {} }
    req.session.save = cb => cb(null)
    const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() }

    await startLinkedinAuth(req, res)

    expect(res.redirect).toHaveBeenCalledTimes(1)
    const url = res.redirect.mock.calls[0][0]
    expect(url).toMatch(/linkedin\.com\/oauth\/v2\/authorization/)
    expect(url).toMatch(/openid/)
    expect(url).toMatch(/profile/)
    expect(url).toMatch(/email/)
    expect(req.session.linkedinCsrf).toBeDefined()
    expect(typeof req.session.linkedinCsrf).toBe('string')
    expect(req.session.linkedinReturn).toBe('/tournament/abc')
  })

  it('rejects non-relative return paths (open redirect prevention)', async () => {
    const req = { query: { return: 'https://evil.com' }, session: {} }
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }

    await startLinkedinAuth(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('defaults to / when return param is missing', async () => {
    const req = { query: {}, session: {} }
    req.session.save = cb => cb(null)
    const res = { redirect: jest.fn() }

    await startLinkedinAuth(req, res)

    expect(req.session.linkedinReturn).toBe('/')
  })
})
```

---

### `app/routes/__tests__/linkedin-oauth-callback.test.js`

Uses `MongoMemoryServer` (via `jest-db.config.js`) to test the HTTP handler logic.

```javascript
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
// @jest-environment node
// Run with: jest --config jest-db.config.js

import { linkedinOauthCallback, redirectAfterLinkedinAuth } from '../linkedin-oauth-callback'
import { User } from 'civil-server'

global.fetch = jest.fn()

const mockProfile = { sub: 'li-sub-001', given_name: 'Dan', family_name: 'Smith', email: 'dan@example.com' }

function makeReq({ code = 'auth-code-123', state = 'test-csrf', sessionCsrf = 'test-csrf', returnPath = '/tournament/abc' } = {}) {
  return {
    query: { code, state },
    session: { linkedinCsrf: sessionCsrf, linkedinReturn: returnPath, save: cb => cb(null) },
  }
}

function makeRes() {
  return { status: jest.fn().mockReturnThis(), send: jest.fn(), redirect: jest.fn() }
}

describe('linkedinOauthCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LINKEDIN_CLIENT_ID = 'test-id'
    process.env.LINKEDIN_CLIENT_SECRET = 'test-secret'
    process.env.HOSTNAME = 'localhost:3011'
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'mock-token' }) }).mockResolvedValueOnce({ ok: true, json: async () => mockProfile })
  })

  it('calls next() with no arguments if code is missing', async () => {
    const req = { query: {}, session: {} }
    const next = jest.fn()
    await linkedinOauthCallback(req, makeRes(), next)
    expect(next).toHaveBeenCalledWith()
  })

  it('returns 403 if CSRF state does not match session', async () => {
    const req = makeReq({ state: 'wrong-token', sessionCsrf: 'test-csrf' })
    const res = makeRes()
    await linkedinOauthCallback(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('creates a new user and sets req.user on first LinkedIn login', async () => {
    const req = makeReq()
    const next = jest.fn()
    await linkedinOauthCallback(req, makeRes(), next)
    expect(next).toHaveBeenCalledWith()
    expect(req.user).toMatchObject({ email: 'dan@example.com', firstName: 'Dan', lastName: 'Smith', linkedinId: 'li-sub-001' })
    expect(req.linkedinReturnPath).toBe('/tournament/abc')
  })

  it('updates existing user with linkedinId if not already set', async () => {
    const { insertedId } = await User.insertOne({ email: 'dan@example.com', firstName: 'Dan', lastName: 'Smith' })
    const req = makeReq()
    await linkedinOauthCallback(req, makeRes(), jest.fn())
    const updated = await User.findOne({ _id: insertedId })
    expect(updated.linkedinId).toBe('li-sub-001')
  })

  it('returns 500 when LinkedIn returns no email', async () => {
    global.fetch
      .mockReset()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'mock-token' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ sub: 'li-sub-002', given_name: 'Anon' }) })
    const res = makeRes()
    await linkedinOauthCallback(makeReq(), res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('redirectAfterLinkedinAuth', () => {
  it('redirects to returnPath?n=1', () => {
    const req = { linkedinReturnPath: '/tournament/abc' }
    const res = makeRes()
    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?n=1')
  })

  it('uses & separator when returnPath already has a query string', () => {
    const req = { linkedinReturnPath: '/tournament/abc?round=2' }
    const res = makeRes()
    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?round=2&n=1')
  })

  it('falls back to / when linkedinReturnPath is not set', () => {
    const res = makeRes()
    redirectAfterLinkedinAuth({}, res)
    expect(res.redirect).toHaveBeenCalledWith('/?n=1')
  })
})
```

> **Note:** `linkedinOauthCallback` and `redirectAfterLinkedinAuth` are named exports so they can be tested directly without spinning up a full Express server.

---

## End-to-End Testing with LinkedIn

LinkedIn OAuth **cannot be fully end-to-end tested in a local environment** without a publicly accessible callback URL, because LinkedIn requires the redirect URI to match exactly and must be reachable by LinkedIn's servers. The following approaches enable real E2E testing:

### Option A: Use `ngrok` for Local Testing

1. Install ngrok: `npm install -g ngrok` or download from [https://ngrok.com](https://ngrok.com).
2. Start your dev server: `npm run dev` (default port 3011).
3. Expose port 3011: `ngrok http 3011`
4. ngrok will print a public URL such as `https://abc123.ngrok-free.app`.
5. In [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) → your app → Auth → Authorized Redirect URLs, add `https://abc123.ngrok-free.app/linkedinOauthCallback`.
6. Update `~/.bashrc`:
   ```bash
   export HOSTNAME=abc123.ngrok-free.app
   ```
   Then `source ~/.bashrc` and restart the dev server.
7. Navigate to your app **via the ngrok URL** (not localhost), complete a discussion round, and click "Sign in with LinkedIn" on the intermission page.

### Option B: Deploy to `civilpursuit.herokuapp.com`

1. Push the branch to Heroku: `git push heroku <branch-name>:main` (or use the Heroku dashboard to deploy the branch).
2. Ensure `https://civilpursuit.herokuapp.com/linkedinOauthCallback` is in the LinkedIn app's Authorized Redirect URLs.
3. Set the Heroku config vars:
   ```
   heroku config:set LINKEDIN_CLIENT_ID=<your-client-id>
   heroku config:set LINKEDIN_CLIENT_SECRET=<your-client-secret>
   heroku config:set HOSTNAME=civilpursuit.herokuapp.com
   ```
4. Test via `https://civilpursuit.herokuapp.com`.

### Manual E2E Test Checklist

| Step                                                        | Expected Result                                          |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| Click "Sign in with LinkedIn" button on intermission page   | Browser navigates to LinkedIn auth page                  |
| Log in to LinkedIn and authorize the app                    | LinkedIn redirects back to `/linkedinOauthCallback`      |
| Server processes the callback                               | Browser redirects to original tournament URL with `?n=1` |
| Tournament detects `?n=1`                                   | Jumps to intermission tab                                |
| Intermission detects authenticated user + localStorage data | Calls batch-upsert automatically                         |
| Batch-upsert succeeds                                       | Success message shown; round marked as finished          |
| Refresh the page                                            | User remains logged in (`synuser` cookie persists)       |
| Click "Sign in with LinkedIn" again with existing account   | Same user found by email; `linkedinId` not duplicated    |
| Revoke app access on LinkedIn, then try to sign in          | LinkedIn shows an error; server returns 500              |
| Test on mobile browser                                      | Full redirect flow works (no popup dependency)           |

### Test LinkedIn Accounts

Use LinkedIn's **Test Users** feature (app Settings → Test users) to avoid using personal accounts during development:

- One test user whose email is confirmed and returned by the API
- One test user to verify the "existing account gets `linkedinId` added" path

---

## Security Considerations

- **State parameter (CSRF protection):** A random UUID is stored in `req.session.linkedinCsrf` and sent as the OAuth `state` parameter. The callback verifies the token matches the session value before processing, preventing CSRF attacks on the redirect endpoint.
- **Open redirect prevention:** The `return` parameter in `/linkedinAuth` is validated to be a relative path (must start with `/`). Absolute URLs are rejected with a 400 error.
- **HTTPS only in production:** The `scheme()` utility must return `https://` in production. Do not register `http://` redirect URLs in the LinkedIn app except for `localhost`.
- **No access token storage:** The LinkedIn access token is used only during the HTTP request to fetch the user profile and is never stored. Only the normalized user profile data (`email`, `firstName`, `lastName`, `linkedinId`) is persisted.
- **Email as user lookup key:** Existing users are looked up by email address. If LinkedIn returns a verified email that matches an existing account, that account is updated rather than a duplicate created.
- **`linkedinId` uniqueness:** The sparse unique index ensures one LinkedIn account maps to at most one user record.
- **Session fixation:** After LinkedIn auth, `req.user` is set and `setUserCookie` writes the `synuser` cookie — the same middleware chain as `civil-server`'s sign-in and sign-up routes. If `civil-server` supports session regeneration (`req.session.regenerate`), call it before `next()` to prevent session fixation attacks.
- **Input sanitization:** All values from the LinkedIn profile (`email`, `given_name`, `family_name`) are string-trimmed before storage. The `sub` value is treated as an opaque string identifier.

---

## Future Work / Out of Scope

- **Account linking UI:** If a user creates an account with email/password and then signs in with LinkedIn using the same email for the first time, the `linkedinId` is silently added to the existing account. A confirmation step ("Link your LinkedIn account to your existing account?") could be added in the future.
- **Token refresh:** The OpenID Connect flow used here obtains a short-lived access token only for the initial profile fetch. No refresh tokens are stored. Re-authentication requires a new OAuth flow.
- **LinkedIn organization/company data:** If future features need the user's employer or other LinkedIn profile data, additional scopes (e.g. `r_organization_social`) require separate LinkedIn product approvals.
