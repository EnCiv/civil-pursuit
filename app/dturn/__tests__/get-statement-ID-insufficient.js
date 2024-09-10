// https://github.com/EnCiv/civil-pursuit/issues/154
const { initDiscussion, getStatementIds } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'
const USER1 = 'user1'

describe('Get Statements', () => {
  test('Cannot get statements from a discussion that does not have enough statements', async () => {
    await initDiscussion(DISCUSSION_ID)
    const statements = await getStatementIds(DISCUSSION_ID, 0, USER1)
    expect(statements).toBeUndefined()
  })
})
