// https://github.com/EnCiv/civil-pursuit/issues/154
const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion, Discussions } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'
const OPTIONS = {
  group_size: 10,
  gmajority: 0.5,
  max_rounds: 10,
  min_shown_count: 6,
  min_rank: 3,
  updateUInfo: () => {},
  getAllUInfo: async () => [],
}

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Initialize Discussion', () => {
  test('Can initialize an empty discussion', async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const discussion = Discussions[DISCUSSION_ID]
    expect(discussion).toBeDefined()
    expect(discussion.ShownStatements).toEqual([])
    expect(discussion.ShownGroups).toEqual([])
    expect(discussion.Gitems).toEqual([])
    expect(discussion.Uitems).toEqual({})
  })
})
