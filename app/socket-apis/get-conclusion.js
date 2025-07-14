// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'
import { getConclusionIds } from '../dturn/dturn'

import getPointsOfIds from '../socket-apis/get-points-of-ids'
import getTopRankedWhysForPoint from './get-top-ranked-whys-for-point'

import Point from '../models/points'

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

    const start = 0
    const pageSize = 5

    let topPointAndWhys = []

    for await (const statementId of statementIds) {
      const mosts = await getTopRankedWhysForPoint.call(this.synuser, statementId, 'most', start, pageSize, results => {
        new Promise((ok, ko) => ok(results))
      })
      const leasts = await getTopRankedWhysForPoint.call(this.synuser, statementId, 'least', start, pageSize, results => {
        new Promise((ok, ko) => ok(results))
      })

      const point = await Point.findOne({ _id: new ObjectId(statementId) })
      const convertedPoint = { ...point, _id: point._id.toString() }

      topPointAndWhys.push({ mosts, leasts, point: convertedPoint })
    }

    return cb && cb(topPointAndWhys)
  }
}
