//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useEffect, useRef, useState } from 'react'
import { useDeliberationContext, useLocalStorageIfAvailable } from '../deliberation-context'
import useFetchDemInfo from '../hooks/use-fetch-dem-info'
import WhyInput from '../why-input'
import { H, Level } from 'react-accessible-headings'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { isEqual } from 'lodash'
import StepIntro from '../step-intro'
import { ChevronDown } from '../../svgr'

export default function WhyStep(props) {
  const { data, upsert } = useDeliberationContext()
  const { category, onDone, ...otherProps } = props
  const storageAvailable = useLocalStorageIfAvailable()
  const fetchDemInfo = useFetchDemInfo()

  useEffect(() => {
    if (!data?.myWhyByCategoryByParentId && data?.reducedPointList?.length > 0) {
      const ids = data.reducedPointList.map(pG => pG.point._id)
      window.socket.emit('get-user-whys', ids, results => {
        // Group whys by category, then by parentId
        const myWhyByCategoryByParentId = {}
        for (const point of results) {
          if (!myWhyByCategoryByParentId[point.category]) myWhyByCategoryByParentId[point.category] = {}
          myWhyByCategoryByParentId[point.category][point.parentId] = point
        }
        upsert({ myWhyByCategoryByParentId })

        // Fetch dem-info for whys
        fetchDemInfo(results.map(w => w._id))
      })
    }
  }, [])

  function handleOnDone({ valid, value, delta }) {
    if (delta) {
      // Upsert only the changed value for the correct category
      const category = delta.category || props.category
      const newData = upsert({
        myWhyByCategoryByParentId: {
          [category]: {
            [delta.parentId]: delta,
          },
        },
      })
      if (newData === data) return // if no change, don't send up
      if (!storageAvailable) {
        window.socket.emit('upsert-why', delta, updatedDoc => {
          if (updatedDoc) {
            if (!isEqual(updatedDoc, delta)) {
              upsert({
                myWhyByCategoryByParentId: {
                  [category]: {
                    [delta.parentId]: updatedDoc,
                  },
                },
              })
            }
          } else {
            console.error('Failed to upsert why')
          }
        })
      }
    }
    onDone({ valid, value })
  }

  const args = derivePointWhyListByCategory(data, category)

  if (!data || !data.reducedPointList) return null

  return <Why {...args} {...otherProps} category={category} onDone={handleOnDone} />
}

export function Why(props) {
  const {
    className = '',
    pointWhyList,
    category = '', // "most" or "least"
    onDone = () => {},
    stepIntro,
    maxWordCount,
    maxCharCount,
  } = props

  const classes = useStylesFromThemeFunction()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [navigationDirection, setNavigationDirection] = useState(1)
  const reportedCompletionSignature = useRef(null)

  const [completedByPointId] = useState(() => {
    return (pointWhyList || []).reduce((completedByPointId, { point, why }) => {
      completedByPointId[point._id] = { completed: isWhyComplete(why), why }
      return completedByPointId
    }, {})
  })

  // not useEffect because we need to do this when the pointWhyList changes and before the children are rendered and possibly make onDone calls
  // Bidirectional data pattern (Variant B — render-time mutation): completedByPointId
  // is mutated directly during render to avoid an extra re-render cycle. See docs/bidirectional-data-pattern.md.
  const [prev] = useState({ pointWhyList })
  if (prev.pointWhyList !== pointWhyList) {
    prev.pointWhyList = pointWhyList
    const oldIds = new Set(Object.keys(completedByPointId).map(id => id + '')) // convert to string because some tests (incorrectly) pass a number but when used as a key to an object it's a string. But set doesn't convert numbers to strings
    for (const { point, why } of pointWhyList || []) {
      if (!completedByPointId[point._id] || completedByPointId[point._id].why !== why) {
        const completed = (completedByPointId[point._id]?.completed && isEqual(completedByPointId[point._id].why, why)) || isWhyComplete(why)
        completedByPointId[point._id] = { completed, why }
      }
      oldIds.delete(point._id)
    }
    // if the point is no longer in pointWyList, delete it
    for (const oldId of oldIds) delete completedByPointId[oldId]
  }

  const handleOnDone = ({ valid, value }) => {
    let delta = value
    if (value) {
      if (!value.category) value.category = category
      // if the object coming up is the same as the one we have, and it's valid and completed, don't send up to be upserted
      if (completedByPointId[value.parentId].why === value) {
        if (completedByPointId[value.parentId].completed && valid) return // do not send up redundant data
        else delta = undefined
      }
      completedByPointId[value.parentId] = { completed: valid, why: value }
    }
    const values = Object.values(completedByPointId)
    const numValid = values.reduce((numValid, { completed }) => (completed ? numValid + 1 : numValid), 0)
    const total = values.length
    setTimeout(() => {
      onDone({
        valid: numValid === total,
        value: numValid / total,
        delta,
      })
    }, 0)
  }

  useEffect(() => {
    // if there nothing to do, skip this step
    if (!pointWhyList) {
      onDone({ valid: true, value: 'skip' })
      return
    }
    const completionSignature = pointWhyList.map(({ point }) => `${point._id}:${completedByPointId[point._id]?.completed}`).join('|')
    if (reportedCompletionSignature.current === completionSignature) return
    reportedCompletionSignature.current = completionSignature
    setCurrentIndex(index => Math.min(index, Math.max(pointWhyList.length - 1, 0)))
    const values = Object.values(completedByPointId)
    const numValid = values.filter(({ completed }) => completed).length
    const total = values.length
    onDone({ valid: numValid === total, value: total ? numValid / total : 1 })
  }, [pointWhyList])

  if (!pointWhyList?.length) {
    return <p className={cx(classes.wrapper, className)}>Nothing to do here. Hit Next to continue.</p>
  }
  const currentPointIndex = Math.min(currentIndex, pointWhyList.length - 1)
  const navigateToPoint = direction => {
    setNavigationDirection(direction)
    setCurrentIndex(index => Math.max(0, Math.min(pointWhyList.length - 1, index + direction)))
  }

  return (
    <div className={cx(classes.wrapper, className)}>
      <StepIntro {...stepIntro} />
      <Level>
        <div className={classes.pointsContainer}>
          <div
            key={pointWhyList[currentPointIndex].point._id}
            className={cx(classes.carouselItem, navigationDirection > 0 ? classes.slideInFromRight : classes.slideInFromLeft)}
          >
            <WhyInput
              point={pointWhyList[currentPointIndex].point}
              value={pointWhyList[currentPointIndex].why}
              onDone={handleOnDone}
              maxWordCount={maxWordCount}
              maxCharCount={maxCharCount}
            />
          </div>
        </div>
      </Level>
      <nav className={classes.navigation} aria-label={`Why ${category} navigation`}>
        <button type="button" className={classes.navigationButton} onClick={() => navigateToPoint(-1)} disabled={currentIndex === 0} title="Previous reason" aria-label="Previous reason">
          <ChevronDown className={classes.previousIcon} />
        </button>
        <span className={classes.counter} aria-live="polite">{currentPointIndex + 1} / {pointWhyList.length}</span>
        <button type="button" className={classes.navigationButton} onClick={() => navigateToPoint(1)} disabled={currentIndex === pointWhyList.length - 1} title="Next reason" aria-label="Next reason">
          <ChevronDown className={classes.nextIcon} />
        </button>
      </nav>
    </div>
  )
}

function isWhyComplete(why) {
  return !!(why?.subject?.trim() && why?.description?.trim())
}

export function derivePointWhyListByCategory(data, category) {
  const local = useRef({
    pointWhyById: {},
    reducedPointList: undefined,
    myWhyByParentId: undefined,
    pointWhyList: undefined,
  }).current

  const { reducedPointList = [], myWhyByCategoryByParentId = {}, preRankByParentId = {} } = data || {}
  const myWhyByParentId = myWhyByCategoryByParentId[category] || {}

  let updated = false

  if (local.reducedPointList !== reducedPointList || local.preRankByParentId !== preRankByParentId) {
    const pointsInCategory = reducedPointList.filter(item => {
      const pId = item.point?._id
      return pId && preRankByParentId[pId]?.category === category
    })

    const oldIds = new Set(Object.keys(local.pointWhyById).map(id => id + '')) // convert to string because some tests (incorrectly) pass a number but when used as a key to an object it's a string. But set doesn't convert numbers to strings

    for (const item of pointsInCategory) {
      const pId = item.point._id
      if (!local.pointWhyById[pId]) {
        local.pointWhyById[pId] = { point: item.point, why: myWhyByParentId[pId] }
        updated = true
      } else {
        if (local.pointWhyById[pId].point !== item.point) {
          local.pointWhyById[pId] = { ...local.pointWhyById[pId], point: item.point }
          updated = true
        }
      }
      oldIds.delete(pId)
    }

    for (const oldId of oldIds) {
      delete local.pointWhyById[oldId]
      updated = true
    }

    local.reducedPointList = reducedPointList
    local.preRankByParentId = preRankByParentId
  }

  if (local.myWhyByParentId !== myWhyByParentId) {
    for (const pId of Object.keys(local.pointWhyById)) {
      const oldWhy = local.pointWhyById[pId].why
      const newWhy = myWhyByParentId[pId]

      if (oldWhy !== newWhy) {
        local.pointWhyById[pId] = { ...local.pointWhyById[pId], why: newWhy }
        updated = true
      }
    }

    local.myWhyByParentId = myWhyByParentId
  }

  if (updated) {
    local.pointWhyList = Object.values(local.pointWhyById)
  }

  return { pointWhyList: local.pointWhyList }
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
  },
  introContainer: {
    textAlign: 'left',
    padding: '0 1.875rem',
  },
  introTitle: {
    fontSize: '2.25rem',
    paddingBottom: '2rem',
  },
  introText: {
    fontSize: '1.25rem',
  },
  pointsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    width: '100%',
    fontSize: '1.25rem',
    overflow: 'hidden',
  },
  carouselItem: {
    width: '100%',
    minWidth: 0,
    willChange: 'transform, opacity',
  },
  slideInFromRight: {
    animation: '$whyCarouselSlideInFromRight 320ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  slideInFromLeft: {
    animation: '$whyCarouselSlideInFromLeft 320ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  '@keyframes whyCarouselSlideInFromRight': {
    from: { opacity: 0, transform: 'translateX(1.5rem)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes whyCarouselSlideInFromLeft': {
    from: { opacity: 0, transform: 'translateX(-1.5rem)' },
    to: { opacity: 1, transform: 'translateX(0)' },
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
    '&:focus-visible': {
      outline: theme.focusOutline,
    },
    '&:disabled': {
      color: theme.colors.disableGray,
      borderColor: theme.colors.disableSecBorderGray,
      cursor: 'not-allowed',
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
}))
