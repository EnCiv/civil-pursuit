// https://github.com/EnCiv/civil-pursuit/issues/53
// https://github.com/EnCiv/civil-pursuit/issues/200
// https://github.com/EnCiv/civil-pursuit/issue/247

'use strict'
import React, { useEffect, useState } from 'react'
import Point from './point'
import { createUseStyles } from 'react-jss'
import { SecondaryButton } from './button.jsx'
import ObjectId from 'bson-objectid'
import cx from 'classnames'

function PairCompare(props) {
  const { whyRankList = [], onDone = () => {}, mainPoint = { subject: '', description: '' }, discussionId, round, ...otherProps } = props

  // idxLeft and idxRight can swap places at any point - they are simply pointers to the current two <Point/> elements
  const [idxLeft, setIdxLeft] = useState(0)
  const [idxRight, setIdxRight] = useState(1)
  const [nextLeftPoint, setNextLeftPoint] = useState(null)
  const [nextRightPoint, setNextRightPoint] = useState(null)
  const [isRightTransitioning, setIsRightTransitioning] = useState(false)
  const [isLeftTransitioning, setIsLeftTransitioning] = useState(false)
  const classes = useStyles()
  const [ranksByParentId, neverSetRanksByParentId] = useState(whyRankList.reduce((ranksByParentId, whyRank) => (whyRank.rank && (ranksByParentId[whyRank.rank.parentId] = whyRank.rank), ranksByParentId), {}))
  // if all points are ranked, show the (first) one ranked most important, go to start over state
  // otherwise compare the list
  useEffect(() => {
    let selectedIdx
    let updated = 0
    whyRankList.forEach((whyRank, i) => {
      if (whyRank.rank && ranksByParentId[whyRank.rank.parentId] !== whyRank.rank) {
        updated++
        ranksByParentId[whyRank.rank.parentId] = whyRank.rank
        if (whyRank.rank.category === 'most') selectedIdx = i
      }
    })
    const ranks = Object.values(ranksByParentId)
    if (updated && ranks.length === whyRankList.length && ranks.length > 0 && ranks.every(rank => rank.category)) {
      // skip if an update from above after the user has completed ranking - likely this is the initial render
      setIdxLeft(selectedIdx ?? whyRankList.length) // idx could be 0
      setIdxRight(whyRankList.length)
      setTimeout(() => onDone({ valid: true, value: undefined }))
    }
  }, [whyRankList])

  // send up the rank, and track it locally
  function rankIdxCategory(idx, category) {
    if (idx >= whyRankList.length) return // if only one to rank, this could be out of bounds
    const value = ranksByParentId[whyRankList[idx]._id]
      ? { ...ranksByParentId[whyRankList[idx]._id], category }
      : {
          _id: ObjectId().toString(),
          category,
          parentId: whyRankList[idx].why._id,
          stage: 'why',
          discussionId,
          round,
        }
    ranksByParentId[value.parentId] = value
    const ranks = Object.values(ranksByParentId)
    const valid = ranks.length === whyRankList.length && ranks.every(rank => rank.category)
    setTimeout(() => onDone({ valid, value }))
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
      setNextRightPoint(null)
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
      setNextLeftPoint(null)
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
    Object.values(ranksByParentId).forEach(rank => (rank.category = undefined)) // reset the categories so we can start again
    onDone({ valid: false, value: null })
    setIdxRight(1)
    setIdxLeft(0)
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
  const ranks = isSelectionComplete && Object.values(ranksByParentId) // isSelectionComple here so we don't do work if not needed
  const allRanked = isSelectionComplete && ranks.length === whyRankList.length && ranks.every(rank => rank.category) // isSelectionComple here so we don't do work if not needed
  return (
    <div className={classes.container} {...otherProps}>
      <div className={classes.mainPointContainer}>
        <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
        <div className={classes.mainPointDescription}>{mainPoint.description}</div>
      </div>

      <span className={isSelectionComplete ? classes.statusBadgeComplete : classes.statusBadge}>{`${pointsIdxCounter <= whyRankList.length ? pointsIdxCounter : whyRankList.length} out of ${whyRankList.length}`}</span>
      <div style={{ marginBottom: '2.5rem' /*increase margin at the bottom of n out of 6 label*/ }}></div>
      <div className={classes.lowerContainer}>
        <div className={classes.hiddenPointContainer}>
          <div className={cx(classes.hiddenPoint, pointsIdxCounter >= whyRankList.length - 1 && classes.hidden)}>
            <Point className={cx(classes.emptyPoint, isRightTransitioning && classes.transitioningDown)} point={nextLeftPoint} />
            
          </div>
          <div className={cx(classes.hiddenPoint, pointsIdxCounter >= whyRankList.length - 1 && classes.hidden)}>
            
            <Point className={cx(classes.emptyPoint, isLeftTransitioning && classes.transitioningDown)} point={nextRightPoint} />
          </div>
        </div>
        <div className={classes.visiblePointsContainer}>
          {idxLeft < whyRankList.length && (
            <button className={cx(classes.visiblePoint, isRightTransitioning && classes.transitioningLeft)} onClick={handleLeftPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxLeft]?.why.subject}`}>
              {<Point point={whyRankList[idxLeft].why} />}
            </button>
          )}
          {idxRight < whyRankList.length && (
            <button className={cx(classes.visiblePoint, isLeftTransitioning && classes.transitioningRight)} onClick={handleRightPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxRight]?.why.subject}`}>
              {<Point point={whyRankList[idxRight].why} />}
            </button>
          )}
        </div>
        {!isSelectionComplete || allRanked ? (
          <div className={classes.buttonsContainer}>{!isSelectionComplete ? <SecondaryButton onDone={handleNeitherButton}>Neither</SecondaryButton> : <SecondaryButton onDone={handleStartOverButton}>Start Over</SecondaryButton>}</div>
        ) : (
          <div className={classes.buttonsContainer}>
            <SecondaryButton onDone={handleYes}>Yes</SecondaryButton>
            <div style={{ width: '1rem', display: 'inline' }} />
            <SecondaryButton onDone={handleNo}>No</SecondaryButton>
          </div>
        )}
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
  },
  mainPointDescription: {
    fontWeight: '400',
  },
  hiddenPointContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    overflow: 'visible',
    paddingTop: '4rem',
    clipPath: 'xywh(0 0 100% 500%)',
  },
  hidden: {
    display: 'none',
  },
  hiddenPoint: {
    width: '30%',
  },
  emptyPoint: {
    position: 'absolute',
    width: '30%',
    top: '-2rem',
  },
  visiblePointsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
  },
  visiblePoint: {
    width: '30%',
    cursor: 'pointer',
    borderRadius: '0.9375rem',
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
    ...sharedButtonStyle(),
  },
  lowerContainer: {
    marginTop: '1rem',
    backgroundColor: theme.colors.cardOutline,
    borderRadius: '1rem',
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem auto',
  },
  transitioningDown: {
    position: 'absolute',
    transform: 'translateY(8.25rem)',
    transition: 'transform 0.5s linear',
  },
  transitioningLeft: {
    position: 'relative',
    transform: 'translateX(-200%)',
    transition: 'transform 0.5s linear',
  },
  transitioningRight: {
    position: 'relative',
    transform: 'translateX(200%)',
    transition: 'transform 0.5s linear',
  },
}))

const sharedStatusBadgeStyle = () => ({
  borderRadius: '1rem',
  padding: '0.375rem 0.625rem',
  marginBottom: '20rem',
})

const sharedButtonStyle = () => ({
  background: 'none',
  border: 'none',
  padding: '0',
  textAlign: 'left',
  '&:hover': {
    background: 'none',
    border: 'none',
  },
})

export default PairCompare
