// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { User } from 'civil-server'
import { getLinkedinRedirectUrl, decodeLinkedinState } from './linkedin-auth'

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo' // OpenID Connect userinfo endpoint

export async function linkedinOauthCallback(req, res, next) {
  // User declined or LinkedIn returned an error — redirect them back to where they started
  if (req.query.error) {
    const stateData = decodeLinkedinState(req.query.state)
    const returnPath = stateData?.return || '/'
    logger.info('linkedinOauthCallback: LinkedIn returned error', req.query.error, '- redirecting back to', returnPath)
    return res.redirect(returnPath)
  }

  if (!req.query.code || !req.query.state) return next()

  // Verify CSRF: state is HMAC-signed, so forgery is detected without server-side storage
  const stateData = decodeLinkedinState(req.query.state)
  if (!stateData) {
    logger.error('linkedinOauthCallback: invalid or tampered state parameter')
    return res.status(403).send('Invalid state parameter. Please try again.')
  }

  const returnPath = stateData.return || '/'

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
      const updates = {}
      if (!user.linkedinId) updates.linkedinId = linkedinId
      if (!user.firstName) updates.firstName = firstName
      if (!user.lastName) updates.lastName = lastName
      if (Object.keys(updates).length) {
        await User.updateOne({ _id: user._id }, { $set: updates })
        Object.assign(user, updates)
      }
    } else {
      const newUser = { email, firstName, lastName, linkedinId }
      const result = await User.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    }
  } catch (err) {
    logger.error('linkedinOauthCallback: database error', err)
    return res.status(500).send('Authentication failed. Please go back and try again.')
  }

  // 4. Set req.user so civil-server's setUserCookie middleware writes the synuser cookie
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
