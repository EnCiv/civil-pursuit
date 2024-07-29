const { initDiscussion, insertStatementId, Discussions } = require('../dturn')

describe('insertStatementId', () => {
  beforeEach(async () => {
    await initDiscussion('testDiscussion')
  })

  test('Can add 1 statement to a discussion', () => {
    const statementId = insertStatementId('testDiscussion', 'user1', 'statement1')
    expect(statementId).toBe('statement1')
    expect(Discussions['testDiscussion'].ShownStatements[0]).toContainEqual(
      expect.objectContaining({ statementId: 'statement1' })
    )
  })
})
