// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect } from 'react'
import ReviewPoint from './review-point.jsx'

const ReviewPointList = ({ ReviewPoints = [], onDone = () => {} }) => {
  const [rankedPoints, setRankedPoints] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!isCompleted && rankedPoints.length === ReviewPoints.length) {
      const donePercentage = (rankedPoints.length / ReviewPoints.length) * 100
      onDone(true, donePercentage)
      setIsCompleted(true)
    }
  }, [rankedPoints, ReviewPoints, onDone, isCompleted])
  const handleReviewPointDone = pointId => {
    if (!rankedPoints.includes(pointId)) {
      setRankedPoints(prevPoints => [...prevPoints, pointId])
    }
  }

  return (
    <div>
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

export default ReviewPointList
