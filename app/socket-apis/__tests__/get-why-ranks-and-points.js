// https://github.com/EnCiv/civil-pursuit/issues/207

import getWhyRanksAndPoints from '../get-why-ranks-and-points'
import Points from '../../models/points'
import Ranks from '../../models/ranks'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { expect } from '@jest/globals'

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
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Cannot retrieve whys - user is not logged in.')
})

// Test 2: No ranks or points found
test('Return empty ranks and points if nothing found', async () => {
  const cb = jest.fn()
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], points: [] })
})

// Test 3: Case where there are two mostIds, and one leastId, no previous rankings and there are 5 why points for each of the mostIds and leastId
test('Case where there are 5 why points for each mostId and leastId', async () => {
  const cb = jest.fn()

  const whys = []
  // Create 5 whys for mostIds[0]
  for (let i = 0; i < 5; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 1,
      parentId: mostIds[0].toString(),
      userId: userId,
    })
  }

  // Create 5 whys for mostIds[1]
  for (let i = 5; i < 10; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 1,
      parentId: mostIds[1].toString(),
      userId: userId,
    })
  }

  // Create 5 whys for leastIds[0]
  for (let i = 10; i < 15; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 1,
      parentId: leastIds[0].toString(),
      userId: userId,
    })
  }

  // These items should not be returned because their parentId is not mostIds[0], mostIds[1], or leastIds[0]
  for (let i = 15; i < 20; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 1,
      parentId: new ObjectId().toString(),
      userId: userId,
    })
  }

  // These These items should not be returned because their userId is not equals to current userId
  for (let i = 20; i < 25; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 1,
      parentId: mostIds[0].toString(),
      userId: new ObjectId().toString(),
    })
  }

  // These items should not be returned because their round is not 1
  for (let i = 25; i < 30; i++) {
    whys.push({
      _id: new ObjectId(),
      title: `Why ${i + 1}`,
      description: `Description ${i + 1}`,
      round: 2,
      parentId: mostIds[0].toString(),
      userId: userId,
    })
  }

  await Points.insertMany(whys)

  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  const expectedRanks = []
  const expectedWhys = whys.slice(0, 15)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(expectedRanks, expectedWhys)
})

// Test 4: there are 5 rankings for each of the mostIds and leastIds
test('Case where there are 5 rankings for each mostId and leastId', async () => {
  const cb = jest.fn()
})

// Test 5: there are rankings for one mostId but not the other and not the leastId
test('Case where there are rankings for one mostId but not the other and not the leastId', async () => {
  const cb = jest.fn()
})
