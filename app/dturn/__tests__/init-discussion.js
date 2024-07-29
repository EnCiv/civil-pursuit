const { initDiscussion, Discussions } = require('../dturn')

describe('initDiscussion', () => {
  test('Can initialize an empty discussion', async () => {
    await initDiscussion('testDiscussion')
    expect(Discussions['testDiscussion']).toBeDefined()
    expect(Discussions['testDiscussion'].ShownStatements).toEqual([])
  })
})
