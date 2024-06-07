// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from './review-point.jsx'

const ReviewPointList = ({ ReviewPoints = [], onDone = () => {} }) => {
  const [rankedPoints, setRankedPoints] = useState(new Map())

  const classes = useStylesFromThemeFunction()

  const handleReviewPointDone = (pointId, selectedRank) => {
    setRankedPoints(prevRankedPoints => {
      const newRankedPoints = new Map(prevRankedPoints)
      newRankedPoints.set(pointId, selectedRank)

      // Check if all points have been ranked
      if (newRankedPoints.size === ReviewPoints.length) {
        const donePercentage = (newRankedPoints.size / ReviewPoints.length) * 100
        onDone({
          valid: true,
          value: {
            donePercentage,
          },
        })
      } else {
        const donePercentage = (newRankedPoints.size / ReviewPoints.length) * 100
        onDone({
          valid: false,
          value: {
            donePercentage,
          },
        })
      }

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
