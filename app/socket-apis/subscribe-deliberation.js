// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

import { subscribeEventName } from './socket-api-subscribe'
const Dturns = require('../models/dturns')

async function subscribeDeliberation(deliberationId, requestHandler) {
  const server = this.server // don't reference "this" in the UInfoUpdate handler.

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
          const [round, { shownStatementIds, groupings }] = Object.entries(
            UInfoData[this.synuser.id][deliberationId]
          )[0]

          const participants = Object.keys(Discussions[deliberationId].Uitems[this.synuser.id]).length
          // TODO: Fix tests then uncomment this.
          //await Dturns.upsert(this.synuser.id, deliberationId, 0, round, shownStatementIds, groupings || {})

          // Then broadcast the update if changes were made
          if (
            round != Discussions[deliberationId].lastRound ||
            participants != Discussions[deliberationId].lastParticipants
          ) {
            const eventName = subscribeEventName('subscribe-deliberation', deliberationId)
            const updateData = {
              participants: Object.keys(Discussions[deliberationId].Uitems[this.synuser.id]).length,
              lastRound: Object.keys(Discussions[deliberationId].ShownStatements).length - 1,
            }

            server.to(eventName).emit(updateData)

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

  requestHandler({ participants: Object.keys(Discussions[deliberationId].Uitems[this.synuser.id] || []).length })
}
module.exports = subscribeDeliberation
