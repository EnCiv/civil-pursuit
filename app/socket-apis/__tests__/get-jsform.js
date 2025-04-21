// https://github.com/EnCiv/civil-pursuit/issues/304

import getJsForm from '../get-jsform'
import upsertJsform from '../upsert-jsform'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const parentId1 = new ObjectId('67f973a8cc0b14c4529a72d7')
const userId1 = new ObjectId('67f973aacc0b44c4529a72d1')
const user = { id: userId1 }

const testFormObj = {
  objectExample: {
    fieldOne: 'dfgsdfg',
    fieldTwo: 'sdfgdsdfg',
    fieldThree: '13123123',
    fieldFour: '34tw456w456',
  },
  stringExample: 'sfdsdfg',
  integerExample: '00000',
  numberExample: '00000',
  checkboxExample: true,
  selectionExample: 'option 1',
  dateExample: '2025-04-10',
}

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

test('Retrieval fails is not logged in.', async () => {
  const cb = jest.fn()

  await getJsForm.call({}, parentId1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith()
})

test('Retrieval fails if parentId not provided.', async () => {
  const cb = jest.fn()

  await getJsForm.call({ synuser: user }, undefined, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith()
})

test('Return empty obj when nothing found.', async () => {
  const cb = jest.fn()

  await getJsForm.call({ synuser: user }, 'doesntExist', cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({})
})

test('Return obj when matching form found.', async () => {
  const cb = jest.fn()

  await upsertJsform.call({ synuser: user }, parentId1, 'testForm1', testFormObj)

  await getJsForm.call({ synuser: user }, parentId1, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb.mock.calls[0][0]).toMatchObject({
    _id: expect.any(ObjectId),
    parentId: new ObjectId('67f973a8cc0b14c4529a72d7'),
    testForm1: {
      checkboxExample: true,
      dateExample: '2025-04-10',
      integerExample: '00000',
      numberExample: '00000',
      objectExample: {
        fieldFour: '34tw456w456',
        fieldOne: 'dfgsdfg',
        fieldThree: '13123123',
        fieldTwo: 'sdfgdsdfg',
      },
      selectionExample: 'option 1',
      stringExample: 'sfdsdfg',
    },
    userId: new ObjectId('67f973aacc0b44c4529a72d1'),
  })
})
