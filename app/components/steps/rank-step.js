// https://github.com/EnCiv/civil-pursuit/issues/65
// https://github.com/EnCiv/civil-pursuit/issues/191
// https://github.com/EnCiv/civil-pursuit/issues/199

import React, { useState, useEffect, useRef, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import DeliberationContext from '../deliberation-context'
import Point from '../point'
import PointGroup from '../point-group' // should be using PointGroup but it needs to support children
import { ModifierButton } from '../button.jsx'
import StatusBadge from '../status-badge'
import StatusBox from '../status-box'

import Ranking from '../ranking'

const minSelectionsTable = {
  0: { least: 0, most: 0 },
  1: { least: 0, most: 0 },
  2: { least: 0, most: 0 },
  3: { least: 0, most: 1 },
  4: { least: 1, most: 1 },
  5: { least: 1, most: 1 },
  6: { least: 1, most: 2 },
  7: { least: 1, most: 2 },
  8: { least: 1, most: 2 },
  9: { least: 1, most: 2 },
  10: { least: 1, most: 2 },
  11: { least: 1, most: 2 },
  12: { least: 1, most: 2 },
}

export default function RankStep(props) {
  const { onDone } = props
  const { data, upsert } = useContext(DeliberationContext)

  function handleOnDone({ valid, value, delta }) {
    if (delta) upsert({ preRankByParentId: { [delta.parentId]: delta } })
    onDone({ valid, value })
  }

  return <RankPoints {...derivePointRankGroupList(data)} onDone={handleOnDone} {...props} />
}

export function RankPoints(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    pointRankGroupList,
    ...otherProps
  } = props

  if (!pointRankGroupList) return null

  // rankList won't change except by parent, but ranks inside the list will change by setRank
  // so updateCount is used to determin when rank updates are made
  const [updateCount, setUpdateCount] = useState(1)
  const [rankDiscrepancies, setRankDiscrepancies] = useState({})

  const table = minSelectionsTable[pointRankGroupList.length] ?? { least: 0, most: 0 }
  const { least: targetLeast, most: targetMost } = table
  const mostCount = () => getRankCount('Most')
  const leastCount = () => getRankCount('Least')

  const setRank = (id, rank) => {
    const it = pointRankGroupList.find(ro => ro._id === id)
    if (it) it.rank = rank

    setUpdateCount(updateCount + 1)
  }

  const getRankCount = rankName => {
    return pointRankGroupList.filter(point => point.rank === rankName).length
  }

  const getPointRank = point => {
    return pointRankGroupList?.find(rank => rank._id === point._id)?.rank
  }

  // in useEffect so it's called after setRank updates have taken effect
  useEffect(() => {
    onDone(validAndPercentDone())
  }, [updateCount])

  const validAndPercentDone = () => {
    let doneCount = 0
    let it
    for (const point of pointRankGroupList) {
      if ((it = pointRankGroupList.find(ro => ro._id === point._id)) && it.rank) doneCount++
    }

    // Check for difference in expected most/least counts
    const mostDiscrepancy = mostCount() - targetMost
    const leastDiscrepancy = leastCount() - targetLeast

    const valid =
      (mostDiscrepancy == 0 && leastDiscrepancy == 0 && doneCount === pointRankGroupList.length) ||
      (doneCount === pointRankGroupList.length && targetLeast == 0 && targetMost == 0) // No minimum constraint when there's a single point.

    setRankDiscrepancies({ most: mostDiscrepancy, least: leastDiscrepancy })

    return [valid, pointRankGroupList.length ? doneCount / pointRankGroupList.length : 0] // value should be 0 if not points in list not null
  }

  // Set the status box error message
  let errorMsg
  if (targetLeast > 0 && targetMost > 0) {
    if (rankDiscrepancies.most > 0 && rankDiscrepancies.least > 0) {
      errorMsg = `You've rated too many responses as "Most Important" and "Least Important." Please edit.`
    } else if (rankDiscrepancies.most > 0) {
      errorMsg = `You've rated too many responses as "Most Important." Please edit.`
    } else if (rankDiscrepancies.least > 0) {
      errorMsg = `You've rated too many responses as "Least Important." Please edit.`
    }
  }

  return (
    <div className={cx(classes.rankStep, className)} {...otherProps}>
      <div className={classes.buttonDiv}>
        <div className={classes.leftButtons}>
          <StatusBadge
            name={'Most Important'}
            number={`${mostCount()}/${targetMost}`}
            status={
              mostCount() == targetMost || (targetLeast == 0 && targetMost == 0)
                ? 'complete'
                : mostCount() > targetMost
                ? 'error'
                : 'progress'
            }
          />
          <StatusBadge
            name={'Least Important'}
            number={`${leastCount()}/${targetLeast}`}
            status={
              leastCount() == targetLeast || (targetLeast == 0 && targetMost == 0)
                ? 'complete'
                : leastCount() > targetLeast
                ? 'error'
                : 'progress'
            }
          />
        </div>
        <div className={classes.rightButtons}>
          <ModifierButton
            className={className.clearButton}
            title="Clear All"
            children={'Clear All'}
            onDone={() => {
              pointRankGroupList.forEach(point => {
                setRank(point._id, null)
              })
              setUpdateCount(updateCount + 1)
            }}
          />
        </div>
      </div>
      <div className={cx(classes.pointDiv)}>
        {pointRankGroupList.map((point, i) => {
          const rankInvalid =
            ((rankDiscrepancies.most > 0 && getPointRank(point) == 'Most') ||
              (rankDiscrepancies.least > 0 && getPointRank(point) == 'Least')) &&
            targetLeast > 0 &&
            targetMost > 0
          return (
            <Point
              key={point._id}
              point={point}
              vState="default"
              className={rankInvalid ? classes.invalidBackground : classes.validBackground}
              isInvalid={rankInvalid}
              data-testid={`point`}
            >
              <Ranking
                className={classes.rank}
                defaultValue={pointRankGroupList.find(ro => ro._id === point._id)?.rank}
                onDone={({ valid, value }) => {
                  if (valid) setRank(point._id, value)
                  else setRank(point._id, '')
                }}
              />
            </Point>
          )
        })}
      </div>
      <div className={classes.statusBoxDiv}>
        {errorMsg && <StatusBox status="error" subject="Oops!" description={errorMsg}></StatusBox>}
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  rankStep: {},
  buttonDiv: {
    padding: '2rem 0rem 3rem 0rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftButtons: { display: 'flex', alignItems: 'center', gap: '1rem' },
  rightButtons: {},
  pointDiv: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'block',
      '& > div': {
        marginBottom: '2rem',
      },
      '& > div:last-child': {
        marginBottom: 0,
      },
    },
  },
  rank: {
    paddingTop: '1rem',
  },
  invalidBackground: {
    backgroundColor: theme.colors.inputErrorContainer,
    border: `0.125rem solid ${theme.colors.rankInvalidBorder}`,
  },
  validBackground: {},
  statusBoxDiv: {
    paddingTop: '3rem',
    textAlign: 'center',
  },
}))

export function derivePointRankGroupList(data) {
  const local = useRef({ rankPointsById: {} }).current

  const { reducedPointList, preRankByParentId } = data
  let updated = false

  const { rankPointsById } = local
  if (local.reducedPointList !== reducedPointList) {
    for (const { point } of reducedPointList) {
      if (!rankPointsById[point._id]) {
        rankPointsById[point._id] = { point }
        updated = true
      } else if (rankPointsById[point._id]?.point !== point) {
        rankPointsById[point._id].point = point
        updated = true
      }
    }
    local.reducedPointList = reducedPointList
  }

  if (local.preRankByParentId !== preRankByParentId) {
    for (const rank of Object.values(preRankByParentId)) {
      if (rankPointsById[rank.parentId]) {
        if (rankPointsById[rank.parentId].rank !== rank) {
          rankPointsById[rank.parentId].rank = rank
          updated = true
        }
        if (rankPointsById[rank.parentId].groupedPoints !== groupedPoints) {
          rankPointsById[rank.parentId].groupedPoints = groupedPoints
          updated = true
        }
      }
    }
    local.preRankByParentId = preRankByParentId
  }

  if (updated) local.pointRankGroupList = Object.values(local.rankPointsById)
  return { pointRankGroupList: local.pointRankGroupList }
}
