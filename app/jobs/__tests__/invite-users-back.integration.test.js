// Integration test for invite-users-back job that actually sends emails
// https://github.com/EnCiv/civil-pursuit/issues/362

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { Iota, User } from 'civil-server'
import { initDiscussion, insertStatementId, getUsersToInviteBack, getStatementIds } from '../../dturn/dturn'
import InviteLog from '../../models/invite-log'
import inviteUsersBackJob from '../invite-users-back'

let MemoryServer

// No mocking - use real civil-server functions including SibGetTemplateId and SibSendTransacEmail

// Mock global logger following guidelines: info silent, warn/error console for debugging
global.logger = {
  error: jest.fn((...args) => console.error('Logger ERROR:', ...args)),
  info: jest.fn(), // Silent for integration tests to reduce noise
  warn: jest.fn((...args) => console.warn('Logger WARN:', ...args)),
  debug: jest.fn((...args) => console.debug('Logger DEBUG:', ...args)),
}

describe('Invite Users Back Job - Integration Tests (Real Email)', () => {
  beforeAll(async () => {
    process.env.INVITE_USERS_BACK_JOB = 'true'
    console.log = jest.fn()
    MemoryServer = await MongoMemoryServer.create()
    const uri = MemoryServer.getUri()
    await Mongo.connect(uri)
  })

  afterAll(async () => {
    await Mongo.disconnect()
    await MemoryServer?.stop()
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    // Clear collections - no mocking, using real civil-server functions
    await User.deleteMany({})
    await Iota.deleteMany({})
    await InviteLog.deleteMany({})
  })

  // Skip test if TEST_USER_EMAIL is not set
  const runTest = process.env.TEST_USER_EMAIL ? test : test.skip

  runTest(
    'should send real emails to test addresses when TEST_USER_EMAIL is set',
    async () => {
      const baseEmail = process.env.TEST_USER_EMAIL
      const discussionId = new ObjectId()
      const userIds = []

      // Create 10 users with email extensions
      for (let i = 0; i < 10; i++) {
        const userId = new ObjectId()
        userIds.push(userId)

        // Create email with extension like email+u1@example.com
        const [localPart, domain] = baseEmail.split('@')
        const testEmail = `${localPart}+u${i + 1}@${domain}`

        await User.insertOne({
          _id: userId,
          email: testEmail,
          firstName: `TestUser${i + 1}`,
        })
      }

      // Create discussion
      await Iota.insertOne({
        _id: discussionId,
        subject: 'Integration Test Discussion',
        path: '/our-tools', // a valid path on enciv.org for testing the invite link
        webComponent: {
          webComponent: 'CivilPursuit',
          status: 'active',
        },
      })

      // Initialize discussion with group_size 5
      await initDiscussion(discussionId.toString(), {
        updateUInfo: () => {},
        getAllUInfo: () => [],
        group_size: 5,
      })

      // Add statements for all users to make them eligible
      for (let i = 0; i < userIds.length; i++) {
        const statementId = new ObjectId()
        await insertStatementId(discussionId.toString(), userIds[i].toString(), statementId.toString())
      }

      // Try to get statements for some users to trigger the invitation logic
      for (let i = 0; i < 7; i++) {
        try {
          await getStatementIds(discussionId.toString(), 0, userIds[i].toString())
        } catch (e) {
          // Some may fail, that's ok for the test
        }
      }

      console.log(`Running integration test with base email: ${baseEmail}`)
      console.log('This test will send real emails to:')
      for (let i = 0; i < 10; i++) {
        const [localPart, domain] = baseEmail.split('@')
        console.log(`  ${localPart}+u${i + 1}@${domain}`)
      }

      // Run the job - this should actually send emails
      await inviteUsersBackJob()

      // Verify that the job ran (check InviteLog entries)
      const inviteLogs = await InviteLog.find({}).toArray()
      expect(inviteLogs.length).toBeGreaterThan(0)

      // Verify that each invite log has a valid userId and timestamp
      inviteLogs.forEach(log => {
        expect(log.userId).toBeDefined()
        expect(log.sentAt).toBeInstanceOf(Date)
        expect(log.discussionId).toBe(discussionId.toString())
      })

      console.log(`Successfully sent ${inviteLogs.length} invitation emails`)
      console.log('Check your email inbox for test invitations')
    },
    10000
  ) // Increase timeout to 10 seconds for email sending

  test('should be skipped when TEST_USER_EMAIL is not set', () => {
    if (!process.env.TEST_USER_EMAIL) {
      console.log('Skipping integration test - TEST_USER_EMAIL environment variable not set')
      console.log('To run this test, set TEST_USER_EMAIL=your-email@example.com')
    }
    expect(true).toBe(true) // This test always passes when skipped
  })
})
