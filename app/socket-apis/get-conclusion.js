// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'
import { getConclusionIds } from '../dturn/dturn'

import Ranks from '../models/ranks'
import Point from '../models/points'

import getTopRankedWhysForPoint from './get-top-ranked-whys-for-point'

const start = 0
const pageSize = 5

export default async function getConclusion(discussionId, cb) {
  if (!discussionId) {
    console.error('getConclusion called but discussionId not provided.')
    return cb && cb(undefined)
  }

  // Gather conclusion points
  let statementIds = await getConclusionIds(discussionId)
  let topPointAndWhys = []

  if (!statementIds) {
    console.error('getConclusion called but discussion not complete.')
    return cb && cb(undefined)
  } else {
    for await (const statementId of statementIds) {
      let mosts, leasts, counts

      await getTopRankedWhysForPoint.call(this, statementId, 'most', start, pageSize, data => {
        mosts = data || []
      })
      await getTopRankedWhysForPoint.call(this, statementId, 'least', start, pageSize, data => {
        leasts = data || []
      })

      counts = await Ranks.aggregate([
        // 1) Filter ranks for the given parent, discussion, and stage
        {
          $match: {
            parentId: statementId, // e.g. "abc123"
            discussionId: discussionId, // e.g. "disc456"
            stage: 'post',
          },
        },

        // 2) Count documents per category
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },

        // 3) Convert grouped documents into an array of { k: <category>, v: <count> }
        {
          $group: {
            _id: null,
            kv: { $push: { k: '$_id', v: '$count' } },
          },
        },

        // 4) Turn the key/value array into an object { categoryName: count, ... }
        {
          $project: {
            _id: 0,
            countByCategory: { $arrayToObject: '$kv' },
          },
        },
      ]).toArray()

      const point = await Point.findOne({ _id: new ObjectId(statementId) })

      const convertedPoint = { ...point, _id: point._id.toString() }
      const newCounts = counts[0]?.countByCategory || {}
      ;['most', 'neutral', 'least'].forEach(cat => {
        if (!newCounts[cat]) newCounts[cat] = 0
      })
      topPointAndWhys.push({ mosts: mosts, leasts: leasts, point: convertedPoint, counts: newCounts })
    }
  }

  return cb && cb(topPointAndWhys)
}
