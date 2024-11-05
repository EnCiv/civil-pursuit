// https://github.com/EnCiv/civil-pursuit/issues/53
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useRef, useState } from 'react'
import Point from './point'
import { createUseStyles } from 'react-jss'
import { SecondaryButton } from './button.jsx'
import ObjectId from 'bson-objectid'

function PairCompare(props) {
  const { whyRankList = [], onDone = () => {}, mainPoint = { subject: '', description: '' }, discussionId, round, ...otherProps } = props

  // idxLeft and idxRight can swap places at any point - they are simply pointers to the current two <Point/> elements
  const [idxLeft, setIdxLeft] = useState(0)
  const [idxRight, setIdxRight] = useState(1)

  const visibleRightPointRef = useRef(null)
  const visibleLeftPointRef = useRef(null)
  const hiddenLeftPointRef = useRef(null)
  const hiddenRightPointRef = useRef(null)

  const [pointsIdxCounter, setPointsIdxCounter] = useState(1)
  const [isRightTransitioning, setIsRightTransitioning] = useState(false)
  const [isLeftTransitioning, setIsLeftTransitioning] = useState(false)
  const classes = useStyles()
  const [ranksByParentId, setRanksByParentId] = useState(whyRankList.reduce((ranksByParentId, whyRank) => (whyRank.rank && (ranksByParentId[whyRank.rank.parentId] = whyRank.rank), ranksByParentId), {}))
  // if all points are ranked, show the (first) one ranked most important, go to start over state
  // otherwise compare the list
  useEffect(() => {
    let selectedIdx
    whyRankList.forEach((whyRank, i) => {
      if (whyRank.rank) {
        ranksByParentId[whyRank.rank.parentId] = whyRank.rank
        if (whyRank.rank.category === 'most') selectedIdx = i
      }
    })
    if (Object.keys(ranksByParentId).length === whyRankList.length) {
      if (pointsIdxCounter !== whyRankList.length) {
        let selectedRank = null
        // skip if an update from above after the user has completed ranking - likely thisis the initial render
        setPointsIdxCounter(whyRankList.length)
        if (typeof selectedIdx === 'number') {
          setIdxLeft(selectedIdx) // idx could be 0
          selectedRank = whyRankList[selectedIdx].rank
        } else setIdxLeft(whyRankList.length + 1)
        setIdxRight(whyRankList.length)
        setTimeout(() => onDone({ valid: true, value: selectedRank }))
      }
    }
  }, [whyRankList])

  function rankIdxCategory(idx, category) {
    // this one gets a neutral vote
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
    setTimeout(() => onDone({ valid: category === 'most', value }))
  }

  function incrementPointsIdxCounter(increment) {
    setPointsIdxCounter(pointsIdxCounter => {
      pointsIdxCounter += increment
      if (pointsIdxCounter >= whyRankList.length + 1) {
        // neither and no other choices
        setTimeout(() => onDone({ valid: true, value: null })) //done but no winner
        return pointsIdxCounter
      } else if (pointsIdxCounter >= whyRankList.length) {
        // selectionComplete ?
        const selectedIdx = whyRankList[idxLeft] ? idxLeft : idxRight
        rankIdxCategory(selectedIdx, 'most')
      }
      return pointsIdxCounter
    })
  }

  const handleLeftPointClick = () => {
    rankIdxCategory(idxRight, 'neutral')
    // prevent transitions from firing on last comparison
    if (idxRight >= whyRankList.length - 1 || idxLeft >= whyRankList.length - 1) {
      if (idxLeft >= idxRight) {
        setIdxRight(idxLeft + 1)
      } else {
        setIdxRight(idxRight + 1)
      }
      incrementPointsIdxCounter(1)
      return
    }

    setIsLeftTransitioning(true)
    const visiblePointRight = visibleRightPointRef.current
    const hiddenPointRight = hiddenRightPointRef.current

    Object.assign(visiblePointRight.style, {
      position: 'relative',
      transform: 'translateX(200%)',
      transition: 'transform 0.5s linear',
    })
    Object.assign(hiddenPointRight.style, {
      position: 'absolute',
      transform: 'translateY(8.25rem)',
      transition: 'transform 0.5s linear',
    })

    setTimeout(() => {
      setIsLeftTransitioning(false)
      if (idxLeft >= idxRight) {
        setIdxRight(idxLeft + 1)
      } else {
        setIdxRight(idxRight + 1)
      }
      incrementPointsIdxCounter(1)

      Object.assign(visiblePointRight.style, { position: '', transition: 'none', transform: '' })
      Object.assign(hiddenPointRight.style, { position: '', transition: 'none', transform: '' })
    }, 500)
  }

  const handleRightPointClick = () => {
    rankIdxCategory(idxLeft, 'neutral')
    // prevent transitions from firing on last comparison
    if (idxRight >= whyRankList.length - 1 || idxLeft >= whyRankList.length - 1) {
      if (idxLeft >= idxRight) {
        setIdxLeft(idxLeft + 1)
      } else {
        setIdxLeft(idxRight + 1)
      }
      incrementPointsIdxCounter(1)
      return
    }

    setIsRightTransitioning(true)
    const visiblePointLeft = visibleLeftPointRef.current
    const hiddenPointLeft = hiddenLeftPointRef.current

    Object.assign(visiblePointLeft.style, {
      position: 'relative',
      transform: 'translateX(-200%)',
      transition: 'transform 0.5s linear',
    })
    Object.assign(hiddenPointLeft.style, {
      position: 'absolute',
      transform: 'translateY(8.25rem)',
      transition: 'transform 0.5s linear',
    })

    setTimeout(() => {
      setIsRightTransitioning(false)
      if (idxLeft >= idxRight) {
        setIdxLeft(idxLeft + 1)
      } else {
        setIdxLeft(idxRight + 1)
      }

      incrementPointsIdxCounter(1)

      Object.assign(visiblePointLeft.style, { position: '', transition: 'none', transform: '' })
      Object.assign(hiddenPointLeft.style, { position: '', transition: 'none', transform: '' })
    }, 500)
  }

  const handleNeitherButton = () => {
    rankIdxCategory(idxLeft, 'neutral')
    rankIdxCategory(idxRight, 'neutral')

    if (idxLeft >= idxRight) {
      setIdxRight(idxLeft + 1)
      setIdxLeft(idxLeft + 2)
    } else {
      setIdxLeft(idxRight + 1)
      setIdxRight(idxRight + 2)
    }

    incrementPointsIdxCounter(2)
  }

  const handleStartOverButton = () => {
    onDone({ valid: false, value: null })
    setIdxRight(1)
    setIdxLeft(0)
    setPointsIdxCounter(1)
    setSelectedPoint(null)
  }

  const isSelectionComplete = () => {
    return pointsIdxCounter >= whyRankList.length
  }

  const nextIndex = idxLeft > idxRight ? idxLeft + 1 : idxRight + 1
  const hiddenEmptyLeftPoint = <Point ref={hiddenLeftPointRef} className={classes.emptyPoint} />
  const hiddenTransitioningLeftPoint = <Point ref={hiddenLeftPointRef} className={classes.emptyPoint} point={whyRankList[nextIndex]} />
  const hiddenEmptyRightPoint = <Point ref={hiddenRightPointRef} className={classes.emptyPoint} />
  const hiddenTransitioningRightPoint = <Point ref={hiddenRightPointRef} className={classes.emptyPoint} point={whyRankList[nextIndex]} />

  return (
    <div className={classes.container} {...otherProps}>
      <div className={classes.mainPointContainer}>
        <div className={classes.mainPointSubject}>{mainPoint.subject}</div>
        <div className={classes.mainPointDescription}>{mainPoint.description}</div>
      </div>

      <span className={isSelectionComplete() ? classes.statusBadgeComplete : classes.statusBadge}>{`${pointsIdxCounter <= whyRankList.length ? pointsIdxCounter : whyRankList.length} out of ${whyRankList.length}`}</span>

      <div className={classes.lowerContainer}>
        <div className={classes.hiddenPointContainer}>
          {pointsIdxCounter < whyRankList.length && <div className={classes.hiddenPoint}>{isRightTransitioning ? hiddenTransitioningLeftPoint : hiddenEmptyLeftPoint}</div>}
          {pointsIdxCounter < whyRankList.length && <div className={classes.hiddenPoint}>{isLeftTransitioning ? hiddenTransitioningRightPoint : hiddenEmptyRightPoint}</div>}
        </div>

        <div className={classes.visiblePointsContainer}>
          {idxLeft < whyRankList.length && (
            <button className={classes.visiblePoint} ref={visibleLeftPointRef} onClick={handleLeftPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxLeft]?.why.subject}`}>
              {<Point point={whyRankList[idxLeft].why} />}
            </button>
          )}
          {idxRight < whyRankList.length && (
            <button className={classes.visiblePoint} ref={visibleRightPointRef} onClick={handleRightPointClick} tabIndex={0} title={`Choose as more important: ${whyRankList[idxRight]?.why.subject}`}>
              {<Point point={whyRankList[idxRight].why} />}
            </button>
          )}
        </div>
        <div className={classes.buttonsContainer}>{!isSelectionComplete() ? <SecondaryButton onDone={handleNeitherButton}>Neither</SecondaryButton> : <SecondaryButton onDone={handleStartOverButton}>Start Over</SecondaryButton>}</div>
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
    justifyContent: 'space-evenly',
    overflow: 'visible',
    paddingTop: '5rem',
    marginBottom: '1rem',
    clipPath: 'xywh(0 0 100% 500%)',
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
    justifyContent: 'space-evenly',
    gap: '1rem',
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
}))

const sharedStatusBadgeStyle = () => ({
  borderRadius: '1rem',
  padding: '0.375rem 0.625rem',
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
