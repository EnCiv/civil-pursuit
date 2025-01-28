//https://github.com/EnCiv/civil-pursuit/issues/213

'use strict'
import React, { useState, useContext, useEffect, useRef } from 'react'
import cx from 'classnames'
import StepIntro from '../step-intro'
import WhyInput from '../why-input'
import { createUseStyles } from 'react-jss'
import { DeliberationContext } from '../deliberation-context'
import ObjectId from 'bson-objectid'
import { isEqual } from 'lodash'

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

  return <Answer {...derivedProps} onDone={handleOnDone} />
}

// Presentation component: only renders UI and handles local user interactions
export function Answer(props) {
  const { className = '', intro = '', question = {}, whyQuestion = '', onDone = () => {}, myAnswer, myWhy, ...otherProps } = props
  const classes = useStylesFromThemeFunction()
  const [validByType, setValidByType] = useState({ myAnswer: false, myWhy: false })
  // myAnswer could be undefined initally, if so it needs to be initialized with an _id, and if the user types in the WhyAnswer first, it's parentId needs to be the answers _id
  const [_myAnswer, setMyAnswer] = useState(myAnswer || { _id: ObjectId().toString(), subject: '', description: '', parentId: question._id })
  useEffect(() => {
    if (myAnswer && !isEqual(myAnswer, _myAnswer)) setMyAnswer(myAnswer)
  }, [myAnswer])

  // myWhy could be undefined initally if so it needs to be initialized with an _id and parentId
  const [_myWhy, setMyWhy] = useState(myWhy || { _id: ObjectId().toString(), subject: '', description: '', parentId: _myAnswer._id })
  useEffect(() => {
    if (myWhy && !isEqual(myWhy, _myWhy)) setMyWhy(myWhy)
  }, [myWhy])

  function percentDone() {
    return (validByType.myAnswer + validByType.myWhy) / 2
  }

  const updateResponse =
    type =>
    ({ valid, value }) => {
      const delta = { [type]: value }
      setValidByType(validByType => ((validByType[type] = valid), validByType))
      onDone({ valid: validByType.myAnswer && validByType.myWhy, value: percentDone(), delta })
    }
  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.answersContainer}>
        <div key="question">
          <WhyInput point={question} value={_myAnswer} onDone={updateResponse('myAnswer')} />
        </div>
        <div key="why">
          <hr className={classes.pointsHr} />
          <WhyInput point={{ description: '', subject: whyQuestion, _id: _myAnswer?._id }} value={_myWhy} onDone={updateResponse('myWhy')} />
        </div>
      </div>
    </div>
  )
}

// Logic for deriving props from data
export function deriver(data, localProps) {
  const local = useRef({ pointByPart: null }).current // Initialize pointByPart to null

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

  // If 'why' doesn't exist, create it but preserve its _id if it was previously created
  if (!why) {
    why = {
      _id: startingPoint._id || ObjectId().toString(), // Ensure _id remains the same if already exists
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
  if (_.isEqual(local.pointByPart, derivedPointByPart)) {
    return local.pointByPart
  }

  // Ensure pointByPart is set before returning
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
