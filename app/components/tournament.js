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
import Jsform from './jsform'
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
  Jsform: Jsform,
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
  let roundFound = false
  const roundsStatus = Object.values(uInfo || []).map((roundInfo, i) => {
    if (roundFound) return 'pending' // if we already found an in-progress round, all subsequent rounds are complete
    const shownStatements = Object.values(roundInfo.shownStatementIds || {})
    if (roundInfo.finished) {
      round = Math.min(i + 1, finalRound)
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
  while (roundsStatus.length <= finalRound) {
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
      const { round, roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data.finalRound)
      // only set round the first time it's valid
      if (round !== undefined && state.round === undefined) {
        setTimeout(() => action.upsert({ round })) // don't update context while rendering this component
        return { ...state, round, roundsStatus }
      } else return { ...state, roundsStatus }
    }
    case 'increment': {
      const nextRound = Math.min(state.round + 1, action.data.finalRound)
      // recalc roundsStatus based on new round
      const { roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data.finalRound)
      const clearContextForNextRound = Object.keys(action.data).reduce((contextData, key) => ((contextData[key] = undefined), contextData), {})
      ;['discussionId', 'user', 'userId', 'participants', 'finalRound', 'uInfo', 'lastRound'].forEach(key => delete clearContextForNextRound[key])
      clearContextForNextRound.round = nextRound // set the next round to clear context for
      setTimeout(() => action.upsert(clearContextForNextRound)) // can't update context while rendering this component
      return { ...state, round: nextRound, roundsStatus, stepComponents: undefined }
    }
    case 'updateRounds': {
      // recalc roundsStatus after uInfo change
      const { roundsStatus } = calculateRoundAndStatus(action.data.uInfo, action.data.finalRound)
      return { ...state, roundsStatus }
    }
    default:
      return state
  }
}

function Tournament(props) {
  const { className, steps = [], onDone, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { uInfo, finalRound } = data
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

  const filteredSteps =
    round < finalRound || (round === finalRound && roundsStatus[round] !== 'complete')
      ? steps.filter(step => !((step.stepName === 'Answer' && round > 0) || (step.allowedRounds && !step.allowedRounds.includes(round)))) // don't show Answer step after the first round
      : steps.filter(step => step.stepName === 'Intermission') // all rounds done, just go to intermission
  const stepInfo = filteredSteps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
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
    marginBottom: '3.6875rem',
  },
  stepClass: {
    marginRight: '1rem', // or there's a problem with the AnswerStep when viewport is between 40 and 78 rems wide
  },
}))

export default Tournament
