// https://github.com/EnCiv/civil-pursuit/issues/212
const dturn = require('../dturn/dturn')

export default async function completeRound(discussionId, round, idRanks, cb) {
  if (cb && typeof cb !== 'function') console.error('completeRound cb must be a function, received:', cb)
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
    return
  })

  // Check if statementIds is valid
  if (!statementIds || statementIds.length === 0) {
    return cbFailure('No statements found to rank.')
  }

  // For each `id`, call `dturn.rankMostImportant` with the provided `rank`
  for await (const item of idRanks) {
    const [id, rank] = Object.entries(item)[0]

    // Check if `id` is in `statementIds`
    if (statementIds.some(sId => sId === id)) {
      await dturn.rankMostImportant(discussionId, round, userId, id, rank)
    } else {
      console.error(`user ${userId} tried to rank statement ${id} which was not shown to them`)
    }
  }

  if (cb) cb(true)
}
