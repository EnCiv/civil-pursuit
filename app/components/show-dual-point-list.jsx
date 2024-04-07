// https://github.com/EnCiv/civil-pursuit/issues/57

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
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
              <PointGroup
                pointObj={point}
                vState={isExpanded ? 'default' : 'collapsed'}
                className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                pointClassName={cx(classes.customStyle)}
              />
              <PointGroup
                pointObj={rightPoints[index] || {}}
                vState={isExpanded ? 'default' : 'collapsed'}
                className={cx(classes.point, index % 2 === 0 ? classes.evenRow : classes.oddRow)}
                pointClassName={cx(classes.customStyle)}
              />
            </React.Fragment>
          ))}
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
  customStyle: {
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: '1.2rem',
  },
}))
