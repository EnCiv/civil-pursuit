/* 

   derives the reviewPoints array from the context
  
   is careful:
     not to change the array reference when nothing has changed
     to change the array refereance when something has changed, and to only chanage references to the things that have changed
     relies on the context, and other function to only change only the references of things that have changed
  
  keeps a local state that is changed directly (not by a setter) to keep track of previous values in order to figure out what's changed
  and only change what is different


   Input pointList, whyMosts, whyLeasts, rankDocs
   Output: reviewPoints=[{point, whyMosts, whyLeasts, rankDoc}]

   usage 
        function ReviewStep(props) {
            return <ReviewPointList reviewPoints={deriveReviewPoints()} {...props} />
        }
*/
import React, { useState, useContext } from 'react'
import DeliberationContext from './deliberation-context'

export function deriveReviewPoints() {
  const { data } = useContext(DeliberationContext)
  const [local] = useState({ reviewPointsById: {} })
  const { pointList, ranks } = data
  let updated = false

  const { reviewPointsById } = local
  if (local.pointList !== pointList) {
    for (const point of pointList) {
      if (!reviewPointsById[point._id]) {
        reviewPointsById[point._id] = { point, whyMosts: [], rank: {} }
        updated = true
      } else if (reviewPointsById[point._id]?.point !== point) {
        reviewPointsById[point._id].point = point
        updated = true
      }
    }
    local.pointList = pointList
  }
  for (const category of ['whyMosts', 'whyLeasts']) {
    if (local[category] !== data[category]) {
      let index
      const parentIdsToUpdate = {}
      for (const whyPoint of data[category]) {
        if (!reviewPointsById[whyPoint.parentId]) continue // parent not in pointList
        if ((index = reviewPointsById[whyPoint.parentId][category].findIndex(w => w._id === whyPoint._id)) >= 0) {
          if (reviewPointsById[whyPoint.parentId][category][index] !== whyPoint) {
            reviewPointsById[whyPoint.parentId][category][index] = whyPoint
            parentIdsToUpdate[whyPoint.parentId] = true
            updated = true
          } // else no need to update
        } else {
          reviewPointsById[whyPoint.parentId][category].push(whyPoint)
          parentIdsToUpdate[whyPoint.parentId] = true
          updated = true
        }
      }
      Object.keys(parentIdsToUpdate).forEach(
        parentId => (reviewPointsById[parentId][category] = { ...reviewPointsById[parentId][category] })
      )
      local[catgory] = data[category]
    }
  }
  if (local.ranks !== ranks) {
    for (const rank of ranks) {
      if (reviewPointsById[rank.parentId]) {
        if (reviewPointsById[rank.parentId].rank !== rank) {
          reviewPointsById[rank.parentId].rank === rank
          updated = true
        }
      } // else some rankDoc's could relate to a whyPoint so do nothing in that case
    }
    local.ranks = ranks
  }
  if (updated) local.reviewPoints = Object.values(local.reviewPointsById)
  return local.reviewPoints
}
