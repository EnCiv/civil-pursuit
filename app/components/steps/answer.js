//https://github.com/EnCiv/civil-pursuit/issues/213

'use strict'
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react'
import cx from 'classnames'
import StepIntro from '../step-intro'
import WhyInput from '../why-input'
import { createUseStyles } from 'react-jss'
import { DeliberationContext } from '../deliberation-context'
import ObjectId from 'bson-objectid'
import { isEqual } from 'lodash'

// Step wrapper component: handles fetching, state, and interaction with context
export default function AnswerStep(props) {
  const { onDone = () => {}, round, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)

  // Fetch initial data and update context
  useEffect(() => {
    const shownStatementIds = Object.keys(data?.uInfo?.[round]?.shownStatementIds || {})
    if (shownStatementIds.length <= 0) return
    window.socket.emit('get-points-of-ids', shownStatementIds, ({ points, myWhys }) => {
      upsert({
        pointById: points.reduce((pById, point) => ((pById[point._id] = point), pById), {}),
        myWhyByCategoryByParentId: myWhys.reduce((myWhyByCategoryByParentId, why) => {
          if (!myWhyByCategoryByParentId[why.category]) myWhyByCategoryByParentId[why.category] = {}
          myWhyByCategoryByParentId[why.category][why.parentId] = why
          return myWhyByCategoryByParentId
        }, {}),
      })
    })
  }, [data.uInfo, round])

  const question = useMemo(() => ({ _id: data.discussionId, subject: data.subject, description: data.description }), [data.discussionId, data.subject, data.description]) // the question use to be in the step, but it is also in the Iota. deprecate the question in the step

  const handleOnDone = React.useCallback(
    ({ valid, value, delta }) => {
      if (delta) {
        if (delta.myAnswer) {
          upsert({ pointById: { [delta.myAnswer._id]: delta.myAnswer } }) // Update context with delta changes
          window.socket.emit('insert-dturn-statement', delta.myAnswer.parentId, delta.myAnswer) // Push changes to server
        }
        if (delta.myWhy) {
          // Only upsert the changed value for 'most', do not expand the whole object
          upsert({ myWhyByCategoryByParentId: { most: { [delta.myWhy.parentId]: delta.myWhy } } })
          window.socket.emit('upsert-why', delta.myWhy)
        }
      }
      onDone({ valid, value })
    },
    [onDone, upsert]
  )

  return <Answer {...deriveMyAnswerAndMyWhy(data)} question={question} round={round} userId={data.userId} discussionId={data.discussionId} {...otherProps} onDone={handleOnDone} />
}

// Presentation component: only renders UI and handles local user interactions
export function Answer(props) {
  const { className = '', question = {}, whyQuestion = '', onDone = () => {}, myAnswer, myWhy, discussionId, userId, stepIntro, maxWordCount, maxCharCount } = props
  const classes = useStylesFromThemeFunction()
  const [validByType, setValidByType] = useState({ myAnswer: false, myWhy: false })
  // myAnswer could be undefined initially, if so it needs to be initialized with an _id, and if the user types in the WhyAnswer first, it's parentId needs to be the answers _id
  const [_myAnswer, setMyAnswer] = useState(myAnswer || { _id: ObjectId().toString(), subject: '', description: '', parentId: discussionId, userId })
  useEffect(() => {
    if (myAnswer && !isEqual(myAnswer, _myAnswer)) setMyAnswer(myAnswer)
  }, [myAnswer])

  // myWhy could be undefined initially if so it needs to be initialized with an _id and parentId
  const [_myWhy, setMyWhy] = useState(myWhy || { _id: ObjectId().toString(), subject: '', description: '', parentId: _myAnswer._id, userId })
  useEffect(() => {
    if (myWhy && !isEqual(myWhy, _myWhy)) setMyWhy(myWhy)
  }, [myWhy])

  function percentDone(validByType) {
    return (validByType.myAnswer + validByType.myWhy) / 2
  }

  const updateResponse =
    type =>
    ({ valid, value }) => {
      if (type === 'myWhy' && value.category !== 'most') value.category = 'most'
      const delta = { [type]: value }
      setValidByType(validByType => {
        validByType[type] = valid
        if (valid)
          setTimeout(() => {
            onDone({ valid: validByType.myAnswer && validByType.myWhy, value: percentDone(validByType), delta })
          })
        return validByType // abort the rerender
      })
    }
  return (
    <div className={cx(classes.wrapper, className)}>
      <StepIntro {...stepIntro} />
      <div className={classes.answersContainer}>
        <div key="question">
          <WhyInput point={question} value={_myAnswer} maxWordCount={maxWordCount} maxCharCount={maxCharCount} onDone={updateResponse('myAnswer')} />
        </div>
        <div key="why">
          <hr className={classes.pointsHr} />
          <WhyInput point={{ description: '', subject: whyQuestion, _id: _myAnswer?._id }} value={_myWhy} maxWordCount={maxWordCount} maxCharCount={maxCharCount} onDone={updateResponse('myWhy')} />
        </div>
      </div>
    </div>
  )
}

// Logic for deriving props from data
export function deriveMyAnswerAndMyWhy(data) {
  const local = useRef({}).current
  if (data.pointById !== local.pointById) {
    const myAnswer = Object.values(data.pointById || {}).find(p => p.userId === data.userId)
    local.myAnswer = myAnswer
    local.pointById = data.pointById
  }
  // In AnswerStep, category is always 'most'
  const myWhyByCategoryByParentId = data.myWhyByCategoryByParentId || {}
  if (local.myAnswer && myWhyByCategoryByParentId.most !== local.myWhyByCategoryByParentIdMost) {
    const myWhy = myWhyByCategoryByParentId['most']?.[local.myAnswer._id]
    local.myWhy = myWhy
    local.myWhyByCategoryByParentIdMost = myWhyByCategoryByParentId['most']
  }
  return { myAnswer: local.myAnswer, myWhy: local.myWhy }
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
