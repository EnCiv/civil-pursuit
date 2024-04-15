//https://github.com/EnCiv/civil-pursuit/issues/65
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point.jsx'
import PointGroup from './point-group.jsx'

import Ranking from './util/ranking.jsx'

function RankStep(props) {
  const classes = useStylesFromThemeFunction()
  const {
    className = '', // may or may not be passed. Should be applied to the outer most tag, after local classNames
    onDone = undefined, // a function that is called when the button is clicked.  - if it exists
    children,
    active = true,
    pointList = [],
    rankList = [],
    ...otherProps
  } = props
  const setRank = (index, val) => {
    for (let i = 0; i < rankList.length; i++) {
      if (rankList[i].id === index) {
        rankList[i]['rank'] = val
        break
      }
    }
  }
  const findRank = index => {
    for (let i = 0; i < rankList.length; i++) {
      if (rankList[i].id === index) {
        return i
      }
    }
  }
  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.pointDiv}>
        {pointList.map((point, i) => (
          <Point key={point._id} subject={point.subject}>
            {rankList[i] && (
              <Ranking
                defaultValue={rankList[findRank(point._id)]['rank']}
                onDone={({ valid, value }) => {
                  setRank(point._id, value)
                }}
              />
            )}
          </Point>
        ))}
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
    padding: '1rem',
  },
  pointDiv: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
}))

export default RankStep
