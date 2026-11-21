// https://github.com/EnCiv/civil-pursuit/issues/136

import getTopRankedWhysForPoint from '../get-top-ranked-whys-for-point'
import Points from '../../models/points'
import Ranks from '../../models/ranks'
import { ObjectId } from 'mongodb'

const USER1 = '6667d5a33da5d19ddc304a6b'
const POINT1 = '6667d688b20d8e339ca50020'
let MemoryServer

beforeAll(async () => {
  MemoryServer = await global.startMongoTestServer()
})

afterAll(async () => {
  await global.stopMongoTestServer(MemoryServer)
})

describe('getTopRankedWhysForPoint', () => {
  beforeEach(async () => {
    await global.clearMongoCollections([Points, Ranks])
  })

  test('user is not logged in', async () => {
    const cb = jest.fn()
    await getTopRankedWhysForPoint.call({}, POINT1, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith(undefined)
  })

  test('missing or invalid parameters', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    await getTopRankedWhysForPoint.call({ synuser: user }, null, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith(undefined)
  })

  test('no whys for the point', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith([])
  })

  test('one why for the point, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const why = {
      _id: new ObjectId(),
      subject: 'Why 1',
      description: 'Description 1',
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }
    await Points.insertOne(why)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Array))
    expect(cb.mock.calls[0][0].length).toBe(1)
  })

  test('five whys for the point, different ranks, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const whys = global.makeTestPoints(5, index => ({
      subject: `Why ${index + 1}`,
      description: `Description ${index + 1}`,
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }))
    await Points.insertMany(whys)

    const ranks = []
    whys.forEach(why => {
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        ranks.push({
          _id: new ObjectId(),
          parentId: why._id.toString(),
          userId: USER1,
          round: why.round,
          stage: 'pre',
          category: why.category,
          discussionId: 'discussion-1',
        })
      }
    })
    await Ranks.insertMany(ranks)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Array))
    expect(cb.mock.calls[0][0].length).toBe(5)
  })

  test('eleven whys for the point, different ranks, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const whys = global.makeTestPoints(11, index => ({
      subject: `Why ${index + 1}`,
      description: `Description ${index + 1}`,
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }))
    await Points.insertMany(whys)

    const ranks = []
    whys.forEach(why => {
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        ranks.push({
          _id: new ObjectId(),
          parentId: why._id.toString(),
          userId: USER1,
          round: why.round,
          stage: 'pre',
          category: why.category,
          discussionId: 'discussion-1',
        })
      }
    })
    await Ranks.insertMany(ranks)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 0, 5, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Array))
    expect(cb.mock.calls[0][0].length).toBe(5)
  })

  test('eleven whys for the point, different ranks, start is 5, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const whys = global.makeTestPoints(11, index => ({
      subject: `Why ${index + 1}`,
      description: `Description ${index + 1}`,
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }))
    await Points.insertMany(whys)

    const ranks = []
    whys.forEach(why => {
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        ranks.push({
          _id: new ObjectId(),
          parentId: why._id.toString(),
          userId: USER1,
          round: why.round,
          stage: 'pre',
          category: why.category,
          discussionId: 'discussion-1',
        })
      }
    })
    await Ranks.insertMany(ranks)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 5, 5, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Array))
    expect(cb.mock.calls[0][0].length).toBe(5)
  })

  test('eleven whys for the point, different ranks, start is 10, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const whys = global.makeTestPoints(11, index => ({
      subject: `Why ${index + 1}`,
      description: `Description ${index + 1}`,
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }))
    await Points.insertMany(whys)

    const ranks = []
    whys.forEach(why => {
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        ranks.push({
          _id: new ObjectId(),
          parentId: why._id.toString(),
          userId: USER1,
          round: why.round,
          stage: 'pre',
          category: why.category,
          discussionId: 'discussion-1',
        })
      }
    })
    await Ranks.insertMany(ranks)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 10, 5, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Array))
    expect(cb.mock.calls[0][0].length).toBe(1) // Only 1 why should be returned
  })

  test('eleven whys for the point, different ranks, start is 15, pageSize is 5', async () => {
    const user = { id: USER1 }
    const cb = jest.fn()
    const whys = global.makeTestPoints(11, index => ({
      subject: `Why ${index + 1}`,
      description: `Description ${index + 1}`,
      round: 1,
      parentId: POINT1,
      userId: USER1,
      category: 'most',
    }))
    await Points.insertMany(whys)

    const ranks = []
    whys.forEach(why => {
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        ranks.push({
          _id: new ObjectId(),
          parentId: why._id.toString(),
          userId: USER1,
          round: why.round,
          stage: 'pre',
          category: why.category,
          discussionId: 'discussion-1',
        })
      }
    })
    await Ranks.insertMany(ranks)
    await getTopRankedWhysForPoint.call({ synuser: user }, POINT1, 'most', 15, 5, cb)
    expect(cb).toHaveBeenCalledWith([]) // No whys should be returned
  })
})
