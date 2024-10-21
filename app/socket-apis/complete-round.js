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
  const errorOccurred = await dturn
    .getStatementIds(discussionId, round, userId)
    .then(ids => {
      statementIds = ids
      return false // No error
    })
    .catch(err => {
      cbFailure('Failed to retrieve statementIds for completeRound.')
      return true // Error occurred
    })

  if (errorOccurred) {
    return // Exit the function to prevent multiple cbFailure calls
  }

  if (!statementIds || statementIds.length === 0) {
    return cbFailure('No statements found to rank.')
  }

  // For each `id`, call `dturn.rankMostImportant` with the provided `rank`
  for (const item of idRanks) {
    const id = Object.keys(item)[0]
    const rank = item[id]
    const rankError = await dturn
      .rankMostImportant(discussionId, round, userId, id, rank)
      .then(() => false) // No error
      .catch(error => {
        cbFailure(`Error ranking statements in completeRound: ${error}`)
        return true // Error occurred
      })
    if (rankError) {
      return // Exit the function to prevent further execution
    }
  }

  if (cb) cb(true)
}

module.exports = completeRound
