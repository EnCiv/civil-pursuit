// https://github.com/EnCiv/civil-pursuit/issues/196

import { initDiscussion, Discussions, initUitems } from '../dturn/dturn'
import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'

import { subscribeEventName } from './socket-api-subscribe'
import Dturns from '../models/dturns'

export async function ensureDeliberationLoaded(deliberationId) {
  if (Discussions[deliberationId]) return true
  const iota = await Iota.findOne({ _id: new ObjectId(deliberationId) }) // Lookup in the iota collection
  if (iota) {
    const server = this.server // don't reference "this" in the UInfoUpdate handler.
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
        const all = allUInfo.map(({ discussionId, userId, round, shownStatementIds = {}, groupings = [], _id, ...otherProps }) => ({
          // do not put _id into the UInfo
          [userId]: {
            [discussionId]: {
              [round]: {
                shownStatementIds,
                groupings: Object.values(groupings).map(group => Object.values(group)), // convert from plain object with nested objects to array of arrays
                ...otherProps,
              },
            },
          },
        }))
        return all
      },
      updates: updateData => {
        const eventName = subscribeEventName('subscribe-deliberation', deliberationId)

        server.to(deliberationId).emit(eventName, updateData)
      },
    }
    await initDiscussion(deliberationId, options)
    return true
  } else return false
}

export default async function subscribeDeliberation(deliberationId, requestHandler) {
  const socket = this // making it clear this is a socket

  // Verify argument
  if (!deliberationId) {
    return console.error('DeliberationId was not provided to subscribeDeliberation(deliberationId).')
  }

  if (!this.synuser?.id) {
    // use not logged in, let them know the number of participants
    // TBD load the deliberation and figure out the number of participants but will have to set the updates function in the future because this has no server.to
    const response = { lastRound: 0, uInfo: [{ shownStatementIds: {} }] } // with late-sign-up uInfo needs to be there to indicate round 0
    if (Discussions[deliberationId]) response.participants = Discussions[deliberationId]?.participants ?? 0 // **TBD** it would be nice to get participants out of the iota if there.
    if (Discussions[deliberationId]) response.lastRound = Discussions[deliberationId]?.lastRound ?? 0
    requestHandler?.(response)
    return
  }

  // Check if discussion is loaded in memory
  if (!Discussions[deliberationId]) {
    const loaded = await ensureDeliberationLoaded.call(this, deliberationId)
    if (!loaded) {
      requestHandler?.() // let the client know there was an error
      return console.error(`Failed to load deliberation with id '${deliberationId}'.`) // Else fail
    } // else deliberation is now loaded
  }

  socket.join(deliberationId) // subscribe this user to the room for this deliberation
  /* if we need to do anything when the user disconnects
  socket.on('disconnecting',()=>{
    // remove the user 
  })*/

  const uInfo = initUitems(deliberationId, this.synuser.id) // adds user if they are not yet there

  requestHandler?.({
    participants: Discussions[deliberationId].participants,
    lastRound: Discussions[deliberationId].lastRound,
    uInfo,
  })
}
