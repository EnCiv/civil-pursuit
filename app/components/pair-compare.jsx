// https://github.com/EnCiv/civil-pursuit/issues/53
// https://github.com/EnCiv/civil-pursuit/issues/200
// https://github.com/EnCiv/civil-pursuit/issues/247

'use strict'
import React, { useEffect, useState } from 'react'
import Point from './point'
import { createUseStyles } from 'react-jss'
import { SecondaryButton } from './button'
import ObjectId from 'bson-objectid'
import cx from 'classnames'

const blankPoint = { subject: '     ', description: '     ' } // used to reset the next point when transitioning
function PairCompare(props) {
  const { whyRankList = [], onDone = () => {}, mainPoint = { subject: '', description: '' }, discussionId, round, ...otherProps } = props

  const [nextLeftPoint, setNextLeftPoint] = useState(blankPoint)
  const [nextRightPoint, setNextRightPoint] = useState(blankPoint)
  const [isRightTransitioning, setIsRightTransitioning] = useState(false)
  const [isLeftTransitioning, setIsLeftTransitioning] = useState(false)
  const classes = useStyles()
  // keep track of ranks locally, because this component needs to create/update them and this component needs to be independently unit testable
  const [ranksByParentId, setRanksByParentId] = useState(whyRankList.reduce((ranksByParentId, whyRank) => (whyRank.rank && (ranksByParentId[whyRank.rank.parentId] = whyRank.rank), ranksByParentId), {}))
  // allRanked is a state, so we can clear it if the user chooses to "Start Over"
  function isAllRanked(ranksByParentId) {
    const ranks = Object.values(ranksByParentId)
    return ranks.length > 0 && ranks.length === whyRankList.length && ranks.every(rank => rank.category)
  }
  const allRanked = isAllRanked(ranksByParentId)
  // idxLeft and idxRight can swap places at any point - they are simply pointers to the current two <Point/> elements
  const [idxLeft, setIdxLeft] = useState(
    allRanked
      ? Math.max(
          whyRankList.findIndex(whyRank => whyRank.rank?.category === 'most'),
          0
        )
      : 0
  ) // if nothing is ranked most, when all are ranked, thats an error, but start at 0
  const [idxRight, setIdxRight] = useState(allRanked ? whyRankList.length : 1)
  const [_this] = useState({ firstRender: true })
  // if all points are ranked, show the (first) one ranked most important, go to start over state
  // otherwise compare the list
  useEffect(() => {
    if (_this.firstRender) {
      _this.firstRender = false
      // if initially all are ranked, we need to send notice back to parent
      if (isAllRanked(ranksByParentId)) setTimeout(() => onDone({ valid: true, value: undefined }))
      return
    }
    let selectedIdx
    let updated = 0
    whyRankList.forEach((whyRank, i) => {
      if (whyRank.rank && ranksByParentId[whyRank.rank.parentId] !== whyRank.rank) {
        updated++
        ranksByParentId[whyRank.rank.parentId] = whyRank.rank
        if (whyRank.rank.category === 'most') selectedIdx = i
      }
    })
    const allRanked = isAllRanked(ranksByParentId)
    if (updated && allRanked) {
      // skip if an update from above after the user has completed ranking - likely this is the initial render
      setIdxLeft(selectedIdx ?? whyRankList.length) // idx could be 0
      setIdxRight(whyRankList.length)
      setRanksByParentId({ ...ranksByParentId }) // force a rerender
      setTimeout(() => onDone({ valid: true, value: undefined }))
    } else if (!whyRankList.length) {
      // if noting to compare then it's done
      setTimeout(() => onDone({ valid: true, value: undefined }))
    }
  }, [whyRankList])

  // send up the rank, and track it locally
  function rankIdxCategory(idx, category) {
    if (idx >= whyRankList.length) return // if only one to rank, this could be out of bounds
    setRanksByParentId(ranksByParentId => {
      const value = ranksByParentId[whyRankList[idx].why._id]
        ? { ...ranksByParentId[whyRankList[idx].why._id], category }
        : {
            _id: ObjectId().toString(),
            category,
            parentId: whyRankList[idx].why._id,
            stage: 'why',
            discussionId,
            round,
          }
      ranksByParentId[value.parentId] = value
      const valid = isAllRanked(ranksByParentId)
      setTimeout(() => onDone({ valid, value }))
      if (valid) return { ...ranksByParentId } // new obj to force a rerender
      else return ranksByParentId // no need for a rerender
    })
  }

  const handleLeftPointClick = () => {
    rankIdxCategory(idxRight, 'neutral')
    if (Math.max(idxLeft, idxRight) + 1 >= whyRankList.length) {
      // they've all been ranked
      rankIdxCategory(idxLeft, 'most')
      setIdxRight(whyRankList.length)
      return
    }
    const nextRightIdx = Math.min(idxLeft >= idxRight ? idxLeft + 1 : idxRight + 1, whyRankList.length)
    setIsLeftTransitioning(true)
    setNextRightPoint(whyRankList[nextRightIdx].why)

    setTimeout(() => {
      setIsLeftTransitioning(false)
      setNextRightPoint(blankPoint) // reset next point
      setIdxRight(nextRightIdx)
    }, 500)
  }

  const handleRightPointClick = () => {
    rankIdxCategory(idxLeft, 'neutral')
    if (Math.max(idxLeft, idxRight) + 1 >= whyRankList.length) {
      // they've all been ranked
      rankIdxCategory(idxRight, 'most')
      setIdxLeft(whyRankList.length)
      return
    }
    const nextLeftIdx = Math.min(idxLeft >= idxRight ? idxLeft + 1 : idxRight + 1, whyRankList.length)
    setNextLeftPoint(whyRankList[nextLeftIdx].why)
    setIsRightTransitioning(true)

    setTimeout(() => {
      setIsRightTransitioning(false)
      setNextLeftPoint(blankPoint)
      setIdxLeft(nextLeftIdx)
    }, 500)
  }

  const handleNeitherButton = () => {
    rankIdxCategory(idxLeft, 'neutral')
    rankIdxCategory(idxRight, 'neutral')

    if (idxLeft >= idxRight) {
      setIdxRight(Math.min(idxLeft + 1, whyRankList.length))
      setIdxLeft(Math.min(idxLeft + 2, whyRankList.length))
    } else {
      setIdxLeft(Math.min(idxRight + 1, whyRankList.length))
      setIdxRight(Math.min(idxRight + 2, whyRankList.length))
    }
  }

  const handleStartOverButton = () => {
    setRanksByParentId(ranksByParentId => {
      const newRanksByParentId = structuredClone(ranksByParentId)
      Object.values(newRanksByParentId).forEach(rank => (rank.category = undefined)) // reset the categories so we can start again
      setIdxRight(1)
      setIdxLeft(0)
      onDone({ valid: false, value: null })
      return newRanksByParentId // force the rerender
    })
  }

  const handleYes = () => {
    if (idxLeft < whyRankList.length) {
      rankIdxCategory(idxLeft, 'most')
    } else if (idxRight < whyRankList.length) {
      rankIdxCategory(idxRight, 'most')
    }
  }
  const handleNo = () => {
    if (idxLeft < whyRankList.length) {
      rankIdxCategory(idxLeft, 'neutral')
    } else if (idxRight < whyRankList.length) {
      rankIdxCategory(idxRight, 'neutral')
    }
  }

  const pointsIdxCounter = Math.max(idxLeft, idxRight)
  const isSelectionComplete = pointsIdxCounter >= whyRankList.length
  return (
    <div className={classes.container} {...otherProps}>
      <div className={classes.mainPointContainer}>
        <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
        <div className={classes.mainPointDescription}>{mainPoint.description}</div>
      </div>

      <span className={isSelectionComplete ? classes.statusBadgeComplete : classes.statusBadge}>{`${pointsIdxCounter <= whyRankList.length ? pointsIdxCounter : whyRankList.length} out of ${whyRankList.length}`}</span>
      <div className={classes.lowerContainer}>
        <div className={classes.hiddenPointContainer}>
          <Point vState="disabled" className={cx(classes.hiddenPoint, pointsIdxCounter >= whyRankList.length - 1 && classes.hidden, isRightTransitioning && classes.transitioningDown)} point={nextLeftPoint} />
          <Point vState="disabled" className={cx(classes.hiddenPoint, pointsIdxCounter >= whyRankList.length - 1 && classes.hidden, isLeftTransitioning && classes.transitioningDown)} point={nextRightPoint} />
        </div>
        <div className={classes.visiblePointsContainer}>
          {idxLeft < whyRankList.length && (
            <button className={cx(classes.visiblePointButton)} onClick={handleLeftPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxLeft]?.why.subject}`}>
              {<Point className={cx(classes.visiblePoint, isRightTransitioning && classes.transitioningLeft)} point={whyRankList[idxLeft].why} />}
            </button>
          )}
          {idxRight < whyRankList.length && (
            <button className={cx(classes.visiblePointButton)} onClick={handleRightPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxRight]?.why.subject}`}>
              {<Point className={cx(classes.visiblePoint, isLeftTransitioning && classes.transitioningRight)} point={whyRankList[idxRight].why} />}
            </button>
          )}
        </div>
        <div className={classes.buttonsContainer}>
          {isSelectionComplete && !allRanked ? (
            <>
              <SecondaryButton className={classes.customButton} onDone={handleYes} title="Recommend for further consideration">
                Useful
              </SecondaryButton>
              <div style={{ width: '1rem', display: 'inline' }} />
              <SecondaryButton className={classes.customButton} onDone={handleNo} title="Not recommended for further consideration">
                Not useful
              </SecondaryButton>
            </>
          ) : isSelectionComplete || allRanked ? (
            <SecondaryButton className={classes.customButton} onDone={handleStartOverButton}>
              Start Over
            </SecondaryButton>
          ) : (
            <SecondaryButton className={classes.customButton} onDone={handleNeitherButton}>
              Neither
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    fontFamily: theme.font.fontFamily,
    overflowX: 'hidden',
  },
  statusBadge: {
    backgroundColor: theme.colors.statusBadgeProgressBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeProgressBorder}`,
    ...sharedStatusBadgeStyle(),
  },
  statusBadgeComplete: {
    backgroundColor: theme.colors.statusBadgeCompletedBackground,
    border: `${theme.border.width.thin} solid ${theme.colors.statusBadgeCompletedBorder}`,
    ...sharedStatusBadgeStyle(),
  },
  mainPointContainer: {
    textAlign: 'center',
  },
  mainPointSubject: {
    fontWeight: '600',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    marginBottom: '1rem',
  },
  mainPointDescription: {
    fontWeight: '400',
    marginBottom: '2rem',
  },
  hiddenPointContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    overflow: 'visible',
    paddingTop: '4rem',
    clipPath: 'xywh(0 0 100% 500%)',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '1rem',
    },
  },
  hidden: {
    display: 'none',
  },
  hiddenPoint: {
    width: '100%',
    position: 'relative',
    background: 'white',
    opacity: 1,
    border: 'none',
    //top: '-5rem',
    transform: 'translateY(-5rem)',
  },
  emptyPoint: {
    position: 'relative',
    top: '0rem',
    //position: 'absolute',
    //width: '30%',
    //top: '-2rem',
  },
  visiblePointsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '1rem',
    },
  },
  visiblePointButton: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    borderRadius: '0.9375rem',
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
    background: 'none',
    border: 'none',
    padding: '0',
    textAlign: 'left',
    '&:hover': {
      background: 'none',
      border: 'none',
    },
  },
  visiblePoint: {
    position: 'relative',
    left: '0%',
    right: '0%',
    width: '100%',
    cursor: 'pointer',
    borderRadius: '0.9375rem',
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
    ...sharedButtonStyle(),
  },
  lowerContainer: {
    marginTop: '2rem',
    paddingLeft: '3rem',
    paddingRight: '3rem',
    backgroundColor: theme.colors.cardOutline,
    borderRadius: '1rem',
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '25rem',
    margin: '2rem auto',
    gap: '3rem',
  },
  transitioningDown: {
    //position: 'absolute',
    transform: 'translateY(8.25rem)',
    //transition: 'transform 0.5s linear',
    //top: '9rem',
    transition: 'all 0.5s linear',
  },
  transitioningLeft: {
    //position: 'relative',
    //transform: 'translateX(-200%)',
    left: '-200%',
    transition: 'all 0.5s linear',
  },
  transitioningRight: {
    //position: 'relative',
    //transform: 'translateX(200%)',
    left: '200%',
    transition: 'all 0.5s linear',
  },
  customButton: {
    width: '25rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '75%',
      maxWidth: '17rem',
    },
  },
}))

const sharedStatusBadgeStyle = () => ({
  borderRadius: '1rem',
  padding: '0.375rem 0.625rem',
})

const sharedButtonStyle = () => ({
  background: 'white',
  border: 'none',
  padding: '0',
  textAlign: 'left',
  '&:hover': {
    background: 'none',
    border: 'none',
  },
})

export default PairCompare
