// https://github.com/EnCiv/civil-pursuit/issues/57

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'
import PointGroup from './point-group'
import { ModifierButton } from './button'

export default function ShowDualPointList({
  className,
  leftPoints = [],
  leftHeader,
  rightPoints = [],
  rightHeader,
  vState,
  ...otherProps
}) {
  const classes = useStylesFromThemeFunction()
  const [isExpanded, setIsExpanded] = useState(vState === 'expanded')
  const toggleExpandCollapse = () => setIsExpanded(!isExpanded)

  // Determine the maximum number of points between left and right sides
  const maxPoints = Math.max(leftPoints.length, rightPoints.length)

  return (
    <div className={cx(classes.sharedBorderStyle, className)} {...otherProps}>
      <div className={classes.contentContainer}>
        <div className={classes.header}>
          <div className={classes.leftHeader}>{leftHeader}</div>
          <div className={classes.rightHeader}>{rightHeader}</div>
        </div>
        <div className={classes.pointGrid}>
          {[...Array(maxPoints)].map((_, index) => {
            const leftPoint = leftPoints[index]
            const rightPoint = rightPoints[index]
            return (
              <React.Fragment key={leftPoint?._id || rightPoint?._id}>
                <PointGroup
                  point={<Point point={leftPoint || {}} />}
                  vState={isExpanded ? 'default' : 'collapsed'}
                  className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                />
                <PointGroup
                  point={<Point point={rightPoint || {}} />}
                  vState={isExpanded ? 'default' : 'collapsed'}
                  className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                />
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <ModifierButton className={classes.button} onDone={toggleExpandCollapse}>
          {isExpanded ? 'Collapse Chart' : 'Expand Chart'}
        </ModifierButton>
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
    position: 'relative',
    borderTopLeftRadius: '0.9375rem',
    borderTopRightRadius: '0.9375rem',
    overflow: 'hidden',
  },
  header: {
    fontSize: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '0.2rem',
    borderBottom: '1px solid #fff',
  },
  leftHeader: {
    padding: '1rem',
    paddingLeft: '1.75rem',
    backgroundColor: theme.colors.lightSuccess,
  },
  rightHeader: {
    padding: '1rem',
    paddingLeft: '1.75rem',
    backgroundColor: theme.colors.statusBadgeProgressBackground,
  },
  pointGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridRowGap: '0',
    gridColumnGap: '0.2rem',
  },
  point: {
    flex: 1,
    '& div': {
      padding: '1rem',
      boxShadow: 'none',
      borderRadius: 0,
      backgroundColor: 'transparent',
      '& div': {
        padding: '0.1rem',
      },
      '&:hover': {
        outline: 'none !important',
      },
      '&:hover $defaultSubject': {
        color: 'inherit !important',
      },
      '&:hover $defaultDescription': {
        color: 'inherit !important',
      },
    },
  },
  oddRow: {
    backgroundColor: `#EFEFEF`,
  },
  evenRow: {
    backgroundColor: `#F8F8F8`,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.5rem 5rem',
  },
}))
