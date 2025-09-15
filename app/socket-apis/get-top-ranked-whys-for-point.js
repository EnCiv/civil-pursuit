// https://github.com/EnCiv/civil-pursuit/issues/136
import Points from '../models/points'

export default async function getTopRankedWhysForPoint(pointId, category, start, pageSize, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('getTopRankedWhysForPoint called but no user logged in')
    return cb && cb(undefined)
  }

  if (!pointId || !category || typeof start !== 'number' || typeof pageSize !== 'number') {
    console.error('getTopRankedWhysForPoint called with missing or invalid parameters')
    return cb && cb(undefined)
  }

  try {
    let results = await Points.aggregate([
      { $match: { parentId: pointId } },
      {
        $lookup: {
          from: 'ranks',
          localField: '_id',
          foreignField: 'parentId',
          as: 'ranks',
        },
      },
      { $unwind: { path: '$ranks', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$_id', count: { $sum: 1 }, doc: { $first: '$$ROOT' } } },
      {
        $project: {
          doc: {
            $mergeObjects: ['$doc', { rankCount: '$count' }],
          },
        },
      },
      {
        $facet: {
          results: [{ $match: { 'doc.category': category } }, { $sort: { count: -1 } }, { $skip: start }, { $limit: pageSize }],
          mosts: [{ $match: { 'doc.category': 'most' } }, { $count: 'count' }],
          leasts: [{ $match: { 'doc.category': 'least' } }, { $count: 'count' }],
          neutrals: [{ $match: { 'doc.category': 'neutral' } }, { $count: 'count' }],
        },
      },
    ]).toArray()

    const first = results[0]

    const data = {
      results: first.results,
      counts: {
        mosts: first.mosts?.[0]?.count ?? 0,
        leasts: first.leasts?.[0]?.count ?? 0,
        neutrals: first.neutrals?.[0]?.count ?? 0,
      },
    }

    cb && cb(data)
  } catch (error) {
    console.error('Error in getTopRankedWhysForPoint:', error)
    cb(undefined)
  }
}
