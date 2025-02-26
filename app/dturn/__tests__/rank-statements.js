// https://github.com/EnCiv/civil-pursuit/issues/154
const { initDiscussion, insertStatementId, getStatementIds, putGroupings, getUserRecord, rankMostImportant, Discussions } = require('../dturn')

const DISCUSSION_ID = 'testRankingDiscussion'
const USER_ID = 'user1'
const OPTIONS = {
  group_size: 10,
  gmajority: 0.5,
  max_rounds: 10,
  min_shown_count: 6,
  min_rank: 3,
  updateUInfo: () => {},
  getAllUInfo: async () => [],
}

describe('Test ranking scenarios', () => {
  beforeAll(async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)

    const totalStatements = OPTIONS.group_size * 2 - 1
    const insertPromises = []
    for (let i = 0; i < totalStatements; i++) {
      insertPromises.push(insertStatementId(DISCUSSION_ID, `user${i}`, `statement${i}`))
    }
    await Promise.all(insertPromises)

    console.log(`Checking if ${USER_ID} exists in discussion...`)
    if (!Discussions[DISCUSSION_ID].Uitems[USER_ID]) {
      console.log(`Inserting statement for ${USER_ID} to ensure it joins the discussion`)
      await insertStatementId(DISCUSSION_ID, USER_ID, `statement-${USER_ID}`)
    }
  })

  test('Can rank 2 statements as most important', async () => {
    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)
    expect(statements).toBeDefined()
    expect(statements.length).toBe(10)

    console.log('Retrieved statements:', statements)

    const statement1 = statements[0]
    const statement2 = statements[1]

    await rankMostImportant(DISCUSSION_ID, 0, USER_ID, statement1, 1)
    await rankMostImportant(DISCUSSION_ID, 0, USER_ID, statement2, 1)

    const userRecord = getUserRecord(DISCUSSION_ID, USER_ID)
    console.log('User record after ranking:', JSON.stringify(userRecord, null, 2))

    expect(userRecord[0].shownStatementIds[statement1].rank).toBe(1)
    expect(userRecord[0].shownStatementIds[statement2].rank).toBe(1)
  })
})
