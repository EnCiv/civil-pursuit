// https://github.com/EnCiv/civil-pursuit/issues/151

import React from 'react'
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
  // TODO: Import answer step component here.,
  GroupingStep: GroupingStep,
  RankStep: RankStep,
  ReviewPointList: ReviewPointList,
  WhyStep: WhyStep,
  CompareReasons: CompareReasons,
  // TODO: Import Intermission component here.
}

export default function Tournament(props) {
  const { className, steps = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <RoundTracker />
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
    padding: '1rem',
  },
}))
