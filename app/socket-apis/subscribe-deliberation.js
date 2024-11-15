// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

import { subscribeEventName } from './socket-api-subscribe'
const Dturns = require('../models/dturns')

async function subscribeDeliberation(deliberationId, requestHandler) {
  const socket = this // making it clear this is a socket
  const server = this.server // don't reference "this" in the UInfoUpdate handler.
  const eventName = subscribeEventName('subscribe-deliberation', deliberationId)

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return console.error('Cannot subscribe to deliberation - user is not logged in.')
  }

  // Verify argument
  if (!deliberationId) {
    return console.error('DeliberationId was not provided to subscribeDeliberation(deliberationId).')
  }

  // Check if discussion is loaded in memory
  if (!Discussions[deliberationId]) {
    const iota = await Iota.findOne({ _id: new ObjectId(deliberationId) }) // Lookup in the iota collection
    if (iota) {
      const options = {
        ...(iota?.webComponent?.dturn ?? {}),
        updateUInfo: async UInfoData => {
          const synuserId = Object.keys(UInfoData)[0]

          // First upsert the UInfo
          const [round, { shownStatementIds, groupings }] = Object.entries(UInfoData[synuserId][deliberationId])[0]

          await Dturns.upsert(synuserId, deliberationId, 0, round, shownStatementIds, groupings || [])
        },
        getAllUInfo: async () => {
          return await Dturns.getAllFromDiscussion()
        },
        updates: updateData => {
          server.to(deliberationId).emit(eventName, updateData)
        },
      }
      await initDiscussion(deliberationId, options)
    } else {
      requestHandler() // let the client know there was an error
      return console.error(`Failed to find deliberation iota with id '${deliberationId}'.`) // Else fail
    }
  }
  socket.join(deliberationId) // subsribe this user to the room for this deliberation
  /* if we need to do anything when the user disconnects
  socket.on('disconnecting',()=>{
    // remove the user 
  })*/
  requestHandler({ participants: Object.keys(Discussions[deliberationId].Uitems[this.synuser.id] || []).length })
}
module.exports = subscribeDeliberation
