// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Tests for batch-upsert-deliberation-data API

import batchUpsertDeliberationData from '../batch-upsert-deliberation-data'
import Points from '../../models/points'
import Ranks from '../../models/ranks'
import Jsforms from '../../models/jsforms'
import { User } from 'civil-server'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import * as dturn from '../../dturn/dturn'

// Mock dturn module
jest.mock('../../dturn/dturn', () => ({
  finishRound: jest.fn().mockResolvedValue(true),
  getDiscussionStatus: jest.fn().mockReturnValue({ uInfo: {} }),
  insertStatementId: jest.fn().mockResolvedValue(true),
}))

// Mock global logger but also console the messages except for info
global.logger = {
  info: jest.fn(),
  warn: jest.fn((...args) => console.warn('Logger WARN:', ...args)),
  error: jest.fn((...args) => console.error('Logger ERROR:', ...args)),
}

const USER1 = '6667d5a33da5d19ddc304a6b'
const DISCUSSION1 = '5d0137260dacd06732a1d814'
const POINT1 = new ObjectId().toString()
const POINT2 = new ObjectId().toString()
const WHY1 = new ObjectId().toString()
const RANK1 = new ObjectId().toString()

let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

beforeEach(async () => {
  // Clear all collections before each test
  await Points.deleteMany({})
  await Ranks.deleteMany({})
  await Jsforms.deleteMany({})
  await User.deleteMany({})
  // Reset mocks
  jest.clearAllMocks()

  // Setup default mock behavior
  dturn.getDiscussionStatus.mockReturnValue({ uInfo: {} })
})

describe('batch-upsert-deliberation-data', () => {
  test('successfully upserts points, whys, ranks, and associates email', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      email: 'test@example.com',
      data: {
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'Test Point',
            description: 'Test Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
        myWhyByCategoryByParentId: {
          most: {
            [POINT1]: {
              _id: WHY1,
              subject: 'Why Test',
              description: 'Why Description',
              parentId: POINT1,
              userId: USER1,
            },
          },
        },
        postRankByParentId: {
          [POINT1]: {
            _id: RANK1,
            stage: 'post',
            category: 'most',
            parentId: POINT1,
            userId: USER1,
            discussionId: DISCUSSION1,
            round: 0,
          },
        },
        groupIdsLists: [[POINT1]],
        jsformData: {
          moreDetails: { age: 30, location: 'CA' },
        },
        idRanks: [{ [POINT1]: 1 }],
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    // Verify callback was called with success
    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1,
      whys: 1,
      ranks: 1,
    })

    // Verify insertStatementId was called with correct parameters
    expect(dturn.insertStatementId).toHaveBeenCalledWith(DISCUSSION1, USER1, POINT1)

    // Verify finishRound was called
    expect(dturn.finishRound).toHaveBeenCalled()

    // Verify point was inserted
    const point = await Points.findOne({ _id: new ObjectId(POINT1) })
    expect(point).toBeTruthy()
    expect(point.subject).toBe('Test Point')
    expect(point.userId).toBe(USER1)

    // Verify why was inserted (also in Points collection)
    const why = await Points.findOne({ _id: new ObjectId(WHY1) })
    expect(why).toBeTruthy()
    expect(why.subject).toBe('Why Test')
    expect(why.category).toBe('most')

    // Verify rank was inserted
    const rank = await Ranks.findOne({ _id: new ObjectId(RANK1) })
    expect(rank).toBeTruthy()
    expect(rank.category).toBe('most')

    // Verify jsform data was inserted
    const jsform = await Jsforms.findOne({ parentId: DISCUSSION1, userId: USER1 })
    expect(jsform).toBeTruthy()
    expect(jsform.moreDetails).toEqual({ age: 30, location: 'CA' })

    // Verify finish-round was called
    expect(dturn.finishRound).toHaveBeenCalledWith(DISCUSSION1, 0, USER1, [{ [POINT1]: 1 }], [[POINT1]])
  })

  test('fails when user is not logged in', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: { idRanks: [] },
    }

    const cb = jest.fn()
    const context = {} // No synuser

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'User is not logged in',
    })
  })

  test('fails with invalid idRanks (not an array)', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: { idRanks: 'not-an-array' }, // Invalid: must be array or undefined
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'idRanks must be an array if provided',
    })
  })

  test('fails with invalid discussionId', async () => {
    const batchData = {
      discussionId: 'invalid',
      round: 0,
      data: { idRanks: [] },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'Invalid discussionId',
    })
  })

  test('fails with invalid round number', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: -1,
      data: { idRanks: [] },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'Invalid round number',
    })
  })

  test('fails with invalid point data', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: '', // Invalid - empty subject
            description: 'Test Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalled()
    expect(cb.mock.calls[0][0]).toHaveProperty('error')
    expect(cb.mock.calls[0][0].error).toContain('validation')
  })

  test('fails when user attempts to insert more than one point', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'First Point',
            description: 'Test Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
          [POINT2]: {
            _id: POINT2,
            subject: 'Second Point',
            description: 'Test Description 2',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'Only one statement allowed per user in Round 0',
    })
  })

  test('fails with invalid why data (missing category)', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myWhyByCategoryByParentId: {
          invalid: {
            // Invalid category
            [POINT1]: {
              _id: WHY1,
              subject: 'Why Test',
              description: 'Why Description',
              parentId: POINT1,
              userId: USER1,
            },
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalled()
    expect(cb.mock.calls[0][0]).toHaveProperty('error')
  })

  test('fails when insertStatementId returns false', async () => {
    // Mock insertStatementId to return false (failure)
    dturn.insertStatementId.mockResolvedValueOnce(false)

    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [{ [POINT1]: 1 }],
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'Test Point',
            description: 'Test Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      error: 'Failed to insert statement into discussion',
    })

    // Verify point was NOT inserted into database
    const point = await Points.findOne({ _id: new ObjectId(POINT1) })
    expect(point).toBeNull()
  })

  test('handles idempotency - returns success if round already finished', async () => {
    // Mock that round is already finished
    dturn.getDiscussionStatus.mockReturnValue({
      uInfo: {
        0: { finished: true },
      },
    })

    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myPointById: {},
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      message: 'Round already completed',
      points: 0,
      whys: 0,
      ranks: 0,
    })

    // Verify finish-round was NOT called again
    expect(dturn.finishRound).not.toHaveBeenCalled()
  })

  test('successfully handles empty data arrays', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myPointById: {},
        myWhyByCategoryByParentId: {},
        postRankByParentId: {},
        groupIdsLists: [],
        jsformData: {},
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 0,
      whys: 0,
      ranks: 0,
    })

    // Verify finish-round was NOT called (empty idRanks means nothing to finish)
    expect(dturn.finishRound).not.toHaveBeenCalled()
  })

  test('handles multiple whys across categories', async () => {
    const WHY2 = new ObjectId().toString()

    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        idRanks: [],
        myWhyByCategoryByParentId: {
          most: {
            [POINT1]: {
              _id: WHY1,
              subject: 'Why Most',
              description: 'Most Description',
              parentId: POINT1,
              userId: USER1,
            },
          },
          least: {
            [POINT1]: {
              _id: WHY2,
              subject: 'Why Least',
              description: 'Least Description',
              parentId: POINT1,
              userId: USER1,
            },
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 0,
      whys: 2,
      ranks: 0,
    })

    // Verify both whys were inserted with correct categories
    const whyMost = await Points.findOne({ _id: new ObjectId(WHY1) })
    expect(whyMost.category).toBe('most')

    const whyLeast = await Points.findOne({ _id: new ObjectId(WHY2) })
    expect(whyLeast.category).toBe('least')
  })

  test('successfully upserts without email', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      // No email provided
      data: {
        idRanks: [{ [POINT1]: 1 }],
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'Test Point',
            description: 'Test Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1,
      whys: 0,
      ranks: 0,
    })
  })

  test('successfully handles undefined idRanks and groupings (early user scenario)', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      email: 'earlyuser@example.com',
      data: {
        // idRanks and groupIdsLists are undefined (not done yet)
        idRanks: undefined,
        groupIdsLists: undefined,
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'Early User Point',
            description: 'Early User Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1,
      whys: 0,
      ranks: 0,
    })

    // Verify finishRound was NOT called (undefined idRanks means not finished yet)
    expect(dturn.finishRound).not.toHaveBeenCalled()
  })

  test('does not call finishRound when idRanks is empty array', async () => {
    const batchData = {
      discussionId: DISCUSSION1,
      round: 0,
      data: {
        // Empty array means user did the step but found no items to rank
        idRanks: [],
        groupIdsLists: [],
        myPointById: {
          [POINT1]: {
            _id: POINT1,
            subject: 'Point with empty ranks',
            description: 'Description',
            parentId: DISCUSSION1,
            userId: USER1,
          },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER1 } }

    await batchUpsertDeliberationData.call(context, batchData, cb)

    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1,
      whys: 0,
      ranks: 0,
    })

    // Verify finishRound was NOT called (empty idRanks array means nothing to rank)
    expect(dturn.finishRound).not.toHaveBeenCalled()
  })
})

// Integration test with mocked dturn (same instance as used by API)
describe('batch-upsert-deliberation-data integration with dturn', () => {
  beforeEach(() => {
    // Reset mocks but keep them as mocks (they share the same instance as the API)
    jest.clearAllMocks()
    
    // Mock getDiscussionStatus to return non-finished state
    dturn.getDiscussionStatus.mockImplementation((discussionId, userId) => {
      return { uInfo: {} }
    })
    
    // Mock insertStatementId to return success
    dturn.insertStatementId.mockResolvedValue(true)
    
    // Mock finishRound to return success
    dturn.finishRound.mockResolvedValue(true)
  })

  test('successfully batch-upserts first user data with dturn calls', async () => {
    const USER_ID_OBJ = new User.ObjectId()
    const USER_ID = USER_ID_OBJ.toString()
    const DISCUSSION_ID = new ObjectId().toString()
    const POINT_ID = new ObjectId().toString()
    const WHY_ID = new ObjectId().toString()

    // Create the user first (insertOne to bypass password requirement)
    await User.insertOne({ _id: USER_ID_OBJ })

    // The first user will not get an opportunity to see others' statements to group or rank
    // So idRanks and groupings are undefined (not done yet), not empty arrays
    const idRanks = undefined
    const groupings = undefined

    const batchData = {
      discussionId: DISCUSSION_ID,
      round: 0,
      email: 'firstuser@example.com',
      data: {
        idRanks,
        myPointById: {
          [POINT_ID]: {
            _id: POINT_ID,
            subject: 'First User Answer',
            description: 'First User Answer Description',
            parentId: DISCUSSION_ID,
            userId: USER_ID,
          },
        },
        myWhyByCategoryByParentId: {
          most: {
            [POINT_ID]: {
              _id: WHY_ID,
              subject: 'Why Most',
              description: 'Why Most Description',
              parentId: POINT_ID,
              userId: USER_ID,
            },
          },
        },
        // the first user won't get an opportunity to rank yet
        postRankByParentId: {},
        groupIdsLists: groupings,
        jsformData: {
          moreDetails: { age: 25, location: 'NY' },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER_ID } }

    // Call batch-upsert
    await batchUpsertDeliberationData.call(context, batchData, cb)

    // Verify callback was called with success
    // Note: first user has no statements to rank yet, so ranks: 0
    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1,
      whys: 1,
      ranks: 0,
    })

    // Verify data was inserted into database
    const point = await Points.findOne({ _id: new ObjectId(POINT_ID) })
    expect(point).toBeTruthy()
    expect(point.subject).toBe('First User Answer')
    expect(point.userId).toBe(USER_ID)

    const why = await Points.findOne({ _id: new ObjectId(WHY_ID) })
    expect(why).toBeTruthy()
    expect(why.subject).toBe('Why Most')
    expect(why.category).toBe('most')
    expect(why.parentId.toString()).toBe(POINT_ID)

    // First user has no statements to rank yet, so no rank document should exist
    const rankCount = await Ranks.countDocuments({ userId: USER_ID })
    expect(rankCount).toBe(0)

    const jsform = await Jsforms.findOne({ parentId: DISCUSSION_ID, userId: USER_ID })
    expect(jsform).toBeTruthy()
    expect(jsform.moreDetails).toEqual({ age: 25, location: 'NY' })

    // Verify email was associated with user
    const user = await User.findOne({ _id: new User.ObjectId(USER_ID) })
    expect(user).toBeTruthy()
    expect(user.email).toBe('firstuser@example.com')

    // Verify dturn methods were called correctly
    expect(dturn.getDiscussionStatus).toHaveBeenCalledWith(DISCUSSION_ID, USER_ID)
    expect(dturn.insertStatementId).toHaveBeenCalledWith(DISCUSSION_ID, USER_ID, POINT_ID)
    // finishRound should NOT be called for early users (undefined/empty idRanks)
    expect(dturn.finishRound).not.toHaveBeenCalled()
  })

  test('handles re-submission when user returns to complete ranking/grouping', async () => {
    const USER_ID_OBJ = new User.ObjectId()
    const USER_ID = USER_ID_OBJ.toString()
    const DISCUSSION_ID = new ObjectId().toString()
    const POINT_ID = new ObjectId().toString()
    const WHY_ID = new ObjectId().toString()
    const RANK_ID = new ObjectId().toString()
    const STATEMENT2_ID = new ObjectId().toString()

    // Create the user with email already set (from first submission)
    await User.insertOne({ _id: USER_ID_OBJ, email: 'returnuser@example.com' })

    // First submission - early user with no ranks (already in DB)
    await Points.insertOne({
      _id: new ObjectId(POINT_ID),
      subject: 'First User Answer',
      description: 'First User Answer Description',
      parentId: DISCUSSION_ID,
      userId: USER_ID,
    })

    await Points.insertOne({
      _id: new ObjectId(WHY_ID),
      subject: 'Why Most',
      description: 'Why Most Description',
      parentId: POINT_ID,
      userId: USER_ID,
      category: 'most',
    })

    // Mock insertStatementId to return success (statement already there, idempotent)
    dturn.insertStatementId.mockResolvedValue(POINT_ID)

    // Now user returns with ranking/grouping data
    const idRanks = [{ [STATEMENT2_ID]: 1 }]
    const groupings = [[STATEMENT2_ID, POINT_ID]]

    const batchData = {
      discussionId: DISCUSSION_ID,
      round: 0,
      email: 'returnuser@example.com', // Same email
      data: {
        idRanks,
        myPointById: {
          // Same point as before (already in DB)
          [POINT_ID]: {
            _id: POINT_ID,
            subject: 'First User Answer',
            description: 'First User Answer Description',
            parentId: DISCUSSION_ID,
            userId: USER_ID,
          },
        },
        myWhyByCategoryByParentId: {
          // Same why as before (already in DB)
          most: {
            [POINT_ID]: {
              _id: WHY_ID,
              subject: 'Why Most',
              description: 'Why Most Description',
              parentId: POINT_ID,
              userId: USER_ID,
            },
          },
        },
        // Now has ranks!
        postRankByParentId: {
          [STATEMENT2_ID]: {
            _id: RANK_ID,
            stage: 'post',
            category: 'most',
            parentId: STATEMENT2_ID,
            userId: USER_ID,
            discussionId: DISCUSSION_ID,
            round: 0,
          },
        },
        groupIdsLists: groupings,
        jsformData: {
          moreDetails: { age: 25, location: 'NY' },
        },
      },
    }

    const cb = jest.fn()
    const context = { synuser: { id: USER_ID } }

    // Call batch-upsert (second time for this user)
    await batchUpsertDeliberationData.call(context, batchData, cb)

    // Verify callback was called with success
    expect(cb).toHaveBeenCalledWith({
      success: true,
      points: 1, // Same point upserted again (no duplicate)
      whys: 1, // Same why upserted again (no duplicate)
      ranks: 1, // New rank added
    })

    // Verify point still exists (only one, not duplicated)
    const pointCount = await Points.countDocuments({ _id: new ObjectId(POINT_ID) })
    expect(pointCount).toBe(1)

    // Verify why still exists (only one, not duplicated)
    const whyCount = await Points.countDocuments({ _id: new ObjectId(WHY_ID) })
    expect(whyCount).toBe(1)

    // Verify rank was added
    const rank = await Ranks.findOne({ _id: new ObjectId(RANK_ID) })
    expect(rank).toBeTruthy()
    expect(rank.stage).toBe('post')

    // Verify dturn methods were called correctly
    expect(dturn.insertStatementId).toHaveBeenCalledWith(DISCUSSION_ID, USER_ID, POINT_ID)
    expect(dturn.finishRound).toHaveBeenCalledWith(DISCUSSION_ID, 0, USER_ID, idRanks, groupings)
  })
})
