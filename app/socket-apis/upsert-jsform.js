// https://github.com/EnCiv/civil-pursuit/issues/304

import Jsforms from '../models/jsforms'

export default async function upsertJsform(parentId, name, obj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertJsform called but no user logged in')
    return cb && cb() // No user logged in
  }

  if (!parentId) {
    console.error('upsertJsform called but no parentId provided')
    return cb && cb()
  }

  if (!name) {
    console.error('upsertJsform called but no form name provided')
    return cb && cb()
  }

  if (!obj) {
    console.error('upsertJsform called but no form obj provided')
    return cb && cb()
  }

  try {
    const formQuery = { parentId: parentId, userId: this.synuser.id }

    await Jsforms.updateOne(formQuery, { $set: { [name]: obj, userId: this.synuser.id } }, { upsert: true })

    if (!cb) {
      return
    } else {
      const updatedDoc = await Jsforms.findOne(formQuery)
      cb(updatedDoc)
    }
  } catch (error) {
    console.error(error)
    cb && cb(false)
  }
}
