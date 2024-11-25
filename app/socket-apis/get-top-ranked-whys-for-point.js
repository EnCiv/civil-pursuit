// https://github.com/EnCiv/civil-pursuit/issues/136
const Points = require('../models/points')
const Rankings = require('../models/rankings')
const { ObjectId } = require('mongodb')

async function getTopRankedWhysForPoint(pointId, category, start, pageSize, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('getTopRankedWhysForPoint called but no user logged in')
    return cb && cb(undefined)
  }

  if (!pointId || !category || typeof start !== 'number' || typeof pageSize !== 'number') {
    console.error('getTopRankedWhysForPoint called with missing or invalid parameters')
    return cb && cb(undefined)
  }

  try {
    const whys = await Points.aggregate([
      { $match: { parentId: pointId, category: category } },
      {
        $lookup: {
          from: 'rankings',
          localField: '_id',
          foreignField: 'parentId',
          as: 'rankings',
        },
      },
      { $unwind: { path: '$rankings', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$_id', count: { $sum: 1 }, doc: { $first: '$$ROOT' } } },
      { $sort: { count: -1 } },
      { $skip: start },
      { $limit: pageSize },
      {
        $project: {
          doc: {
            $mergeObjects: ['$doc', { rankCount: '$count' }],
          },
        },
      },
    ]).toArray()

    const result = whys.map(why => {
      const { userId, ...rest } = why.doc
      return rest
    })

    cb(result)
  } catch (error) {
    console.error('Error in getTopRankedWhysForPoint:', error)
    cb(undefined)
  }
}

module.exports = getTopRankedWhysForPoint
