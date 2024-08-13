// https://github.com/EnCiv/civil-pursuit/issues/102

'use strict'
import React, { forwardRef, useState, useEffect } from 'react'
import StepIntro from './step-intro'
import WhyInput from './why-input'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

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

  const [points, setPoints] = useState(shared.startingPoint)
  const [answeredPoints, setAnsweredPoints] = useState(shared.whyMosts)

  useEffect(() => {
    if (!points.length || areAnswersComplete(answeredPoints)) {
      onDone({ valid: true, value: answeredPoints })
    } else {
      onDone({ valid: false, value: answeredPoints })
    }
  }, [answeredPoints])

  const updateWhyResponse = ({ valid, value }) => {
    const updatedAnswers = answeredPoints.map(answer => {
      if (answer._id === value.parentId) {
        answer.answerSubject = value.subject
        answer.answerDescription = value.description
        answer.valid = valid
      }
      return answer
    })
    setAnsweredPoints(updatedAnswers)
  }

  const areAnswersComplete = answeredPoints => {
    return answeredPoints.every(answer => answer.valid)
  }

  console.log('question: ' + question)

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <StepIntro subject="Answer" description="Please provide a title and short description of your answer." />
      <div className={classes.pointsContainer}>
        {question ? (
          <WhyInput
            point={{ subject: '', description: question, _id: '1' }}
            defaultValue={{ subject: '', description: '' }}
            onDone={updateWhyResponse}
          />
        ) : (
          <div className={classes.noPointsContainer}>
            <hr className={classes.pointsHr}></hr>
            There are no questions to respond to.
          </div>
        )}
        {whyQuestion ? (
          <WhyInput
            point={{ subject: '', description: whyQuestion, _id: '1' }}
            defaultValue={{ subject: '', description: '' }}
            onDone={updateWhyResponse}
          />
        ) : (
          <div className={classes.noPointsContainer}>
            <hr className={classes.pointsHr}></hr>
            There are no whyPoints to respond to.
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
  pointsContainer: {
    fontSize: '1.25rem',
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
