// https://github.com/EnCiv/civil-pursuit/issues/102

// most of this code was taken from why-step.jsx
'use strict'
import React, { forwardRef, useState, useEffect } from 'react'
import StepIntro from './step-intro'
import WhyInput from './why-input'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
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

  useEffect(() => {
    if (areStartingComplete() && areWhyAnswersComplete()) {
      onDone({ valid: true, value: { startingPoint: startingPoint, whyMosts: whyMosts } })
    } else {
      onDone({ valid: false, value: { startingPoint: startingPoint, whyMosts: whyMosts } })
    }
  }, [whyMosts])

  const updateQuestionResponse = ({ valid, value }) => {
    const updatedAnswers = {
      answerSubject: value.subject,
      answerDescription: value.description,
      _id: startingPoint._id,
    }
    setStartingPoint(updatedAnswers)
  }

  const updateWhyResponse = ({ valid, value }) => {
    const updatedAnswers = whyMosts.map(answer => {
      // find which why response to update
      if (answer._id === value.parentId) {
        answer.answerSubject = value.subject
        answer.answerDescription = value.description
        answer.valid = valid
      }
      return answer
    })
    setWhyMosts(updatedAnswers)
  }

  // evaluates if both subject and description fields are filled out for starting point
  const areStartingComplete = () => {
    return startingPoint.answerSubject && startingPoint.answerDescription
  }

  // evaluates if both subject and description fields are filled out for whyMosts
  const areWhyAnswersComplete = () => {
    return whyMosts.every(answer => answer.valid)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.answersContainer}>
        {question ? (
          <div key={startingPoint._id}>
            <WhyInput
              point={{ subject: '', description: question, _id: startingPoint._id }}
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
                point={{ subject: '', description: whyQuestion, _id: point._id }} // _id is parentId
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
