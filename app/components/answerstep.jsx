// https://github.com/EnCiv/civil-pursuit/issues/102

// most of this code was taken from why-step.jsx
'use strict'
import React, { forwardRef, useState, useEffect } from 'react'
import StepIntro from './step-intro'
import WhyInput from './why-input'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import ObjectId from 'bson-objectid'
import _ from 'lodash'

const AnswerStep = forwardRef((props, ref) => {
  const {
    className = '',
    intro = '',
    question = {},
    whyQuestion = '',
    shared = {
      startingPoint: {},
      whyMosts: [],
    },
    onDone = () => {},
    ...otherProps
  } = props
  const classes = useStylesFromThemeFunction()

  // user input to answer important issue
  const [startingPoint, setStartingPoint] = useState(shared.startingPoint)

  // user input to explain why issue is important
  const [whyMosts, setWhyMosts] = useState(shared.whyMosts)
  console.log(whyMosts)

  // const objectID = ObjectId().toString()

  useEffect(() => {
    if (!startingPoint.length || areAnswersComplete(whyMosts)) {
      onDone({ valid: true, value: { startingPoint: startingPoint, whyMosts: whyMosts } })
    } else {
      onDone({ valid: false, value: { startingPoint: startingPoint, whyMosts: whyMosts } })
    }
  }, [whyMosts])

  const updateQuestionResponse = ({ valid, value }) => {
    const updatedAnswers = {
      answerSubject: value.subject,
      answerDescription: value.description,
      _id: value._id,
    }
    setStartingPoint(updatedAnswers)
  }

  const updateWhyResponse = ({ valid, value }) => {
    const updatedAnswers = whyMosts.map(answer => {
      console.log(answer._id + ' ' + value.parentId)
      if (answer._id === value.parentId) {
        answer.answerSubject = value.subject
        answer.answerDescription = value.description
        answer.parentId = value.parentId
      }
      return answer
    })
    setWhyMosts(updatedAnswers)
  }

  const areAnswersComplete = whyMosts => {
    return whyMosts.every(answer => answer.valid)
  }

  const assignID = () => {
    return objectID
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.answersContainer}>
        {question ? (
          <div key="1">
            <WhyInput
              point={{ subject: '', description: question, _id: question._id }}
              defaultValue={{ subject: '', description: '' }}
              onDone={updateQuestionResponse}
            />
          </div>
        ) : (
          <div className={classes.noPointsContainer}>
            <hr className={classes.pointsHr}></hr>
            There are no questions to respond to.
          </div>
        )}
        {whyMosts.length ? (
          whyMosts.map(point => (
            <div key={point._id}>
              <hr className={classes.pointsHr}></hr>
              <WhyInput
                point={{ subject: '', description: whyQuestion, _id: question._id }}
                defaultValue={{ subject: '', description: '' }}
                onDone={updateWhyResponse}
              />
            </div>
          ))
        ) : (
          <div className={classes.noPointsContainer}>
            <hr className={classes.pointsHr}></hr>
            There are no whyQuestion to respond to.
          </div>
        )}
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
    color: '#D9D9D9',
    margin: '4rem 0',
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    pointsHr: {
      margin: '2rem 1.875rem',
    },
  },
}))

export default AnswerStep
