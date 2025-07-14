// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useState, useEffect, useContext } from 'react'
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

function Tournament(props) {
  const { className, steps = [], discussionId, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { round, uInfo = {}, finalRound } = data
  const [state] = useState({ stepComponentsByRound: [] })
  const filteredSteps = steps.filter(step => !(step.stepName === 'Answer' && round > 0)) // don't show Answer step after the first round
  if (typeof data.round === 'number' && !state.stepComponentsByRound[round]) {
    state.stepComponentsByRound[round] = buildChildren(filteredSteps, round)
  }
  const stepInfo = filteredSteps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
    }
  })
  const roundsStatus = Object.values(uInfo).map((roundInfo, i, uInfos) => {
    if (roundInfo.shownStatementIds && Object.values(roundInfo.shownStatementIds).some(shown => shown.rank > 0)) {
      if (i + 1 < uInfos.length && uInfos[i + 1].shownStatementIds) return 'complete'
      else return 'inProgress'
    }
    if (roundInfo.shownStatementIds) return 'inProgress'
    return 'pending'
  })
  while (roundsStatus.length <= finalRound) roundsStatus.push('pending')

  return (
    <div className={cx(classes.tournament, className)}>
      <RoundTracker className={classes.roundTracker} roundsStatus={roundsStatus} />
      {state.stepComponentsByRound[round] && (
        <StepSlider
          key={round}
          steps={stepInfo}
          children={state.stepComponentsByRound[round]}
          onDone={valid => {
            if (valid) upsert({ round: data.round + 1 })
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
