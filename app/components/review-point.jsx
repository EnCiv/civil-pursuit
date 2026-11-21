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

function ReviewPoint(props) {
  const { point = {}, leftPointList = [], rightPointList = [], rank = '', vState: incomingVState, onDone = () => {}, className = '', ...otherProps } = props
  const [isRanked, setIsRanked] = useState(false)

  // disabled: can't select yet, collapsed, has not been read
  // open: point is open and visible, can select a ranking, has been read
  // enabled: point is collapsed, but you can still select a ranking, has been read
  const [vState, setVState] = useState(incomingVState || (rank ? 'enabled' : 'disabled'))
  useEffect(() => {
    if (incomingVState) setVState(incomingVState)
  }, [incomingVState])

  const classes = useStylesFromThemeFunction()

  const handleRankingDone = ({ valid, value }) => {
    setVState(previous => previous === 'open' ? 'open' : 'enabled')
    setIsRanked(valid)
    if (!(isRanked && rank === value)) {
      onDone({ valid, value })
    }
  }

  useEffect(() => {
    if (rank) setVState(previous => previous === 'open' ? 'open' : 'enabled')
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

  const handleCardClick = event => {
    if (event.target.closest(`.${classes.rankingPlacement}, button, a, input, select, textarea, [role="button"], [role="radio"]`)) return
    if (vState === 'open') handleClose()
    else handleOpen()
  }

  const topRow = (
    <div className={classes.topRowContent}>
      <span className={vState !== 'disabled' ? classes.statusBadgeComplete : classes.statusBadge}>{vState !== 'disabled' ? 'Read' : 'Unread'}</span>
    </div>
  )

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.pointContainer}>
        <Point point={point} vState={vState === 'disabled' ? 'disabled' : 'default'} topRow={topRow} className={classes.reviewPoint} onClick={handleCardClick}>
          {(leftPointList.length > 0 || rightPointList.length > 0) && (
            <div className={cx(classes.showDualPointListDisclosure, vState === 'open' && classes.showDualPointListExpanded)} aria-hidden={vState !== 'open'}>
              <div className={classes.showDualPointListInner}>
                <div className={classes.showDualPointListContainer}>
                  <ShowDualPointList className={classes.showDualPointList} leftHeader="Why It's Most Important" rightHeader="Why It's Least Important" leftPoints={leftPointList} rightPoints={rightPointList} vState={'expanded'} showToggle={false} />
                </div>
              </div>
            </div>
          )}
          <div className={classes.rankingPlacement}>
            <Ranking className={classes.ranking} disabled={vState === 'disabled'} defaultValue={rank} onDone={handleRankingDone} />
          </div>
        </Point>
        <div className={classes.SvgContainer}>
          {vState === 'open' ? (
            <TextButton onDone={handleClose} title="close" aria-label="Close point review" aria-expanded={true} tabIndex={0} style={{ padding: 0 }}>
              <span className={classes.chevronButton}>
                <SvgChevronUp width={'2rem'} height={'auto'} />
              </span>
            </TextButton>
          ) : (
            <TextButton onDone={handleOpen} title="open" aria-label="Open point review" aria-expanded={false} tabIndex={0} style={{ padding: 0 }}>
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
    cursor: 'pointer',
    '& > div > div > :is(h1, h2, h3, h4, h5, h6)': {
      fontSize: '1.75rem',
    },
    '& > div > div > p': {
      fontSize: '1.125rem',
    },
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

  rankingPlacement: {
    display: 'flex',
    cursor: 'default',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '1.25rem',
  },

  ranking: {
    width: 'min(100%, 24rem)',
    fontSize: '1rem',
    '&[role="radiogroup"]': {
      flexWrap: 'nowrap',
    },
    '& > [role="radio"]': {
      flex: '1 1 0',
      minWidth: 0,
      padding: '0.5rem 0.375rem',
      gap: '0.375rem',
    },
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
      '& > [role="radio"]': {
        padding: '0.375rem 0.25rem',
        gap: '0.25rem',
      },
      '& svg': {
        width: '1rem',
        height: '1rem',
      },
      '& span': {
        fontSize: '0.8125rem',
      },
    },
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '1.5rem',
  },

  showDualPointListDisclosure: {
    display: 'grid',
    width: 'calc(100% + 3.75rem)',
    marginLeft: '-1.875rem',
    gridTemplateRows: '0fr',
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
    transition: 'grid-template-rows 300ms ease, opacity 200ms ease, visibility 0s linear 300ms',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },

  showDualPointListExpanded: {
    gridTemplateRows: '1fr',
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'auto',
    transition: 'grid-template-rows 300ms ease, opacity 200ms ease, visibility 0s',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },

  showDualPointListInner: {
    minHeight: 0,
    overflow: 'hidden',
  },

  showDualPointList: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0rem',
    '&&': {
      border: 'none !important',
      borderRadius: 0,
      boxShadow: 'none !important',
    },
    '& > div': {
      borderRadius: 0,
    },
  },
}))

const sharedStatusBadgeStyle = () => ({
  borderRadius: '1rem',
  padding: '0.375rem 0.625rem',
})

export default ReviewPoint
