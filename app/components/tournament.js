// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useState, useEffect, useContext, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import StepBar from './step-bar'
import RoundTracker from './round-tracker'
import StepSlider from './step-slider'
import AnswerStep from './steps/answer'
import GroupingStep from './steps/grouping'
import RankStep from './steps/rank'
import ReviewPointList from './steps/rerank'
import WhyStep from './steps/why'
import CompareReasons from './steps/compare-whys'
import Intermission from './intermission'
import DeliberationContext from './deliberation-context'

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
}

function buildChildren(steps, round) {
  // don't do the Answer step after the first round

  return steps.map(step => {
    const { webComponent, ...props } = step
    const LookupResult = WebComponents[webComponent]
    if (LookupResult) {
      // Pass all props from step obj except WebComponent
      return <LookupResult {...props} />
    } else {
      console.error(`Couldn't render step - component '${webComponent}' was not found in WebComponents.`)
      return <div>Couldn't render step - component '{webComponent}' was not found in WebComponents.</div>
    }
  })
}

function calculateRoundAndStatus(uInfo, finalRound) {
  let round = 0
  const roundsStatus = Object.values(uInfo || []).map((roundInfo, i) => {
    if (roundInfo.shownStatementIds && Object.values(roundInfo.shownStatementIds).some(shown => shown.rank > 0)) {
      round = Math.min(i + 1, finalRound)
      return 'complete'
    } else return 'inProgress'
  })
  if (round < finalRound) roundsStatus[round] = 'inProgress'
  else if (roundsStatus.at(-1) !== 'complete') roundsStatus[round] = 'inProgress'
  while (roundsStatus.length <= finalRound) roundsStatus.push('pending')
  return { round: uInfo ? round : undefined, roundsStatus } // round should be undefined until uInfo is available
}

function reducer(state, action) {
  switch (action.type) {
    case 'init': {
      const { round, roundsStatus } = calculateRoundAndStatus(action.uInfo, action.finalRound)
      // only set round the first time it's valid
      if (round !== undefined && state.round === undefined) return { ...state, round, roundsStatus }
      else return { ...state, roundsStatus }
    }
    case 'increment': {
      const nextRound = Math.min(state.round + 1, action.data.finalRound)
      // recalc roundsStatus based on new round
      const { roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data.finalRound)
      const clearContextForNextRound = Object.keys(action.data).reduce((contextData, key) => ((contextData[key] = undefined), contextData), {})
      ;['discussionId', 'user', 'userId', 'participants', 'finalRound', 'uInfo', 'lastRound'].forEach(key => delete clearContextForNextRound[key])
      setTimeout(() => action.upsert(clearContextForNextRound)) // can't update context while rendering this component
      return { ...state, round: nextRound, roundsStatus, stepComponents: undefined }
    }
    default:
      return state
  }
}

function Tournament(props) {
  const { className, steps = [], discussionId, onDone, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { uInfo, finalRound } = data

  const [state, dispatch] = useReducer(reducer, { ...calculateRoundAndStatus(uInfo, finalRound), stepComponents: undefined })

  useEffect(() => {
    dispatch({ type: 'init', uInfo, finalRound })
  }, [uInfo, finalRound])

  const filteredSteps = steps.filter(step => !(step.stepName === 'Answer' && state.round > 0)) // don't show Answer step after the first round
  const stepInfo = filteredSteps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
    }
  })
  if (state.round !== undefined && !state.stepComponents) {
    state.stepComponents = buildChildren(filteredSteps, state.round)
  }

  return (
    <div className={cx(classes.tournament, className)}>
      <RoundTracker className={classes.roundTracker} roundsStatus={state.roundsStatus} />
      {state.stepComponents && (
        <StepSlider
          key={state.round}
          steps={stepInfo}
          round={state.round}
          children={state.stepComponents}
          onDone={({ valid, value }) => {
            if (valid && state.round + 1 > finalRound) onDone({ valid, value: 'done' })
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
    marginBottom: '3.6875rem',
  },
}))

export default Tournament
