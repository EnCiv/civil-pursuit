// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'
import { getConclusionIds } from '../dturn/dturn'

import getPointsOfIds from '../socket-apis/get-points-of-ids'
import getTopRankedWhysForPoint from './get-top-ranked-whys-for-point'

import Points from '../models/points'

export default async function getConclusion(discussionId, cb) {
  if (!discussionId) {
    console.error('getConclusion called but discussionId not provided.')
    return cb && cb(undefined)
  }

  // Gather conclusion points
  let statementIds = await getConclusionIds(discussionId)

  if (!statementIds) {
    console.error('getConclusion called but discussion not complete.')
    return cb && cb(undefined)
  } else {
    let pointDocs, myWhys
    await getPointsOfIds.call(this.synuser, statementIds, result => {
      pointDocs = result.points
      myWhys = result.myWhys
    })

    let topPointAndRanks = []

    for await (const statementId of statementIds) {
      const ranks = await Points.aggregate([
        {
          $match: {
            parentId: statementId,
            discussionId: discussionId,
            stage: 'post',
          },
        },
      ]).toArray()
      console.log('RANKS', JSON.stringify(ranks, null, 2))
      topPointAndRanks.push(ranks)
    }

    return cb && cb(topPointAndRanks)
  }
}
