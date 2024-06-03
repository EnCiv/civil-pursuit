// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from './review-point.jsx'

const ReviewPointList = ({ ReviewPoints = [], onDone = () => {} }) => {
  const [rankedPoints, setRankedPoints] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)

  const classes = useStylesFromThemeFunction()

  useEffect(() => {
    if (!isCompleted && rankedPoints.length === ReviewPoints.length) {
      const donePercentage = (rankedPoints.length / ReviewPoints.length) * 100
      onDone({ valid: true, value: donePercentage })
      setIsCompleted(true)
    }
  }, [rankedPoints, ReviewPoints, onDone, isCompleted])
  const handleReviewPointDone = pointId => {
    if (!rankedPoints.includes(pointId)) {
      setRankedPoints(prevPoints => [...prevPoints, pointId])
    }
  }

  return (
    <div className={classes.reviewPointsContainer}>
      {ReviewPoints.map(reviewPoint => (
        <ReviewPoint
          key={reviewPoint.point._id}
          point={reviewPoint.point}
          leftPointList={reviewPoint.leftPoints}
          rightPointList={reviewPoint.rightPoints}
          rank={reviewPoint.rank}
          onDone={() => handleReviewPointDone(reviewPoint.point._id)}
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
