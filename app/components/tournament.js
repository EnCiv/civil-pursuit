// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import StepBar from './step-bar'
import RoundTracker from './round-tracker'
import StepSlider from './step-slider'
import GroupingStep from './grouping-step'
import RankStep from './rank-step'
import ReviewPointList from './review-point-list'
import WhyStep from './why-step'
import CompareReasons from './compare-reasons'

const WebComponents = {
  StepBar: StepBar,
  RoundTracker: RoundTracker,
  StepSlider: StepSlider,
  Answer: undefined, // TODO: Import answer step component here.
  GroupingStep: GroupingStep,
  RankStep: RankStep,
  ReviewPointList: ReviewPointList,
  WhyStep: WhyStep,
  CompareReasons: CompareReasons,
  Intermission: undefined, // TODO: Import Intermission component here.
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
  const { className, steps = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  function reducer(state, action) {
    switch (action.type) {
      case 'incrementRound':
        // Rebuild steps when going to next round
        const newRound = state.currentRound + 1

        return {
          currentRound: newRound,
          stepComponents: buildChildren(steps, newRound),
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, { currentRound: 1, stepComponents: buildChildren(steps, 1) })

  const stepInfo = steps.map(step => {
    return {
      name: step.stepName,
      title: step.stepIntro.description,
    }
  })

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <RoundTracker />
      <StepSlider
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
  wrapper: {
    width: '100%',
  },
}))

export default Tournament
