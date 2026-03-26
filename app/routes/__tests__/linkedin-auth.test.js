// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { startLinkedinAuth, getLinkedinRedirectUrl, encodeLinkedinState, decodeLinkedinState } from '../linkedin-auth'

global.logger = {
  info: jest.fn(),
  warn: jest.fn((...args) => console.warn('Logger WARN:', ...args)),
  error: jest.fn((...args) => console.error('Logger ERROR:', ...args)),
}

describe('encodeLinkedinState / decodeLinkedinState', () => {
  it('round-trips returnPath correctly', () => {
    const state = encodeLinkedinState('/tournament/abc')
    const decoded = decodeLinkedinState(state)
    expect(decoded.return).toBe('/tournament/abc')
  })

  it('produces a different state on each call (nonce makes it unique)', () => {
    const s1 = encodeLinkedinState('/same-path')
    const s2 = encodeLinkedinState('/same-path')
    expect(s1).not.toBe(s2)
  })

  it('returns null for a tampered payload', () => {
    const state = encodeLinkedinState('/path')
    const tampered = 'evilpayload.' + state.split('.')[1]
    expect(decodeLinkedinState(tampered)).toBeNull()
  })

  it('returns null for a tampered signature', () => {
    const state = encodeLinkedinState('/path')
    const tampered = state.split('.')[0] + '.invalidsignature'
    expect(decodeLinkedinState(tampered)).toBeNull()
  })

  it('returns null for a missing dot separator', () => {
    expect(decodeLinkedinState('nodotinhere')).toBeNull()
  })

  it('returns null for null/undefined input', () => {
    expect(decodeLinkedinState(null)).toBeNull()
    expect(decodeLinkedinState(undefined)).toBeNull()
  })
})

describe('startLinkedinAuth', () => {
  let req, res

  beforeEach(() => {
    process.env.HOSTNAME = 'localhost:3011'
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id'

    req = { query: { return: '/tournament/abc' } }
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    }
  })

  it('redirects to LinkedIn authorization URL with correct params', () => {
    startLinkedinAuth(req, res)

    expect(res.redirect).toHaveBeenCalledTimes(1)
    const redirectUrl = res.redirect.mock.calls[0][0]
    expect(redirectUrl).toContain('https://www.linkedin.com/oauth/v2/authorization')
    expect(redirectUrl).toContain('response_type=code')
    expect(redirectUrl).toContain('client_id=test-client-id')
    expect(redirectUrl).toContain('redirect_uri=')
    expect(redirectUrl).toContain('scope=openid+profile+email')
    expect(redirectUrl).toContain('state=')
  })

  it('state param decodes back to the correct returnPath', () => {
    startLinkedinAuth(req, res)
    const redirectUrl = res.redirect.mock.calls[0][0]
    const params = new URLSearchParams(redirectUrl.split('?')[1])
    const decoded = decodeLinkedinState(params.get('state'))
    expect(decoded).not.toBeNull()
    expect(decoded.return).toBe('/tournament/abc')
  })

  it('generates a different state on each call', () => {
    const req2 = { query: { return: '/tournament/abc' } }
    startLinkedinAuth(req, res)
    startLinkedinAuth(req2, res)
    const url1 = new URLSearchParams(res.redirect.mock.calls[0][0].split('?')[1])
    const url2 = new URLSearchParams(res.redirect.mock.calls[1][0].split('?')[1])
    expect(url1.get('state')).not.toBe(url2.get('state'))
  })

  it('defaults returnPath to / when return param is missing', () => {
    req.query = {}
    startLinkedinAuth(req, res)
    const redirectUrl = res.redirect.mock.calls[0][0]
    const params = new URLSearchParams(redirectUrl.split('?')[1])
    const decoded = decodeLinkedinState(params.get('state'))
    expect(decoded.return).toBe('/')
  })

  it('rejects non-relative return paths with 400', () => {
    req.query.return = 'https://evil.com/steal'
    startLinkedinAuth(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith('Invalid return path')
    expect(res.redirect).not.toHaveBeenCalled()
  })
})

describe('getLinkedinRedirectUrl', () => {
  it('returns correct redirect URL', () => {
    process.env.HOSTNAME = 'localhost:3011'
    const url = getLinkedinRedirectUrl()
    expect(url).toBe('http://localhost:3011/linkedinOauthCallback')
  })
})
