const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Initialize Discussion', () => {
  test('Can initialize an empty discussion', async () => {
    await initDiscussion(DISCUSSION_ID)
    const discussion = require('../dturn').Discussions[DISCUSSION_ID]
    expect(discussion).toBeDefined()
    expect(discussion.ShownStatements).toEqual([])
    expect(discussion.ShownGroups).toEqual([])
    expect(discussion.Gitems).toEqual([])
    expect(discussion.Uitems).toEqual({})
  })
})
