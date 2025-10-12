// https://github.com/EnCiv/civil-pursuit/issues/362
import InviteLog from '../models/invite-log'
import { getUsersToInviteBack } from '../dturn/dturn'
import { SibGetTemplateId, SibSendTransacEmail, Iota, User } from 'civil-server'
import { ObjectId } from 'mongodb'
import path from 'path'

// Job: invite users back to continue their discussion participation
// Following civil-server pattern with SibGetTemplateId and SibSendTransacEmail

let templateId = null

async function sendInviteEmail(userId, discussion, round) {
  try {
    // Get user details from User model - convert string ID to ObjectId
    const user = await User.findOne({ _id: new ObjectId(userId) })
    if (!user || !user.email) {
      logger.warn(`User ${userId} not found or has no email`)
      return false
    }

    // Skip test email addresses
    const testEmailPatterns = [/^david\d+@enciv\.org$/i, /^ga-test-\d+@enciv\.org$/i]

    if (testEmailPatterns.some(pattern => pattern.test(user.email))) {
      logger.info(`Skipping test email address: ${user.email}`)
      return false
    }

    // Determine the correct scheme for the hostname
    const hostname = process.env.HOSTNAME || 'localhost:3011'
    const scheme = hostname.startsWith('localhost') ? 'http://' : /^([a-z][a-z0-9+\-.]*):\/\//i.test(hostname) ? '' : 'https://'

    // Use SendinBlue transactional email
    const params = {
      DISPLAYNAME: user.firstName || user.name || user.email?.split('@')[0] || 'there',
      DISCUSSIONTITLE: discussion.subject || '',
      INVITEURL: `${scheme}${hostname}${discussion.path}`, // no slash in front of path because paths in iotas begin with /
      DISCUSSIONID: discussion._id.toString(), // Hidden prop as per issue requirements
    }

    const messageProps = {
      to: [{ email: user.email }],
      sender: {
        name: 'EnCiv.org',
        email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
      },
      templateId,
      tags: ['invite-next-round', discussion._id.toString()],
      params,
    }

    const result = await SibSendTransacEmail(messageProps)
    if (!result || !result.messageId) {
      logger.error(`Failed to send invite email to ${user.email}`)
      return false
    }
    logger.info(`Sent invite email to ${user.email} for discussion ${discussion._id}, round ${round}`)
    return true
  } catch (error) {
    logger.error('Failed to send invite email via SibSendTransacEmail:', error)
    return false
  }
}

let nextRunTimeout = null

export default async function inviteUsersBackJob() {
  if (!process.env.INVITE_USERS_BACK_JOB) {
    logger.info('INVITE_USERS_BACK_JOB not set - skipping inviteUsersBackJob')
    return null // job disabled, maybe it's running on another server
  }
  // Clear any existing timeout
  if (nextRunTimeout) {
    clearTimeout(nextRunTimeout)
    nextRunTimeout = null
  }

  // Get template ID at the beginning if not already cached
  if (!templateId) {
    templateId = await SibGetTemplateId(path.resolve(__dirname, '../../assets/email-templates/invite-next-round.html'))
    if (!templateId) {
      logger.error('Failed to get template ID for invite-next-round - aborting job')
      return { invitesSent: 0, discussionsProcessed: 0, error: 'Template ID retrieval failed' }
    }
  }

  // Get all active discussions from Iota collection per issue specs
  const iotas = await Iota.find({
    'webComponent.webComponent': 'CivilPursuit',
    'webComponent.status': 'active',
  }).toArray()

  logger.info(`Found ${iotas.length} active discussions`)

  let totalInvitesSent = 0
  let nextRunTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // default to 24 hours from now

  for (const discussion of iotas) {
    try {
      logger.info(`Processing discussion ${discussion._id}`)
      const usersToInvite = await getUsersToInviteBack(discussion._id.toString())

      logger.info(`getUsersToInviteBack returned ${usersToInvite?.length || 0} users`)

      if (!usersToInvite || !usersToInvite.length) {
        continue
      }

      logger.info(`Found ${usersToInvite.length} users to invite back for discussion ${discussion._id}`)

      for (const userInfo of usersToInvite) {
        try {
          const { userId, round } = userInfo
          if (!userId) {
            logger.warn('Skipping user with missing ID', userInfo)
            continue
          }

          // Check throttling: no more than 3 invites per round, not more than 1 per 24 hours
          const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

          // Check recent invites in last 24 hours
          const recentInvites = await InviteLog.countInvitesForUser({
            userId: userId.toString(),
            discussionId: discussion._id.toString(),
            round,
            since: last24Hours,
          })

          if (recentInvites > 0) {
            // User already invited in last 24 hours for this round
            const lastInvite = await InviteLog.findLastInvite({
              userId: userId.toString(),
              discussionId: discussion._id.toString(),
              round,
            })

            if (lastInvite) {
              const nextAllowedTime = new Date(lastInvite.sentAt.getTime() + 24 * 60 * 60 * 1000)
              if (!nextRunTime || nextAllowedTime < nextRunTime) {
                nextRunTime = nextAllowedTime
              }
            }
            continue
          }

          // Check total invites for this round (max 3)
          const totalInvitesForRound = await InviteLog.countInvitesForUser({
            userId: userId.toString(),
            discussionId: discussion._id.toString(),
            round,
          })

          if (totalInvitesForRound >= 3) {
            logger.info(`Skipping invite to ${userId}: already sent 3 invites for round ${round}`)
            continue
          }

          // Send invite email
          const emailSent = await sendInviteEmail(userId, discussion, round)

          if (emailSent) {
            // Log the invite
            await InviteLog.insertOne({
              userId: userId.toString(),
              discussionId: discussion._id.toString(),
              round,
              sentAt: new Date(),
            })
            totalInvitesSent++
          } else logger.error(`Failed to send invite email to user ${userId}`)
        } catch (userError) {
          logger.error(`Error inviting user ${userInfo.userId}:`, userError)
        }
      }
    } catch (discussionError) {
      logger.error(`Error processing discussion ${discussion._id}:`, discussionError)
    }
  }

  // Set timeout for next run if needed
  if (nextRunTime) {
    const timeUntilNext = nextRunTime.getTime() - Date.now()
    if (timeUntilNext > 0) {
      logger.info(`Scheduling next invite job run in ${Math.round(timeUntilNext / 1000 / 60)} minutes`)
      nextRunTimeout = setTimeout(() => {
        inviteUsersBackJob()
      }, timeUntilNext)
    }
  }
  logger.info(`Invite job completed. Sent ${totalInvitesSent} invites across ${iotas.length} discussions. Next run time: ${nextRunTime}`)

  return { invitesSent: totalInvitesSent, discussionsProcessed: iotas.length, nextRunTime }
}
