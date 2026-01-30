import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import upsertWhy from '../upsert-why'

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

describe('Point property validation', () => {
  test('_id validation passes for valid _id', async () => {
    const invalidPoint = {
      _id: 'invalid',
      title: 'valid',
      description: 'valid',
    }

    const user = { id: USER1 }
    const cb = jest.fn()

    try {
      await upsertWhy.call({ synuser: user }, invalidPoint, cb) // test api
    } catch (error) {
      expect(error.message).toBe('Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer')
    }
  })

  test('_id validation passes for valid _id', async () => {
    const validPoint = {
      _id: POINT1.toHexString(),
      title: 'valid',
      description: 'valid',
    }

    const user = { id: USER1 }
    const cb = jest.fn()

    try {
      await upsertWhy.call({ synuser: user }, validPoint, cb) // test api
      expect(cb).toHaveBeenCalledTimes(1)
    } catch (error) {
      console.error(error)
      expect(error).toBeUndefined()
    }
  })
})
