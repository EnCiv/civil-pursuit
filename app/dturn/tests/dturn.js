// https://github.com/EnCiv/civil-pursuit/issues/171

const { initDiscussion, getConclusionIds, insertStatementId, getStatementIds, rankMostImportant, putGroupings, Discussions } = require('../dturn')

import { Mongo } from '@enciv/mongo-collections'
import { expect } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Config
const USER_ID = 110
const DISCUSSION_ID = 1
const nonexistentOptionErrorRegex = /'a_nonexistent_option' is not an option for initDiscussion()/

let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Fail if discussion not initialized.', async () => {
  const func = async () => {
    await getConclusionIds(DISCUSSION_ID)
  }
  expect(func()).rejects.toThrow(/not initialized/)
})

test('Succeed if all arguments are valid.', async () => {
  initDiscussion(DISCUSSION_ID, {
    group_size: 10,
    gmajority: 0.5,
    max_rounds: 10,
    min_shown_count: 6,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => [],
  })
})

test('Fail if all options are not valid.', async () => {
  const func = async () => {
    await initDiscussion(DISCUSSION_ID, { a_nonexistent_option: 12345 })
  }
  expect(func()).rejects.toThrow(nonexistentOptionErrorRegex)
})

test('Fail if at least 1 option is not valid.', async () => {
  const func = async () => {
    await initDiscussion(DISCUSSION_ID, { group_size: 10, a_nonexistent_option: 12345 })
  }
  expect(func()).rejects.toThrow(nonexistentOptionErrorRegex)
})

test('Undefined if discussion not complete.', async () => {
  const props = []

  // insert 20 statements
  for (let i = 0; i < 20; i++) {
    props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
  }
  for await (const args of props) {
    await insertStatementId(...args)
  }

  const conclusions = await getConclusionIds(DISCUSSION_ID)
  expect(conclusions).toBeUndefined()
})

test('Return conclusion if discussion is complete.', async () => {
  const props = []

  // insert 20 statements
  for (let count = 0; count < 20; count++) {
    props.push([DISCUSSION_ID, `user${count}`, `statement${count}`])
  }
  for await (const args of props) {
    await insertStatementId(...args)
  }

  // Complete round
  for (let count = 0; count < 20; count++) {
    const statements = await getStatementIds(DISCUSSION_ID, 0, `user${count}`)
    await putGroupings(DISCUSSION_ID, 0, `user${count}`, [])
    statements && (await rankMostImportant(DISCUSSION_ID, 0, `user${count}`, statements[0], 1))
    statements = await getStatementIds(DISCUSSION_ID, 0, `user${count}`)
  }

  console.log(Discussions[DISCUSSION_ID].ShownStatements.at(-1))

  const conclusions = await getConclusionIds(DISCUSSION_ID)
  expect(conclusions).toBeDefined()
})
