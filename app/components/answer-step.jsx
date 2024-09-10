// https://github.com/EnCiv/civil-pursuit/issues/102

// most of this code was taken from why-step.jsx
'use strict'
import React, { forwardRef, useState, useEffect, useRef } from 'react'
import StepIntro from './step-intro'
import WhyInput from './why-input'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import _ from 'lodash'
import ObjectId from 'bson-objectid'

const AnswerStep = forwardRef((props, ref) => {
  const {
    className = '',
    intro = '',
    question = {},
    whyQuestion = '',
    shared,
    onDone = () => {},
    ...otherProps
  } = props
  const classes = useStylesFromThemeFunction()

  if (!shared) return null // can't function if shared not present - if we initialize it - we start from empty on every rerender
  if (!shared.startingPoint)
    //if not present, initialize it
    shared.startingPoint = { _id: ObjectId().toString(), subject: '', description: '', parentId: question._id }
  if (!shared.whyMosts)
    //if not present, initialize it
    shared.whyMosts = []

  const { startingPoint, whyMosts } = shared

  // if there's a why for the starting point, get it. If there isn't make a blank one and put it in the shared whyMosts
  const whys = whyMosts.filter(p => p.parentId === startingPoint._id)
  if (whys.length === 0) {
    // this is not why, so make one
    whyMosts.push({
      subject: '',
      description: '',
      parentId: startingPoint._id,
      _id: ObjectId().toString(),
    })
    whys.push(whyMosts[0])
  }
  // there should not be more than one, if there is we are ignoring them
  const why = whys[0]

  // keep track of the previous values of these, but we will only call the set function if changed from above.
  // If changed from user input, just mutate the object
  const [pointByPart, setPointByPart] = useState({
    answer: startingPoint,
    why,
  })

  // keep track of valid for both parts, no need to rerender if they change so not useState
  const validByPart = useRef({ answer: false, why: false }).current

  function isValid() {
    return validByPart.answer && validByPart.why
  }

  function doOnDone() {
    onDone({ valid: isValid(), value: { startingPoint: pointByPart.answer, whyMost: pointByPart.why } })
  }

  const updateQuestionResponse = ({ valid, value }) => {
    setPointByPart(pointByPart => {
      pointByPart['answer'] = value
      validByPart['answer'] = valid
      return pointByPart
    })
    doOnDone()
  }

  const updateWhyResponse = ({ valid, value }) => {
    setPointByPart(pointByPart => {
      pointByPart['why'] = value
      validByPart['why'] = valid
      return pointByPart
    })
    doOnDone()
  }

  useEffect(() => {
    setPointByPart(pointByPart => {
      if (pointByPart.answer === startingPoint) return pointByPart // abort the setState
      return { ...pointByPart, answer: startingPoint }
    })
  }, [startingPoint])

  useEffect(() => {
    setPointByPart(pointByPart => {
      if (pointByPart.why === why) return pointByPart
      return { ...pointByPart, why }
    })
  }, [why])

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.answersContainer}>
        <div key="question">
          <WhyInput point={question} value={pointByPart.answer} onDone={updateQuestionResponse} />
        </div>
        <div key="why">
          <hr className={classes.pointsHr}></hr>
          <WhyInput
            point={{ description: '', subject: whyQuestion, _id: pointByPart.answer._id }} // whyInput assigns this _id to the parentId of the result
            value={pointByPart.why}
            onDone={updateWhyResponse}
          />
        </div>
      </div>
    </div>
  )
})

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
  },
  introContainer: {
    textAlign: 'left',
    padding: '0 1.875rem',
  },
  introTitle: {
    fontSize: '2.25rem',
    paddingBottom: '2rem',
  },
  introText: {
    display: 'block',
    fontSize: '1.25rem',
  },
  [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
    introContainer: {
      padding: '0',
    },
    introText: {
      maxWidth: '33rem',
    },
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

export default AnswerStep
