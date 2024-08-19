// https://github.com/EnCiv/civil-pursuit/issues/154
const {
  initDiscussion,
  insertStatementId,
  getStatementIds,
  putGroupings,
  getUserRecord,
  Discussions,
} = require('../dturn')

const DISCUSSION_ID = 'testGroupingDiscussion'
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

describe('Test grouping scenarios', () => {
  beforeAll(async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const props = []
    for (let i = 0; i < 20; i++) {
      props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
    }
    for await (const args of props) {
      await insertStatementId(...args)
    }
  })

  test('Can put groupings of 2 statements in one group, and 3 statements in the other', async () => {
    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)

    // Log statements to diagnose if it's undefined
    // console.log('Retrieved statements:', statements)

    // Ensure statements is defined before accessing its length
    expect(statements).toBeDefined()
    expect(statements.length).toBe(10)

    const group1 = statements.slice(0, 2) // Group with 2 statements
    const group2 = statements.slice(2, 5) // Group with 3 statements

    const result = putGroupings(DISCUSSION_ID, 0, USER_ID, [group1, group2])

    expect(result).toBe(true)

    const userRecord = getUserRecord(DISCUSSION_ID, USER_ID)
    expect(userRecord[0].groupings.length).toBe(2)
    expect(userRecord[0].groupings).toEqual([group1, group2])
  })

  afterAll(() => {
    delete Discussions[DISCUSSION_ID] // Clean up the discussion
  })
})
