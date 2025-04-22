// https://github.com/EnCiv/civil-pursuit/issues/305

import { ObjectId } from 'mongodb'

export default async function getConclusion(discussionId, cb) {
  if (!discussionId) {
    console.error('getConclusion called but discussionId not provided.')
    cb && cb(undefined)
  }
}
