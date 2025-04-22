// https://github.com/EnCiv/civil-pursuit/issues/305

import getConclusion from '../get-conclusion'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'

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

test('Fail if discussionId not provided', async () => {
  const cb = jest.fn()

  await getConclusion.call({}, undefined, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})
