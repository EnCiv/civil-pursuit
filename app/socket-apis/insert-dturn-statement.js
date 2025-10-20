// https://github.com/EnCiv/civil-pursuit/issues/163

'use strict'

import { insertStatementId } from '../dturn/dturn'

import upsertPoint from './upsert-point'

export default async function insertDturnStatement(dTurnId, pointObj, cb) {
  // Anonymous functions to handle success/fail
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    cb?.(undefined)
  }
  const cbSuccess = () => {
    cb?.(true)
  }

  if (typeof dTurnId !== 'string' || dTurnId.length !== 24) {
    return cbFailure('dTurnId is not a valid ObjectId')
  }
  if (typeof pointObj !== 'object' || pointObj === null) {
    return cbFailure('pointObj is not a valid object')
  }
  if (cb && typeof cb !== 'function') {
    return cbFailure('callback is not a function')
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot insert Dturn statement - user is not logged in.')
  }

  if (typeof pointObj._id !== 'string' || pointObj._id.length !== 24) {
    return cbFailure('pointObj._id is not a valid ObjectId')
  }

  // Add userId to pointObj.
  const userId = this.synuser.id
  pointObj.userId = userId

  // Insert ID into dturn
  const insertStatementResult = await insertStatementId(dTurnId, userId, pointObj._id)

  // If insert to dturn failed - discussion isn't initialized, and don't need to try to insert into Points.
  if (!insertStatementResult) {
    return cbFailure()
  }

  // insert the pointObj
  const pointInsertCb = success => {
    if (success) {
      cbSuccess()
    } else {
      cbFailure('An error occurred inserting the pointObj.')
    }
  }

  await upsertPoint.call(this, pointObj, pointInsertCb)
}
