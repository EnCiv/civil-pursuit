// https://github.com/EnCiv/civil-pursuit/issues/101
// https://github.com/EnCiv/civil-pursuit/issues/243

'use strict'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import StatusBadge from './status-badge'
import Theme from './theme'
import cx from 'classnames'

const statusToBadge = {
  complete: { name: 'Complete', status: 'Complete' },
  inprogress: { name: 'In Progress', status: 'Progress' },
  pending: { name: 'Pending', status: 'Pending' },
}

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
    const lastRound = roundsStatus.length - 1

    let visibleRounds = []

    if (isMobile) {
      // Just show the current round and the last round
      if (currentRoundIndex == lastRound) {
        visibleRounds = [lastRound - 1, lastRound]
      } else {
        visibleRounds = [currentRoundIndex, lastRound]
      }
    } else {
      if (currentRoundIndex === 0) {
        visibleRounds = [currentRoundIndex, currentRoundIndex + 1, lastRound]
      } else if (currentRoundIndex === lastRound) {
        visibleRounds = [currentRoundIndex - 2, currentRoundIndex - 1, currentRoundIndex]
      } else {
        visibleRounds = [currentRoundIndex - 1, currentRoundIndex, lastRound]
      }
    }

    let visibleRoundCounter = 0
    return roundsStatus.map((status, index) => {
      // Only render visible rounds
      if (visibleRounds.includes(index)) {
        const badgeInfo = statusToBadge[status.toLowerCase()]
        const thisVisibleRound = visibleRoundCounter
        visibleRoundCounter++
        return (
          <React.Fragment key={index}>
            <div className={classes.roundContainer}>
              <div className={classes.roundHeader}>
                <div className={classes.roundNumber}>Round {index + 1}</div>
                {!(thisVisibleRound === 2 && status.toLowerCase() === 'pending') && (
                  <div
                    className={cx(classes.lineBase, status.toLowerCase() === 'complete' && classes.lineComplete, status.toLowerCase() === 'inprogress' && classes.lineInProgress, status.toLowerCase() === 'pending' && classes.linePending)}
                  />
                )}
              </div>
              <StatusBadge name={badgeInfo.name} status={badgeInfo.status} className={classes.badge} />
            </div>
          </React.Fragment>
        )
      }
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
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
  },
  roundTracker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: '1.625rem 6.0625rem 1.625rem 4.1875rem',
    gap: '5.1875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      margin: '1.625rem 1rem  1.625rem 1rem ',
      gap: '2rem',
    },
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
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
    borderBottomColor: theme.colors.encivGray,
    borderBottomStyle: 'solid',
  },

  lineComplete: {
    borderBottomStyle: 'solid',
  },

  lineInProgress: {
    borderBottomStyle: 'dashed',
  },

  linePending: {
    borderBottomColor: 'transparent',
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
