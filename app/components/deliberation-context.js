import React, { createContext, useCallback, useState, useRef } from 'react'
import { merge } from 'lodash'
export const DeliberationContext = createContext({})
export default DeliberationContext

export function DeliberationContextProvider(props) {
  const [data, setData] = useState({})
  const local = useRef({}).current // can't be in deriver becasue "Error: Rendered more hooks than during the previous render."
  const upsert = useCallback(
    obj => {
      setData(data => {
        return { ...deriveReducedPointList(merge(data, obj), local) } // spread because we need to return a new reference
      })
    },
    [setData]
  )
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

// export to test by jest -- this shouldn't be called directly
export function deriveReducedPointList(data, local) {
  const { pointById, groupIdsLists } = data
  if (!pointById || !groupIdsLists) return data
  if (local.pointById === pointById && local.groupIdsList === groupIdsLists) return data // nothing to update
  const reducedPointTable = { ...pointById } // make own copy of it
  let updated = false
  for (const [firstId, ...groupIds] of groupIdsLists) {
    reducedPointTable[firstId].group = groupIds.map(id => reducedPointTable[id].point)
    groupIds.forEach(id => delete reducedPointTable[id])
  }
  // if there are any pointWithGroup elements in the new table, that have equal contents with those in the old reducedPointList
  // then copy them over so they are unchanged
  for (const pointWithGroup of data.reducedPointList) {
    const ptid = pointWithGroup.point._id
    if (
      reducedPointTable[ptid]?.point === pointWithGroup.point &&
      aEqual(reducedPointTable[ptid]?.group, pointWithGroup.group)
    )
      reducedPointTable[ptid] = pointWithGroup // if contentss are unchanged - unchange the ref
    else updated = true
  }
  const newReducedPointList = Object.values(reducedPointTable)
  local.pointById = pointById
  local.groupIdsList = groupIdsLists
  if (!(newReducedPointList.length === reducedPointTable.length && !updated))
    data.reducedPointList = newReducedPointList
  return data
}
