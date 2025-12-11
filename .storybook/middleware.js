// Storybook is run on an express server, and this middleware lets routes be added
// To test the useAuth and AuthForm component we need to handle the post request and give a response

/**
 * Authentication Flow in Storybook
 *
 * This middleware mocks the authentication endpoints needed for civil-client's useAuth hook.
 *
 * ## New User Flow
 * When a new user first visits the site:
 *
 * 1. `user` prop is undefined
 * 2. Answer step shows Terms & Privacy checkbox
 * 3. User checks Terms and clicks Next
 * 4. `useAuth.methods.skip()` is called, which:
 *    - Validates that Terms are agreed (!agree check)
 *    - Generates a random password
 *    - POSTs to /tempid endpoint with { email, password } (email may be undefined)
 *    - Server responds with { userId: 'abc123', email }
 *    - useAuth calls authenticateSocketIo() which:
 *      - Closes socket.io connection
 *      - Reopens socket.io (now with auth cookie in headers)
 *      - Server authenticates the socket connection
 *    - Page reloads/redirects with authenticated session
 * 5. After reload:
 *    - `user` prop is now { id: 'userId-from-server' }
 *    - User continues through tournament with temporary ID
 *    - All data saved to localStorage
 *
 * ## Storybook Testing Limitations
 *
 * In Storybook, the HTTP endpoints are mocked below, but:
 * - Socket.io reconnection doesn't happen (no real socket server)
 * - Page reload doesn't happen (Storybook story doesn't navigate)
 * - User prop doesn't automatically update after skip
 *
 * **Workaround for Testing:**
 * Tests that need to simulate the post-authentication state should start with
 * `user: { id: 'temp-id' }` in the defaultValue, skipping the authentication step.
 *
 * **Testing the Terms Flow:**
 * To test Terms checkbox and validation, use `user: undefined` but don't expect
 * the skip() call to work - just test that onDone becomes valid when Terms are checked.
 * See stories/answer-step.stories.jsx AnswerStepWithTermsAgreement for example.
 *
 * ## TODO: Investigate Modern Storybook Mocking
 *
 * Storybook 7+ has new ways to mock fetch/network requests:
 * - msw-storybook-addon (Mock Service Worker)
 * - fetch-mock addon
 * These might provide better ways to test authentication flows.
 */

const express = require('express')

async function signInHandler(req, res) {
  const { email, password } = req.body
  if (email === 'success@email.com') {
    if (password === 'password') {
      res.send({ userId: 'abc123', firstName: 'Jane', lastName: 'Doe' })
    } else {
      res.statusCode = 404
      res.json({ 'user/password error': email })
      return
    }
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
    return
  }
}

async function signUpHandler(req, res) {
  console.info('body', req.body)
  const { email, password } = req.body
  if (email === 'success@email.com') {
    if (password === 'password') {
      res.send({ userId: 'abc123', firstName: 'Jane', lastName: 'Doe' })
    } else {
      res.statusCode = 404
      res.json({ 'user/password error': email })
      return
    }
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
    return
  }
}

/**
 * Temporary ID (Skip) Handler
 *
 * Mocks the /tempid endpoint used by useAuth.methods.skip()
 *
 * - `req.body` contains: { email?, password, ...userInfo }
 * - Email is optional (can be undefined for anonymous users)
 * - Password is a randomly generated string (8-16 chars A-Z)
 * - Returns: { userId: 'abc123', email } on success
 * - Returns: 404 with error for invalid email (not 'success@email.com')
 *
 * In production, this endpoint:
 * 1. Creates a new User document with the temporary credentials
 * 2. Sets a session cookie for authentication
 * 3. The session cookie is used to authenticate subsequent socket.io connections
 * 4. If email is not associated before cookie expires, account becomes abandoned
 */
async function tempId(req, res) {
  console.info('tempId body', req.body)
  let { password, ..._body } = req.body // don't let the password show up in the logs
  let { email } = req.body

  if (email === 'success@email.com' || !email) {
    res.send({ userId: 'abc123', email })
  } else {
    res.statusCode = 404
    res.json({ 'user/password error': email })
  }
}

/**
 * Batch Upsert Deliberation Data Handler
 *
 * Mocks the /api/batch-upsert-deliberation-data endpoint used by intermission.jsx
 *
 * This HTTP route is used instead of the socket API when:
 * - Email is being associated with a temporary user account
 * - The cookie needs to be updated with the new email
 *
 * In production, this endpoint:
 * 1. Validates and upserts points, whys, ranks to database
 * 2. Associates email with user account
 * 3. Updates the synuser cookie to include email
 * 4. Client reconnects socket to get authenticated with email
 */
async function batchUpsertDeliberationData(req, res) {
  console.info('batch-upsert-deliberation-data body', JSON.stringify(req.body, null, 2))
  const { email } = req.body

  // Track calls for test assertions
  if (!global.batchUpsertCalls) global.batchUpsertCalls = []
  global.batchUpsertCalls.push(req.body)

  // Also put on window for browser-side test access
  // This is a server-side handler, so we need to track differently
  // Tests should check the response or use socket mock alongside

  if (email === 'batch-fail@email.com') {
    res.status(500).json({ error: 'Failed to save data. Please try again.' })
  } else {
    // Simulate setting cookie (in real server, setUserCookie middleware does this)
    if (email) {
      res.cookie('synuser', { id: 'temp-user-123', email }, { path: '/', httpOnly: true })
    }
    res.json({ success: true, points: 1, whys: 1, ranks: 0 })
  }
}

const expressMiddleWare = router => {
  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))
  router.post('/sign/in', signInHandler)
  router.post('/sign/up', signUpHandler)
  router.post('/tempid', tempId)
  router.post('/api/batch-upsert-deliberation-data', batchUpsertDeliberationData)
}
module.exports = expressMiddleWare
