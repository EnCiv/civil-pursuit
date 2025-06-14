// https://github.com/EnCiv/civil-pursuit/issues/171

const { initDiscussion, getConclusionIds, insertStatementId, getStatementIds, rankMostImportant, putGroupings, Discussions } = require('../dturn')
import { proxyUser, proxyUserReturn } from '../test'

import { Mongo } from '@enciv/mongo-collections'
import { expect } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Config
const USER_ID = 110
const DISCUSSION_ID = 1
const DISCUSSION_ID2 = 10
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
    group_size: 5,
    gmajority: 0.9,
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

  // insert statements
  for (let i = 0; i < 4; i++) {
    props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
  }
  for await (const args of props) {
    await insertStatementId(...args)
  }

  const conclusions = await getConclusionIds(DISCUSSION_ID)
  expect(conclusions).toBeUndefined()
})

test('Return conclusion if discussion is complete.', async () => {
  initDiscussion(DISCUSSION_ID2, {
    group_size: 5,
    gmajority: 0.5,
    max_rounds: 10,
    min_shown_count: 1,
    min_rank: 1,
    updateUInfo: () => {},
    getAllUInfo: async () => [],
  })

  const UserIds = []

  for (let i = 0; i < 5; i++) {
    process.stdout.write('new user ' + i + '\r')
    await proxyUser(DISCUSSION_ID2)

    //checkUInfo(DISCUSSION_ID) // only for debug
  }
  process.stdout.write('\n')
  let i = 0
  for (const userId of UserIds) {
    process.stdout.write('returning user ' + i++ + '\r')
    await proxyUserReturn(userId, 0, DISCUSSION_ID2)
    //checkUInfo(DISCUSSION_ID) // only for debug
  }
  if (Discussions[DISCUSSION_ID2].ShownStatements.at(-1).length > Discussions[DISCUSSION_ID2].group_size) {
    console.info('before last round', Discussions[DISCUSSION_ID2].ShownStatements.length - 1, 'has', Discussions[DISCUSSION_ID2].ShownStatements.at(-1).length)
    // need one last round
    i = 0
    const final = Discussions[DISCUSSION_ID2].ShownStatements.length - 1
    process.stdout.write(`\nLastRound: ${final}\n`)
    for (const userId of UserIds) {
      process.stdout.write('returning user ' + i++ + '\r')
      await proxyUserReturn(userId, final)
    }
  }
  console.info('after last round', Discussions[DISCUSSION_ID2].ShownStatements.length - 1, 'has', Discussions[DISCUSSION_ID2].ShownStatements.at(-1).length)

  const conclusions = await getConclusionIds(DISCUSSION_ID2)
  expect(conclusions).toBeDefined()
})
