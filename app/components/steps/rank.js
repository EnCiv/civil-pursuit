// https://github.com/EnCiv/civil-pursuit/issues/65
// https://github.com/EnCiv/civil-pursuit/issues/191
// https://github.com/EnCiv/civil-pursuit/issues/199

import React, { useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ObjectId from 'bson-objectid'

import DeliberationContext from '../deliberation-context.js'
import Point from '../point'
import PointGroup from '../point-group' // should be using PointGroup but it needs to support children
import { ModifierButton } from '../button'
import StatusBadge from '../status-badge'
import StatusBox from '../status-box.js'
import StepIntro from '../step-intro'
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
  const { onDone, round, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  function handleOnDone({ valid, value, delta }) {
    if (delta) {
      upsert({ preRankByParentId: { [delta.parentId]: delta } })
      window.socket.emit('upsert-rank', delta)
    }
    onDone({ valid, value })
  }

  // fetch previous data
  useEffect(() => {
    const { discussionId } = data

    window.socket.emit('get-user-ranks', discussionId, round, 'pre', result => {
      if (!result) return // there was an error
      const ranks = result
      const preRankByParentId = ranks.reduce((preRankByParentId, rank) => ((preRankByParentId[rank.parentId] = rank), preRankByParentId), {})
      upsert({ preRankByParentId })
    })
  }, [round])

  return <RankPoints reducedPointList={data.reducedPointList} preRankByParentId={data.preRankByParentId} onDone={handleOnDone} discussionId={data.discussionId} round={round} {...otherProps} />
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

// also used by Rerank
export function useRankByParentId(discussionId, round, stage, reducedPointList, stageRankByParentId, validAndPercentDone, onDone) {
  const [rankByParentId, setRankByParentId] = useState(
    (reducedPointList || []).reduce((rankByParentId, pointGroup) => {
      rankByParentId[pointGroup.point._id] = stageRankByParentId?.[pointGroup.point._id]
      return rankByParentId
    }, {})
  )

  const [prev] = useState({ reducedPointList })

  useEffect(() => {
    const newRankByParentId = {}
    let updated = false
    reducedPointList?.forEach(({ point, group }) => {
      if (stageRankByParentId?.[point._id]) {
        if (stageRankByParentId?.[point._id] !== rankByParentId[point._id]) {
          newRankByParentId[point._id] = stageRankByParentId?.[point._id]
          updated = true
        } else {
          newRankByParentId[point._id] = rankByParentId[point._id] // keep the old rank
        }
      }
    })
    if (updated) {
      setRankByParentId(newRankByParentId)
    }
    if (updated || prev.reducedPointList !== reducedPointList) {
      prev.reducedPointList = reducedPointList
      setTimeout(() => onDone(validAndPercentDone(reducedPointList, newRankByParentId)))
    }
  }, [reducedPointList, stageRankByParentId])

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
        }
      } else {
        rank = {
          _id: ObjectId().toString(),
          stage,
          category: newCategory,
          parentId: point._id,
          round,
          discussionId,
        }
        rankByParentId[point._id] = rank
      }
      if (rank) {
        const { valid, value } = validAndPercentDone(reducedPointList, rankByParentId)
        setTimeout(() => onDone({ valid: valid, value: value, delta: rank }))
      }
      // don't call onDone from within a setter - because onDone's may call other react hooks and react causes errors
      return rankByParentId // abort the setter
    })
  }

  return [rankByParentId, handleRankPoint]
}

export function RankPoints(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    reducedPointList,
    preRankByParentId,
    round,
    discussionId,
    stepIntro,
  } = props
  const [rankDiscrepancies, setRankDiscrepancies] = useState({})
  const validAndPercentDone = (reducedPointList, rankByParentId) => {
    if (!reducedPointList) return { valid: false, value: 0 } // no points to rank
    const target = minSelectionsTable[reducedPointList?.length] ?? { least: 0, most: 0 }
    let doneCount = 0
    const countByCategory = {}
    for (const pointGroup of reducedPointList) {
      if (rankByParentId[pointGroup.point._id]?.category) {
        doneCount++
        if (!countByCategory[rankByParentId[pointGroup.point._id]?.category]) countByCategory[rankByParentId[pointGroup.point._id].category] = 1
        else countByCategory[rankByParentId[pointGroup.point._id].category]++
      }
    }
    // Check for difference in expected most/least counts
    const mostDiscrepancy = countByCategory.most - target.most
    const leastDiscrepancy = countByCategory.least - target.least

    const valid = (mostDiscrepancy == 0 && leastDiscrepancy == 0 && doneCount === reducedPointList.length) || (doneCount === reducedPointList.length && targetLeast == 0 && targetMost == 0) // No minimum constraint when there's a single point.

    setRankDiscrepancies({ most: mostDiscrepancy, least: leastDiscrepancy })

    return { valid: valid, value: reducedPointList.length ? doneCount / reducedPointList.length : 0 } // value should be 0 if not points in list not null
  }
  const [rankByParentId, handleRankPoint] = useRankByParentId(discussionId, round, 'pre', reducedPointList, preRankByParentId, validAndPercentDone, onDone)

  useEffect(() => {
    if (reducedPointList) {
      onDone(validAndPercentDone(reducedPointList, rankByParentId))
    }
  }, [])

  const table = minSelectionsTable[reducedPointList?.length] ?? { least: 0, most: 0 }
  const { least: targetLeast, most: targetMost } = table
  const mostCount = () => getRankCount('most')
  const leastCount = () => getRankCount('least')

  const getRankCount = rankName => {
    return reducedPointList.filter(pointGroup => rankByParentId[pointGroup.point._id]?.category?.toLowerCase() === rankName?.toLowerCase()).length
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
  // can't return null before all the hooks are called
  if (!reducedPointList) return null
  return (
    <div className={cx(classes.rankStep, className)}>
      <StepIntro {...stepIntro} />
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
                const { valid, percentDone } = validAndPercentDone(reducedPointList, rankByParentId)
                setTimeout(() => onDone({ valid: valid, value: percentDone, delta: rank }))
              }
            }}
          />
        </div>
      </div>
      <div className={cx(classes.pointDiv)}>
        {reducedPointList.map((pointGroup, i) => {
          const { point, group } = pointGroup
          const rank = rankByParentId[point._id]

          const rankInvalid = (rankDiscrepancies.most > 0 && rank == 'Most' && targetMost > 0) || (rankDiscrepancies.least > 0 && rank == 'Least' && targetLeast > 0)

          return (
            <Point key={point._id} point={point} vState="default" className={rankInvalid ? classes.invalidBackground : classes.validBackground} isInvalid={rankInvalid} data-testid={`point`}>
              <Ranking
                className={classes.rank}
                defaultValue={toRankString[rank?.category]}
                onDone={({ valid, value }) => {
                  handleRankPoint(point, { valid, value })
                }}
              />
            </Point>
          )
        })}
      </div>
      <div className={errorMsg ? classes.statusBoxDiv : ''}>{errorMsg && <StatusBox status="error" subject="Oops!" description={errorMsg}></StatusBox>}</div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  rankStep: {
    paddingLeft: '1rem', // room for the shadow around the points
    paddingRight: '1rem',
    marginBottom: '1rem', // for box shadow of children
  },
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
