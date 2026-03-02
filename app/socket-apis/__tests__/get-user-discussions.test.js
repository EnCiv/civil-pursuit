// https://github.com/EnCiv/civil-pursuit/issues/385

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'
import Points from '../../models/points'
import Dturns from '../../models/dturns'
import getUserDiscussions from '../get-user-discussions'
import { getConclusionIds } from '../../dturn/dturn'

// Mock getConclusionIds function
jest.mock('../../dturn/dturn', () => ({
  getConclusionIds: jest.fn(),
}))

let MemoryServer

const DISCUSSION_ID1 = '6667d5a33da5d19ddc304a6b'
const DISCUSSION_ID2 = '6667d5a33da5d19ddc304a6c'

const userId1 = '6667d5a33da5d19ddc304a6b'
const userId2 = '6667d5a33da5d19ddc304a6c'
const synuser1 = { synuser: { id: userId1 } }

beforeEach(async () => {
  global.logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  // Reset and set default behavior for getConclusionIds
  jest.clearAllMocks()
  getConclusionIds.mockResolvedValue(undefined) // Default: discussions are not complete
})

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  await Iota.deleteMany({})
  await Points.deleteMany({})
  await Dturns.deleteMany({})
  await Mongo.disconnect()
  await MemoryServer.stop()
})

afterEach(async () => {
  await Iota.deleteMany({})
  await Points.deleteMany({})
  await Dturns.deleteMany({})
})

test('returns undefined when no user is logged in', async () => {
  const cb = jest.fn()

  await getUserDiscussions.call({}, cb)

  expect(cb).toHaveBeenCalledWith(undefined)
})

test('returns empty array when user has not participated in any discussions', async () => {
  const cb = jest.fn()

  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith([])
})

test('returns discussions for user with single discussion participation', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    subject: 'Test Discussion 1',
    description: 'Description for discussion 1',
    webComponent: {
      participants: 127,
    },
  })

  await Points.insertOne({
    _id: new ObjectId(),
    userId: userId1,
    parentId: DISCUSSION_ID1,
    subject: 'Point 1',
    description: 'User point in discussion 1',
  })

  await Dturns.insertOne({
    discussionId: DISCUSSION_ID1,
    userId: userId1,
    round: 2,
  })

  const cb = jest.fn()

  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    _id: DISCUSSION_ID1,
    subject: 'Test Discussion 1',
    description: 'Description for discussion 1',
    participants: 127,
    currentRound: 2,
    isComplete: false,
    userLastActivity: expect.any(String),
    discussionLastActivity: expect.any(String),
  })
})

test('returns multiple discussions for user who participated in several', async () => {
  // Mock getConclusionIds: DISCUSSION_ID2 is complete (has conclusion), DISCUSSION_ID1 is not
  getConclusionIds.mockImplementation(discussionId => {
    if (discussionId === DISCUSSION_ID2) {
      return Promise.resolve(['conclusion1', 'conclusion2']) // Has conclusions - complete
    }
    return Promise.resolve(undefined) // No conclusions - not complete
  })

  await Iota.insertMany([
    {
      _id: new ObjectId(DISCUSSION_ID1),
      subject: 'Discussion One',
      description: 'First discussion',
      webComponent: {
        participants: 50,
      },
    },
    {
      _id: new ObjectId(DISCUSSION_ID2),
      subject: 'Discussion Two',
      description: 'Second discussion',
      webComponent: {
        participants: 25,
      },
    },
  ])

  await Points.insertMany([
    {
      _id: new ObjectId(),
      userId: userId1,
      parentId: DISCUSSION_ID1,
      subject: 'Point in discussion 1',
      description: 'User point in first discussion',
    },
    {
      _id: new ObjectId(),
      userId: userId1,
      parentId: DISCUSSION_ID2,
      subject: 'Point in discussion 2',
      description: 'User point in second discussion',
    },
  ])

  await Dturns.insertMany([
    {
      discussionId: DISCUSSION_ID1,
      userId: userId1,
      round: 1,
    },
    {
      discussionId: DISCUSSION_ID2,
      userId: userId1,
      round: 3,
    },
  ])

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]

  expect(result).toHaveLength(2)

  expect(result).toEqual(
    expect.arrayContaining([
      {
        _id: DISCUSSION_ID1,
        subject: 'Discussion One',
        description: 'First discussion',
        participants: 50,
        currentRound: 1,
        isComplete: false,
        userLastActivity: expect.any(String),
        discussionLastActivity: expect.any(String),
      },
      {
        _id: DISCUSSION_ID2,
        subject: 'Discussion Two',
        description: 'Second discussion',
        participants: 25,
        currentRound: 3,
        isComplete: true,
        userLastActivity: expect.any(String),
        discussionLastActivity: expect.any(String),
      },
    ])
  )
})

test('excludes discussions where iota is not found', async () => {
  await Points.insertOne({
    _id: new ObjectId(),
    userId: userId1,
    parentId: DISCUSSION_ID1,
    subject: 'Point for non-existent discussion',
    description: 'This point references a discussion that has no iota',
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith([])
})

test('handles database query errors gracefully', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    path: 'test-discussion',
    subject: 'Test Discussion',
    description: 'Test description',
    webComponent: { component: 'Tournament' },
  })

  await Points.insertOne({
    _id: new ObjectId(),
    userId: userId1,
    parentId: DISCUSSION_ID1,
    subject: 'Test point',
    description: 'Test point description',
  })

  const iotaSpy = jest.spyOn(Iota, 'find').mockImplementation(() => {
    throw new Error('Database connection error')
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith(undefined)

  iotaSpy.mockRestore()
})

test('handles Points database errors gracefully', async () => {
  const pointsSpy = jest.spyOn(Points, 'find').mockImplementation(() => {
    throw new Error('Database connection error')
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith(undefined)

  pointsSpy.mockRestore()
})

test('returns unique discussions even with duplicate parentIds in points', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    subject: 'Test Discussion',
    description: 'Test description',
    webComponent: {
      participants: 15,
    },
  })

  await Points.insertMany([
    {
      _id: new ObjectId(),
      userId: userId1,
      parentId: DISCUSSION_ID1,
      subject: 'Point 1',
      description: 'First point in discussion',
    },
    {
      _id: new ObjectId(),
      userId: userId1,
      parentId: DISCUSSION_ID1,
      subject: 'Point 2',
      description: 'Second point in same discussion',
    },
    {
      _id: new ObjectId(),
      userId: userId1,
      parentId: DISCUSSION_ID1,
      subject: 'Point 3',
      description: 'Third point in same discussion',
    },
  ])

  await Dturns.insertOne({
    discussionId: DISCUSSION_ID1,
    userId: userId1,
    round: 1,
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    _id: DISCUSSION_ID1,
    subject: 'Test Discussion',
    description: 'Test description',
    participants: 15,
    currentRound: 1,
    isComplete: false,
    userLastActivity: expect.any(String),
    discussionLastActivity: expect.any(String),
  })
})

test('handles missing webComponent participants gracefully', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    subject: 'Test Discussion',
    description: 'Test description',
  })

  await Points.insertOne({
    _id: new ObjectId(),
    userId: userId1,
    parentId: DISCUSSION_ID1,
    subject: 'Test point',
    description: 'Test point description',
  })

  await Dturns.insertOne({
    discussionId: DISCUSSION_ID1,
    userId: userId1,
    round: 1,
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    _id: DISCUSSION_ID1,
    subject: 'Test Discussion',
    description: 'Test description',
    participants: 0,
    currentRound: 1,
    isComplete: false,
    userLastActivity: expect.any(String),
    discussionLastActivity: expect.any(String),
  })
})

test('handles missing Dturn record gracefully', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    subject: 'Test Discussion',
    description: 'Test description',
    webComponent: {
      participants: 10,
    },
  })

  await Points.insertOne({
    _id: new ObjectId(),
    userId: userId1,
    parentId: DISCUSSION_ID1,
    subject: 'Test point',
    description: 'Test point description',
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    _id: DISCUSSION_ID1,
    subject: 'Test Discussion',
    description: 'Test description',
    participants: 10,
    currentRound: 0,
    isComplete: false,
    userLastActivity: null,
    discussionLastActivity: null,
  })
})
