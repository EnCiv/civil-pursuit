// https://github.com/EnCiv/civil-pursuit/issues/204

const Points = require('../models/points')
import { Discussions, getStatementIds } from '../dturn/dturn'
import { ObjectId } from 'mongodb'

async function getPointsForRound(discussionId, round, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify user is logged in
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve points for round - user is not logged in.')
  }

  // Verify arguments
  if (!discussionId || round === undefined || typeof round !== 'number') {
    return cbFailure('Invalid arguments provided to getPointsForRound(discussionId: ObjectId, round: number, cb: Function).')
  }

  // Retrieve statement IDs
  let statementIds
  try {
    statementIds = await getStatementIds(discussionId, round, this.synuser.id)
  } catch {
    return cbFailure('Failed to retrieve points for round - getStatementIds failed.')
  }

  // If statementIds is null or undefined, log the failure
  if (!Discussions[discussionId]) {
    console.error('getStatementIds failed')
    return cbFailure('getStatementIds failed')
  }

  // If only one user has submitted, return an empty list
  if (!statementIds || statementIds.length < 2) {
    console.error('Insufficient ShownStatements length')
    return cb([])
  }

  // Fetch points from the database
  let pointsList = await Points.find({ _id: { $in: statementIds } }).toArray()

  // Anonymize points except for the current user
  pointsList = pointsList.map(point => {
    const { userId, ...otherData } = point
    return userId === this.synuser.id ? point : otherData
  })

  if (cb) cb(pointsList)
  return pointsList
}

module.exports = getPointsForRound
