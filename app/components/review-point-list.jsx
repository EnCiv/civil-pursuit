// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from './review-point.jsx'

const ReviewPointList = ({ ReviewPoints = [], onDone = () => {} }) => {
  const [rankedPoints, setRankedPoints] = useState(new Map())

  const classes = useStylesFromThemeFunction()

  useEffect(() => {
    // Check if all points have been ranked
    if (rankedPoints.size === ReviewPoints.length) {
      console.log('ReviewPoints:', ReviewPoints)
      const donePercentage = (rankedPoints.size / ReviewPoints.length) * 100

      // Call onDone with the completed ranking information
      onDone({
        valid: true,
        value: {
          donePercentage,
        },
      })
    }
  }, [rankedPoints])

  const handleReviewPointDone = (pointId, selectedRank) => {
    setRankedPoints(prevRankedPoints => {
      const newRankedPoints = new Map(prevRankedPoints)
      newRankedPoints.set(pointId, selectedRank)
      return newRankedPoints
    })
  }

  return (
    <div className={classes.reviewPointsContainer}>
      {ReviewPoints.map(reviewPoint => (
        <ReviewPoint
          key={reviewPoint.point._id}
          point={reviewPoint.point}
          leftPointList={reviewPoint.leftPoints}
          rightPointList={reviewPoint.rightPoints}
          rank={rankedPoints.get(reviewPoint.point._id) || reviewPoint.rank}
          onDone={selectedRank => handleReviewPointDone(reviewPoint.point._id, selectedRank)}
        />
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

export default ReviewPointList
