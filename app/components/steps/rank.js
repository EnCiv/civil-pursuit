// https://github.com/EnCiv/civil-pursuit/issues/65
// https://github.com/EnCiv/civil-pursuit/issues/191
// https://github.com/EnCiv/civil-pursuit/issues/199

import React, { useState, useEffect, useRef, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { isEqual } from 'lodash'
import ObjectId from 'bson-objectid'

import DeliberationContext from '../deliberation-context.js'
import Point from '../point.jsx'
import PointGroup from '../point-group.jsx' // should be using PointGroup but it needs to support children
import { ModifierButton } from '../button.jsx'
import StatusBadge from '../status-badge.jsx'
import StatusBox from '../status-box.js'

import Ranking from '../ranking.jsx'

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
  const { onDone, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  const args = derivePointRankGroupList(data)

  function handleOnDone({ valid, value, delta }) {
    if (delta) {
      upsert({ preRankByParentId: { [delta.parentId]: delta } })
      window.socket.emit('upsert-rank', delta)
    }
    onDone({ valid, value })
  }

  // fetch previous data
  if (typeof window !== 'undefined')
    useState(() => {
      const { discussionId, round } = data

      window.socket.emit('get-user-ranks', discussionId, round, 'pre', result => {
        if (!result) return // there was an error
        const [ranks] = result
        const preRankByParentId = ranks.reduce((preRankByParentId, rank) => ((preRankByParentId[rank.parentId] = rank), preRankByParentId), {})
        upsert({ preRankByParentId })
      })
    })

  return <RankPoints {...args} onDone={handleOnDone} discussionId={data.discussionId} round={data.round} {...otherProps} />
}

const toRankString = {
  undefined: '',
  most: 'Most',
  least: 'Least',
  neutral: 'Neutral',
}

const rankStringToCategory = Object.entries(toRankString).reduce((rS2C, [key, value]) => {
  if (key === 'undefined') return rS2C
  rS2C[value] = key
  return rS2C
}, {})

export function RankPoints(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    pointRankGroupList,
    round,
    discussionId,
    ...otherProps
  } = props

  if (!pointRankGroupList) return null

  const [rankByParentId, setRankByParentId] = useState(
    (pointRankGroupList || []).reduce((rankByParentId, rankPoint) => {
      if (rankPoint.rank && rankByParentId[rankPoint.point._id]) rankByParentId[rankPoint.point._id] = rankPoint.rank
      return rankByParentId
    }, {})
  )

  useEffect(() => {
    const newRankByParentId = {}
    pointRankGroupList?.forEach(rankPoint => {
      if (rankPoint.rank) {
        newRankByParentId[rankPoint.point._id] = rankPoint.rank
      }
    })

    let updated = false
    for (const rankDoc of Object.values(newRankByParentId)) {
      if (isEqual(rankDoc, rankByParentId[rankDoc.parentId])) {
        newRankByParentId[rankDoc.parentId] = rankByParentId[rankDoc.parentId]
      } else updated = true
    }

    if (updated) {
      setRankByParentId(newRankByParentId)
    }
  }, [pointRankGroupList])

  useEffect(() => {
    if (pointRankGroupList) {
      onDone(validAndPercentDone())
    }
  }, [])

  const handleRankPoint = (point, result) => {
    const rankString = result.value
    const newCategory = rankStringToCategory[rankString]

    // the above vars are needed when calling onDone which must be done outside the set function
    setRankByParentId(rankByParentId => {
      // doing this within the set function because handleReviewPoint could get called multiple time before the next rerender which updates the state value returned by useState
      let rank
      if (rankByParentId[point._id]) {
        if (rankByParentId[point._id].category !== newCategory) {
          rank = { ...rankByParentId[point._id], category: newCategory }
          rankByParentId[point._id] = rank
        } else {
          rank = rankByParentId[point._id]
        }
      } else {
        rank = {
          _id: ObjectId().toString(),
          stage: 'pre',
          category: newCategory,
          parentId: point._id,
          round,
          discussionId,
        }

        rankByParentId[point._id] = rank
      }

      if (rank) {
        const { valid, percentDone } = validAndPercentDone()
        setTimeout(() => onDone({ valid: valid, value: percentDone, delta: rank }))
      } // don't call onDone from within a setter - because onDone's may call other react hooks and react causes errors
      return rankByParentId // about the setter
    })
  }

  const [rankDiscrepancies, setRankDiscrepancies] = useState({})

  const table = minSelectionsTable[pointRankGroupList.length] ?? { least: 0, most: 0 }
  const { least: targetLeast, most: targetMost } = table
  const mostCount = () => getRankCount('most')
  const leastCount = () => getRankCount('least')

  const getRankCount = rankName => {
    return Object.values(rankByParentId).filter(rankedPoint => rankedPoint.category?.toLowerCase() === rankName?.toLowerCase()).length
  }

  useEffect(() => {
    onDone(validAndPercentDone())
  }, [rankByParentId])

  const validAndPercentDone = () => {
    let doneCount = 0

    for (const rankedPoint of Object.values(rankByParentId)) {
      if (rankedPoint.category) doneCount++
    }

    // Check for difference in expected most/least counts
    const mostDiscrepancy = mostCount() - targetMost
    const leastDiscrepancy = leastCount() - targetLeast

    const valid = (mostDiscrepancy == 0 && leastDiscrepancy == 0 && doneCount === pointRankGroupList.length) || (doneCount === pointRankGroupList.length && targetLeast == 0 && targetMost == 0) // No minimum constraint when there's a single point.

    setRankDiscrepancies({ most: mostDiscrepancy, least: leastDiscrepancy })

    return { valid: valid, percentDone: pointRankGroupList.length ? doneCount / pointRankGroupList.length : 0 } // value should be 0 if not points in list not null
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
          <StatusBadge name={'Most Important'} number={`${mostCount()}/${targetMost}`} status={mostCount() == targetMost || (targetLeast == 0 && targetMost == 0) ? 'complete' : mostCount() > targetMost ? 'error' : 'progress'} />
          <StatusBadge name={'Least Important'} number={`${leastCount()}/${targetLeast}`} status={leastCount() == targetLeast || (targetLeast == 0 && targetMost == 0) ? 'complete' : leastCount() > targetLeast ? 'error' : 'progress'} />
        </div>
        <div className={classes.rightButtons}>
          <ModifierButton
            className={className.clearButton}
            title="Clear All"
            children={'Clear All'}
            onDone={() => {
              const clearedRanks = Object.values(rankByParentId).reduce((rankByParentId, rank) => ((rankByParentId[rank.parentId] = { ...rank, category: '' }), rankByParentId), {})

              for (let rank of Object.values(clearedRanks)) {
                const { valid, percentDone } = validAndPercentDone()
                setTimeout(() => onDone({ valid: valid, value: percentDone, delta: rank }))
              }
            }}
          />
        </div>
      </div>
      <div className={cx(classes.pointDiv)}>
        {pointRankGroupList.map((rankedPoint, i) => {
          const { point, rank } = rankedPoint

          const rankInvalid = (rankDiscrepancies.most > 0 && rankedPoint.rank == 'Most' && targetMost > 0) || (rankDiscrepancies.least > 0 && rankedPoint.rank == 'Least' && targetLeast > 0)

          return (
            <Point key={point._id} point={point} vState="default" className={rankInvalid ? classes.invalidBackground : classes.validBackground} isInvalid={rankInvalid} data-testid={`point`}>
              <Ranking
                className={classes.rank}
                defaultValue={toRankString[rankByParentId[point._id]?.category]}
                onDone={({ valid, value }) => {
                  handleRankPoint(point, { valid: valid, value: value })
                }}
              />
            </Point>
          )
        })}
      </div>
      <div className={classes.statusBoxDiv}>{errorMsg && <StatusBox status="error" subject="Oops!" description={errorMsg}></StatusBox>}</div>
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
    for (const { point, group } of reducedPointList) {
      if (!rankPointsById[point._id]) {
        rankPointsById[point._id] = { point, group }
        updated = true
      } else if (rankPointsById[point._id].point != point) {
        rankPointsById[point._id] = { ...rankPointsById[point._id], point }
        updated = true
      }
    }

    local.reducedPointList = reducedPointList
  }

  if (local.preRankByParentId !== preRankByParentId) {
    for (const rank of Object.values(preRankByParentId)) {
      if (rankPointsById[rank.parentId]) {
        if (rankPointsById[rank.parentId].rank !== rank) {
          rankPointsById[rank.parentId] = { ...rankPointsById[rank.parentId], rank }
          updated = true
        }
      }
    }
    local.preRankByParentId = preRankByParentId
  }

  if (updated) local.pointRankGroupList = Object.values(local.rankPointsById)
  return { pointRankGroupList: local.pointRankGroupList }
}
