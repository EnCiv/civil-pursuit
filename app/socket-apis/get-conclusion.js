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
      let mosts,
        leasts,
        counts = { mosts: 0, leasts: 0, neutrals: 0 }

      await getTopRankedWhysForPoint.call(this.synuser, statementId, 'most', start, pageSize, data => {
        mosts = data.results
        counts.mosts += data.counts.mosts
        counts.leasts += data.counts.leasts
        counts.neutrals += data.counts.neutrals
      })
      await getTopRankedWhysForPoint.call(this.synuser, statementId, 'least', start, pageSize, data => {
        leasts = data.results

        counts.mosts += data.counts.mosts
        counts.leasts += data.counts.leasts
        counts.neutrals += data.counts.neutrals
      })

      const point = await Point.findOne({ _id: new ObjectId(statementId) })
      const convertedPoint = { ...point, _id: point._id.toString() }

      topPointAndWhys.push({ mosts: mosts, leasts: leasts, point: convertedPoint, counts: counts })
    }

    return cb && cb(topPointAndWhys)
  }
}
