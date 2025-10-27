// https://github.com/EnCiv/civil-pursuit/issues/58
// https://github.com/EnCiv/civil-pursuit/issues/80

'use strict'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { TextButton } from './button'
import ShowDualPointList from './show-dual-point-list'
import Ranking from './ranking'
import Point from './point'
import SvgChevronUp from '../svgr/chevron-up'
import SvgChevronDown from '../svgr/chevron-down'
import { Level } from 'react-accessible-headings'

function ReviewPoint(props) {
  const { point = {}, leftPointList = [], rightPointList = [], rank = '', onDone = () => {}, className = '', ...otherProps } = props
  const [isRanked, setIsRanked] = useState(false)

  // disabled: can't select yet, collapsed, has not been read
  // open: point is open and visible, can select a ranking, has been read
  // enabled: point is collapsed, but you can still select a ranking, has been read
  const [vState, setVState] = useState(props.vState || (rank ? 'enabled' : 'disabled'))
  useEffect(() => {
    if (props.vState) setVState(props.vState)
  }, [props.vState])

  const classes = useStylesFromThemeFunction()

  const handleRankingDone = ({ valid, value }) => {
    setVState('enabled')
    setIsRanked(valid)
    if (!(isRanked && rank === value)) {
      onDone({ valid, value })
    }
  }

  useEffect(() => {
    if (rank) setVState('enabled')
    if (isRanked) setIsRanked(false) // not ranked until validated from child
  }, [rank])

  const handleClose = () => {
    setVState('enabled')
    setTimeout(() => onDone({ valid: !!rank }), 0)
  }

  const handleOpen = () => {
    setVState('open')
    setTimeout(() => onDone({ valid: !!rank }), 0)
  }

  const topRow = (
    <div className={classes.topRowContent}>
      <span className={vState !== 'disabled' ? classes.statusBadgeComplete : classes.statusBadge}>{vState !== 'disabled' ? 'Read' : 'Unread'}</span>
      <div className={classes.rankingDesktop}>
        <div></div>
        <Ranking className={classes.ranking} disabled={vState === 'disabled'} defaultValue={rank} onDone={handleRankingDone} />
      </div>
    </div>
  )

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.pointContainer}>
        <Point point={point} vState={vState === 'disabled' ? 'disabled' : 'default'} topRow={topRow} className={classes.reviewPoint}>
          <div className={classes.rankingMobile}>
            <Ranking className={classes.ranking} disabled={vState === 'disabled'} defaultValue={rank} onDone={handleRankingDone} />
          </div>
          {vState === 'open' && (leftPointList.length > 0 || rightPointList.length > 0) && (
            <div className={classes.showDualPointListContainer}>
              <Level>
                <ShowDualPointList className={classes.showDualPointList} leftHeader="Why It's Most Important" rightHeader="Why It's Least Important" leftPoints={leftPointList} rightPoints={rightPointList} vState={'expanded'} />
              </Level>
            </div>
          )}
        </Point>
        <div className={classes.SvgContainer}>
          {vState === 'open' ? (
            <TextButton onClick={handleClose} title="close" tabIndex={0} style={{ padding: 0 }}>
              <span className={classes.chevronButton}>
                <SvgChevronUp width={'2rem'} height={'auto'} />
              </span>
            </TextButton>
          ) : (
            <TextButton onClick={handleOpen} title="open" tabIndex={0} style={{ padding: 0 }}>
              <span className={classes.chevronButton}>
                <SvgChevronDown width={'2rem'} height={'auto'} />
              </span>
            </TextButton>
          )}
        </div>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  reviewPoint: {
    // Don't override Point's border styles - let Point handle borders
  },

  pointContainer: {
    position: 'relative',
  },

  topRowContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: '1rem',
    position: 'relative',
    paddingRight: '15%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingRight: '0',
    },
  },

  statusBadge: {
    backgroundColor: theme.colors.statusBadgeProgressBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeProgressBorder}`,
    ...sharedStatusBadgeStyle(),
    flexShrink: 0,
  },

  statusBadgeComplete: {
    backgroundColor: theme.colors.statusBadgeCompletedBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeCompletedBorder}`,
    ...sharedStatusBadgeStyle(),
    flexShrink: 0,
  },

  rankingDesktop: {
    display: 'none',
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      flex: 1,
      alignItems: 'flex-start',
    },
  },

  rankingMobile: {
    display: 'flex',
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1rem',
    [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
      display: 'none',
    },
  },

  ranking: {
    width: '70%',
    fontSize: '1rem',
    '& label': {
      fontWeight: 'normal',
    },
  },

  SvgContainer: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    fontSize: '1.5rem',
    opacity: 1,
  },

  chevronButton: {
    opacity: 1,
  },

  showDualPointListContainer: {
    padding: '0rem 0rem 1.875rem',
    paddingRight: '15%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingRight: '0',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '1.5rem',
  },

  showDualPointList: {
    width: '100%',
    padding: '0rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      border: 'none',
      paddingBottom: '0.1rem',
      '& > div': {
        borderTopLeftRadius: '0rem',
        borderTopRightRadius: '0rem',
      },
    },
  },
}))

const sharedStatusBadgeStyle = () => ({
  borderRadius: '1rem',
  padding: '0.375rem 0.625rem',
})

export default ReviewPoint
