// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import { linkedinOauthCallback, redirectAfterLinkedinAuth } from '../linkedin-oauth-callback'
import { User } from 'civil-server'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { encodeLinkedinState } from '../linkedin-auth'

// Only mock getLinkedinRedirectUrl; use real encode/decodeLinkedinState
jest.mock('../linkedin-auth', () => ({
  ...jest.requireActual('../linkedin-auth'),
  getLinkedinRedirectUrl: jest.fn(() => 'http://localhost:3011/linkedinOauthCallback'),
}))

global.logger = {
  info: jest.fn(),
  warn: jest.fn((...args) => console.warn('Logger WARN:', ...args)),
  error: jest.fn((...args) => console.error('Logger ERROR:', ...args)),
}

const mockProfile = {
  sub: 'li-user-123',
  email: 'alice@example.com',
  given_name: 'Alice',
  family_name: 'Smith',
}

const mockTokenResponse = { access_token: 'mock-access-token' }

function buildReq({ code = 'authcode', returnPath = '/tournament/abc', state } = {}) {
  return {
    query: { code, state: state ?? encodeLinkedinState(returnPath) },
    user: undefined,
    linkedinReturnPath: undefined,
  }
}

function buildRes() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    redirect: jest.fn(),
  }
}

let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
  process.env.LINKEDIN_CLIENT_ID = 'test-client-id'
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
  jest.clearAllMocks()

  global.fetch = jest.fn(url => {
    if (url.includes('accessToken')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
    }
    if (url.includes('userinfo')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProfile) })
    }
    return Promise.reject(new Error('Unexpected fetch: ' + url))
  })
})

afterEach(() => {
  delete global.fetch
})

describe('linkedinOauthCallback', () => {
  it('calls next() without processing when code or state are missing', async () => {
    const req = { query: {} }
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('redirects back to returnPath when user declines LinkedIn (error param present)', async () => {
    const { encodeLinkedinState } = require('../linkedin-auth')
    const state = encodeLinkedinState('/whats-largest')
    const req = { query: { error: 'user_cancelled_login', error_description: 'User declined', state } }
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.redirect).toHaveBeenCalledWith('/whats-largest')
    expect(next).not.toHaveBeenCalled()
  })

  it('redirects to / when user declines and state is missing', async () => {
    const req = { query: { error: 'access_denied' } }
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.redirect).toHaveBeenCalledWith('/')
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 403 when state is tampered', async () => {
    const req = buildReq({ state: 'completelyfakestate.invalidsig' })
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Invalid state'))
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 500 when token exchange fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400 }))
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 500 when profile fetch fails', async () => {
    global.fetch = jest.fn(url => {
      if (url.includes('accessToken')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
      return Promise.resolve({ ok: false, status: 500 })
    })
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(next).not.toHaveBeenCalled()
  })

  it('creates a new user when email does not exist in DB', async () => {
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user).not.toBeNull()
    expect(user.email).toBe('alice@example.com')
    expect(user.firstName).toBe('Alice')
    expect(user.lastName).toBe('Smith')
    expect(user.linkedinId).toBe('li-user-123')
    expect(req.user).toBeDefined()
    expect(req.user.email).toBe('alice@example.com')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('links LinkedIn ID to existing user by email', async () => {
    await User.insertOne({ email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith' })

    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user.linkedinId).toBe('li-user-123')
    expect(req.user.email).toBe('alice@example.com')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('does not overwrite existing linkedinId on existing user', async () => {
    await User.insertOne({ email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith', linkedinId: 'original-id' })

    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user.linkedinId).toBe('original-id')
  })

  it('returns 500 when LinkedIn does not return an email', async () => {
    global.fetch = jest.fn(url => {
      if (url.includes('accessToken')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
      if (url.includes('userinfo')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ sub: 'li-123', given_name: 'No', family_name: 'Email' }) })
      return Promise.reject(new Error('Unexpected'))
    })
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(logger.error).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('stores the return path on req.linkedinReturnPath', async () => {
    const req = buildReq({ returnPath: '/tournament/test' })
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(req.linkedinReturnPath).toBe('/tournament/test')
  })
})

describe('redirectAfterLinkedinAuth', () => {
  it('redirects to returnPath with ?n=1 appended', () => {
    const req = { linkedinReturnPath: '/tournament/abc' }
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?n=1')
  })

  it('appends &n=1 when returnPath already has query params', () => {
    const req = { linkedinReturnPath: '/tournament/abc?foo=bar' }
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?foo=bar&n=1')
  })

  it('defaults to / when linkedinReturnPath is not set', () => {
    const req = {}
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/?n=1')
  })
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
  jest.clearAllMocks()

  // Mock global fetch for token and profile endpoints
  global.fetch = jest.fn(url => {
    if (url.includes('accessToken')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
    }
    if (url.includes('userinfo')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProfile) })
    }
    return Promise.reject(new Error('Unexpected fetch: ' + url))
  })
})

afterEach(() => {
  delete global.fetch
})

describe('linkedinOauthCallback', () => {
  it('calls next() without processing when code or state are missing', async () => {
    const req = { query: {}, session: {} }
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('returns 403 when CSRF state does not match', async () => {
    const req = buildReq({ state: 'tampered', csrfInSession: 'valid-csrf' })
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Invalid state'))
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 500 when token exchange fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400 }))
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 500 when profile fetch fails', async () => {
    global.fetch = jest.fn(url => {
      if (url.includes('accessToken')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
      return Promise.resolve({ ok: false, status: 500 })
    })
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(next).not.toHaveBeenCalled()
  })

  it('creates a new user when email does not exist in DB', async () => {
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user).not.toBeNull()
    expect(user.email).toBe('alice@example.com')
    expect(user.firstName).toBe('Alice')
    expect(user.lastName).toBe('Smith')
    expect(user.linkedinId).toBe('li-user-123')
    expect(req.user).toBeDefined()
    expect(req.user.email).toBe('alice@example.com')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('links LinkedIn ID to existing user by email', async () => {
    await User.insertOne({ email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith' })

    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user.linkedinId).toBe('li-user-123')
    expect(req.user.email).toBe('alice@example.com')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('does not overwrite existing linkedinId on existing user', async () => {
    await User.insertOne({ email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith', linkedinId: 'original-id' })

    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)

    const user = await User.findOne({ email: 'alice@example.com' })
    expect(user.linkedinId).toBe('original-id')
  })

  it('returns 500 when LinkedIn does not return an email', async () => {
    global.fetch = jest.fn(url => {
      if (url.includes('accessToken')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTokenResponse) })
      if (url.includes('userinfo')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ sub: 'li-123', given_name: 'No', family_name: 'Email' }) })
      return Promise.reject(new Error('Unexpected'))
    })
    const req = buildReq()
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(logger.error).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('stores the return path on req.linkedinReturnPath', async () => {
    const req = buildReq({ returnPath: '/tournament/test' })
    const res = buildRes()
    const next = jest.fn()

    await linkedinOauthCallback(req, res, next)
    expect(req.linkedinReturnPath).toBe('/tournament/test')
  })
})

describe('redirectAfterLinkedinAuth', () => {
  it('redirects to returnPath with ?n=1 appended', () => {
    const req = { linkedinReturnPath: '/tournament/abc' }
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?n=1')
  })

  it('appends &n=1 when returnPath already has query params', () => {
    const req = { linkedinReturnPath: '/tournament/abc?foo=bar' }
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/tournament/abc?foo=bar&n=1')
  })

  it('defaults to / when linkedinReturnPath is not set', () => {
    const req = {}
    const res = buildRes()

    redirectAfterLinkedinAuth(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/?n=1')
  })
})
