import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'

if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder

global.startMongoTestServer = async () => {
  const memoryServer = await MongoMemoryServer.create()
  await Mongo.connect(memoryServer.getUri())
  return memoryServer
}

global.stopMongoTestServer = async memoryServer => {
  await Mongo.disconnect()
  await memoryServer?.stop()
}

global.clearMongoCollections = async collections => {
  await Promise.all(collections.map(collection => collection.deleteMany({})))
}