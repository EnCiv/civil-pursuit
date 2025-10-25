// https://github.com/EnCiv/civil-pursuit/issues/58
// https://github.com/EnCiv/civil-pursuit/issues/80

'use strict'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { TextButton } from './button'
import ShowDualPointList from './show-dual-point-list'
import Ranking from './ranking'
import SvgChevronUp from '../svgr/chevron-up'
import SvgChevronDown from '../svgr/chevron-down'
import { H, Level } from 'react-accessible-headings'
import DemInfo from './dem-info'

function ReviewPoint(props) {
  const { point = {}, leftPointList = [], rightPointList = [], rank = '', onDone = () => {}, ...otherProps } = props
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

  return (
    <div className={cx(classes.borderStyle)} {...otherProps}>
      <div className={cx(classes.contentContainer)}>
        <div className={classes.informationGrid}>
          <div className={classes.informationColumn}>
            <span className={vState !== 'disabled' ? classes.statusBadgeComplete : classes.statusBadge}>{vState !== 'disabled' ? 'Read' : 'Unread'}</span>
            {point.subject && <H className={cx(classes.subjectStyle)}>{point.subject}</H>}
            {point.description && <p className={cx(classes.descriptionStyle)}>{point.description}</p>}
            <DemInfo pointId={point._id} />
          </div>
          <div className={classes.rankingColumn}>
            <Ranking className={classes.ranking} disabled={vState === 'disabled'} defaultValue={rank} onDone={handleRankingDone} />
          </div>
        </div>
        <div className={classes.SvgContainer}>
          {vState === 'open' ? (
            <TextButton onClick={handleClose} title="close" tabIndex={0}>
              <span className={classes.chevronButton}>
                <SvgChevronUp />
              </span>
            </TextButton>
          ) : (
            <TextButton onClick={() => setVState('open')} title="open" tabIndex={0}>
              <span className={classes.chevronButton}>
                <SvgChevronDown />
              </span>
            </TextButton>
          )}
        </div>
      </div>
      {vState === 'open' && (leftPointList.length > 0 || rightPointList.length > 0) && (
        <div className={classes.showDualPointListContainer}>
          <Level>
            <ShowDualPointList className={classes.showDualPointList} leftHeader="Why It's Most Important" rightHeader="Why It's Least Important" leftPoints={leftPointList} rightPoints={rightPointList} vState={'expanded'} />
          </Level>
        </div>
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  borderStyle: {
    borderRadius: '0.9375rem',
    boxShadow: theme.boxShadow,
  },

  container: {
    fontFamily: theme.font.fontFamily,
    overflowX: 'hidden',
  },
  statusBadge: {
    backgroundColor: theme.colors.statusBadgeProgressBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeProgressBorder}`,
    ...sharedStatusBadgeStyle(),
    alignSelf: 'flex-start',
  },
  statusBadgeComplete: {
    backgroundColor: theme.colors.statusBadgeCompletedBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeCompletedBorder}`,
    ...sharedStatusBadgeStyle(),
    alignSelf: 'flex-start',
  },
  SvgContainer: {
    position: 'absolute',
    top: '0.3rem',
    right: '0rem',
    fontSize: '1.5rem',
  },
  subjectStyle: {
    ...theme.font,
    fontSize: '1.5rem',
    fontWeight: '400',
    lineHeight: '1.875rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  descriptionStyle: {
    ...theme.font,
    alignSelf: 'stretch',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  contentContainer: {
    padding: '2rem 1.875rem',
    paddingRight: '15%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '2rem 1.875rem',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
  },
  showDualPointListContainer: {
    padding: '0rem 1.875rem 1.875rem',
    paddingRight: '15%',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '0rem 0rem 1.875rem',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
  },
  informationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr', // Initially, set to 1 column
    gap: '1rem',
    width: '100%',
  },
  informationColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    width: '100%', // Initially set to 100%
  },
  rankingColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    position: 'relative',
    width: '100%', // Initially set to 100%
  },
  // Additional style for adjusting grid layout
  '@media (min-width: 40rem)': {
    // Adjust breakpoint as needed
    informationGrid: {
      gridTemplateColumns: '1fr 0.25fr', // Adjusted grid layout
    },
  },
  ranking: {
    width: '70%',
    fontSize: '1rem',
    '& label': {
      fontWeight: 'normal',
    },
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
