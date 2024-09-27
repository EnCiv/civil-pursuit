// https://github.com/EnCiv/civil-pursuit/issues/205

const Rankings = require('../models/rankings')
import { ObjectId } from 'mongodb'

async function getUserRanks(discussionId, round, stage, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure("Cannot retrieve ranks for user because they're not logged in.")
  }

  // Verify arguments
  if (!discussionId || !stage || round === undefined || typeof round !== 'number') {
    return cbFailure(
      'Invalid arguments provided to getUserRanks(discussionId: string, round: number, stage: string, cb: Function).'
    )
  }

  // Get ranks for user
  const results = await Rankings.find({
    discussionId: discussionId,
    round: round,
    stage: stage,
    userId: this.synuser.id,
  }).toArray()

  if (cb) cb(results)
  return results
}
module.exports = getUserRanks
