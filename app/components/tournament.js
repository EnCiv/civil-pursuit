// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useState, useEffect, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { cloneDeep } from 'lodash'

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
import socketApiSubscribe from '../socket-apis/socket-api-subscribe'
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
  const filteredSteps = steps.filter(step => !(step === 'Answer' && round > 0))
  return filteredSteps.map(step => {
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
  const { className, steps = [], discussionId, user, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useContext(DeliberationContext)
  const { round } = data
  const [state] = useState({ stepComponentsByRound: [] })
  if (typeof data.round === 'number' && !state.stepComponentsByRound[round]) {
    state.stepComponentsByRound[round] = buildChildren(steps, round)
  }

  function onSubscribeHandler(data) {
    if (data.uInfo) {
      let round = data.uInfo.length - 1
      /*let shown=Object.values(data.uInfo[round].shownStatementIds ?? {})
      if(shown.length > 1 && shown.some(sObj=>sObj.author) && shown.some(sObj=>sObj.rank>0 ))
        round++*/
      data.round = round
      if (data.uInfo[round].groupings?.length > 0) data.groupIdsLists = cloneDeep(data.uInfo[round].groupings)
    }
    upsert(data)
  }

  function onUpdateHandler(data) {
    upsert(data)
  }

  useEffect(() => {
    upsert({ discussionId })
    socketApiSubscribe('subscribe-deliberation', discussionId, onSubscribeHandler, onUpdateHandler)
  }, [])

  // steps are looking for userId in the context, if the user is not logged in to start, context needs to be updated
  useEffect(() => {
    upsert({ userId: user?.id })
  }, [user?.id])

  const stepInfo = steps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
    }
  })

  return (
    <div className={cx(classes.tournament, className)} {...otherProps}>
      <RoundTracker className={classes.roundTracker} roundsStatus={['complete', 'complete', 'inProgress', 'pending', 'pending']} />
      {state.stepComponentsByRound[round] && (
        <StepSlider
          key={round}
          steps={stepInfo}
          children={state.stepComponentsByRound[round]}
          onDone={valid => {
            if (valid) upsert({ round: data.round })
          }}
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
