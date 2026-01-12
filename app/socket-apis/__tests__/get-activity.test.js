// https://github.com/EnCiv/civil-pursuit/issues/305

import getActivity from '../get-activity'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

import { initDiscussion } from '../../dturn/dturn'
import upsertPoint from '../../socket-apis/upsert-point'
import Points from '../../models/points'
import Ranks from '../../models/ranks'

let MemoryServer

const DISCUSSION_ID = '6667d5a33da5d19ddc304a6b'
const DISCUSSION_ID2 = '6667d5a33da5d19ddc304a6c'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

beforeEach(async () => {
  global.logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
})

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)

  initDiscussion(DISCUSSION_ID, {
    group_size: 5,
    gmajority: 0.7,
    max_rounds: 10,
    min_shown_count: 3,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => {
      return []
    },
  })
})

afterAll(async () => {
  await Iota.deleteMany({})
  await Mongo.disconnect()
  await MemoryServer.stop()
})

test('Fail if discussionId not provided', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID),
    subject: 'Test Discussion for unauthenticated test',
    description: 'This is a test discussion for testing authentication',
    path: '/test-discussion-unauth',
    webComponent: {
      webComponent: 'CivilPursuit',
      status: 'active',
    },
  })

  const cb = jest.fn()

  await getActivity.call({}, undefined, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  if (global.logger.error.mock.calls.length > 0) {
    console.log('Error message:', global.logger.error.mock.calls[0][0])
    console.log('Error details:', global.logger.error.mock.calls[0][1])
  }
})

test('Return data from in-progress discussion.', async () => {
  await Iota.insertOne({
    _id: new ObjectId(DISCUSSION_ID2),
    subject: 'Test Discussion 2',
    description: 'This is another test discussion for get-activity API testing',
    path: '/test-discussion-2',
    webComponent: {
      webComponent: 'CivilPursuit',
      status: 'active',
    },
  })

  const cb = jest.fn()

  initDiscussion(DISCUSSION_ID2, {
    group_size: 5,
    gmajority: 0.5,
    max_rounds: 10,
    min_shown_count: 3,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => {
      return []
    },
  })

  const userPoint = {
    _id: new ObjectId(),
    subject: 'User Point',
    description: 'User point description',
    round: 1,
    parentId: DISCUSSION_ID2,
    userId: userId,
    category: 'most',
  }

  const cb2 = jest.fn()
  await upsertPoint.call({ synuser: { id: userId } }, userPoint, cb2)

  expect(cb2).toHaveBeenCalledTimes(1)
  expect(cb2.mock.calls[0][0]).toBeDefined()

  const insertedPoint = await Points.findOne({ parentId: DISCUSSION_ID2, userId: userId })
  expect(insertedPoint).toBeDefined()
  expect(insertedPoint.subject).toBe('User Point')

  const ranks = Array.from({ length: 20 }, (_, rankIndex) => {
    let category
    if (rankIndex < 8) category = 'most'
    else if (rankIndex < 15) category = 'least'
    else category = 'neutral'

    return {
      _id: new ObjectId(),
      parentId: insertedPoint._id.toString(),
      userId: new ObjectId().toString(),
      round: 1,
      stage: 'post',
      category: category,
      discussionId: DISCUSSION_ID2,
    }
  })
  await Ranks.insertMany(ranks)

  // Verify ranks were successfully inserted
  const insertedRanks = await Ranks.find({ parentId: insertedPoint._id.toString() }).toArray()
  expect(insertedRanks).toHaveLength(20)

  // Verify rank category counts
  const mostRanks = insertedRanks.filter(rank => rank.category === 'most')
  const leastRanks = insertedRanks.filter(rank => rank.category === 'least')
  const neutralRanks = insertedRanks.filter(rank => rank.category === 'neutral')
  expect(mostRanks).toHaveLength(8)
  expect(leastRanks).toHaveLength(7)
  expect(neutralRanks).toHaveLength(5)

  await getActivity.call(synuser, DISCUSSION_ID2, cb)

  expect(cb).toHaveBeenCalledTimes(1)

  const result = cb.mock.calls[0][0]
  if (result === undefined) {
    console.log('getActivity returned undefined')
    if (global.logger.error.mock.calls.length > 0) {
      console.log('Error message:', global.logger.error.mock.calls[0][0])
      console.log('Error details:', global.logger.error.mock.calls[0][1])
    }
  } else {
    console.log('getActivity returned:', JSON.stringify(result, null, 2))
  }

  expect(result).toEqual({
    subject: 'Test Discussion 2',
    description: 'This is another test discussion for get-activity API testing',
    userResponse: expect.objectContaining({
      subject: 'User Point',
      description: 'User point description',
      category: 'most',
    }),
    rankCounts: {
      mosts: 8,
      leasts: 7,
      neutrals: 5,
    },
  })
})
