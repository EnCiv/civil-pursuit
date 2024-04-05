// https://github.com/EnCiv/civil-pursuit/issues/57

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Point from './point'
import { ModifierButton } from './button.jsx'

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

  return (
    <div className={cx(classes.sharedBorderStyle, className)} {...otherProps}>
      <div className={classes.contentContainer}>
        <div className={classes.header}>
          <div className={classes.leftHeader}>{leftHeader}</div>
          <div className={classes.rightHeader}>{rightHeader}</div>
        </div>
        <div className={classes.pointGrid}>
          {leftPoints.map((point, index) => (
            <React.Fragment key={index}>
              <Point
                {...point}
                description={isExpanded ? point.description : ''}
                vState={isExpanded ? 'expanded' : 'collapsed'}
                className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                // Override styles to remove shadow and round corners
                style={{ borderRadius: 0, boxShadow: 'none' }}
              />
              <Point
                {...(rightPoints[index] || {})}
                description={isExpanded ? (rightPoints[index] || {}).description : ''}
                vState={isExpanded ? 'expanded' : 'collapsed'}
                className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                // Override styles to remove shadow and round corners
                style={{ borderRadius: 0, boxShadow: 'none' }}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <ModifierButton onDone={toggleExpandCollapse}>{isExpanded ? 'Collapse Chart' : 'Expand Chart'}</ModifierButton>
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
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderBottom: '1px solid rgba(217, 217, 217, 0.40)',
    columnGap: '0.3rem',
  },
  leftHeader: {
    padding: '1rem',
    paddingLeft: '1.5rem',
    fontSize: '1.25rem',
    backgroundColor: theme.colors.lightSuccess,
  },
  rightHeader: {
    padding: '1rem',
    paddingLeft: '1.5rem',
    fontSize: '1.25rem',
    backgroundColor: theme.colors.statusBadgeProgressBackground,
  },
  pointGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridRowGap: '0',
    columnGap: '0.3rem',
  },
  point: {
    flex: 1,
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
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}))
