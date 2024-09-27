// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

'use strict'
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from '../review-point'
import DeliberationContext from '../deliberation-context'

export default function ReRankStep(props) {
  const { data, upsert } = useContext(DeliberationContext)

  return <Rerank {...derivePointMostsLeastsRankList(data)} {...props} />
}

const toRankString = {
  undefined: '',
  most: 'Most',
  least: 'Least',
  neutral: 'Neutral',
}

export function Rerank(props) {
  const { reviewPoints = [], onDone = () => {}, className, ...otherProps } = props
  const [rankedPoints, setRankedPoints] = useState(new Set())
  const [percentDone, setPercentDone] = useState(0)

  const classes = useStylesFromThemeFunction()

  useEffect(() => {
    if (reviewPoints.length === 0) {
      setPercentDone(100)
    } else {
      const initialRankedPoints = reviewPoints.filter(point => point.rank).length
      setRankedPoints(new Set(reviewPoints.filter(point => point.rank).map(point => point.point._id)))
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
            leftPointList={reviewPoint.mosts}
            rightPointList={reviewPoint.leasts}
            rank={toRankString[reviewPoint.rank?.category]}
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


   Input pointList, mosts, whyLeasts, rankDocs
   Output: reviewPoints=[{point, mosts, leasts, rankDoc}]

   usage 
        function ReviewStep(props) {
            return <ReviewPointList reviewPoints={deriveReviewPoints()} {...props} />
        }
*/

// to make is possible to test with jest, this is exported
export function derivePointMostsLeastsRankList(data) {
  const local = useRef({ reviewPointsById: {} }).current
  const { reducedPointList, postRankByParentId, topWhyByParentId } = data
  let updated = false

  const { reviewPointsById } = local
  if (local.reducedPointList !== reducedPointList) {
    for (const { point } of reducedPointList) {
      if (!reviewPointsById[point._id]) {
        reviewPointsById[point._id] = { point }
        updated = true
      } else if (reviewPointsById[point._id]?.point !== point) {
        reviewPointsById[point._id].point = point
        updated = true
      }
    }
    local.reducedPointList = reducedPointList
  }
  if (local.topWhyByParentId !== topWhyByParentId) {
    local.topWhyByParentId = topWhyByParentId
    let index
    const categoiesToUpdateByParentId = {}
    for (const whyPoint of Object.values(topWhyByParentId)) {
      if (!reviewPointsById[whyPoint.parentId]) continue // parent not in pointList
      const category = whyPoint.category
      if ((index = reviewPointsById[whyPoint.parentId][category + 's']?.findIndex(w => w._id === whyPoint._id)) >= 0) {
        if (reviewPointsById[whyPoint.parentId][category + 's'][index] !== whyPoint) {
          reviewPointsById[whyPoint.parentId][category + 's'][index] = whyPoint
          if (!categoiesToUpdateByParentId[whyPoint.parentId]) categoiesToUpdateByParentId[whyPoint.parentId] = []
          categoiesToUpdateByParentId[whyPoint.parentId].push(category)
          updated = true
        } // else no need to update
      } else {
        if (!reviewPointsById[whyPoint.parentId][category + 's'])
          reviewPointsById[whyPoint.parentId][category + 's'] = []
        reviewPointsById[whyPoint.parentId][category + 's'].push(whyPoint)
        if (!categoiesToUpdateByParentId[whyPoint.parentId]) categoiesToUpdateByParentId[whyPoint.parentId] = []
        categoiesToUpdateByParentId[whyPoint.parentId].push(category)
        updated = true
      }
    }
    Object.entries(categoiesToUpdateByParentId).forEach(([parentId, categories]) =>
      categories.forEach(
        category => (reviewPointsById[parentId][category + 's'] = [...reviewPointsById[parentId][category + 's']])
      )
    )
  }
  if (local.postRankByParentId !== postRankByParentId) {
    for (const rank of Object.values(postRankByParentId)) {
      if (reviewPointsById[rank.parentId]) {
        if (reviewPointsById[rank.parentId].rank !== rank) {
          reviewPointsById[rank.parentId].rank = rank
          updated = true
        }
      } // else some rankDoc's could relate to a whyPoint so do nothing in that case
    }
    local.postRankByParentId = postRankByParentId
  }
  if (updated) local.reviewPoints = Object.values(local.reviewPointsById)
  return local.reviewPoints
}
