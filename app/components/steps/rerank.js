// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

'use strict'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from '../review-point'
import DeliberationContext from '../deliberation-context'
import { isEqual } from 'lodash'
import ObjectId from 'bson-objectid'

export default function RerankStep(props) {
  const { onDone } = props
  const { data, upsert } = useContext(DeliberationContext)
  const args = { ...derivePointMostsLeastsRankList(data) }
  const handleOnDone = ({ valid, value, delta }) => {
    if (delta) {
      upsert({ postRankByParentId: { [delta.parentId]: delta }, completedByRound: { [data.round]: valid } })
      window.socket.emit('upsert-rank', delta)
    }
    if (valid) {
      const rankByIds = data.reducedPointList.map(point_group => {
        const pointId = point_group.point._id
        const rank = data.postRankByParentId[pointId]?.category === 'most' ? 1 : 0
        return { [pointId]: rank }
      })
      window.socket.emit('complete-round', data.discussionId, data.round, rankByIds, () => {})
    }
    onDone({ valid, value })
  }

  // fetch previous data
  if (typeof window !== 'undefined')
    useState(() => {
      // on the browser, do this once and only once when this component is first rendered
      const { discussionId, round, reducedPointList } = data
      window.socket.emit(
        'get-user-post-ranks-and-top-ranked-whys',
        discussionId,
        round,
        reducedPointList.map(point_group => point_group.point._id),
        result => {
          if (!result) return // there was an error
          const { ranks, whys } = result
          //if (!ranks.length && !whys.length) return // nothing to do
          const postRankByParentId = ranks.reduce((postRankByParentId, rank) => ((postRankByParentId[rank.parentId] = rank), postRankByParentId), {})
          const topWhyById = whys.reduce((topWhyById, point) => ((topWhyById[point._id] = point), topWhyById), {})
          upsert({ postRankByParentId, topWhyById })
        }
      )
    })
  return <Rerank {...props} {...args} round={data.round} discussionId={data.discussionId} onDone={handleOnDone} />
}

// table to map from data model properties, to the Rank Strings shown in the UI
const toRankString = {
  undefined: '',
  most: 'Most',
  least: 'Least',
  neutral: 'Neutral',
}

// table to map from UI's Rank Strings to the data model prpoerty names
const rankStringToCategory = Object.entries(toRankString).reduce((rS2C, [key, value]) => {
  if (key === 'undefined') return rS2C // rankStringToCategory[''] will be undefined
  rS2C[value] = key
  return rS2C
}, {})

export function Rerank(props) {
  const { reviewPoints, onDone = () => {}, className, round, discussionId } = props
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

  // if reviewPoints are changed from above, we need to set the state and cause rerendering
  // if they haven't changed - don't set state - on initial render they won't have changed don't set state
  useEffect(() => {
    const newRankByParentId = (reviewPoints || []).reduce((rankByParentId, reviewPoint) => {
      if (reviewPoint.rank) rankByParentId[reviewPoint.point._id] = reviewPoint.rank
      return rankByParentId
    }, {})
    let updated = false
    for (const rankDoc of Object.values(newRankByParentId)) {
      if (isEqual(rankDoc, rankByParentId[rankDoc.parentId])) {
        newRankByParentId[rankDoc.parentId] = rankByParentId[rankDoc.parentId]
      }
      // don't change the ref if it hasn't changed in conotent
      else updated = true
    }
    if (updated) {
      setRankByParentId(newRankByParentId)
      const percentDone = Object.keys(newRankByParentId).length / reviewPoints.length
      onDone({ valid: percentDone >= 1, value: percentDone })
    }
    // if an item in the updated reviewPoints does not have a rank doc where it previously did, the rank doc will remain.
    // deleting a rank is not a use case
  }, [reviewPoints])

  // first time through should call onDone if there are reviewPoints to notify parent of valid status
  useEffect(() => {
    if (reviewPoints) {
      const percentDone = Object.keys(rankByParentId).length / reviewPoints.length
      onDone({ valid: percentDone >= 1, value: percentDone })
    }
  }, [])

  // handle user input from below, keep track of the new values by mutating state - without calling set state and causing a rerender
  // call onDone to notify parent of new values, and add the delta prop to pass what's changed to the parent
  const handleReviewPoint = (point, result) => {
    const rankString = result.value
    // the above vars are needed when calling onDone which must be done outside the set function
    setRankByParentId(rankByParentId => {
      // doing this within the set function because handleReviewPoint could get called multiple time before the next rerender which updates the state value returned by useState
      let rank
      let percentDone
      if (rankByParentId[point._id]) {
        if (rankByParentId[point._id].category !== rankStringToCategory[rankString]) {
          rank = { ...rankByParentId[point._id], category: rankStringToCategory[rankString] }
          rankByParentId[point._id] = rank // mutate the state don't call the set function
          percentDone = Object.keys(rankByParentId).length / reviewPoints.length
        } else {
          // don't call onDone, the data is already there
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
        rankByParentId[point._id] = rank
        percentDone = Object.keys(rankByParentId).length / reviewPoints.length
      }
      if (rank) setTimeout(() => onDone({ valid: percentDone === 1, value: percentDone, delta: rank })) // don't call onDone from within a setter - because onDone's may call other react hooks and react causes errors
      return rankByParentId // about the setter
    })
  }

  if (!reviewPoints) return null // nothing ready yet

  return (
    <div className={classes.reviewPointsContainer}>
      {reviewPoints.map((reviewPoint, idx) => (
        <div key={reviewPoint.point._id} className={classes.reviewPoint}>
          <ReviewPoint
            point={reviewPoint.point}
            leftPointList={reviewPoint.mosts}
            rightPointList={reviewPoint.leasts}
            rank={toRankString[rankByParentId[reviewPoint.point._id]?.category]}
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
    paddingLeft: '1rem', // room for the shadow around the points
    paddingRight: '1rem',
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
  const { reducedPointList, postRankByParentId, topWhyById, myWhyByParentId } = data
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
  function addWhysToReviewPointsById(whys) {
    let index
    const categoiesToUpdateByParentId = {}
    for (const whyPoint of whys) {
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
        if (!reviewPointsById[whyPoint.parentId][category + 's']) reviewPointsById[whyPoint.parentId][category + 's'] = []
        reviewPointsById[whyPoint.parentId][category + 's'].push(whyPoint)
        if (!categoiesToUpdateByParentId[whyPoint.parentId]) categoiesToUpdateByParentId[whyPoint.parentId] = []
        categoiesToUpdateByParentId[whyPoint.parentId].push(category)
        updated = true
      }
    }
    Object.entries(categoiesToUpdateByParentId).forEach(([parentId, categories]) => categories.forEach(category => (reviewPointsById[parentId][category + 's'] = [...reviewPointsById[parentId][category + 's']])))
  }
  if (local.myWhyByParentId !== myWhyByParentId) {
    addWhysToReviewPointsById(Object.values(myWhyByParentId))
    local.myWhyByParentId = myWhyByParentId
  }
  if (local.topWhyById !== topWhyById) {
    local.topWhyById = topWhyById
    addWhysToReviewPointsById(Object.values(topWhyById))
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
  return { reviewPoints: local.reviewPoints }
}
