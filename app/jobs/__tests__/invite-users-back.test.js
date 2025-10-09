// https://github.com/EnCiv/civil-pursuit/issues/362

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { Iota, User, SibGetTemplateId, SibSendTransacEmail } from 'civil-server'
import { initDiscussion, insertStatementId, getUsersToInviteBack, getStatementIds } from '../../dturn/dturn'
import InviteLog from '../../models/invite-log'
import inviteUsersBackJob from '../invite-users-back'

let MemoryServer

// Mock SibGetTemplateId and SibSendTransacEmail
jest.mock('civil-server', () => ({
  ...jest.requireActual('civil-server'),
  SibGetTemplateId: jest.fn(),
  SibSendTransacEmail: jest.fn(),
}))

// Mock global logger
global.logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

beforeAll(async () => {
  // Set Jest environment for dturn so things are not randomized
  process.env.JEST_TEST_ENV = 'true'

  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

beforeEach(async () => {
  // Clear collections
  await Iota.deleteMany({})
  await User.deleteMany({})
  await InviteLog.deleteMany({})

  // Reset mocks completely
  jest.clearAllMocks()
  SibGetTemplateId.mockResolvedValue(123)
  SibSendTransacEmail.mockResolvedValue({ success: true })

  // Set up environment
  process.env.HOSTNAME = 'example.com'

  // Clear logger calls
  logger.info.mockClear()
  logger.warn.mockClear()
  logger.error.mockClear()
})

afterEach(() => {
  delete process.env.HOSTNAME
})

describe('invite-users-back job', () => {
  test('should send invite emails to users who need to be invited back', async () => {
    // Create test data - need enough users to meet dturn requirements
    const discussionId = new ObjectId()
    const userIds = []
    for (let i = 0; i < 10; i++) {
      userIds.push(new ObjectId())
    }

    // Create users with _id as both ObjectId and the string version that dturn returns
    for (let i = 0; i < userIds.length; i++) {
      await User.insertOne({
        _id: userIds[i],
        email: `user${i}@example.com`,
        firstName: `User${i}`,
      })
    }

    // Create discussion
    await Iota.insertOne({
      _id: discussionId,
      subject: 'Test Discussion',
      path: 'test-path',
      webComponent: {
        webComponent: 'CivilPursuit',
        finished: false,
      },
    })

    // Initialize discussion in dturn
    await initDiscussion(discussionId.toString(), {
      updateUInfo: () => {},
      getAllUInfo: () => [],
      group_size: 5,
      finalRound: 3,
    })

    // Add statements from all users (dturn expects string IDs)
    for (let i = 0; i < userIds.length; i++) {
      const statementId = new ObjectId()
      await insertStatementId(discussionId.toString(), userIds[i].toString(), statementId.toString())
    }

    // Have some users get statements but not finish the round (this creates the condition for invites)
    // Only some users should get statements to create a mixed scenario
    for (let i = 0; i < 5; i++) {
      try {
        await getStatementIds(discussionId.toString(), 0, userIds[i].toString())
      } catch (e) {
        // Some may fail due to dturn logic, that's ok
      }
    }

    // Run the job
    const result = await inviteUsersBackJob()

    // Verify emails were sent
    expect(result.invitesSent).toBeGreaterThan(0)
    expect(SibGetTemplateId).toHaveBeenCalledWith('invite-next-round')
    expect(SibSendTransacEmail).toHaveBeenCalled()

    // Verify invite was logged
    const inviteLog = await InviteLog.findOne({ discussionId: discussionId.toString() })
    expect(inviteLog).toBeTruthy()
    expect(inviteLog.round).toBe(0)
  })

  test('should respect throttling limits', async () => {
    const discussionId = new ObjectId()
    const userIds = []
    for (let i = 0; i < 10; i++) {
      userIds.push(new ObjectId())
    }

    // Create users
    for (let i = 0; i < userIds.length; i++) {
      await User.insertOne({
        _id: userIds[i],
        email: `user${i}@example.com`,
        firstName: `User${i}`,
      })
    }

    await Iota.insertOne({
      _id: discussionId,
      subject: 'Test Discussion',
      webComponent: {
        webComponent: 'CivilPursuit',
        finished: false,
      },
    })

    // Initialize discussion
    await initDiscussion(discussionId.toString(), {
      updateUInfo: () => {},
      getAllUInfo: () => [],
      group_size: 5,
    })

    // Add statements and make users eligible
    for (let i = 0; i < userIds.length; i++) {
      const statementId = new ObjectId()
      await insertStatementId(discussionId.toString(), userIds[i].toString(), statementId.toString())
    }

    // Try to get statements for some users
    for (let i = 0; i < 5; i++) {
      try {
        await getStatementIds(discussionId.toString(), 0, userIds[i].toString())
      } catch (e) {
        // Some may fail, that's ok
      }
    }

    // Create a recent invite for the first user
    await InviteLog.insertOne({
      userId: userIds[0].toString(),
      discussionId: discussionId.toString(),
      round: 0,
      sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    })

    // Run the job
    await inviteUsersBackJob()

    // Should not send email to first user due to throttling, but may send to others
    // The specific behavior depends on dturn logic
    expect(SibSendTransacEmail).not.toHaveBeenCalledWith('user0@example.com', expect.anything(), expect.anything())
  })

  test('should handle missing user gracefully', async () => {
    const discussionId = new ObjectId()
    const userIds = []
    for (let i = 0; i < 10; i++) {
      userIds.push(new ObjectId())
    }

    // Create only some users (others will be missing)
    for (let i = 0; i < 8; i++) {
      // Only create 8 out of 10
      await User.insertOne({
        _id: userIds[i],
        email: `existing${i}@example.com`,
        firstName: `Existing${i}`,
      })
    }

    // Create discussion
    await Iota.insertOne({
      _id: discussionId,
      subject: 'Test Discussion',
      webComponent: {
        webComponent: 'CivilPursuit',
        finished: false,
      },
    })

    // Initialize discussion
    await initDiscussion(discussionId.toString(), {
      updateUInfo: () => {},
      getAllUInfo: () => [],
      group_size: 5,
    })

    // Add statements for all users (including missing ones)
    for (let i = 0; i < userIds.length; i++) {
      const statementId = new ObjectId()
      await insertStatementId(discussionId.toString(), userIds[i].toString(), statementId.toString())
    }

    // Try to get statements for some users
    for (let i = 0; i < 5; i++) {
      try {
        await getStatementIds(discussionId.toString(), 0, userIds[i].toString())
      } catch (e) {
        // Some may fail, that's ok
      }
    }

    // Run the job
    await inviteUsersBackJob()

    // Should handle missing user gracefully and log warning
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('not found or has no email'))
  })

  test('should skip finished discussions', async () => {
    const discussionId = new ObjectId()

    // Create finished discussion
    await Iota.insertOne({
      _id: discussionId,
      subject: 'Finished Discussion',
      webComponent: {
        webComponent: 'CivilPursuit',
        finished: true,
      },
    })

    // Run the job
    await inviteUsersBackJob()

    // Should not process finished discussions
    expect(SibSendTransacEmail).not.toHaveBeenCalled()
  })

  test('should handle email sending errors gracefully', async () => {
    const discussionId = new ObjectId()
    const userIds = []
    for (let i = 0; i < 10; i++) {
      userIds.push(new ObjectId())
    }

    // Create users
    for (let i = 0; i < userIds.length; i++) {
      await User.insertOne({
        _id: userIds[i],
        email: `user${i}@example.com`,
        firstName: `User${i}`,
      })
    }

    await Iota.insertOne({
      _id: discussionId,
      subject: 'Test Discussion',
      webComponent: {
        webComponent: 'CivilPursuit',
        finished: false,
      },
    })

    // Initialize discussion
    await initDiscussion(discussionId.toString(), {
      updateUInfo: () => {},
      getAllUInfo: () => [],
      group_size: 5,
    })

    // Add statements and make users eligible
    for (let i = 0; i < userIds.length; i++) {
      const statementId = new ObjectId()
      await insertStatementId(discussionId.toString(), userIds[i].toString(), statementId.toString())
    }

    // Try to get statements for some users
    for (let i = 0; i < 5; i++) {
      try {
        await getStatementIds(discussionId.toString(), 0, userIds[i].toString())
      } catch (e) {
        // Some may fail, that's ok
      }
    }

    // Mock email sending to fail
    SibSendTransacEmail.mockRejectedValue(new Error('Email service error'))

    // Run the job - should not throw
    await expect(inviteUsersBackJob()).resolves.not.toThrow()

    // Should log error
    expect(logger.error).toHaveBeenCalledWith('Failed to send invite email via SibSendTransacEmail:', expect.any(Error))

    // Should not log invite since email failed
    const inviteLog = await InviteLog.findOne({ discussionId: discussionId.toString() })
    expect(inviteLog).toBeFalsy()
  })
})
