// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'
import { getConclusionIds } from '../dturn/dturn'

import getPointsOfIds from '../socket-apis/get-points-of-ids'
import getUserPostRanksAndTopRankedWhys from './get-user-post-ranks-and-top-ranked-whys'

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

    const postRanksAndTopRankedWhys = await getUserPostRanksAndTopRankedWhys.call(this.synuser, discussionId, 0, statementIds, result => {
      console.log(result)
    })

    return cb && cb({ rankResults: [{ parentId: '', category: '', count: 0 }], points: pointDocs, whys: [{}] })
  }
}
