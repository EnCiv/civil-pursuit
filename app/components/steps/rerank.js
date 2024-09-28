// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

'use strict'
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from '../review-point'
import DeliberationContext from '../deliberation-context'
import { isEqual } from 'lodash'
import ObjectId from 'bson-objectid'

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

const rankStringToCategory = Object.entries(toRankString).reduce((rS2C, [key, value]) => {
  if (key === 'undefined') return rS2C // rankStringToCategory[''] will be undefined
  rS2C[value] = key
  return rS2C
}, {})

export function Rerank(props) {
  const { reviewPoints, onDone = () => {}, className, round, discussionId, ...otherProps } = props
  // this componet manages the rank doc so we keep a local copy
  // if it's changed from above, we use the setter to cause a rerender
  // if it's chagned from below (by the user) we mutate the state so we don't cause a rerender
  const [rankByParentId, setRankByParentId] = useState(
    (reviewPoints || []).reduce((rankByParentId, reviewPoint) => {
      if (reviewPoint.rank) rankByParentId[reviewPoint.point._id] = reviewPoint.rank
      return rankByParentId
    }, {})
  )

  const classes = useStylesFromThemeFunction()

  useEffect(() => {
    const newRankByParentId = (reviewPoints || []).reduce((rankByParentId, reviewPoint) => {
      if (reviewPoint.rank) rankByParentId[reviewPoint.point._id] = reviewPoint.rank
      return rankByParentId
    }, {})
    let updated = false
    for (const rankDoc of Object.values(newRankByParentId)) {
      if (isEqual(rankDoc, rankByParentId[rankDoc.parentId])) {
        console.info('isEqual', rankDoc, rankByParentId[rankDoc.parentId])
        newRankByParentId[rankDoc.parentId] = rankByParentId[rankDoc.parentId]
      }
      // don't change the ref if it hasn't changed in conotent
      else updated = true
    }
    if (updated) {
      console.info('updated')
      setRankByParentId(newRankByParentId)
    }
    // if an item in the updated reviewPoints does not have a rank doc where it previously did, the rank doc will remain.
    // deleting a rank is not a use case
  }, [reviewPoints])

  // first time through should call onDone if there are reviewPoints
  useEffect(() => {
    if (reviewPoints) {
      const percentDone = Object.keys(rankByParentId).length / reviewPoints.length
      onDone({ valid: percentDone >= 1, value: percentDone })
    }
  }, [])

  const handleReviewPoint = (point, result) => {
    const rankString = result.value
    let rank
    let percentDone
    // the above vars are needed when calling onDone which must be done outside the set function
    setRankByParentId(rankByParentId => {
      // doin this within the set function because handleReviewPoint could get called multiple time before the next rerender which updates the state value returned by useState
      if (rankByParentId[point._id]) {
        if (rankByParentId[point._id].category !== rankStringToCategory[rankString]) {
          rank = { ...rankByParentId[point._id], category: rankStringToCategory[rankString] }
          console.info('handle', rankString, rank, rankStringToCategory)
          const newRankByParentId = {
            ...rankByParentId,
            [point._id]: rank,
          }
          percentDone = Object.keys(newRankByParentId).length / reviewPoints.length
          return newRankByParentId
        } else {
          percentDone = Object.keys(rankByParentId).length / reviewPoints.length
          rank = rankByParentId[point._id]
          return rankByParentId // nothing has changed, so abort the setter and don't cause a rerender
        }
      } else {
        rank = {
          _id: ObjectId().toString(),
          stage: 'post',
          category: rankStringToCategory[rankString],
          parentId: point._id,
          round,
          discussionId,
        }
        const newRankByParentId = { ...rankByParentId, [point._id]: rank }
        percentDone = Object.keys(newRankByParentId).length / reviewPoints.length
        return newRankByParentId
      }
    })
    if (rank) onDone({ valid: percentDone === 1, value: percentDone, delta: rank })
  }

  if (!reviewPoints) return null // nothing ready yet

  return (
    <div className={classes.reviewPointsContainer} {...otherProps}>
      {reviewPoints.map((reviewPoint, idx) => (
        <div key={idx} className={classes.reviewPoint}>
          <ReviewPoint
            point={reviewPoint.point}
            leftPointList={reviewPoint.mosts}
            rightPointList={reviewPoint.leasts}
            rank={
              (console.info(
                'rank',
                rankByParentId[reviewPoint.point._id],
                toRankString[rankByParentId[reviewPoint.point._id]?.category]
              ),
              toRankString[rankByParentId[reviewPoint.point._id]?.category])
            }
            onDone={result => handleReviewPoint(reviewPoint.point, result)}
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
