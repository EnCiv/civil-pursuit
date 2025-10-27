// https://github.com/EnCiv/civil-pursuit/issues/57

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PointGroup from './point-group'
import Point from './point'
import { ModifierButton } from './button'
import { H, Level } from 'react-accessible-headings'

export default function ShowDualPointList({ className, leftPoints = [], leftHeader, rightPoints = [], rightHeader, vState, ...otherProps }) {
  const classes = useStylesFromThemeFunction()
  const [isExpanded, setIsExpanded] = useState(vState === 'expanded')
  const toggleExpandCollapse = () => setIsExpanded(!isExpanded)

  // Determine the maximum number of points between left and right sides
  const maxPoints = Math.max(leftPoints.length, rightPoints.length)

  return (
    <div className={cx(classes.sharedBorderStyle, className)} {...otherProps}>
      <div className={classes.contentContainer}>
        <div className={classes.headerContainer}>
          <H className={classes.leftHeader}>{leftHeader}</H>
          <H className={classes.rightHeader}>{rightHeader}</H>
        </div>

        <div className={classes.pointGrid}>
          <Level>
            {[...Array(maxPoints)].map((_, index) => {
              const leftPoint = leftPoints[index]
              const rightPoint = rightPoints[index]
              return (
                <React.Fragment key={leftPoint?._id || rightPoint?._id}>
                  <Point point={leftPoint || {}} vState={isExpanded ? 'secondary' : 'collapsed'} className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)} />
                  <Point point={rightPoint || {}} vState={isExpanded ? 'secondary' : 'collapsed'} className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)} />
                </React.Fragment>
              )
            })}
          </Level>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <ModifierButton className={classes.button} onDone={toggleExpandCollapse}>
          {isExpanded ? 'Collapse Table' : 'Expand Table'}
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
  headerContainer: {
    fontSize: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '0.2rem',
    borderBottom: '1px solid #fff',
  },
  leftHeader: {
    padding: '1rem',
    paddingLeft: '1.75rem',
    margin: '0rem',
    backgroundColor: theme.colors.lightSuccess,
    fontSize: '1.7rem', // Default font size
    wordWrap: 'break-word',
    overflow: 'hidden',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      // For small screens
      fontSize: '1.5rem',
    },
  },
  rightHeader: {
    padding: '1rem',
    paddingLeft: '1.75rem',
    margin: '0rem',
    backgroundColor: theme.colors.statusBadgeProgressBackground,
    fontSize: '1.7rem', // Default font size
    wordWrap: 'break-word',
    overflow: 'hidden',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      // For small screens
      fontSize: '1.5rem',
    },
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
      paddingTop: '0.2rem',
      paddingBottom: '0.2rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
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
