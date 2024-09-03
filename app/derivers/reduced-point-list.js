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

export function updateReducedPointsWithGroups(data, local) {
  const { pointList, groupIdsLists } = data
  if (local.pointList === pointList && local.groupIdsList === groupIdsLists) return // nothing to update
  const reducedPointTable = pointList.reduce((table, point) => ((table[point._id] = point), table), {})
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
  local.pointList = pointList
  local.groupIdsList = groupIdsLists
  if (!(newReducedPointList.length === reducedPointTable.length && !updated))
    data.reducedPointList = newReducedPointList
}
