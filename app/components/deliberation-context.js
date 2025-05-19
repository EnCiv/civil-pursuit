import React, { createContext, useCallback, useState, useRef, useEffect } from 'react'
import setOrDeleteByMutatePath from '../lib/set-or-delete-by-mutate-path'
import socketApiSubscribe from '../socket-apis/socket-api-subscribe'

export const DeliberationContext = createContext({})
export default DeliberationContext

export function DeliberationContextProvider(props) {
  const local = useRef({}).current // can't be in deriver becasue "Error: Rendered more hooks than during the previous render."
  const { defaultValue = {} } = props
  const { discussionId, userId } = defaultValue
  const [data, setData] = useState(() => {
    return deriveReducedPointList({ reducedPointList: [], ...defaultValue }, local)
  })
  const upsert = useCallback(
    obj => {
      let messages = data._showUpsertDeltas ? [] : undefined
      setData(data => {
        let newData = setOrDeleteByMutatePath(data, obj, messages)
        if (messages) console.info('context update:', messages)
        newData = deriveReducedPointList(newData, local)
        return newData // is a new ref is there were changes above, or may be the original ref if no changes
      })
    },
    [setData]
  )
  useEffect(() => {
    if (!discussionId) return
    // steps are looking for userId in the context, if the user is not logged in to start, context needs to be updated
    upsert({ discussionId, userId })

    function onSubscribeHandler(data) {
      if (data.uInfo) {
        let round = data.uInfo.length - 1
        data.round = round
        if (data.uInfo[round].groupings?.length > 0) data.groupIdsLists = structuredClone(data.uInfo[round].groupings)
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
  }, [discussionId, upsert, userId])

  return <DeliberationContext.Provider value={{ data, upsert }}>{props.children}</DeliberationContext.Provider>
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
  for (const pointWithGroup of data.reducedPointList) {
    const ptid = pointWithGroup.point._id
    if (reducedPointTable[ptid]?.point === pointWithGroup.point && aEqual(reducedPointTable[ptid]?.group, pointWithGroup.group)) reducedPointTable[ptid] = pointWithGroup // if contentss are unchanged - unchange the ref
    else updated = true
  }
  const newReducedPointList = Object.values(reducedPointTable)
  local.pointById = pointById
  local.groupIdsList = groupIdsLists
  if (!(newReducedPointList.length === data.reducedPointList.length && !updated)) {
    data.reducedPointList = newReducedPointList
    return { ...data }
  }
  return data
}
