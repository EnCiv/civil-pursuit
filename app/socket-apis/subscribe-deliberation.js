// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

const Dturns = require('../models/dturns')

async function subscribeDeliberation(deliberationId) {
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
          // First upsert the UInfo
          const [round, { shownStatementIds, groupings }] = Object.entries(UInfoData[userId][deliberationId])[0]
          const participants = Object.keys(Discussions[deliberationId].Uitems[userId]).length

          await Dturns.upsert(this.synuser.id, deliberationId, 0, round, shownStatementIds, groupings)
          const result = await this.findOne({ discussionId: deliberationId })

          // Then broadcast the update if changes were made
          if (
            result.round != Discussions[deliberationId].lastRound ||
            participants != Discussions[deliberationId].lastParticipants
          ) {
            const eventName = subscribeEventName('subscribe-discussion', deliberationId)

            window.socket.broadcast.to(deliberationId).emit(eventName, {
              participants: Object.keys(Discussions[deliberationId].Uitems[userId]).length,
              lastRound: Object.keys(Discussions[deliberationId].ShownStatement).length - 1,
            })

            Discussions[deliberationId]['lastRound'] = round
            Discussions[deliberationId]['lastParticipants'] = participants
          }
        },
        getAllUInfo: async () => {
          return await Dturns.getAllFromDiscussion()
        },
      }
      await initDiscussion(deliberationId, options)
    } else {
      return console.error(`Failed to find deliberation iota with id '${deliberationId}'.`) // Else fail
    }
  }

  // Add the client to the room
  console.log(window.socket)
  window.socket.join(deliberationId)
}
module.exports = subscribeDeliberation
