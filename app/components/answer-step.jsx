// https://github.com/EnCiv/civil-pursuit/issues/102
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import StepIntro from './step-intro'
import WhyInput from './why-input'
import ObjectId from 'bson-objectid'

const AnswerStep = props => {
  const {
    className = '',
    intro = '', // text for the introduction
    whyQuestion1 = '', // the text for the left of the first why input
    whyQuestion2 = '', // the text for the left of the second why input
    question = {}, // a pointObj
    shared = {
      startingPoint: {},
      whyMosts: [],
    },
    onDone = () => {},
    ...otherProps
  } = props

  const classes = useStylesFromThemeFunction(props)
  const { startingPoint: initialStartingPoint, whyMosts } = shared
  const [startingPoint, setStartingPoint] = useState(initialStartingPoint)
  const whyPoints =
    Object.keys(initialStartingPoint).length === 0
      ? whyMosts
      : whyMosts.filter(point => point.parentId === initialStartingPoint._id)
  const [whyMostInputs, setWhyMostInputs] = useState(whyPoints)

  useEffect(() => {
    if (areAnswersComplete(whyMostInputs)) {
      onDone({ valid: true, value: { startingPoint: startingPoint, whyMosts: whyMostInputs } })
    } else {
      onDone({ valid: false, value: { startingPoint: startingPoint, whyMosts: whyMostInputs } })
    }
  }, [whyMostInputs, startingPoint])

  const updateWhyResponse = ({ valid, value }) => {
    let newStartingPoint = startingPoint
    if (Object.keys(startingPoint).length === 0) {
      newStartingPoint = {
        subject: 'Starting Point',
        description: 'Starting Point Description',
        _id: ObjectId().toString(),
      }
      setStartingPoint(newStartingPoint)
    }

    const updatedAnswers = whyMostInputs.map(answer => {
      if (answer._id === value.parentId) {
        answer.answerSubject = value.subject
        answer.answerDescription = value.description
        answer.valid = valid
        console.log('startingpoint:', startingPoint)
        if (!answer.parentId || answer.parentId !== startingPoint._id) {
          answer.parentId = startingPoint._id
        }
      }
      return answer
    })
    setWhyMostInputs(updatedAnswers)
  }

  const areAnswersComplete = whyMostInputs => {
    return whyMostInputs.every(whyMost => whyMost.valid)
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <StepIntro className={classes.stepIntro} subject={'Answer'} description={intro} />

      <div className={classes.whyInputContainer}>
        {whyPoints.map((point, index) => (
          <div key={point._id}>
            <WhyInput className={classes.whyInput} point={point} onDone={updateWhyResponse} />
            <hr className={classes.divider} />
          </div>
        ))}
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },

  stepIntro: {},

  whyInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      gap: '3rem',
    },
  },

  whyInput1: {},
  divider: {
    width: '100%',
    border: 'none',
    borderBottom: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    transform: 'rotate(180deg)',
    alignSelf: 'center',
  },

  whyInput2: {},
}))

export default AnswerStep
