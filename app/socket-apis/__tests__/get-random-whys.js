// https://github.com/EnCiv/civil-pursuit/issues/135

import getRandomWhys from '../get-random-whys'
import Points from '../../models/points'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'

const USER1 = '6667d5a33da5d19ddc304a6b'
const POINT1 = new ObjectId('6667d688b20d8e339ca50020')
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

test('Fail if user is not logged in', async () => {
  const cb = jest.fn()

  await getRandomWhys.call({}, POINT1.toString(), 'most', 5, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test("Fail if parameters missing or don't match", async () => {
  const user = { id: USER1 }
  const cb = jest.fn()

  await getRandomWhys.call({ synuser: user }, null, 'most', 5, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), null, 5, cb)
  expect(cb).toHaveBeenCalledTimes(2)
  expect(cb).toHaveBeenCalledWith(undefined)

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', null, cb)
  expect(cb).toHaveBeenCalledTimes(3)
  expect(cb).toHaveBeenCalledWith(undefined)

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', 'five', cb)
  expect(cb).toHaveBeenCalledTimes(4)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Case where there are 0 matching whys', async () => {
  const user = { id: USER1 }
  const cb = jest.fn()

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'least', 5, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result).toEqual([])
})

test('Case where there are 5 matching whys and qty is 5', async () => {
  const whys = [
    {
      _id: new ObjectId(),
      subject: 'Why 1',
      description: 'Description 1',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why 2',
      description: 'Description 2',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why 3',
      description: 'Description 3',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why 4',
      description: 'Description 4',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why 5',
      description: 'Description 5',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
  ]
  await Points.insertMany(whys)

  const user = { id: USER1 }
  const cb = jest.fn()

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', 5, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result.length).toBe(5)
  result.forEach(why => {
    expect(why).not.toHaveProperty('userId')
    expect(why.parentId).toBe(POINT1.toString())
    expect(why.category).toBe('most')
  })
})

test('Case where there are 10 matching whys and qty is 5', async () => {
  const whys = [
    {
      _id: new ObjectId(),
      subject: 'Why1',
      description: 'Description 1',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why2',
      description: 'Description 2',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why3',
      description: 'Description 3',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why4',
      description: 'Description 4',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why5',
      description: 'Description 5',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why6',
      description: 'Description 6',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why7',
      description: 'Description 7',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why8',
      description: 'Description 8',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why9',
      description: 'Description 9',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why10',
      description: 'Description 10',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
  ]
  await Mongo.db.collection('points').insertMany(whys)

  const user = { id: USER1 }
  const cb = jest.fn()

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', 5, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const result = cb.mock.calls[0][0]
  expect(result.length).toBe(5)
  result.forEach(why => {
    expect(why).not.toHaveProperty('userId')
    expect(why.parentId.toString()).toBe(POINT1.toString())
    expect(why.category).toBe('most')
  })
})

test('Case where the results are randomized', async () => {
  const whys = [
    {
      _id: new ObjectId(),
      subject: 'Why_1',
      description: 'Description 1',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why_2',
      description: 'Description 2',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why_3',
      description: 'Description 3',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why_4',
      description: 'Description 4',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
    {
      _id: new ObjectId(),
      subject: 'Why_5',
      description: 'Description 5',
      round: 1,
      parentId: POINT1.toString(),
      userId: USER1,
      category: 'most',
    },
  ]

  await Points.insertMany(whys)

  const user = { id: USER1 }
  const cb1 = jest.fn()
  const cb2 = jest.fn()

  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', 5, cb1)
  await getRandomWhys.call({ synuser: user }, POINT1.toString(), 'most', 5, cb2)

  expect(cb1).toHaveBeenCalledTimes(1)
  expect(cb2).toHaveBeenCalledTimes(1)

  const result1 = cb1.mock.calls[0][0]
  const result2 = cb2.mock.calls[0][0]

  // Ensure that both results have the same length
  expect(result1.length).toBe(5)
  expect(result2.length).toBe(5)

  // Ensure the results are not the same, checking order specifically
  const areResultsDifferent = result1.some((item, index) => item._id !== result2[index]._id)
  expect(areResultsDifferent).toBe(true)
})
