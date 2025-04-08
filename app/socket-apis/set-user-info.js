'use strict'

import { User } from 'civil-server'

function setUserInfo(set, cb) {
  if (!this.synuser?.id) {
    console.error('setUserInfo: synuser not set')
    cb?.()
    return
  }
  try {
    User.updateOne({ _id: new User.ObjectId(this.synuser.id) }, { $set: set }).then(
      user => cb?.(user),
      error => console.error('setUserInfo error', error)
    )
  } catch (error) {
    console.error('setUserInfo error', error)
  }
}

export default setUserInfo
