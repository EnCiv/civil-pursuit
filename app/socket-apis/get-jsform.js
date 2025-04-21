// https://github.com/EnCiv/civil-pursuit/issues/304

import Jsforms from '../models/jsforms'

export default async function getJsform(parentId, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('getJsform called but no user logged in')
    return cb && cb() // No user logged in
  }

  if (!parentId) {
    console.error('getJsform called but no parentId provided')
    return cb && cb()
  }

  let result = await Jsforms.findOne({ parentId: parentId })

  return cb && cb(result ?? {})
}
