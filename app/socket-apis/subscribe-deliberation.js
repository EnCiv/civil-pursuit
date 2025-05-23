// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions, initUitems } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

import { subscribeEventName } from './socket-api-subscribe'
import Dturns from '../models/dturns'

export default async function subscribeDeliberation(deliberationId, requestHandler) {
  const socket = this // making it clear this is a socket
  const server = this.server // don't reference "this" in the UInfoUpdate handler.
  const eventName = subscribeEventName('subscribe-deliberation', deliberationId)

  // Verify argument
  if (!deliberationId) {
    return console.error('DeliberationId was not provided to subscribeDeliberation(deliberationId).')
  }

  if (!this.synuser?.id) {
    // use not logged in, let them know the number of participants
    // TBD load the deliberation and figure out the number of participantsbut will have to set the updates function in the future because this has no server.to
    requestHandler?.({
      participants: Discussions[deliberationId]?.participants ?? 0, // it might not be loaded, but we can't load it if there's no server
    })
    return
  }

  // Check if discussion is loaded in memory
  if (!Discussions[deliberationId]) {
    const iota = await Iota.findOne({ _id: new ObjectId(deliberationId) }) // Lookup in the iota collection
    if (iota) {
      const options = {
        ...(iota?.webComponent?.dturn ?? {}),
        updateUInfo: async UInfoData => {
          const userId = Object.keys(UInfoData)[0]

          // extract the round and info note round is a string because this was an object
          // info is an object which may have shownStatementIds and/or groupings but is a delta not the whole object
          const [roundStr, info] = Object.entries(UInfoData[userId][deliberationId])[0]

          await Dturns.upsert(userId, deliberationId, +roundStr, info)
        },
        getAllUInfo: async () => {
          const allUInfo = await Dturns.getAllFromDiscussion(deliberationId)
          const all = allUInfo.map(({ discussionId, userId, round, shownStatementIds = {}, groupings = [] }) => ({
            [userId]: {
              [discussionId]: {
                [round]: {
                  shownStatementIds,
                  groupings: Object.values(groupings).map(group => Object.values(group)), // convert from plain object with nested objects to array of arrays
                },
              },
            },
          }))
          return all
        },
        updates: updateData => {
          server.to(deliberationId).emit(eventName, updateData)
        },
      }
      await initDiscussion(deliberationId, options)
    } else {
      requestHandler?.() // let the client know there was an error
      return console.error(`Failed to find deliberation iota with id '${deliberationId}'.`) // Else fail
    }
  }

  socket.join(deliberationId) // subscribe this user to the room for this deliberation
  /* if we need to do anything when the user disconnects
  socket.on('disconnecting',()=>{
    // remove the user 
  })*/

  const uInfo = initUitems(deliberationId, this.synuser.id) // adds user if they are not yet there
  const round = Math.min(uInfo.length - 1, Discussions[deliberationId].max_rounds)
  requestHandler?.({
    participants: Discussions[deliberationId].participants,
    round,
    uInfo,
  })
}
