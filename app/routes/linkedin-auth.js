// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import crypto from 'crypto'

const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2/authorization'
const SCOPES = ['openid', 'profile', 'email']

// Random secret generated at startup — no env var required.
// A server restart invalidates in-flight OAuth state params, which fail gracefully with 403.
const STATE_SECRET = crypto.randomBytes(32).toString('hex')

const getScheme = () => (process.env.HOSTNAME?.startsWith('localhost') ? 'http://' : 'https://')

export const linkedinRedirectRoute = '/linkedinOauthCallback'
export const getLinkedinRedirectUrl = () => getScheme() + process.env.HOSTNAME + linkedinRedirectRoute

/**
 * Encode returnPath into a self-contained, tamper-proof state parameter.
 * The payload is base64url(JSON) signed with HMAC-SHA256(LINKEDIN_CLIENT_SECRET).
 * LinkedIn echoes state back verbatim, so no server-side storage is needed.
 */
export function encodeLinkedinState(returnPath) {
  const payload = Buffer.from(JSON.stringify({ return: returnPath, nonce: crypto.randomBytes(16).toString('hex') })).toString('base64url')
  const sig = crypto.createHmac('sha256', STATE_SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

/**
 * Verify and decode a state parameter produced by encodeLinkedinState.
 * Returns the decoded object on success, or null if invalid / tampered.
 */
export function decodeLinkedinState(state) {
  if (!state || typeof state !== 'string') return null
  const dot = state.lastIndexOf('.')
  if (dot === -1) return null
  const payload = state.slice(0, dot)
  const sig = state.slice(dot + 1)
  const expectedSig = crypto.createHmac('sha256', STATE_SECRET).update(payload).digest('base64url')
  // Constant-time comparison to prevent timing attacks
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'base64url'), Buffer.from(expectedSig, 'base64url'))) return null
  } catch {
    return null
  }
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

export function startLinkedinAuth(req, res) {
  // Validate that the return path is relative (prevent open redirect)
  const returnPath = req.query.return || '/'
  if (!returnPath.startsWith('/')) {
    return res.status(400).send('Invalid return path')
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: getLinkedinRedirectUrl(),
    scope: SCOPES.join(' '),
    state: encodeLinkedinState(returnPath),
  })
  res.redirect(`${LINKEDIN_AUTH_BASE}?${params}`)
}

export default function route() {
  ;['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'].forEach(name => {
    if (!process.env[name]) {
      logger.error('env', name, 'not set. LinkedIn OAuth authentication will not work.')
    }
  })
  this.app.get('/linkedinAuth', startLinkedinAuth)
}
