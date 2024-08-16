// https://github.com/EnCiv/civil-pursuit/issues/65
// https://github.com/EnCiv/civil-pursuit/issues/191

import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'
import PointGroup from './point-group' // should be using PointGroup but it needs to support children

import Ranking from './ranking'

const minSelectionsTable = {
  1: { least: 0, most: 0 },
  // TODO: Figure out the rest of the values.
  10: { least: 1, most: 2 },
}

function RankStep(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = () => {}, // a function that is called when the button is clicked.  - if it exists
    children,
    active = true,
    pointList = [],
    rankList = [],
    ...otherProps
  } = props

  // rankList won't change except by parent, but ranks inside the list will change by setRank
  // so updateCount is used to determin when rank updates are made
  const [updateCount, setUpdateCount] = useState(1)
  const [rankDiscrepancies, setRankDiscrepancies] = useState({})
  const setRank = (id, rank) => {
    const it = rankList.find(ro => ro.id === id)
    if (it) it.rank = rank
    else rankList.push({ id, rank })
    setUpdateCount(updateCount + 1)
  }
  // in useEffect so it's called after setRank updates have taken effect
  useEffect(() => {
    onDone(validAndPercentDone())
  }, [updateCount])

  const validAndPercentDone = () => {
    let doneCount = 0
    let it
    for (const point of pointList) {
      if ((it = rankList.find(ro => ro.id === point._id)) && it.rank) doneCount++
    }

    // Check for difference in expected most/least counts
    const mostDiscrepancy =
      rankList.filter(point => point.rank === 'Most').length - minSelectionsTable[pointList.length]?.most
    const leastDiscrepancy =
      rankList.filter(point => point.rank === 'Least').length - minSelectionsTable[pointList.length]?.least

    const valid = mostDiscrepancy == 0 && leastDiscrepancy == 0 && doneCount === pointList.length

    setRankDiscrepancies({ most: mostDiscrepancy, least: leastDiscrepancy })

    return [valid, pointList.length ? doneCount / pointList.length : 0] // value should be 0 if not points in list not null
  }

  return (
    <div className={cx(classes.rankStep, className)} {...otherProps}>
      <div className={cx(classes.pointDiv)}>
        {pointList.map((point, i) => {
          const rankInvalid =
            (rankDiscrepancies.most > 0 && rankList?.find(rank => rank.id === point._id)?.rank == 'Most') ||
            (rankDiscrepancies.least > 0 && rankList?.find(rank => rank.id === point._id)?.rank == 'Least')

          return (
            <Point
              key={point._id}
              point={point}
              vState="default"
              className={rankInvalid ? classes.invalidBackground : undefined}
              isInvalid={rankInvalid}
            >
              <Ranking
                className={classes.rank}
                defaultValue={(rankList.find(ro => ro.id === point._id) || {}).rank}
                onDone={({ valid, value }) => {
                  if (valid) setRank(point._id, value)
                  else setRank(point._id, '')
                }}
              />
            </Point>
          )
        })}
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  rankStep: {},
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
    backgroundColor: '#f9e7e5',
  },
}))

export default RankStep
