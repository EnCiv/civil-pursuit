// https://github.com/EnCiv/civil-pursuit/issues/163

'use strict'

import { insertStatementId } from '../dturn/dturn'

import upsertPoint from './upsert-point'
import { ObjectId } from 'mongodb'

export default async function insertDturnStatement(dTurnId, pointObj, cb) {
  // Anonymous functions to handle success/fail
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }
  const cbSuccess = () => {
    if (cb) cb(true)
  }

  // Verify arguments
  if (arguments.length != 3) {
    return console.error(`Expected 3 arguments (dTurnId, pointObj, cb) but got ${arguments.length}.`)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot insert Dturn statement - user is not logged in.')
  }

  // Add userId to pointObj.
  const userId = this.synuser.id
  pointObj.userId = userId

  // If _id is present, convert to BSON, else add ID.
  const statementId = new ObjectId(pointObj._id)
  pointObj._id = statementId

  // Insert ID into dturn
  const insertStatementResult = await insertStatementId(dTurnId, userId, statementId)

  // If insert to dturn failed - discussion isn't initialized, and don't need to try to insert into Points.
  if (!insertStatementResult) {
    return cbFailure()
  }

  // Attempt to insert pointObj.
  const pointInsertCb = success => {
    if (success) {
      cbSuccess()
    } else {
      cbFailure('An error occured inserting the pointObj.')
    }
  }

  await upsertPoint.call({ synuser: this.synuser }, pointObj, pointInsertCb)
}
