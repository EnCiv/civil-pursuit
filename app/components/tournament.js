// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import StepBar from './step-bar'
import RoundTracker from './round-tracker'
import StepSlider from './step-slider'
import AnswerStep from './steps/answer'
import GroupingStep from './steps/grouping'
import RankStep, { isRankDataComplete } from './steps/rank'
import ReviewPointList from './steps/rerank'
import WhyStep from './steps/why'
import CompareReasons from './steps/compare-whys'
import Intermission from './intermission'
import Jsform from './jsform'
import { useDeliberationContext } from './deliberation-context'
import Conclusion from './steps/conclusion'

const WebComponents = {
  StepBar: StepBar,
  RoundTracker: RoundTracker,
  StepSlider: StepSlider,
  Answer: AnswerStep,
  GroupingStep: GroupingStep,
  RankStep: RankStep,
  ReviewPointList: ReviewPointList,
  WhyStep: WhyStep,
  CompareReasons: CompareReasons,
  Intermission: Intermission,
  Conclusion: Conclusion,
  Jsform: Jsform,
}

/**
 * Filter steps based on stepVisibility configuration
 *
 * Each step can have a `stepVisibility` object with the following properties:
 * - `always` - Boolean, if `true` the step is always shown (overrides all other filters)
 * - `rounds` - Array of round numbers where step appears (e.g., `[0]` for round 0 only)
 * - `minParticipants` - Boolean, if `true` requires minimum participants (2 * group_size)
 * - `hideWhenAllComplete` - Boolean, if `true` hide when all rounds are complete
 *
 * If `stepVisibility` is omitted, falls back to legacy hardcoded rules for backward compatibility.
 * The legacy filter logic will be removed in a future version. Please add stepVisibility to all steps.
 *
 * - `step` {object} - The step object from iota configuration
 * - `context` {object} - Object containing `{ round, participants, finalRound, roundsStatus, groupSize, participantThreshold }`
 *
 * Returns `true` if step should be shown, `false` otherwise
 */
function stepFilter(step, context) {
  const { round, participants, finalRound, roundsStatus, groupSize, participantThreshold } = context
  const vis = step.stepVisibility

  // If no stepVisibility, use legacy filter logic for backward compatibility
  // @deprecated This fallback will be removed in a future version
  if (!vis) {
    const threshold = participantThreshold !== undefined ? participantThreshold : 2 * (groupSize || 10)

    // Not enough participants: show only Answer and Intermission
    if (participants < threshold) {
      return step.stepName === 'Answer' || step.stepName === 'Intermission'
    }

    // All rounds complete: show only Intermission
    if (round >= finalRound && roundsStatus[round] === 'complete') {
      return step.stepName === 'Intermission'
    }

    // During active rounds: hide Answer after round 0, check allowedRounds
    if (step.stepName === 'Answer' && round > 0) return false
    if (step.allowedRounds && !step.allowedRounds.includes(round)) return false

    return true
  }

  // New declarative stepVisibility logic
  // Explicit always = always show (overrides other filters)
  if (vis.always === true) return true

  // Round filter
  if (vis.rounds && !vis.rounds.includes(round)) return false

  // Minimum participants (use participantThreshold if configured, else 2 * group_size for deliberation)
  if (vis.minParticipants === true) {
    const threshold = participantThreshold !== undefined ? participantThreshold : 2 * (groupSize || 5)
    if (participants < threshold) return false
  }

  // Hide when all complete
  if (vis.hideWhenAllComplete) {
    const allComplete = round >= finalRound && roundsStatus[round] === 'complete'
    if (allComplete) return false
  }

  return true
}

export function getLoadedStepComplete(step, data, round) {
  if (data.uInfo?.[round]?.finished) return true

  const reducedPointList = data.reducedPointList || []
  const preRankByParentId = data.preRankByParentId || {}
  const hasText = value => typeof value === 'string' && value.trim().length > 0

  switch (step.webComponent) {
    case 'Answer': {
      const userId = data.user?.id
      if (!userId) return false
      const answer = Object.values(data.pointById || {}).find(point => point.userId === userId)
      const why = data.myWhyByCategoryByParentId?.most?.[answer?._id]
      return hasText(answer?.subject) && hasText(answer?.description) && hasText(why?.subject) && hasText(why?.description)
    }
    case 'GroupingStep':
      return data.groupIdsLists !== undefined || data.uInfo?.[round]?.groupings !== undefined
    case 'RankStep':
      return reducedPointList.length > 0 && data.preRankByParentId ? isRankDataComplete(reducedPointList, preRankByParentId) : undefined
    case 'WhyStep': {
      if (!data.preRankByParentId) return undefined
      const selectedPoints = reducedPointList.filter(({ point }) => preRankByParentId[point._id]?.category === step.category)
      const whysByParentId = data.myWhyByCategoryByParentId?.[step.category] || {}
      return selectedPoints.every(({ point }) => hasText(whysByParentId[point._id]?.subject) && hasText(whysByParentId[point._id]?.description))
    }
    case 'CompareReasons': {
      if (!data.preRankByParentId) return undefined
      const selectedParentIds = new Set(reducedPointList.filter(({ point }) => preRankByParentId[point._id]?.category === step.category).map(({ point }) => String(point._id)))
      if (!selectedParentIds.size) return true
      const randomWhyParentIds = new Set(Object.values(data.randomWhyById || {}).filter(why => why.category === step.category).map(why => String(why.parentId)))
      const loadedWhyParentIds = data.whyDataLoadedByParentIdByRound?.[round] || {}
      if ([...selectedParentIds].some(parentId => !randomWhyParentIds.has(parentId) && !loadedWhyParentIds[parentId])) return undefined
      const whyById = new Map()
      for (const categoryWhys of Object.values(data.myWhyByCategoryByParentId || {})) {
        for (const why of Object.values(categoryWhys || {})) whyById.set(String(why._id), why)
      }
      for (const why of Object.values(data.randomWhyById || {})) whyById.set(String(why._id), why)
      const whyRankByParentId = data.whyRankByParentId || {}
      const hasUnknownRank = Object.values(whyRankByParentId).some(rank => rank.stage === 'why' && !whyById.has(String(rank.parentId)))
      if (hasUnknownRank) return undefined
      return [...whyById.values()]
        .filter(why => why.category === step.category && selectedParentIds.has(String(why.parentId)))
        .every(why => !!whyRankByParentId[why._id]?.category)
    }
    case 'ReviewPointList':
      return reducedPointList.length > 0 && data.postRankByParentId ? reducedPointList.every(({ point }) => !!data.postRankByParentId[point._id]?.category) : undefined
    case 'Jsform': {
      const formData = data.jsformData?.[step.name]
      if (!formData) return undefined
      return (step.schema?.required || []).every(key => {
        const property = step.schema?.properties?.[key]
        if (!property) return false
        if (property.type === 'object' && property.properties) return Object.keys(property.properties).every(propertyKey => !!formData[key]?.[propertyKey])
        return !!formData[key]
      })
    }
    default:
      return undefined
  }
}

function buildChildren(steps, round) {
  return steps.map((step, index) => {
    const { webComponent, ...props } = step
    const LookupResult = WebComponents[webComponent]
    if (LookupResult) {
      // Pass all props from step obj except WebComponent, plus round
      return <LookupResult key={props.stepName || props.name || step.webComponent || index} {...props} round={round} />
    } else {
      console.error(`Couldn't render step - component '${webComponent}' was not found in WebComponents.`)
      return <div key={props.stepName || props.name || webComponent || index}>Couldn't render step - component '{webComponent}' was not found in WebComponents.</div>
    }
  })
}

function calculateRoundAndStatus(uInfo, finalRound) {
  let round = 0
  let roundFound = false
  const roundsStatus = Object.values(uInfo || []).map((roundInfo, i) => {
    if (roundFound) return 'pending' // if we already found an in-progress round, all subsequent rounds are complete
    const shownStatements = Object.values(roundInfo.shownStatementIds || {})
    if (roundInfo.finished) {
      round = Math.min(i + 1, finalRound || 0)
      return 'complete'
    } else if (shownStatements.length) {
      round = i
      roundFound = true
      return 'inProgress'
    } else {
      round = i
      roundFound = true
      return 'inProgress' // if this is the first round and no statements are shown, it's still in progress
    }
  })
  while (roundsStatus.length <= (finalRound || 0)) {
    if (roundFound) roundsStatus.push('pending')
    else {
      roundsStatus.push('inProgress')
      roundFound = true
    }
  }
  return { round: uInfo ? round : undefined, roundsStatus } // round should be undefined until uInfo is available
}

function reducer(state, action) {
  switch (action.type) {
    case 'init': {
      const { round, roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data?.dturn?.finalRound)
      // only set round the first time it's valid
      if (round !== undefined && state.round === undefined) {
        setTimeout(() => action.upsert({ round })) // don't update context while rendering this component
        return { ...state, round, roundsStatus }
      } else return { ...state, roundsStatus }
    }
    case 'increment': {
      const nextRound = Math.min(state.round + 1, action.data?.dturn?.finalRound)
      // recalc roundsStatus based on new round
      const { roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data?.dturn?.finalRound)
      const clearContextForNextRound = Object.keys(action.data).reduce((contextData, key) => ((contextData[key] = undefined), contextData), {})
      ;['discussionId', 'user', 'userId', 'participants', 'dturn', 'uInfo', 'lastRound'].forEach(key => delete clearContextForNextRound[key])
      clearContextForNextRound.round = nextRound // set the next round to clear context for
      setTimeout(() => {
        action.upsert(clearContextForNextRound)
      }) // can't update context while rendering this component
      return { ...state, round: nextRound, roundsStatus, stepComponents: undefined }
    }
    case 'updateRounds': {
      // recalc roundsStatus after uInfo change
      const { roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data?.dturn?.finalRound)
      return { ...state, roundsStatus }
    }
    default:
      return state
  }
}

function Tournament(props) {
  const { className, steps = [], onDone, testSteps, defaultValue, preserveLocalStorage, ...otherProps } = props
  const returnFromLinkedIn = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('n') === '1'
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useDeliberationContext()
  const { uInfo, dturn } = data
  const { finalRound = 0 } = dturn || {}
  const [prev] = useState({ uInfoSet: !!data.uInfo })
  const [state, dispatch] = useReducer(reducer, { ...calculateRoundAndStatus(uInfo, finalRound), stepComponents: undefined })
  const { round = 0, roundsStatus } = state

  useEffect(() => {
    if (prev.uInfoSet) {
      dispatch({ type: 'updateRounds', data })
      return
    } else if (uInfo) {
      // only update the first time uInfo is set
      prev.uInfoSet = true
      dispatch({ type: 'init', data, upsert })
    } // if uInfo not set yet, don't do anything
  }, [uInfo, finalRound])

  const stepContext = {
    round,
    participants: data.participants || 0,
    finalRound,
    roundsStatus,
    groupSize: dturn?.group_size,
    participantThreshold: dturn?.participantThreshold,
  }
  const filteredSteps = steps.filter(step => stepFilter(step, stepContext))
  const stepInfo = filteredSteps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
      complete: getLoadedStepComplete(step, data, round),
    }
  })
  if (state.round !== undefined && !state.stepComponents) {
    // if state.round is undefined, round will be 0 but don't build children yet
    state.stepComponents = buildChildren(filteredSteps, round)
  }
  return (
    <div className={cx(classes.tournament, className)}>
      <RoundTracker className={classes.roundTracker} roundsStatus={roundsStatus} />
      {state.stepComponents && (
        <StepSlider
          key={round}
          steps={stepInfo}
          round={round}
          className={classes.stepClass}
          children={state.stepComponents}
          defaultStepName={returnFromLinkedIn ? 'Intermission' : undefined}
          onDone={({ valid, value }) => {
            if (valid && round + 1 > finalRound) onDone({ valid, value: 'done' })
            else if (valid) dispatch({ type: 'increment', data, upsert })
          }}
          {...otherProps}
        />
      )}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  tournament: {
    width: '100%',
  },
  roundTracker: {
    position: 'relative',
    zIndex: 10,
    marginTop: '-3.875rem',
    marginBottom: '3.6875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      marginTop: '-1.625rem',
    },
  },
  stepClass: {
    marginRight: '1rem', // or there's a problem with the AnswerStep when viewport is between 40 and 78 rems wide
  },
}))

export default Tournament
