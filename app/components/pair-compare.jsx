// https://github.com/EnCiv/civil-pursuit/issues/53
// https://github.com/EnCiv/civil-pursuit/issues/200
// https://github.com/EnCiv/civil-pursuit/issues/247

'use strict'
import React, { useEffect, useRef, useState } from 'react'
import Point from './point'
import { createUseStyles } from 'react-jss'
import { SecondaryButton, TextButton } from './button'
import ObjectId from 'bson-objectid'
import cx from 'classnames'

function PairCompare(props) {
  const { whyRankList = [], onDone = () => {}, mainPoint = { subject: '', description: '' }, progressHeading, discussionId, round, ...otherProps } = props

  const [isRightTransitioning, setIsRightTransitioning] = useState(false)
  const [isLeftTransitioning, setIsLeftTransitioning] = useState(false)
  const [isNeitherTransitioning, setIsNeitherTransitioning] = useState(false)
  const [revealedCard, setRevealedCard] = useState(null)
  const [revealedLeftCard, setRevealedLeftCard] = useState(null)
  const [revealedRightCard, setRevealedRightCard] = useState(null)
  const transitionLockRef = useRef(false)
  const transitionTimerRef = useRef(null)
  const classes = useStyles()
  // keep track of ranks locally, because this component needs to create/update them and this component needs to be independently unit testable
  const [ranksByParentId, setRanksByParentId] = useState(whyRankList.reduce((ranksByParentId, whyRank) => (whyRank.rank && (ranksByParentId[whyRank.rank.parentId] = whyRank.rank), ranksByParentId), {}))
  // allRanked is a state, so we can clear it if the user chooses to "Start Over"
  function isAllRanked(ranksByParentId) {
    const ranks = Object.values(ranksByParentId)
    return ranks.length > 0 && ranks.length === whyRankList.length && ranks.every(rank => rank.category)
  }
  const allRanked = isAllRanked(ranksByParentId)
  const winnerIndex = allRanked
    ? whyRankList.findIndex(whyRank => ranksByParentId[whyRank.why._id]?.category === 'most')
    : -1
  const hasWinner = winnerIndex >= 0
  const noWinner = allRanked && !hasWinner
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
  const [finalMostIndex, setFinalMostIndex] = useState(() => {
    if (!allRanked) return null
    const index = whyRankList.findIndex(whyRank => whyRank.rank?.category === 'most')
    return index >= 0 ? index : 0
  })
  const [_this] = useState({ firstRender: true })

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
  }, [])

  const beginTransition = () => {
    if (transitionLockRef.current) return false
    setIsLeftTransitioning(false)
    setIsRightTransitioning(false)
    setIsNeitherTransitioning(false)
    setRevealedCard(null)
    setRevealedLeftCard(null)
    setRevealedRightCard(null)
    transitionLockRef.current = true
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = setTimeout(() => {
      transitionLockRef.current = false
    }, 500)
    return true
  }
  // if all points are ranked, show the (first) one ranked most important, go to start over state
  // otherwise compare the list
  useEffect(() => {
    if (_this.firstRender) {
      _this.firstRender = false
      // if initially all are ranked, we need to send notice back to parent
      if (isAllRanked(ranksByParentId)) {
        const hasWinner = Object.values(ranksByParentId).some(rank => rank.category === 'most')
        setTimeout(() => onDone(hasWinner ? { valid: true, value: undefined } : { valid: false, value: null }))
      }
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
      const finalIndex = selectedIdx ?? whyRankList.findIndex(whyRank => whyRank.rank?.category === 'most')
      setFinalMostIndex(finalIndex >= 0 ? finalIndex : 0)
      setIdxLeft(finalIndex >= 0 ? finalIndex : whyRankList.length)
      setIdxRight(whyRankList.length)
      const hasWinner = Object.values(ranksByParentId).some(rank => rank.category === 'most')
      setRanksByParentId({ ...ranksByParentId }) // force a rerender
      setTimeout(() => onDone(hasWinner ? { valid: true, value: undefined } : { valid: false, value: null }))
    } else if (!whyRankList.length) {
      // if noting to compare then it's done
      setTimeout(() => onDone({ valid: true, value: undefined }))
    }
  }, [whyRankList])

  // send up the rank, and track it locally
  // Bidirectional data pattern: ranksByParentId is mutated directly and the same
  // reference returned when !valid to suppress re-renders on each intermediate
  // comparison. A new object is only returned when all points are ranked (valid=true)
  // to trigger the final UI update. See docs/bidirectional-data-pattern.md.
  // Note: the setTimeout(() => onDone(...)) fires promptly (~<50ms) from inside the
  // updater — returning the same reference does NOT delay the callback.
  function rankIdxCategory(idx, category) {
    if (idx >= whyRankList.length) return // if only one to rank, this could be out of bounds
    setRanksByParentId(ranksByParentId => {
      const value = ranksByParentId[whyRankList[idx].why._id]
        ? { ...ranksByParentId[whyRankList[idx].why._id], category }
        : {
            _id: new ObjectId().toString(),
            category,
            parentId: whyRankList[idx].why._id,
            stage: 'why',
            discussionId,
            round,
          }
      ranksByParentId[value.parentId] = value
      const valid = isAllRanked(ranksByParentId)
      const winner = Object.values(ranksByParentId).some(rank => rank.category === 'most')
      setTimeout(() => onDone(valid && winner ? { valid: true, value } : valid ? { valid: false, value: null } : { valid, value }))
      if (valid) return { ...ranksByParentId } // new obj to force a rerender
      else return ranksByParentId // no need for a rerender
    })
  }

  const handleLeftPointClick = () => {
    if (!beginTransition()) return
    setIsNeitherTransitioning(false)
    setIsRightTransitioning(false)
    setRevealedLeftCard(null)
    setRevealedRightCard(null)
    rankIdxCategory(idxRight, 'neutral')
    if (Math.max(idxLeft, idxRight) + 1 >= whyRankList.length) {
      // they've all been ranked
      rankIdxCategory(idxLeft, 'most')
      setFinalMostIndex(idxLeft)
      setIdxLeft(idxLeft)
      setIdxRight(whyRankList.length)
      return
    }
    const nextRightIdx = Math.min(idxLeft >= idxRight ? idxLeft + 1 : idxRight + 1, whyRankList.length)
    setIsRightTransitioning(true)

    setTimeout(() => {
      setIsRightTransitioning(false)
      setIdxRight(nextRightIdx)
      setRevealedCard(null)
      setRevealedLeftCard(null)
      setRevealedRightCard(`right-${nextRightIdx}`)
    }, 500)
  }

  const handleRightPointClick = () => {
    if (!beginTransition()) return
    setIsNeitherTransitioning(false)
    setIsLeftTransitioning(false)
    setRevealedLeftCard(null)
    setRevealedRightCard(null)
    rankIdxCategory(idxLeft, 'neutral')
    if (Math.max(idxLeft, idxRight) + 1 >= whyRankList.length) {
      // they've all been ranked
      rankIdxCategory(idxRight, 'most')
      setFinalMostIndex(idxRight)
      setIdxLeft(idxRight)
      setIdxRight(whyRankList.length)
      return
    }
    const nextLeftIdx = Math.min(idxLeft >= idxRight ? idxLeft + 1 : idxRight + 1, whyRankList.length)
    setIsLeftTransitioning(true)

    setTimeout(() => {
      setIsLeftTransitioning(false)
      setIdxLeft(nextLeftIdx)
      setRevealedCard(null)
      setRevealedLeftCard(`left-${nextLeftIdx}`)
      setRevealedRightCard(null)
    }, 500)
  }

  const handleNeitherButton = () => {
    if (!beginTransition()) return
    setIsLeftTransitioning(false)
    setIsRightTransitioning(false)
    setRevealedLeftCard(null)
    setRevealedRightCard(null)
    rankIdxCategory(idxLeft, 'neutral')
    rankIdxCategory(idxRight, 'neutral')

    setIsNeitherTransitioning(true)

    let nextLeftIdx
    let nextRightIdx
    if (idxLeft >= idxRight) {
      nextRightIdx = Math.min(idxLeft + 1, whyRankList.length)
      nextLeftIdx = Math.min(idxLeft + 2, whyRankList.length)
    } else {
      nextLeftIdx = Math.min(idxRight + 1, whyRankList.length)
      nextRightIdx = Math.min(idxRight + 2, whyRankList.length)
    }

    setTimeout(() => {
      setIsNeitherTransitioning(false)
      const exhausted = nextLeftIdx >= whyRankList.length && nextRightIdx >= whyRankList.length
      setIdxLeft(exhausted ? whyRankList.length : nextLeftIdx)
      setIdxRight(exhausted ? whyRankList.length : nextRightIdx)
      setRevealedCard(null)
      setRevealedLeftCard(`left-${nextLeftIdx}`)
      setRevealedRightCard(`right-${nextRightIdx}`)
    }, 500)
  }

  const handleStartOverButton = () => {
    setRanksByParentId(ranksByParentId => {
      const newRanksByParentId = structuredClone(ranksByParentId)
      Object.values(newRanksByParentId).forEach(rank => (rank.category = undefined)) // reset the categories so we can start again
      setIdxRight(1)
      setIdxLeft(0)
      onDone({ valid: false, value: null, delta: Object.values(newRanksByParentId).map(rank => ({ ...rank, category: '' })) })
      return newRanksByParentId // force the rerender
    })
  }

  const handleFinalChoice = category => {
    const selectedIndex = idxLeft < whyRankList.length ? idxLeft : idxRight
    if (selectedIndex >= whyRankList.length) return

    const why = whyRankList[selectedIndex].why
    const rank = ranksByParentId[why._id]
      ? { ...ranksByParentId[why._id], category }
      : {
          _id: new ObjectId().toString(),
          category,
          parentId: why._id,
          stage: 'why',
          discussionId,
          round,
        }

    const nextRanks = { ...ranksByParentId, [why._id]: rank }
    const allRanked = isAllRanked(nextRanks)
    const winner = Object.values(nextRanks).some(existingRank => existingRank.category === 'most')

    setRanksByParentId(nextRanks)
    setIdxLeft(selectedIndex)
    setIdxRight(whyRankList.length)
    if (category === 'most') setFinalMostIndex(selectedIndex)

    if (allRanked) {
      setTimeout(() => onDone(winner
        ? { valid: true, value: rank }
        : { valid: false, value: null }))
    } else {
      setTimeout(() => onDone({ valid: false, value: rank }))
    }
  }

  const handleYes = () => handleFinalChoice('most')
  const handleNo = () => handleFinalChoice('neutral')

  const pointsIdxCounter = Math.max(idxLeft, idxRight)
  const isSelectionComplete = pointsIdxCounter >= whyRankList.length
  const progressBadge = <span className={isSelectionComplete ? classes.statusBadgeComplete : classes.statusBadge}>{`${pointsIdxCounter <= whyRankList.length ? pointsIdxCounter : whyRankList.length} out of ${whyRankList.length}`}</span>
  return (
    <div className={classes.container} {...otherProps}>
      {progressHeading ? (
        <div className={classes.progressHeader}>
          {progressHeading}
          {progressBadge}
        </div>
      ) : (
        <>
          <div className={classes.mainPointContainer}>
            <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
            <div className={classes.mainPointDescription}>{mainPoint.description}</div>
          </div>
          {progressBadge}
        </>
      )}
      <div className={classes.lowerContainer}>
        {(allRanked || noWinner) && (
          <TextButton className={classes.startOverButton} onDone={handleStartOverButton} title="Start Over">
            Start Over
          </TextButton>
        )}
        <div className={classes.visiblePointsContainer}>
          {hasWinner && finalMostIndex !== null && finalMostIndex < whyRankList.length && (
            <div className={classes.finalPointWrapper}>
              <Point className={cx(classes.finalPoint, classes.finalPointReveal)} point={whyRankList[finalMostIndex].why} vState="selected" />
            </div>
          )}
          {noWinner && (
            <div className={classes.noWinnerScreen} role="status" aria-live="polite">
              <div className={classes.noWinnerTitle}>No winner</div>
              <div className={classes.noWinnerText}>Neither reason was selected as the most convincing explanation.</div>
            </div>
          )}
          {!allRanked && !noWinner && idxLeft < whyRankList.length && (
            <div className={cx(classes.cardPile, isLeftTransitioning && classes.cardPileTransitionLeft, isNeitherTransitioning && classes.cardPileNeitherLeft)}>
              {idxLeft + 2 < whyRankList.length && <div className={cx(classes.pileCard, classes.pileCardThird)} aria-hidden="true" />}
              {idxLeft + 1 < whyRankList.length && <div className={cx(classes.pileCard, classes.pileCardSecond)} aria-hidden="true" />}
              <button className={cx(classes.visiblePointButton)} onClick={handleLeftPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxLeft]?.why.subject}`}>
                {<Point key={whyRankList[idxLeft].why._id} className={cx(classes.visiblePoint, isRightTransitioning && classes.transitioningLeft, (revealedCard === `left-${idxLeft}` || revealedLeftCard === `left-${idxLeft}`) && classes.revealedCard)} point={whyRankList[idxLeft].why} />}
              </button>
            </div>
          )}
          {!allRanked && !noWinner && idxRight < whyRankList.length && (
            <div className={cx(classes.cardPile, isRightTransitioning && classes.cardPileTransitionRight, isNeitherTransitioning && classes.cardPileNeitherRight)}>
              {idxRight + 2 < whyRankList.length && <div className={cx(classes.pileCard, classes.pileCardThird)} aria-hidden="true" />}
              {idxRight + 1 < whyRankList.length && <div className={cx(classes.pileCard, classes.pileCardSecond)} aria-hidden="true" />}
              <button className={cx(classes.visiblePointButton)} onClick={handleRightPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxRight]?.why.subject}`}>
                {<Point key={whyRankList[idxRight].why._id} className={cx(classes.visiblePoint, isLeftTransitioning && classes.transitioningRight, (revealedCard === `right-${idxRight}` || revealedRightCard === `right-${idxRight}`) && classes.revealedCard)} point={whyRankList[idxRight].why} />}
              </button>
            </div>
          )}
        </div>
        <div className={classes.buttonsContainer}>
          {isSelectionComplete && !allRanked && !noWinner ? (
            <>
              <SecondaryButton className={classes.customButton} onDone={handleYes} title="Recommend for further consideration">
                Useful
              </SecondaryButton>
              <SecondaryButton className={classes.customButton} onDone={handleNo} title="Not recommended for further consideration">
                Not useful
              </SecondaryButton>
            </>
          ) : hasWinner ? (
            <div className={classes.finalSelectionText} aria-live="polite">
              You chose this as the most convincing explanation
            </div>
          ) : noWinner ? null : (
            <SecondaryButton className={classes.neitherButton} onDone={handleNeitherButton} title="Neither reason">
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
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    '& > span': {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
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
    alignItems: 'stretch',
    gap: '3rem',
    minHeight: '16rem',
    paddingTop: '4.5rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '1rem',
    },
  },
  cardPile: {
    position: 'relative',
    width: '100%',
    minHeight: '14rem',
  },
  cardPileTransitionLeft: {
    zIndex: 3,
    animation: '$singleSwipeLeft 500ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  cardPileTransitionRight: {
    zIndex: 3,
    animation: '$singleSwipeRight 500ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  cardPileNeitherLeft: {
    zIndex: 3,
    animation: '$neitherSwipeLeft 500ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  cardPileNeitherRight: {
    zIndex: 3,
    animation: '$neitherSwipeRight 500ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  pileCard: {
    position: 'absolute',
    inset: '0',
    height: '100%',
    borderRadius: '0.9375rem',
    backgroundColor: theme.colors.white,
    border: `${theme.border.width.thin} solid ${theme.colors.borderGray}`,
    boxShadow: '0 0.25rem 0.625rem rgba(6, 51, 92, 0.10)',
  },
  pileCardSecond: {
    transform: 'translate(0.5rem, 0.5rem)',
  },
  pileCardThird: {
    transform: 'translate(1rem, 1rem)',
  },
  visiblePointButton: {
    position: 'absolute',
    inset: '0',
    zIndex: 2,
    width: '100%',
    height: '100%',
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
  revealedCard: {
    animation: '$cardReveal 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  visiblePoint: {
    position: 'relative',
    height: '100%',
    boxSizing: 'border-box',
    left: '0%',
    right: '0%',
    width: '100%',
    cursor: 'pointer',
    borderRadius: '0.9375rem',
    boxShadow: 'none !important',
    '&:hover': {
      boxShadow: 'none !important',
      transform: 'none',
    },
    '&:focus': {
      outline: `${theme.focusOutline}`,
    },
    ...sharedButtonStyle(),
  },
  finalPointWrapper: {
    width: '100%',
    maxWidth: '32rem',
  },
  finalPoint: {
    height: '100%',
    boxSizing: 'border-box',
  },
  finalPointReveal: {
    animation: '$finalCardReveal 420ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  noWinnerScreen: {
    width: '100%',
    maxWidth: '32rem',
    minHeight: '14rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    animation: '$finalCardReveal 420ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
  },
  noWinnerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: '1.875rem',
  },
  noWinnerText: {
    marginTop: '0.5rem',
    color: theme.colors.title,
    fontSize: '0.9375rem',
    lineHeight: '1.5rem',
  },
  startOverButton: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    zIndex: 4,
    minWidth: 'auto',
    width: 'auto',
    minHeight: '2.75rem',
    height: 'auto',
    padding: '0.625rem 0.875rem',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    fontSize: '0.9375rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    color: theme.colors.disableGray,
    textDecoration: 'underline',
    textUnderlineOffset: '0.125rem',
  },
  lowerContainer: {
    overflow: 'visible',
    position: 'relative',
    paddingTop: '1.25rem',
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
  finalSelectionText: {
    minHeight: '3.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: theme.colors.title,
    fontFamily: theme.font.fontFamily,
    fontSize: '0.9375rem',
    fontWeight: 600,
  },
  buttonsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    width: '100%',
    maxWidth: '25rem',
    margin: '3.5rem auto 2rem',
    gap: '1.25rem',
    '& > $neitherButton': {
      gridColumn: '1 / -1',
      justifySelf: 'center',
    },
    '& > $finalSelectionText': {
      gridColumn: '1 / -1',
      justifySelf: 'stretch',
    },
  },
  transitioningLeft: {
    transform: 'translateX(-130%) rotate(-4deg)',
    transition: 'transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  transitioningNeitherLeft: {
    transform: 'translateX(-115%) rotate(-5deg)',
    transition: 'transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  transitioningNeitherRight: {
    transform: 'translateX(115%) rotate(5deg)',
    transition: 'transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  transitioningRight: {
    transform: 'translateX(130%) rotate(4deg)',
    transition: 'transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  '@keyframes singleSwipeLeft': {
    from: { opacity: 1, transform: 'translateX(0) rotate(0)' },
    to: { opacity: 0, transform: 'translateX(-115%) rotate(-5deg)' },
  },
  '@keyframes singleSwipeRight': {
    from: { opacity: 1, transform: 'translateX(0) rotate(0)' },
    to: { opacity: 0, transform: 'translateX(115%) rotate(5deg)' },
  },
  '@keyframes neitherSwipeLeft': {
    from: { opacity: 1, transform: 'translateX(0) rotate(0)' },
    to: { opacity: 0, transform: 'translateX(-115%) rotate(-5deg)' },
  },
  '@keyframes neitherSwipeRight': {
    from: { opacity: 1, transform: 'translateX(0) rotate(0)' },
    to: { opacity: 0, transform: 'translateX(115%) rotate(5deg)' },
  },
  '@keyframes cardReveal': {
    from: { opacity: 0.25, transform: 'translateY(0.5rem) scale(0.985)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  '@keyframes finalCardReveal': {
    from: { opacity: 0, transform: 'translateY(0.75rem) scale(0.98)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  neitherButton: {
    minWidth: '12rem',
    width: 'auto',
    minHeight: '2.75rem',
    height: 'auto',
    padding: '0.625rem 1rem',
    border: `0.125rem solid ${theme.colors.borderGray}`,
    backgroundColor: theme.colors.white,
    boxShadow: 'none',
    color: theme.colors.textPrimary,
    fontSize: '0.9375rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    '&:hover': {
      borderColor: theme.colors.borderGray,
      backgroundColor: theme.colors.cardOutline,
      textDecoration: 'none',
    },
  },
  customButton: {
    width: '100%',
    minHeight: '3.25rem',
    padding: '0.875rem 1rem',
    boxSizing: 'border-box',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      width: '100%',
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
