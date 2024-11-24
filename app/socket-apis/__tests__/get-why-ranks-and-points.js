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
test('Case where there are 5 why-points for each mostId and leastId', async () => {
  const cb = jest.fn()

  const whys = []
  mostIds.concat(leastIds).forEach((parentId, index) => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`, // Unique title
        description: `Description ${i}`,
      })
    }
  })

  console.log('Inserting whys:', whys)
  await Points.insertMany(whys)

  const insertedWhys = await Points.find({}).toArray()
  console.log('Inserted whys:', insertedWhys)
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: [] })
})

// Test 4: 5 rankings for each mostId and leastId
test('Case where there are 5 rankings for each mostId and leastId', async () => {
  const cb = jest.fn()

  const ranks = []
  mostIds.concat(leastIds).forEach((parentId, index) => {
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

  const whys = []
  mostIds.concat(leastIds).forEach((parentId, index) => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`, // Unique title
        description: `Description ${i}`,
      })
    }
  })

  await Points.insertMany(whys)

  await Ranks.insertMany(ranks)

  const insertedRanks = await Ranks.find({}).toArray()
  console.log('Inserted ranks:', insertedRanks)
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks, whys })
})

// Test 5: Rankings for one mostId but not the other or leastId
test('Case where there are 5 rankings for one mostId but not the other or leastId', async () => {
  const cb = jest.fn()

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

  const whys = []
  mostIds.concat(leastIds).forEach((parentId, index) => {
    for (let i = 0; i < 5; i++) {
      whys.push({
        _id: new ObjectId(),
        parentId: parentId.toString(),
        userId,
        round,
        title: `Why ${parentId}-${i}`, // Unique title
        description: `Description ${i}`,
      })
    }
  })

  await Points.insertMany(whys)
  await Ranks.insertMany(ranks)

  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks, whys })
})
