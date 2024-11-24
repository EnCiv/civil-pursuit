// https://github.com/EnCiv/civil-pursuit/issues/207

import getWhyRanksAndPoints from '../get-why-ranks-and-points'
import Points from '../../models/points'
import Ranks from '../../models/ranks'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { expect, test } from '@jest/globals'

let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  await Points.deleteMany({})
  await Ranks.deleteMany({})
})

afterEach(() => {
  console.error.mockRestore()
})

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'
const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }
const round = 1
const mostIds = [new ObjectId(), new ObjectId()]
const leastIds = [new ObjectId()]

// Test 1: User not logged in
test('Fail if user is not logged in', async () => {
  const cb = jest.fn()
  await getWhyRanksAndPoints.call({}, discussionId, round, mostIds, leastIds, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: [] })
  expect(console.error).toHaveBeenCalledWith('Cannot retrieve whys - user is not logged in.')
})

// Test 2: No ranks or points found
test('Return empty ranks and points if nothing found', async () => {
  const cb = jest.fn()
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: [] })
})

// Test 3: Case where there are 5 why-points for each mostId and leastId
test('Return why-points if they exist for mostIds and leastIds', async () => {
  const cb = jest.fn()

  // Insert 5 why-points for each ID
  const whys = []
  mostIds.concat(leastIds).forEach(parentId => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`,
        description: `Description ${i}`,
      })
    }
  })

  await Points.insertMany(whys)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  const expectedWhys = await Points.find({}).toArray()
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: expectedWhys })
})

// Test 4: Rankings exist for each mostId and leastId
test('Return ranks and points when rankings exist for each ID', async () => {
  const cb = jest.fn()

  // Insert ranks for each mostId and leastId
  const ranks = []
  mostIds.concat(leastIds).forEach(parentId => {
    for (let i = 0; i < 5; i++) {
      ranks.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        round,
        stage: 'why',
        category: 'most',
        discussionId,
        userId,
      })
    }
  })

  // Insert corresponding why-points
  const whys = []
  mostIds.concat(leastIds).forEach(parentId => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`,
        description: `Description ${i}`,
      })
    }
  })

  await Ranks.insertMany(ranks)
  await Points.insertMany(whys)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  const expectedRanks = await Ranks.find({}).toArray()
  const expectedWhys = await Points.find({}).toArray()

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: expectedRanks, whys: expectedWhys })
})

// Test 5: Rankings exist for one ID but not all
test('Handle partial rankings and return appropriate data', async () => {
  const cb = jest.fn()

  // Insert ranks for only one mostId
  const ranks = []
  for (let i = 0; i < 5; i++) {
    ranks.push({
      _id: new ObjectId(),
      parentId: mostIds[0].toString(),
      round,
      rank: i,
      stage: 'why',
      category: 'most',
      discussionId,
      userId,
    })
  }

  // Insert why-points for all IDs
  const whys = []
  mostIds.concat(leastIds).forEach(parentId => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`,
        description: `Description ${i}`,
      })
    }
  })

  await Ranks.insertMany(ranks)
  await Points.insertMany(whys)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  const expectedRanks = await Ranks.find({}).toArray()
  const expectedWhys = await Points.find({}).toArray()

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: expectedRanks, whys: expectedWhys })
})
