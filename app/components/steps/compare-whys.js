// https://github.com/EnCiv/civil-pursuit/issues/77
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import PairCompare from '../pair-compare'
import { H, Level } from 'react-accessible-headings'

import DeliberationContext from '../deliberation-context'
import { isEqual } from 'lodash'
import ObjectId from 'bson-objectid'

export default function CompareWhysStep(props) {
  const { onDone, category } = props
  const { data, upsert } = useContext(DeliberationContext)
  const args = { ...derivePointWithWhyRankListLisyByCategory(data, category) }
  const handleOnDone = ({ valid, value, delta }) => {
    if (delta) {
      upsert({ whyRankByParentId: { [delta.parentId]: delta } })
      window.socket.emit('upsert-rank', delta)
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
          const [ranks, whys] = result
          //if (!ranks.length && !whys.length) return // nothing to do
          const postRankByParentId = ranks.reduce((postRankByParentId, rank) => ((postRankByParentId[rank.parentId] = rank), postRankByParentId), {})
          const topWhyById = whys.reduce((topWhyById, point) => ((topWhyById[point._id] = point), topWhyById), {})
          upsert({ postRankByParentId, topWhyById })
        }
      )
    })
  return <CompareWhys {...props} {...args} round={data.round} discussionId={data.discussionId} onDone={handleOnDone} />
}

// pointWithWhyRankListList = [{point: {}, whyRankList: [why:{}, rank:{}]]
export function CompareWhys(props) {
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

// pointWithWhyRankByWhyIdByPointId={id: {point, whyRankByWhyId: {id: {why, rank}}}}

export function derivePointWithWhyRankListLisyByCategory(data, category) {
  // pointWithWhyRankListList shouldn't default to [], it should be undefined until data is fetched from the server. But then, [] is ok
  const local = useRef({ pointWithWhyRankListList: undefined, pointWithWhyRankByWhyIdByPointId: {} }).current
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
      if (why.category !== category) continue
      if (!pointWithWhyRankByWhyIdByPointId[why.parentId]) continue // a why's parent not here
      if (pointWithWhyRankByWhyIdByPointId[why.parentId]?.whyRankByWhyId[why._id]?.why !== why) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id] = {
          why,
          rank: whyRankByParentId?.[why._id],
        }
        updatedPoints[why.parentId] = true
      } else if (pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank !== whyRankByParentId?.[why._id]) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank = whyRankByParentId[why._id]
        updatedPoints[why.parentId] = true
      }
    }
    local.randomWhyById = randomWhyById
    local.whyRankByParentId = whyRankByParentId
  }
  //const newPointWithWhyRankListList=Object.values(pointWithWhyRankByWhyIdByPointId).map(pointWithWhyRankByParentId=>({point: pointWithWhyRankByParentId.point, whyRanks: Object.values(pointWithWhyRankByParentId.whyRankByParentId)}))
  const newPointWithWhyRankListList = []
  let updated = false
  for (const pointWithWhyRankList of pointWithWhyRankListList ?? []) {
    const pointId = pointWithWhyRankList.point._id
    if (updatedPoints[pointId]) {
      newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRanks: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
      updated = true
    } else newPointWithWhyRankListList.push(pointWithWhyRankList)
    delete updatedPoints[pointId]
  }
  for (const pointId of Object.keys(updatedPoints)) {
    newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRanks: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
    updated = true
  }
  if (updated) local.pointWithWhyRankListList = newPointWithWhyRankListList
  return { pointWithWhyRankListList: local.pointWithWhyRankListList }
}
