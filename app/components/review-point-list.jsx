// https://github.com/EnCiv/civil-pursuit/issues/61

'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from './review-point'

function ReviewPointList(props) {
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

export default ReviewPointList
