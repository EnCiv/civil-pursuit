//https://github.com/EnCiv/civil-pursuit/issues/213

'use strict'
import React, { useContext, useEffect, useRef } from 'react'
import cx from 'classnames'
import StepIntro from '../step-intro'
import WhyInput from '../why-input'
import { createUseStyles } from 'react-jss'
import { DeliberationContext } from '../../context/deliberation-context'
import ObjectId from 'bson-objectid'

// Step wrapper component: handles fetching, state, and interaction with context
export default function AnswerStep(props) {
  const { data, upsert } = useContext(DeliberationContext)

  // Fetch initial data and update context
  useEffect(() => {
    window.socket.emit('fetch-answer-step', { questionId: props.question?._id }, results => upsert(results))
  }, [props.question, upsert])

  function handleOnDone({ valid, value, delta }) {
    if (delta) {
      upsert(delta) // Update context with delta changes
      window.socket.emit('update-answer-step', delta) // Push changes to server
    }
  }

  const derivedProps = deriver(data, props)
  if (!derivedProps) return null // Wait for data to load before rendering

  return <AnswerComponent {...derivedProps} onDone={handleOnDone} />
}

// Presentation component: only renders UI and handles local user interactions
export function AnswerComponent({ className = '', intro = '', question = {}, whyQuestion = '', pointByPart = {}, onDone = () => {}, ...otherProps }) {
  const classes = useStylesFromThemeFunction()

  const updateResponse =
    type =>
    ({ valid, value }) => {
      const delta = { [type]: value }
      onDone({ valid, value: { ...pointByPart, ...delta }, delta })
    }

  if (!pointByPart.answer || !pointByPart.why) return null // Render nothing if props are undefined

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.answersContainer}>
        <div key="question">
          <WhyInput point={question} value={pointByPart.answer} onDone={updateResponse('answer')} />
        </div>
        <div key="why">
          <hr className={classes.pointsHr} />
          <WhyInput point={{ description: '', subject: whyQuestion, _id: pointByPart.answer._id }} value={pointByPart.why} onDone={updateResponse('why')} />
        </div>
      </div>
    </div>
  )
}

// Logic for deriving props from data
export function deriver(data, localProps) {
  const local = useRef({}).current

  if (!data?.shared) return null

  const { shared } = data
  if (!shared.startingPoint) {
    shared.startingPoint = {
      _id: ObjectId().toString(),
      subject: '',
      description: '',
      parentId: localProps.question?._id,
    }
  }
  if (!shared.whyMosts) {
    shared.whyMosts = []
  }

  const startingPoint = shared.startingPoint
  let why = shared.whyMosts.find(p => p.parentId === startingPoint._id)

  if (!why) {
    why = {
      _id: ObjectId().toString(),
      subject: '',
      description: '',
      parentId: startingPoint._id,
    }
    shared.whyMosts.push(why)
  }

  const derivedPointByPart = {
    answer: startingPoint,
    why,
  }

  // Avoid re-rendering if no changes in references
  if (_.isEqual(local.pointByPart, derivedPointByPart)) return local.pointByPart
  local.pointByPart = derivedPointByPart
  return { ...localProps, pointByPart: derivedPointByPart }
}

// Styles
const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
  },
  answersContainer: {
    fontSize: '1.25rem',
    paddingTop: '4.325rem',
  },
  pointsHr: {
    color: theme.colors.secondaryDivider,
    margin: '4rem 0',
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    pointsHr: {
      margin: '2rem 1.875rem',
    },
  },
}))
