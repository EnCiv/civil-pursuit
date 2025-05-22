// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'
import { getConclusionIds } from '../dturn/dturn'

import getPointsOfIds from '../socket-apis/get-points-of-ids'

export default async function getConclusion(discussionId, cb) {
  if (!discussionId) {
    console.error('getConclusion called but discussionId not provided.')
    return cb && cb(undefined)
  }

  // Gather conclusion points
  let statementIds = await getConclusionIds(discussionId)

  return await getPointsOfIds.call({ synuser: this.synuser }, statementIds, cb)
}
