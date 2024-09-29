// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

async function subscribeDeliberation(deliberationId) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot subscribe to deliberation - user is not logged in.')
  }

  // Verify argument
  if (!deliberationId) {
    return cbFailure('DeliberationId was not provided to subscribeDeliberation(deliberationId).')
  }

  // Check if discussion is loaded in memory
  if (Discussions[deliberationId]) {
  } else {
    const iota = Iota.findOne({ _id: deliberationId }) // Lookup in the iota collection
    if (iota) {
      initDiscussion(deliberationId, iota?.webcomponent?.dturn ?? {}) // Use webcomponent dturn to init discussion if iota exists
    } else {
      return cbFailure(`Failed to find deliberation iota with id '${deliberationId}'.`) // Else fail
    }
  }
}
module.exports = subscribeDeliberation
