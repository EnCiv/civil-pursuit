// https://github.com/EnCiv/civil-pursuit/issues/204

const Points = require('../models/points')
import { getStatementIds } from '../dturn/dturn'
import { ObjectId } from 'mongodb'

async function getPointsForRound(discussionId, round, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve points for round - user is not logged in.')
  }

  // If getStatementIds errors, call callback to indicate error
  let statementIds
  try {
    statementIds = await getStatementIds(discussionId, round, this.synuser.id)
  } catch {
    return cbFailure('Failed to retrieve points for round - getStatementIds failed.')
  }

  // If points is 0 or 1, return empty list
  if (!statementIds) {
    cb([])
    return []
  }

  const pointsList = await Points.find({ id: { $in: statementIds } })

  return pointsList
}

module.exports = getPointsForRound
