// https://github.com/EnCiv/civil-pursuit/issues/77
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import PairCompare from '../pair-compare'
import { H, Level } from 'react-accessible-headings'

// pointWithWhyRankListList = [{point: {}, whyRankList: [why:{}, rank:{}]]
function CompareReasons(props) {
  const { pointWithWhyRankListList = [], side = '', onDone = () => {}, className, ...otherProps } = props
  const classes = useStyles()
  const [completedPoints, setCompletedPoints] = useState(new Set())
  const [percentDone, setPercentDone] = useState(0)

  useEffect(() => {
    if (completedPoints.size === pointWithWhyRankListList.length) {
      onDone({ valid: true, value: percentDone })
    } else {
      onDone({ valid: false, value: percentDone })
    }
  }, [completedPoints, percentDone])

  useEffect(() => {
    if (pointWithWhyRankListList.length === 0) setPercentDone(100)
    else {
      setPercentDone(Number(((completedPoints.size / pointWithWhyRankListList.length) * 100).toFixed(2)))
    }
  }, [completedPoints, pointWithWhyRankListList])

  const handlePairCompare = ({ valid, value }, idx) => {
    setCompletedPoints(prevPoints => {
      const updatedPoints = new Set(prevPoints)
      if (valid) {
        updatedPoints.add(idx)
      } else {
        updatedPoints.delete(idx)
      }
      return updatedPoints
    })
  }

  return (
    <div className={classes.container} {...otherProps}>
      {pointWithWhyRankListList.map(({ point, whyRankList }, idx) => (
        <div key={idx} className={classes.headlinePoint}>
          <H className={classes.headlineTitle}>Please choose the most convincing explanation for...</H>
          <H className={classes.headlineSubject}>{point.subject}</H>
          <Level>
            <PairCompare className={classes.pairCompare} whyRankList={whyRankList} onDone={value => handlePairCompare(value, idx)} />
          </Level>
        </div>
      ))}
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    fontFamily: theme.font.fontFamily,
  },
  headlinePoint: {
    borderTop: '0.0625rem solid #000000',
    marginBottom: '4rem',
    paddingTop: '2rem',
    '&:first-child': {
      borderTop: 'none',
    },
  },
  headlineTitle: {
    fontWeight: '600',
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  headlineSubject: {
    fontWeight: '300',
    fontSize: '2.25rem',
    lineHeight: '2.9375rem',
  },
  pairCompare: {
    marginTop: '1rem',
  },
}))

export default CompareReasons

// pointWithWhyRankByWhyIdByPointId={id: {point, whyRankByWhyId: {id: {why, rank}}}}

export function derivePointWithWhyRankListLisyByCategory(data, category) {
  const local = useRef({ pointWithWhyRankListList: {}, pointWithWhyRankByWhyIdByPointId: {} }).current
  const { reducedPointList, randomWhyById, whyRankByParentId } = data
  const { pointWithWhyRankListList, pointWithWhyRankByWhyIdByPointId } = local
  let updatedPoints = {}
  if (local.reducedPointList !== reducedPointList) {
    for (const pointGroup of reducedPointList) {
      if (!pointWithWhyRankByWhyIdByPointId[pointGroup.point._id]?.point !== pointGroup.point) {
        if (!pointWithWhyRankByWhyIdByPointId[pointGroup.point._id]) pointWithWhyRankByWhyIdByPointId[pointGroup.point._id] = { whyRankByWhyId: {} }
        pointWithWhyRankByWhyIdByPointId[pointGroup.point._id].point = pointGroup.point
        updatedPoints[pointGroup.point._id] = true
      }
    }
    local.reducedPointList = reducedPointList
  }
  if (local.randomWhyById !== randomWhyById || local.whyRankByParentId !== whyRankByParentId) {
    for (const why of Object.values(randomWhyById)) {
      if (!pointWithWhyRankByWhyIdByPointId[why.parentId]) continue // a why's parent not here
      if (pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].why !== why) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id] = {
          why,
          rank: (pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank = whyRankByParentId[why._id]),
        }
        updatedPoints[why.parentId] = true
      } else if (pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank !== whyRankByParentId[why._id]) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank = { why, rank: whyRankByParentId[why._id] }
        updatedPoints[why.parentId] = true
      }
    }
    local.randomWhyById = randomWhyById
    local.whyRankByParentId = whyRankByParentId
  }
  //const newPointWithWhyRankListList=Object.values(pointWithWhyRankByWhyIdByPointId).map(pointWithWhyRankByParentId=>({point: pointWithWhyRankByParentId.point, whyRanks: Object.values(pointWithWhyRankByParentId.whyRankByParentId)}))
  const newPointWithWhyRankListList = []
  const updated = false
  for (const pointWithWhyRankList of pointWithWhyRankListList) {
    const pointId = pointWithWhyRankList.point._id
    if (updatedPoints[pointId]) {
      newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRanks: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
      updated = true
    } else newPointWithWhyRankListList.push(pointWithWhyRankList)
    delete updatedPoints[pointWithWhyRankList.point._id]
  }
  for (const pointId of Object.keys(updatedPoints)) {
    newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRanks: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
    updated = true
  }
  if (updated) local.pointWithWhyRankListList = newPointWithWhyRankListList
  return local.pointWithWhyRankListList
}
