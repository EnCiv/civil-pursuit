const dturn = require('../dturn/dturn')

export default async function finishRound(discussionId, round, idRanks, groupings, cb) {
  if (cb && typeof cb !== 'function') console.error('finishRound cb must be a function, received:', cb)
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify that the user is logged in
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot complete round - user is not logged in.')
  }

  const userId = this.synuser.id

  // Validate parameters
  if (!discussionId || typeof round !== 'number' || !Array.isArray(idRanks) || !Array.isArray(groupings)) {
    return cbFailure('Invalid arguments provided to finishRound.')
  }

  try {
    await dturn.finishRound(discussionId, round, userId, idRanks, groupings)
  } catch (error) {
    logger.error('finishRound failed:', error)
    return cbFailure(error?.message || 'Failed to finish round.')
  }

  if (cb) cb(true)
}
