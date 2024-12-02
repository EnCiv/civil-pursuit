// https://github.com/EnCiv/civil-pursuit/issues/77
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import PairCompare from '../pair-compare'
import { H, Level } from 'react-accessible-headings'

import DeliberationContext from '../deliberation-context'

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
      const { discussionId, round, reducedPointList, preRankByParentId } = data
      const { mostIds, leastIds } = Object.values(preRankByParentId).reduce(
        ({ mostIds, leastIds }, rank) => {
          if (rank.category === 'most') mostIds.push(rank.parentId)
          else if (rank.category === 'least') leastIds.push(rank.parentId)
          return { mostIds, leastIds }
        },
        { mostIds: [], leastIds: [] }
      )
      window.socket.emit(
        'get-why-ranks-and-points',
        discussionId,
        round,
        mostIds,
        leastIds,
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
  // completedByPointId does not effect rendering, so no need to set state, just mutate.
  const [completedByPointId] = useState(
    pointWithWhyRankListList.reduce((completedByPointId, pointWithWhyRankList) => {
      completedByPointId[pointWithWhyRankList.point._id] = false
      return completedByPointId
    }, {})
  )

  useEffect(() => {
    // if new points get added, mark them as incomplete
    for (const pointWithWhyRankList of pointWithWhyRankListList) {
      if (typeof completedByPointId[pointWithWhyRankList.point._id] === 'undefined') completedByPointId[pointWithWhyRankList.point._id] = false
    }
  }, [pointWithWhyRankListList])

  const handlePairCompare = ({ valid, value }, _id) => {
    if (valid) completedByPointId[_id] = true
    else completedByPointId[_id] = false
    const [done, total] = Object.values(completedByPointId).reduce(
      ([done, total], completed) => {
        if (completed) done++
        total++
        return [done, total]
      },
      [0, 0]
    )
    const percentDone = done / total
    onDone({ valid: percentDone >= 1, value: percentDone, delta: value })
  }

  return (
    <div className={classes.container} {...otherProps}>
      {pointWithWhyRankListList.map(({ point, whyRankList }) => (
        <div key={point._id} className={classes.headlinePoint}>
          <H className={classes.headlineTitle}>Please choose the most convincing explanation for...</H>
          <H className={classes.headlineSubject}>{point.subject}</H>
          <Level>
            <PairCompare className={classes.pairCompare} whyRankList={whyRankList} onDone={value => handlePairCompare(value, point._id)} />
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
