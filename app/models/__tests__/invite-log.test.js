const { Mongo } = require('@enciv/mongo-collections')
const InviteLog = require('../invite-log')

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
})

beforeEach(async () => {
  // clear the collection between tests
  await InviteLog.deleteMany({})
})

afterAll(async () => {
  await Mongo.disconnect()
})

describe('InviteLog model', () => {
  it('should have the correct collection name', () => {
    expect(InviteLog.collectionName).toEqual('invite_logs')
  })

  it('should insert a valid document', async () => {
    const res = await InviteLog.insertOne({ userId: 'u1', discussionId: 'd1', round: 1, sentAt: new Date() })
    expect(res.acknowledged).toBe(true)
  })

  it('should count invites for a user', async () => {
    await InviteLog.insertOne({ userId: 'u2', discussionId: 'd2', round: 0, sentAt: new Date() })
    const cnt = await InviteLog.countInvitesForUser({ userId: 'u2', discussionId: 'd2' })
    expect(cnt).toBeGreaterThanOrEqual(1)
  })

  it('should find the last invite', async () => {
    const older = new Date(Date.now() - 1000 * 60 * 60)
    const newer = new Date()
    await InviteLog.insertOne({ userId: 'u3', discussionId: 'd3', round: 0, sentAt: older })
    await InviteLog.insertOne({ userId: 'u3', discussionId: 'd3', round: 1, sentAt: newer })
    const last = await InviteLog.findLastInvite({ userId: 'u3', discussionId: 'd3' })
    expect(last).toBeDefined()
    expect(new Date(last.sentAt).getTime()).toBeGreaterThanOrEqual(newer.getTime() - 1)
  })
})
