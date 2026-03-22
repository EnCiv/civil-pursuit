// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
import React, { createContext, useCallback, useState, useRef, useEffect, useContext } from 'react'
import setOrDeleteByMutatePath from '../lib/set-or-delete-by-mutate-path'
import socketApiSubscribe from '../socket-apis/socket-api-subscribe'
import LocalStorageManager from '../lib/local-storage-manager'

export const DeliberationContext = createContext({})
export default DeliberationContext

export function DeliberationContextProvider(props) {
  const local = useRef({}).current // can't be in deriver becasue "Error: Rendered more hooks than during the previous render."
  const { defaultValue = {} } = props
  const { discussionId, userId, user } = defaultValue
  const [storageAvailable] = useState(() => defaultValue.storageAvailable ?? LocalStorageManager.isAvailable()) // defaultValue.storageAvailable is for testing
  const [data, setData] = useState(() => {
    let initialData = { reducedPointList: [], ...defaultValue }

    // Load from localStorage if available
    if (storageAvailable && discussionId && userId) {
      // Clean up any expired data first
      LocalStorageManager.clearExpired()

      const stored = LocalStorageManager.load(discussionId, userId)
      if (stored) {
        initialData = { ...initialData, ...stored }
      }
    }

    return deriveReducedPointList(initialData, local)
  })

  const upsert = useCallback(
    obj => {
      setData(data => {
        let messages = data._showUpsertDeltas ? [] : undefined
        let newData = setOrDeleteByMutatePath(data, obj, messages)
        if (messages) console.info('context update:', messages)
        newData = deriveReducedPointList(newData, local)

        // Save to localStorage after updating state
        if (storageAvailable && discussionId && userId) {
          LocalStorageManager.save(discussionId, userId, newData)
        }

        return newData // is a new ref is there were changes above, or may be the original ref if no changes
      })
    },
    [setData, storageAvailable, discussionId, userId]
  )
  useEffect(() => {
    if (!discussionId) return
    // steps are looking for userId in the context, if the user is not logged in to start, context needs to be updated
    upsert({ discussionId, userId, user })
  }, [discussionId, upsert, userId, user])

  useEffect(() => {
    function onSubscribeHandler(data) {
      let currentRound = 0
      if (data.uInfo) {
        for (const r of data.uInfo) {
          if (r.shownStatementIds && Object.values(r.shownStatementIds).some(s => s.rank > 0)) currentRound++
          else break
        }
        if (data.uInfo[currentRound]?.finished && data.uInfo[currentRound]?.groupings) data.groupIdsLists = structuredClone(data.uInfo[currentRound].groupings)
        // Don't set groupIdsLists if not in server response - preserves localStorage value
      }
      upsert(data)
    }

    function onUpdateHandler(data) {
      upsert(data)
    }
    socketApiSubscribe('subscribe-deliberation', discussionId, onSubscribeHandler, onUpdateHandler)
    // after the socket is idle for too lone, the connection is closed to save server resources
    // if the user start to interact again, the connection will reopen and we need to re subscribe
    window.socket.on('connect', () => {
      console.log('Reconnected to socket')
      socketApiSubscribe('subscribe-deliberation', discussionId, onSubscribeHandler, onUpdateHandler)
    })
  }, [discussionId, userId])

  return <DeliberationContext.Provider value={{ data, upsert, storageAvailable }}>{props.children}</DeliberationContext.Provider>
}

/**
 * Hook to check if localStorage is being used by DeliberationContext
 *
 * Returns `true` if localStorage is available and being used, `false` otherwise
 */
export function useLocalStorageIfAvailable() {
  const { storageAvailable } = React.useContext(DeliberationContext)
  return storageAvailable || false
}

/**
 * Batch-upsert localStorage data for a specific round to the server
 *
 * This function retrieves all localStorage data for the given round and sends it to the server.
 * After successful upsert, it clears that round's localStorage.
 *
 * - `discussionId` - The discussion ID
 * - `userId` - The user ID
 * - `callback` - Optional callback function called with `(error, result)` after operation completes
 *
 * Returns nothing (void)
 */
export function flushRoundToServer(discussionId, userId, callback) {
  if (!discussionId || !userId) {
    const error = new Error('discussionId and userId are required')
    if (callback) callback(error)
    return
  }

  const data = LocalStorageManager.load(discussionId, userId)

  if (!data) {
    // No data to flush
    if (callback) callback(null, { flushed: false, reason: 'no-data' })
    return
  }

  // TODO: Implement actual server upsert API call
  // This will be implemented in later phases when server endpoints are created
  // For now, just clear localStorage
  console.info('flushRoundToServer: Would flush data to server', { discussionId, userId, data })

  const cleared = LocalStorageManager.clear(discussionId, userId)

  if (callback) {
    callback(null, { flushed: true, cleared })
  }
}

/*

reducedPointList:[
 {point: pointDoc, group: [pointDoc, pointDoc, ...]},
 ...
]

The order of the list is not relevant. If the contents compared the same, but the order was different, the old list would be used
*/

// do two arrays have equal contents
function aEqual(a = [], b = []) {
  return a.length === b.length && a.every((e, i) => e === b[i])
}
// reducedPointTable: { _id: {point, group}}

// export to test by jest -- this shouldn't be called directly
export function deriveReducedPointList(data, local) {
  const { pointById, groupIdsLists } = data
  if (!pointById) return data
  if (!Object.keys(pointById).length) return data
  if (local.pointById === pointById && local.groupIdsList === groupIdsLists) return data // nothing to update
  const reducedPointTable = Object.entries(pointById).reduce((reducedPointTable, [id, point]) => ((reducedPointTable[id] = { point }), reducedPointTable), {})
  let updated = false
  for (const [firstId, ...groupIds] of groupIdsLists || []) {
    if (!reducedPointTable[firstId]) {
      console.error('firstId not in reducedPointTable', firstId, reducedPointTable)
      continue
    }
    reducedPointTable[firstId].group = groupIds.map(id => reducedPointTable[id].point)
    groupIds.forEach(id => delete reducedPointTable[id])
  }
  // if there are any pointWithGroup elements in the new table, that have equal contents with those in the old reducedPointList
  // then copy them over so they are unchanged
  const oldReducedPointList = data.reducedPointList || []
  for (const pointWithGroup of oldReducedPointList) {
    const ptid = pointWithGroup.point._id
    if (reducedPointTable[ptid]?.point === pointWithGroup.point && aEqual(reducedPointTable[ptid]?.group, pointWithGroup.group)) reducedPointTable[ptid] = pointWithGroup // if contentss are unchanged - unchange the ref
    else updated = true
  }
  const newReducedPointList = Object.values(reducedPointTable)
  local.pointById = pointById
  local.groupIdsList = groupIdsLists
  if (!(newReducedPointList.length === oldReducedPointList.length && !updated)) {
    data.reducedPointList = newReducedPointList
    return { ...data }
  }
  return data
}

export function useDeliberationContext() {
  const ctx = useContext(DeliberationContext)
  return ctx || null
}
