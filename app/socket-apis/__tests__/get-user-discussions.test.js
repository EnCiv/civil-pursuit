// https://github.com/EnCiv/civil-pursuit/issues/XXX

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'
import Dturns from '../../models/dturns'
import getUserDiscussions from '../get-user-discussions'

let MemoryServer

const DISCUSSION_ID1 = '6667d5a33da5d19ddc304a6b'
const DISCUSSION_ID2 = '6667d5a33da5d19ddc304a6c'
const DISCUSSION_ID3 = '6667d5a33da5d19ddc304a6d'

const userId1 = '6667d5a33da5d19ddc304a6b'
const userId2 = '6667d5a33da5d19ddc304a6c'
const synuser1 = { synuser: { id: userId1 } }
const synuser2 = { synuser: { id: userId2 } }

beforeEach(async () => {
  global.logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  // Clear Discussions object
  Object.keys(Discussions).forEach(key => delete Discussions[key])

  // Setup default mock return values
  ensureDeliberationLoaded.mockResolvedValue(true)
  getConclusionIds.mockResolvedValue(undefined) // default to not complete
})

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  await Iota.deleteMany({})
  await Dturns.deleteMany({})
  await Mongo.disconnect()
  await MemoryServer.stop()
})

afterEach(async () => {
  await Iota.deleteMany({})
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
  // Create iota for discussion
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    subject: 'Test Discussion 1',
    description: 'Description for discussion 1',
  })

  // Create dturn records for multiple users to show participant count
  const userId2 = new ObjectId()
  const userId3 = new ObjectId()
  await Dturns.insertMany([
    {
      discussionId: DISCUSSION_ID1,
      userId: userId1,
      round: 0,
      shownStatementIds: { statement1: { rank: 1 } },
      groupings: [['statement1', 'statement2']],
      finished: true,
    },
    {
      discussionId: DISCUSSION_ID1,
      userId: userId2.toString(),
      round: 0,
      shownStatementIds: { statement1: { rank: 2 } },
      groupings: [['statement1', 'statement2']],
      finished: true,
    },
    {
      discussionId: DISCUSSION_ID1,
      userId: userId3.toString(),
      round: 0,
      shownStatementIds: { statement2: { rank: 1 } },
      groupings: [['statement2', 'statement3']],
      finished: false,
    },
  ])

  const cb = jest.fn()

  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  console.log('Single discussion result:', JSON.stringify(result, null, 2))
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    discussionId: DISCUSSION_ID1,
    subject: 'Test Discussion 1',
    description: 'Description for discussion 1',
    numParticipants: 3, // 3 different users in the dturn records
    roundNum: 0, // user1's highest round
  })
})

test('returns multiple discussions for user who participated in several', async () => {
  // Setup multiple discussions - create iotas
  await Iota.insertMany([
    {
      _id: new ObjectId(DISCUSSION_ID1),
      path: 'discussion-1',
      subject: 'Discussion One',
      description: 'First discussion',
      webComponent: {
        component: 'Tournament',
        participants: {},
      },
    },
    {
      _id: new ObjectId(DISCUSSION_ID2),
      path: 'discussion-2',
      subject: 'Discussion Two',
      description: 'Second discussion',
      webComponent: {
        component: 'Tournament',
        participants: {},
      },
    },
  ])

  // Mock additional user IDs
  const userId2 = new ObjectId().toString()
  const userId3 = new ObjectId().toString()
  const userId4 = new ObjectId().toString()

  // Create dturn participation records for multiple users and discussions
  await Dturns.insertMany([
    // Discussion 1 participants - user1 participated in 2 rounds, others in 1
    { discussionId: DISCUSSION_ID1, userId: userId1, rounds: [{ roundNum: 1 }, { roundNum: 2 }] },
    { discussionId: DISCUSSION_ID1, userId: userId2, rounds: [{ roundNum: 1 }] },
    { discussionId: DISCUSSION_ID1, userId: userId3, rounds: [{ roundNum: 1 }] },
    // Discussion 2 participants (userId1 participates in both)
    { discussionId: DISCUSSION_ID2, userId: userId1, rounds: [{ roundNum: 1 }] },
    { discussionId: DISCUSSION_ID2, userId: userId4, rounds: [{ roundNum: 1 }] },
  ])

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]

  expect(result).toHaveLength(2)

  // Check that both discussions are returned
  const discussionIds = result.map(d => d.discussionId)
  expect(discussionIds).toContain(DISCUSSION_ID1)
  expect(discussionIds).toContain(DISCUSSION_ID2)

  // Check discussion metadata and participant counts
  const discussion1 = result.find(d => d.discussionId === DISCUSSION_ID1)
  expect(discussion1.subject).toBe('Discussion One')
  expect(discussion1.description).toBe('First discussion')
  expect(discussion1.path).toBe('discussion-1')
  expect(discussion1.participants).toBe(3) // 3 unique participants
  expect(discussion1.roundNum).toBe(2) // user1's highest round

  const discussion2 = result.find(d => d.discussionId === DISCUSSION_ID2)
  expect(discussion2.subject).toBe('Discussion Two')
  expect(discussion2.path).toBe('discussion-2')
  expect(discussion2.participants).toBe(2) // 2 unique participants
  expect(discussion2.roundNum).toBe(1) // user1's highest round
})

test('excludes discussions where iota is not found', async () => {
  // Create dturn record but no corresponding iota
  await Dturns.insertOne({
    discussionId: DISCUSSION_ID1,
    userId: userId1,
    rounds: [{ roundNum: 1 }],
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith([])
})

test('handles database query errors gracefully', async () => {
  // Create valid data first
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    path: 'test-discussion',
    subject: 'Test Discussion',
    description: 'Test description',
    webComponent: { component: 'Tournament' },
  })

  await Dturns.insertOne({
    discussionId: DISCUSSION_ID1,
    userId: userId1,
    rounds: [{ roundNum: 1 }],
  })

  // Mock Iota.find to throw an error
  const originalFind = Iota.find
  Iota.find = jest.fn().mockImplementation(() => {
    throw new Error('Database connection error')
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith(undefined)

  // Restore original method
  Iota.find = originalFind
})

test('returns correct round number for user participation', async () => {
  // Create iota
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID1),
    path: 'test-discussion',
    subject: 'Test Discussion',
    description: 'Test description',
    webComponent: { component: 'Tournament' },
  })

  // Create dturn records - user1 participated in multiple rounds
  const userId2 = new ObjectId().toString()
  const userId3 = new ObjectId().toString()
  await Dturns.insertMany([
    {
      discussionId: DISCUSSION_ID1,
      userId: userId1,
      round: 1, // user1 highest round
    },
    {
      discussionId: DISCUSSION_ID1,
      userId: userId1,
      round: 2, // user1 went to round 2
    },
    {
      discussionId: DISCUSSION_ID1,
      userId: userId2,
      round: 1, // user2 only did round 1
    },
    {
      discussionId: DISCUSSION_ID1,
      userId: userId3,
      round: 1, // user3 only did round 1
    },
  ])

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toHaveLength(1)
  expect(result[0].roundNum).toBe(2) // user1's highest round
  expect(result[0].numParticipants).toBe(3) // 3 unique participants
})

test('handles database errors gracefully', async () => {
  // Mock Dturns.find to throw an error
  const originalFind = Dturns.find
  Dturns.find = jest.fn().mockImplementation(() => {
    throw new Error('Database connection error')
  })

  const cb = jest.fn()
  await getUserDiscussions.call(synuser1, cb)

  expect(cb).toHaveBeenCalledWith(undefined)

  // Restore original method
  Dturns.find = originalFind
})
