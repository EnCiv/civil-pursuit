'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import StatusBadge from './status-badge'
import Theme from './theme'
import cx from 'classnames'

const RoundTracker = ({ roundsStatus = [], className, ...otherProps }) => {
  const classes = useStyles()

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${Theme.condensedWidthBreakPoint})`) : false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${Theme.condensedWidthBreakPoint})`)
    const handleResize = () => {
      setIsMobile(mediaQuery.matches)
    }

    setIsMobile(mediaQuery.matches)
    setIsInitialized(true)

    mediaQuery.addEventListener('change', handleResize)
    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])

  if (!isInitialized) {
    // Render nothing until the initial check is done
    return null
  }

  const renderRounds = () => {
    if (roundsStatus.length === 0) {
      return <div className={classes.emptyMessage}>No rounds available</div>
    }

    const currentRoundIndex = roundsStatus.findIndex(status => status === 'inProgress')

    let lowerIndex, upperIndex

    if (currentRoundIndex === 0) {
      lowerIndex = 0
      upperIndex = isMobile ? 2 : 3 // Show the first two rounds on mobile, first 3 on full-width
    } else if (currentRoundIndex === roundsStatus.length - 1) {
      lowerIndex = roundsStatus.length - (isMobile ? 1 : 3)
      upperIndex = roundsStatus.length - 1 // Show only the last round on mobile, last 3 on full-width
    } else {
      // Show the current and next round on mobile.
      // Previous, current, and next round on full-width
      lowerIndex = isMobile ? currentRoundIndex : currentRoundIndex - 1
      upperIndex = currentRoundIndex + 2
    }

    return roundsStatus.map((status, index) => {
      // Only render visible rounds
      if (lowerIndex <= index && index < upperIndex)
        return (
          <React.Fragment key={index}>
            <div className={classes.roundContainer}>
              <div className={classes.roundHeader}>
                <div className={classes.roundNumber}>Round {index + 1}</div>
                {status.toLowerCase() !== 'pending' && <div className={cx(classes.lineBase, status.toLowerCase() === 'complete' && classes.lineComplete, status.toLowerCase() === 'inprogress' && classes.lineInProgress)} />}{' '}
              </div>
              <StatusBadge name={status.charAt(0).toUpperCase() + status.slice(1)} status={status.toLowerCase()} className={classes.badge} />
            </div>
          </React.Fragment>
        )
    })
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
    gap: '3.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '2rem',
    },
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: '0 0.5rem',
    gap: '0.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '0.5rem',
    },
  },
  roundHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  roundNumber: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: '1rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginBottom: '0.25rem',
      marginRight: '0.75rem',
    },
  },
  lineBase: {
    width: '3.375rem',
    height: '0rem',
    borderBottomWidth: '0.125rem',
    borderBottomColor: '#5D5D5C',
    borderBottomStyle: 'solid',
  },

  lineComplete: {
    borderBottomStyle: 'solid',
  },

  lineInProgress: {
    borderBottomStyle: 'dashed',
  },

  linePending: {
    borderBottomWidth: 0,
  },

  badge: {
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      margin: '0 0.25rem',
    },
  },

  emptyMessage: {
    fontSize: '1rem',
    color: theme.colors.textPrimary,
  },
}))

export default RoundTracker
