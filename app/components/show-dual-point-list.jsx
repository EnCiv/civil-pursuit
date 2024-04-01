// https://github.com/EnCiv/civil-pursuit/issues/57

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'
import { ModifierButton } from './button.jsx'

export default function ShowDualPointList({
  className,
  leftPoints,
  leftHeader,
  rightPoints,
  rightHeader,
  vState,
  ...otherProps
}) {
  const classes = useStylesFromThemeFunction()
  const [isExpanded, setIsExpanded] = useState(vState === 'expanded')
  const toggleExpandCollapse = () => setIsExpanded(!isExpanded)

  return (
    <div className={cx(classes.sharedBorderStyle, className)} {...otherProps}>
      <div className={classes.contentContainer}>
        <div className={cx(classes.column, classes.leftColumn)}>
          <div className={cx(classes.header, classes.leftHeader)}>{leftHeader}</div>

          {leftPoints.map((point, index) => (
            <Point
              key={index}
              {...point}
              description={isExpanded ? point.description : ''}
              vState={isExpanded ? 'expanded' : 'collapsed'}
              className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
            />
          ))}
        </div>

        <div className={cx(classes.column, classes.rightColumn)}>
          <div className={cx(classes.header, classes.rightHeader)}>{rightHeader}</div>

          {rightPoints.map((point, index) => (
            <Point
              key={index}
              {...point}
              description={isExpanded ? point.description : ''}
              vState={isExpanded ? 'expanded' : 'collapsed'}
              className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
            />
          ))}
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <ModifierButton onDone={toggleExpandCollapse}> {isExpanded ? 'Collapse Chart' : 'Expand Chart'}</ModifierButton>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  sharedBorderStyle: {
    borderRadius: '0.9375rem',

    border: '1px solid rgba(217, 217, 217, 0.40)',
  },

  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    borderTopLeftRadius: '0.9375rem',
    borderTopRightRadius: '0.9375rem',
    overflow: 'hidden',
  },

  column: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
  },

  leftColumn: {
    marginRight: '0.3rem',
    backgroundColor: theme.colors.lightSuccess,
  },

  rightColumn: {
    backgroundColor: theme.colors.statusBadgeProgressBackground,
  },

  header: {
    fontSize: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: '1rem',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    marginBottom: '1rem',
  },

  oddRow: {
    backgroundColor: `#EFEFEF`,
  },

  evenRow: {
    backgroundColor: `#F8F8F8`,
  },

  point: {
    flex: 1,
  },
}))
