// https://github.com/EnCiv/civil-pursuit/issues/212
const dturn = require('../dturn/dturn')

async function completeRound(discussionId, round, idRanks, cb) {
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
  if (!discussionId || typeof round !== 'number' || !Array.isArray(idRanks)) {
    return cbFailure('Invalid arguments provided to completeRound.')
  }

  let statementIds

  statementIds = await dturn.getStatementIds(discussionId, round, userId).catch(err => {
    cbFailure('Failed to retrieve statementIds for completeRound.')
    return null // Return null to indicate an error occurred
  })

  // Check if statementIds is valid
  if (!statementIds || statementIds.length === 0) {
    return cbFailure('No statements found to rank.')
  }

  // For each `id`, call `dturn.rankMostImportant` with the provided `rank`
  for (const item of idRanks) {
    const id = Object.keys(item)[0]
    const rank = item[id]

    // Check if `id` is in `statementIds`
    if (statementIds.some(sId => sId === id)) {
      try {
        dturn.rankMostImportant(discussionId, round, userId, id, rank)
      } catch (error) {
        cbFailure(`Error ranking statements in completeRound: ${error}`)
        return // Exit the function if there’s an error
      }
    }
  }

  if (cb) cb(true)
}

module.exports = completeRound
