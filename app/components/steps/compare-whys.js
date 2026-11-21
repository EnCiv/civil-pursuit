// https://github.com/EnCiv/civil-pursuit/issues/77
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PairCompare from '../pair-compare'
import { ChevronDown } from '../../svgr'
import { H, Level } from 'react-accessible-headings'
import StepIntro from '../step-intro'

import { useDeliberationContext, useLocalStorageIfAvailable } from '../deliberation-context'
import useFetchDemInfo from '../hooks/use-fetch-dem-info'

export default function CompareWhysStep(props) {
  const { onDone, round, category = 'most' } = props
  const { data, upsert } = useDeliberationContext()
  const storageAvailable = useLocalStorageIfAvailable()
  const fetchDemInfo = useFetchDemInfo()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const args = { ...derivePointWithWhyRankListListByCategory(data, category) }
  const handleOnDone = ({ valid, value, delta }) => {
    if (delta) {
      const rankDeltas = Array.isArray(delta) ? delta : [delta]
      const whyRankByParentId = rankDeltas.reduce((ranks, rank) => ((ranks[rank.parentId] = rank), ranks), {})
      upsert({ whyRankByParentId })
      if (!storageAvailable) {
        rankDeltas.forEach(rank => window.socket.emit('upsert-rank', rank))
      }
    }
    onDone({ valid, value })
  }
  // fetch previous data
  useEffect(() => {
    // on the browser, do this once and only once when this component is first rendered
    setIsLoading(true)
    setLoadError(false)
    const { discussionId, preRankByParentId } = data
    const { mostIds, leastIds } = Object.values(preRankByParentId ?? {}).reduce(
      ({ mostIds, leastIds }, rank) => {
        if (Object.values(data.randomWhyById || {}).some(why => why.parentId === rank.parentId && why.category === rank.category)) return { mostIds, leastIds } // already have this why
        if (rank.category === 'most') mostIds.push(rank.parentId)
        else if (rank.category === 'least') leastIds.push(rank.parentId)
        return { mostIds, leastIds }
      },
      { mostIds: [], leastIds: [] }
    )
    if (!mostIds.length && !leastIds.length) {
      setIsLoading(false)
      return
    }
    window.socket.emit('get-why-ranks-and-points', discussionId, round, mostIds, leastIds, result => {
      if (!result) {
        setLoadError(true)
        setIsLoading(false)
        return // there was an error
      }
      const { ranks, whys } = result
      //if (!ranks.length && !whys.length) return // nothing to do
      const whyRankByParentId = ranks.reduce((whyRankByParentId, rank) => ((whyRankByParentId[rank.parentId] = rank), whyRankByParentId), {})
      const randomWhyById = whys.reduce((randomWhyById, point) => ((randomWhyById[point._id] = point), randomWhyById), {})
      const requestedParentIds = [...mostIds, ...leastIds]
      const whyDataLoadedByParentIdByRound = {
        ...data.whyDataLoadedByParentIdByRound,
        [round]: {
          ...data.whyDataLoadedByParentIdByRound?.[round],
          ...Object.fromEntries(requestedParentIds.map(parentId => [parentId, true])),
        },
      }
      upsert({ whyRankByParentId, randomWhyById, whyDataLoadedByParentIdByRound })

      // Fetch dem-info for all why points
      const whyIds = whys.map(w => w._id)
      fetchDemInfo(whyIds)
      setIsLoading(false)
    })
  }, [round, data.preRankByParentId])
  return <CompareWhys {...props} {...args} category={category} isLoading={isLoading} loadError={loadError} round={round} discussionId={data.discussionId} onDone={handleOnDone} />
}

// pointWithWhyRankListList = [{point: {}, whyRankList: [why:{}, rank:{}]]
export function CompareWhys(props) {
  const { pointWithWhyRankListList, side = '', category = 'most', onDone = () => {}, className, discussionId, round, stepIntro, isLoading = false, loadError = false } = props
  const classes = useStyles()
  const [completedByPointId, setCompletedByPointId] = useState(() =>
    (pointWithWhyRankListList || []).reduce((completedByPointId, pointWithWhyRankList) => {
      completedByPointId[pointWithWhyRankList.point._id] = isWhyListComplete(pointWithWhyRankList.whyRankList)
      return completedByPointId
    }, {})
  )
  const completedByPointIdRef = useRef(completedByPointId)
  const reportedCompletionByPointIdRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [navigationDirection, setNavigationDirection] = useState(1)
  const currentPointIndex = Math.min(currentIndex, Math.max((pointWithWhyRankListList?.length || 1) - 1, 0))
  const currentPointWithWhyRankList = pointWithWhyRankListList?.[currentPointIndex]
  const navigateToPoint = direction => {
    setNavigationDirection(direction)
    setCurrentIndex(index => Math.max(0, Math.min(pointWithWhyRankListList.length - 1, index + direction)))
  }

  useEffect(() => {
    if (isLoading || loadError) return
    // if new points get added, mark them as incomplete
    if (!pointWithWhyRankListList) {
      onDone({ valid: true, value: 'skip' })
      return
    }
    const updatedCompletedByPointId = pointWithWhyRankListList.reduce(
      (updated, pointWithWhyRankList) => {
        updated[pointWithWhyRankList.point._id] = isWhyListComplete(pointWithWhyRankList.whyRankList)
        return updated
      },
      {}
    )
    const previousReportedCompletion = reportedCompletionByPointIdRef.current
    const completionChanged =
      !previousReportedCompletion ||
      Object.keys(updatedCompletedByPointId).length !== Object.keys(previousReportedCompletion).length ||
      Object.keys(updatedCompletedByPointId).some(pointId => updatedCompletedByPointId[pointId] !== previousReportedCompletion[pointId])
    completedByPointIdRef.current = updatedCompletedByPointId
    setCompletedByPointId(updatedCompletedByPointId)
    reportedCompletionByPointIdRef.current = updatedCompletedByPointId
    setCurrentIndex(index => Math.min(index, Math.max(pointWithWhyRankListList.length - 1, 0)))
    const done = Object.values(updatedCompletedByPointId).filter(Boolean).length
    const total = pointWithWhyRankListList.length
    if (completionChanged) onDone({ valid: done === total, value: total ? done / total : 1 })
  }, [pointWithWhyRankListList, isLoading, loadError])

  const handlePairCompare = ({ valid, value, delta }, _id) => {
    if (value === undefined) return
    const updatedCompletedByPointId = { ...completedByPointIdRef.current, [_id]: valid }
    completedByPointIdRef.current = updatedCompletedByPointId
    reportedCompletionByPointIdRef.current = updatedCompletedByPointId
    setCompletedByPointId(updatedCompletedByPointId)
    const done = Object.values(updatedCompletedByPointId).filter(Boolean).length
    const percentDone = pointWithWhyRankListList.length ? done / pointWithWhyRankListList.length : 1
    onDone({ valid: percentDone >= 1, value: percentDone, delta: delta ?? value })
  }
  return (
    <div className={classes.container}>
      <StepIntro {...stepIntro} />
      {isLoading ? (
        <p className={classes.headlineTitle} aria-live="polite">Loading explanations...</p>
      ) : loadError ? (
        <p className={classes.headlineTitle} role="alert">Explanations could not be loaded.</p>
      ) : !pointWithWhyRankListList?.length ? (
        <p className={classes.headlineTitle}>Nothing to do here, hit Next to continue</p>
      ) : (
        <>
          <div
            key={currentPointWithWhyRankList.point._id}
            className={cx(classes.headlinePoint, navigationDirection > 0 ? classes.slideInFromRight : classes.slideInFromLeft)}
          >
            <H className={classes.headlineTitle}>Please choose the {category === 'least' ? 'least' : 'most'} convincing explanation for...</H>
            <Level>
              <PairCompare
                round={round}
                discussionId={discussionId}
                className={classes.pairCompare}
                progressHeading={<H className={classes.headlineSubject}>{currentPointWithWhyRankList.point.subject}</H>}
                whyRankList={currentPointWithWhyRankList.whyRankList}
                onDone={value => handlePairCompare(value, currentPointWithWhyRankList.point._id)}
              />
            </Level>
          </div>
          <nav className={classes.navigation} aria-label="Compare reasons navigation">
            <button
              type="button"
              className={classes.navigationButton}
              onClick={() => navigateToPoint(-1)}
              disabled={currentPointIndex === 0}
              title="Previous reason"
              aria-label="Previous reason"
            >
              <ChevronDown className={classes.previousIcon} />
            </button>
            <span className={classes.counter} aria-live="polite">{currentPointIndex + 1} / {pointWithWhyRankListList.length}</span>
            <button
              type="button"
              className={classes.navigationButton}
              onClick={() => navigateToPoint(1)}
              disabled={currentPointIndex === pointWithWhyRankListList.length - 1}
              title="Next reason"
              aria-label="Next reason"
            >
              <ChevronDown className={classes.nextIcon} />
            </button>
          </nav>
        </>
      )}
    </div>
  )
}

function isWhyListComplete(whyRankList = []) {
  return whyRankList.length === 0 || whyRankList.every(({ rank }) => !!rank?.category)
}

const useStyles = createUseStyles(theme => ({
  container: {
    fontFamily: theme.font.fontFamily,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  navigationButton: {
    width: '2.75rem',
    height: '2.75rem',
    padding: '0.5rem',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.primaryButtonBlue,
    backgroundColor: theme.colors.white,
    border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'transform 160ms ease',
    '&:hover:not(:disabled)': {
      transform: 'translateY(-0.08rem)',
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0.04rem)',
    },
    '&:focus-visible': {
      outline: `${theme.focusOutline}`,
    },
    '&:disabled': {
      color: theme.colors.disableGray,
      borderColor: theme.colors.disableSecBorderGray,
      cursor: 'not-allowed',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover, &:active': {
        transform: 'none',
      },
    },
  },
  previousIcon: {
    transform: 'rotate(90deg)',
  },
  nextIcon: {
    transform: 'rotate(-90deg)',
  },
  counter: {
    minWidth: '3rem',
    textAlign: 'center',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  headlinePoint: {
    width: '100%',
    willChange: 'transform, opacity',
  },
  slideInFromRight: {
    animation: '$compareReasonsSlideInFromRight 320ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  slideInFromLeft: {
    animation: '$compareReasonsSlideInFromLeft 320ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  '@keyframes compareReasonsSlideInFromRight': {
    from: { opacity: 0, transform: 'translateX(1.5rem)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes compareReasonsSlideInFromLeft': {
    from: { opacity: 0, transform: 'translateX(-1.5rem)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  headlineTitle: {
    fontWeight: '600',
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  headlineSubject: {
    minWidth: 0,
    margin: 0,
    color: theme.colors.encivGray,
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.3,
    overflowWrap: 'anywhere',
  },
  pairCompare: {
    marginTop: '1rem',
  },
}))

// pointWithWhyRankByWhyIdByPointId={id: {point, whyRankByWhyId: {id: {why, rank}}}}

export function derivePointWithWhyRankListListByCategory(data, category) {
  // pointWithWhyRankListList shouldn't default to [], it should be undefined until data is fetched from the server. But then, [] is ok
  const local = useRef({ pointWithWhyRankListList: undefined, pointWithWhyRankByWhyIdByPointId: {} }).current
  const { reducedPointList, preRankByParentId = {}, randomWhyById, whyRankByParentId, myWhyByCategoryByParentId = {} } = data
  const myWhyByParentId = myWhyByCategoryByParentId[category] || {}
  const { pointWithWhyRankListList, pointWithWhyRankByWhyIdByPointId } = local
  let updatedPoints = {}
  if (local.reducedPointList !== reducedPointList) {
    for (const pointGroup of reducedPointList) {
      if (preRankByParentId[pointGroup.point._id]?.category !== category) continue
      if (!pointWithWhyRankByWhyIdByPointId[pointGroup.point._id]?.point !== pointGroup.point) {
        if (!pointWithWhyRankByWhyIdByPointId[pointGroup.point._id]) pointWithWhyRankByWhyIdByPointId[pointGroup.point._id] = { whyRankByWhyId: {} }
        pointWithWhyRankByWhyIdByPointId[pointGroup.point._id].point = pointGroup.point
        updatedPoints[pointGroup.point._id] = true
      }
    }
    local.reducedPointList = reducedPointList
  }
  function addWhysToPointWithWhyRankByWhyIdByPointId(whys) {
    for (const why of Object.values(whys)) {
      if (why.category !== category) continue
      if (!pointWithWhyRankByWhyIdByPointId[why.parentId]) continue // a why's parent not here
      if (pointWithWhyRankByWhyIdByPointId[why.parentId]?.whyRankByWhyId[why._id]?.why !== why) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id] = {
          why,
          rank: whyRankByParentId?.[why._id],
        }
        updatedPoints[why.parentId] = true
      } else if (pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank !== whyRankByParentId?.[why._id]) {
        pointWithWhyRankByWhyIdByPointId[why.parentId].whyRankByWhyId[why._id].rank = whyRankByParentId[why._id]
        updatedPoints[why.parentId] = true
      }
    }
  }
  const whys = []
  if (local.whyRankByParentId !== whyRankByParentId) {
    // if rank changes we have to go through them all
    whys.push(...Object.values(myWhyByParentId ?? {}).filter(why => why.category === category))
    whys.push(...Object.values(randomWhyById ?? {}).filter(why => why.category === category))
    local.whyRankByParentId = whyRankByParentId
    local.randomWhyById = randomWhyById
    local.myWhyByParentId = myWhyByParentId
  } else {
    // get myWhys too
    if (local.myWhyByParentId !== myWhyByParentId) {
      whys.push(...Object.values(myWhyByParentId ?? {}).filter(why => why.category === category))
      local.myWhyByParentId = myWhyByParentId
    }
    if (local.randomWhyById !== randomWhyById) {
      whys.push(...Object.values(randomWhyById ?? {}).filter(why => why.category === category))
      local.randomWhyById = randomWhyById
    }
  }
  if (whys.length) addWhysToPointWithWhyRankByWhyIdByPointId(whys)
  const newPointWithWhyRankListList = []
  let updated = false
  for (const pointWithWhyRankList of pointWithWhyRankListList ?? []) {
    const pointId = pointWithWhyRankList.point._id
    if (updatedPoints[pointId]) {
      newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRankList: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
      updated = true
    } else newPointWithWhyRankListList.push(pointWithWhyRankList)
    delete updatedPoints[pointId]
  }
  for (const pointId of Object.keys(updatedPoints)) {
    newPointWithWhyRankListList.push({ point: pointWithWhyRankByWhyIdByPointId[pointId].point, whyRankList: Object.values(pointWithWhyRankByWhyIdByPointId[pointId].whyRankByWhyId) })
    updated = true
  }
  if (updated) local.pointWithWhyRankListList = newPointWithWhyRankListList
  return { pointWithWhyRankListList: local.pointWithWhyRankListList }
}
