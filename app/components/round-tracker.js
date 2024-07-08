'use strict'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import StatusBadge from './status-badge'
import Theme from './theme'
import cx from 'classnames'

const RoundTracker = ({ roundsStatus = [], className, ...otherProps }) => {
  const classes = useStyles()

  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${Theme.condensedWidthBreakPoint})`)

    const handleResize = () => {
      setIsMobile(mediaQuery.matches)
    }

    handleResize()

    mediaQuery.addEventListener('change', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!isReady) {
    return <div style={{ visibility: 'hidden' }} />
  }

  const renderRounds = () => {
    if (roundsStatus.length === 0) {
      return <div className={classes.emptyMessage}>No rounds available</div>
    }

    let visibleRounds
    const currentRoundIndex = roundsStatus.findIndex(status => status === 'inProgress')

    if (isMobile) {
      if (currentRoundIndex < 0) {
        visibleRounds = roundsStatus.slice(0, 2)
      } else if (currentRoundIndex === roundsStatus.length - 1) {
        visibleRounds = roundsStatus.slice(-2)
      } else {
        visibleRounds = roundsStatus.slice(currentRoundIndex, currentRoundIndex + 2)
      }
    } else {
      if (currentRoundIndex <= 0) {
        visibleRounds = roundsStatus.slice(0, 3)
      } else if (currentRoundIndex === roundsStatus.length - 1) {
        visibleRounds = roundsStatus.slice(-3)
      } else {
        visibleRounds = roundsStatus.slice(currentRoundIndex - 1, currentRoundIndex + 2)
      }
    }

    return visibleRounds.map((status, index) => (
      <React.Fragment key={index}>
        <div className={classes.roundContainer}>
          <div className={classes.roundNumber}>Round {roundsStatus.length - visibleRounds.length + index + 1}</div>
          <StatusBadge
            name={status.charAt(0).toUpperCase() + status.slice(1)}
            status={status.toLowerCase()}
            className={classes.badge}
          />
        </div>
        {index < visibleRounds.length - 1 && <div className={classes.dash} />}
      </React.Fragment>
    ))
  }

  return (
    <div className={cx(classes.centerWrapper, className)} {...otherProps}>
      <div className={classes.roundTrackerWrapper}>
        <div className={classes.roundTracker}>{renderRounds()}</div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  centerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  roundTrackerWrapper: {
    backgroundColor: theme.colors.roundTrackerBackground,
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 0 1rem rgba(0, 0, 0, 0.1)',
  },
  roundTracker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 0.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
  },
  roundNumber: {
    marginBottom: '0.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginBottom: '0.25rem',
      marginRight: '0',
    },
  },
  badge: {
    margin: '0 0.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      margin: '0 0.25rem',
    },
  },
  dash: {
    width: '1.5rem',
    height: '0.125rem',
    backgroundColor: theme.colors.borderGray,
    alignSelf: 'center',
    transform: 'translateY(0.65rem)',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '0.75rem',
      height: '0.0625rem',
      marginBottom: '0.5rem',
    },
  },
  emptyMessage: {
    fontSize: '1rem',
    color: theme.colors.textPrimary,
  },
}))

export default RoundTracker
