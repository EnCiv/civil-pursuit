// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useReducer, useEffect, useContext } from 'react'
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
  return steps.map(step => {
    const { webComponent, ...props } = step

    const LookupResult = WebComponents[webComponent]
    if (LookupResult) {
      // Pass all props from step obj except WebComponent
      return <LookupResult {...props} round={round} />
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

  function reducer(state, action) {
    switch (action.type) {
      case 'incrementRound':
        // Rebuild steps when going to next round
        const newRound = state.currentRound + 1

        return {
          ...state,
          currentRound: newRound,
          stepComponents: buildChildren(steps, newRound),
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, { currentRound: 1, stepComponents: buildChildren(steps, 1) })
  function onSubscribeHandler(data) {
    upsert(data)
  }
  function onUpdateHandler(data) {
    upsert(data)
  }

  useEffect(() => {
    upsert({ discussionId })
    socketApiSubscribe('subscribe-deliberation', discussionId, onUpdateHandler, onSubscribeHandler)
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
      <StepSlider
        key={state.currentRound}
        steps={stepInfo}
        children={state.stepComponents}
        onDone={valid => {
          if (valid) dispatch({ type: 'incrementRound' })
        }}
      />
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
