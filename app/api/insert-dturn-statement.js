// https://github.com/EnCiv/civil-pursuit/issues/163

'use strict'

import insertStatementId from '../dturn/dturn.js'
const Points = require('../models/points')
const { BSON } = require('bson')

async function insertDturnStatement(dTurnId, pointObj, cb) {
  // Anonymous functions to handle success/fail
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }
  const cbSuccess = () => {
    if (cb) cb(true)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    cbFailure('Cannot insert Dturn statement - user is not logged in.')
    return
  }

  // Verify arguments.
  if (!dTurnId) {
    cbFailure('No dTurnId provided for insert DturnStatement operation.')
    return
  }
  if (!pointObj) {
    cbFailure('No pointObj provided for insert DturnStatement operation.')
    return
  }

  // Add userId to pointObj.
  const userId = this.synuser.id
  pointObj.userId = userId

  // If _id is present, convert to BSON, else add ID.
  const statementId = pointObj._id ? BSON.serialize(pointObj._id) : new ObjectId()
  pointObj._id = statementId

  // Insert ID into dturn
  const insertStatementResult = insertStatementId(dTurnId, userId, statementId)

  // If insert to dturn failed - discussion isn't initialized, and don't need to try to insert into Points.
  if (insertStatementResult === undefined) {
    cbFailure()
    return
  }

  // Attempt to insert pointObj.
  try {
    await Points.insertOne(pointObj)
    cbSuccess()
  } catch (error) {
    cbFailure(error)
  }
}
