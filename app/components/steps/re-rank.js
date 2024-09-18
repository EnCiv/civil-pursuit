// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from '../review-point'
import DeliberationContext from '../deliberation-context'

export default function ReRankStep(props) {
  const { data, upsert } = useContext(DeliberationContext)

  return <ReRank {...derivePointMostsLeastsRankList(data)} {...props} />
}

export function ReRank(props) {
  const { reviewPoints = [], onDone = () => {}, className, ...otherProps } = props
  const [rankedPoints, setRankedPoints] = useState(new Set())
  const [percentDone, setPercentDone] = useState(0)

  const classes = useStylesFromThemeFunction()

  useEffect(() => {
    if (reviewPoints.length === 0) {
      setPercentDone(100)
    } else {
      const initialRankedPoints = reviewPoints.filter(point => point.rank !== '').length
      setRankedPoints(new Set(reviewPoints.filter(point => point.rank !== '').map(point => point.point._id)))
      setPercentDone(Number(((initialRankedPoints / reviewPoints.length) * 100).toFixed(2)))
    }
  }, [reviewPoints])

  useEffect(() => {
    if (rankedPoints.size === reviewPoints.length) {
      onDone({ valid: true, value: percentDone })
    } else {
      onDone({ valid: false, value: percentDone })
    }
  }, [rankedPoints, percentDone])

  const handleReviewPoint = (pointId, selectedRank) => {
    setRankedPoints(prevPoints => {
      const rankedPoints = new Set(prevPoints)
      if (selectedRank !== '') {
        rankedPoints.add(pointId)
      } else {
        rankedPoints.delete(pointId)
      }

      const newPercentDone = Number(((rankedPoints.size / reviewPoints.length) * 100).toFixed(2))
      setPercentDone(newPercentDone)
      return rankedPoints
    })
  }

  return (
    <div className={classes.reviewPointsContainer} {...otherProps}>
      {reviewPoints.map((reviewPoint, idx) => (
        <div key={idx} className={classes.reviewPoint}>
          <ReviewPoint
            point={reviewPoint.point}
            leftPointList={reviewPoint.leftPoints}
            rightPointList={reviewPoint.rightPoints}
            rank={reviewPoint.rank}
            onDone={selectedRank => handleReviewPoint(reviewPoint.point._id, selectedRank)}
          />
        </div>
      ))}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  reviewPointsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}))

/* 

   derives the reviewPoints array from the context
  
   is careful:
     not to change the array reference when nothing has changed
     to change the array refereance when something has changed, and to only chanage references to the things that have changed
     relies on the context, and other functions to only change only the references of things that have changed
  
  keeps a local state that is changed directly to keep track of previous values in order to figure out what's changed
  and only change what is different


   Input pointList, whyMosts, whyLeasts, rankDocs
   Output: reviewPoints=[{point, whyMosts, whyLeasts, rankDoc}]

   usage 
        function ReviewStep(props) {
            return <ReviewPointList reviewPoints={deriveReviewPoints()} {...props} />
        }
*/

// to make is possible to test with jest, calcReviewPoints is exported
export function derivePointMostsLeastsRankList(data) {
  const local = useRef({ reviewPointsById: {} }).current
  const { pointList, ranks } = data
  let updated = false

  const { reviewPointsById } = local
  if (local.pointList !== pointList) {
    for (const point of pointList) {
      if (!reviewPointsById[point._id]) {
        reviewPointsById[point._id] = { point, whyMosts: [], whyLeasts: [], rank: {} }
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
