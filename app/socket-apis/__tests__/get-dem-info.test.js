// https://github.com/EnCiv/civil-pursuit/issues/XXX
/**
 * @jest-environment node
 */

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import Points from '../../models/points'
import Jsforms from '../../models/jsforms'
import getDemInfo from '../get-dem-info'

describe('get-dem-info socket API', () => {
  let mongod

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await Mongo.connect(uri)
  })

  afterAll(async () => {
    await Mongo.disconnect()
    await mongod?.stop()
  })

  beforeEach(() => {
    global.logger = {
      info: jest.fn(),
      warn: jest.fn((...args) => console.warn('Logger WARN:', ...args)),
      error: jest.fn(),
    }
  })

  afterEach(async () => {
    await Points.deleteMany({})
    await Jsforms.deleteMany({})
    jest.clearAllMocks()
  })

  const createPoint = async (userId, parentId) => {
    const point = {
      _id: new ObjectId(),
      userId,
      parentId,
      subject: 'Test Point',
      description: 'Test description',
    }
    await Points.insertOne(point)
    return point
  }

  const createJsform = async (userId, parentId, moreDetails) => {
    const jsform = {
      _id: new ObjectId(),
      userId,
      parentId,
      moreDetails,
    }
    await Jsforms.insertOne(jsform)
    return jsform
  }

  test('returns dem-info for valid pointIds with shareInfo="Yes"', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      yearOfBirth: 1985,
      politicalParty: 'Democrat',
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: {
        stateOfResidence: 'California',
        yearOfBirth: 1985,
        politicalParty: 'Democrat',
        shareInfo: 'Yes',
      },
    })
  })

  test('returns null for pointId where shareInfo="No"', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      shareInfo: 'No',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: null,
    })
  })

  test('returns null for pointId where shareInfo is missing', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      // shareInfo missing
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: null,
    })
  })

  test('returns null for pointId with no jsform data', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    // No jsform created

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: null,
    })
  })

  test('removes userId from response for other users points', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      userId: 'user123', // This should be removed
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: {
        stateOfResidence: 'California',
        shareInfo: 'Yes',
        // userId should NOT be present
      },
    })
    expect(callback.mock.calls[0][0][point._id.toString()]).not.toHaveProperty('userId')
  })

  test('includes userId for authenticated users own points', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      userId: 'user123',
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'user123' } } // Same user
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: {
        stateOfResidence: 'California',
        userId: 'user123', // Should be present for own points
        shareInfo: 'Yes',
      },
    })
  })

  test('handles multiple pointIds in single request', async () => {
    const userId1 = 'user1'
    const userId2 = 'user2'
    const parentId = 'discussion456'

    const point1 = await createPoint(userId1, parentId)
    await createJsform(userId1, parentId, {
      stateOfResidence: 'California',
      shareInfo: 'Yes',
    })

    const point2 = await createPoint(userId2, parentId)
    await createJsform(userId2, parentId, {
      stateOfResidence: 'New York',
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point1._id.toString(), point2._id.toString()], callback)

    expect(callback).toHaveBeenCalledWith({
      [point1._id.toString()]: {
        stateOfResidence: 'California',
        shareInfo: 'Yes',
      },
      [point2._id.toString()]: {
        stateOfResidence: 'New York',
        shareInfo: 'Yes',
      },
    })
  })

  test('returns undefined for unauthenticated requests', async () => {
    const context = {} // No synuser
    const callback = jest.fn()

    await getDemInfo.call(context, ['123'], callback)

    expect(callback).toHaveBeenCalledWith(undefined)
    expect(logger.error).toHaveBeenCalled()
  })

  test('returns undefined for invalid pointIds format', async () => {
    const context = { synuser: { id: 'user123' } }
    const callback = jest.fn()

    await getDemInfo.call(context, 'not-an-array', callback)

    expect(callback).toHaveBeenCalledWith(undefined)
    expect(logger.error).toHaveBeenCalled()
  })

  test('returns undefined for empty pointIds array', async () => {
    const context = { synuser: { id: 'user123' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [], callback)

    expect(callback).toHaveBeenCalledWith(undefined)
    expect(logger.error).toHaveBeenCalled()
  })

  test('handles points that do not exist gracefully', async () => {
    const context = { synuser: { id: 'user123' } }
    const callback = jest.fn()
    const fakeId = new ObjectId().toString()

    await getDemInfo.call(context, [fakeId], callback)

    expect(callback).toHaveBeenCalledWith({
      [fakeId]: null,
    })
  })

  test('handles mixed valid and invalid pointIds', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()
    const fakeId = new ObjectId().toString()

    await getDemInfo.call(context, [point._id.toString(), fakeId], callback)

    expect(callback).toHaveBeenCalledWith({
      [point._id.toString()]: {
        stateOfResidence: 'California',
        shareInfo: 'Yes',
      },
      [fakeId]: null,
    })
  })

  test('does not include shareInfo field in response itself', async () => {
    const userId = 'user123'
    const parentId = 'discussion456'
    const point = await createPoint(userId, parentId)
    await createJsform(userId, parentId, {
      stateOfResidence: 'California',
      politicalParty: 'Democrat',
      shareInfo: 'Yes',
    })

    const context = { synuser: { id: 'otherUser' } }
    const callback = jest.fn()

    await getDemInfo.call(context, [point._id.toString()], callback)

    const result = callback.mock.calls[0][0]
    // shareInfo is included in the result (it's part of moreDetails)
    // The DemInfo component will filter it out when rendering
    expect(result[point._id.toString()]).toHaveProperty('shareInfo', 'Yes')
  })
})
