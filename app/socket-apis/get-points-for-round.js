// https://github.com/EnCiv/civil-pursuit/issues/204

const Points = require('../models/points')
import { getStatementIds } from '../dturn/dturn'
import { ObjectId } from 'mongodb'

export default async function getPointsForRound(discussionId, round, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve points for round - user is not logged in.')
  }

  // Verify arguments
  if (!discussionId || round === undefined || typeof round !== 'number') {
    return cbFailure('Invalid arguments provided to getPointsForRound(discussionId: ObjectId, round: number, cb: Function).')
  }

  // If getStatementIds errors, call callback to indicate error
  let statementIds
  try {
    statementIds = await getStatementIds(discussionId, round, this.synuser.id)
  } catch {
    return cbFailure('Failed to retrieve points for round - getStatementIds failed.')
  }

  // If points is 0 or 1, return empty list
  if (!statementIds || statementIds.length < 2) {
    if (cb) cb([])
    return []
  }

  // Get the list and return if successful
  let pointsList = await Points.find({ _id: { $in: statementIds.map(_id => new ObjectId(_id)) } }).toArray()

  // Anonymize points by removing userids, except if the point was made by the current user
  pointsList = pointsList.map(point => {
    const { userId, ...otherData } = point
    return userId === this.synuser.id ? point : otherData
  })

  if (cb) cb(pointsList)
  return pointsList
}
