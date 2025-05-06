// https://github.com/EnCiv/civil-pursuit/issues/304

import upsertJsform from '../upsert-jsform'
import Jsforms from '../../models/jsforms'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const parentId1 = '67f973a8cc0b14c4529a72d7'
const userId1 = '67f973aacc0b44c4529a72d1'
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

const testFormObj2 = {
  objectExample2: {
    fieldOne: 'ipoipoio',
    fieldTwo: 'poipiopi',
    fieldThree: '57685768',
    fieldFour: '7809987',
  },
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

test('Upsert fails is not logged in.', async () => {
  const cb = jest.fn()

  await upsertJsform.call({}, parentId1, 'testForm1', testFormObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith()
})

test('Upserting matches parent and userId', async () => {
  const cb = jest.fn()

  await upsertJsform.call({ synuser: user }, parentId1, 'testForm1', testFormObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)

  let form = await Jsforms.findOne({ parentId: parentId1, userId: userId1 })
  expect(form).toMatchObject({
    _id: /./,
    parentId: parentId1,
    userId: userId1,
    testForm1: {
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
    },
  })
})

test("Upserting edits existing form AND doesn't remove other data.", async () => {
  const cb = jest.fn()

  // New forms
  await upsertJsform.call({ synuser: user }, parentId1, 'testForm1', testFormObj, cb)
  await upsertJsform.call({ synuser: user }, parentId1, 'testForm2', testFormObj2, cb)

  expect(cb).toHaveBeenCalledTimes(2)

  let form = await Jsforms.findOne({ parentId: parentId1, userId: userId1 })
  expect(form).toMatchObject({
    _id: /./,
    parentId: parentId1,
    userId: userId1,
    testForm1: testFormObj,
    testForm2: {
      objectExample2: {
        fieldOne: 'ipoipoio',
        fieldTwo: 'poipiopi',
        fieldThree: '57685768',
        fieldFour: '7809987',
      },
    },
  })

  // Edit existing form
  await upsertJsform.call({ synuser: user }, parentId1, 'testForm2', { ...testFormObj2, stringExample: 'newField' }, cb)

  expect(cb).toHaveBeenCalledTimes(3)

  form = await Jsforms.findOne({ parentId: parentId1, userId: userId1 })

  // Shows new edit while retaining other forms
  expect(form).toMatchObject({
    _id: /./,
    parentId: parentId1,
    userId: userId1,
    testForm1: {
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
    },
    testForm2: {
      objectExample2: {
        fieldOne: 'ipoipoio',
        fieldTwo: 'poipiopi',
        fieldThree: '57685768',
        fieldFour: '7809987',
      },
      stringExample: 'newField',
    },
  })
})
