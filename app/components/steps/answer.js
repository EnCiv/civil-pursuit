//https://github.com/EnCiv/civil-pursuit/issues/213
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md

'use strict'
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react'
import cx from 'classnames'
import StepIntro from '../step-intro'
import WhyInput from '../why-input'
import { createUseStyles } from 'react-jss'
import { DeliberationContext, useLocalStorageIfAvailable } from '../deliberation-context'
import { useAuth } from 'civil-client'
import TermsAgreement from '../terms-agreement'
import ObjectId from 'bson-objectid'
import { isEqual } from 'lodash'

// Step wrapper component: handles fetching, state, and interaction with context
export default function AnswerStep(props) {
  const { onDone = () => {}, round, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)
  const user = data.user // Get user from deliberation context
  const storageAvailable = useLocalStorageIfAvailable()

  // Fetch initial data and update context
  useEffect(() => {
    const shownStatementIds = Object.keys(data?.uInfo?.[round]?.shownStatementIds || {})
    if (shownStatementIds.length <= 0) return
    window.socket.emit('get-points-of-ids', shownStatementIds, ({ points, myWhys }) => {
      upsert({
        pointById: (points || []).reduce((pById, point) => ((pById[point._id] = point), pById), {}),
        myWhyByCategoryByParentId: (myWhys || []).reduce((myWhyByCategoryByParentId, why) => {
          if (!myWhyByCategoryByParentId[why.category]) myWhyByCategoryByParentId[why.category] = {}
          myWhyByCategoryByParentId[why.category][why.parentId] = why
          return myWhyByCategoryByParentId
        }, {}),
      })
    })
  }, [data.uInfo, round])

  const question = useMemo(() => ({ _id: data.discussionId, subject: data.subject, description: data.description }), [data.discussionId, data.subject, data.description]) // the question use to be in the step, but it is also in the Iota. deprecate the question in the step

  const handleOnDone = React.useCallback(
    ({ valid, value, delta, onNext }) => {
      if (delta) {
        if (delta.myAnswer) {
          upsert({ pointById: { [delta.myAnswer._id]: delta.myAnswer } }) // Update context with delta changes
          // send to server if local storage is not available
          if (!storageAvailable) window.socket.emit('insert-dturn-statement', delta.myAnswer.parentId, delta.myAnswer)
        }
        if (delta.myWhy) {
          // Only upsert the changed value for 'most', do not expand the whole object
          upsert({ myWhyByCategoryByParentId: { most: { [delta.myWhy.parentId]: delta.myWhy } } })
          // send to server if local storage is not available
          if (!storageAvailable) window.socket.emit('upsert-why', delta.myWhy)
        }
      }
      onDone({ valid, value, onNext })
    },
    [onDone, upsert]
  )

  return <Answer {...deriveMyAnswerAndMyWhy(data)} question={question} round={round} discussionId={data.discussionId} user={user} userId={data.userId} {...otherProps} onDone={handleOnDone} />
}

// Presentation component: only renders UI and handles local user interactions
export function Answer(props) {
  const { className = '', question = {}, whyQuestion = '', onDone = () => {}, myAnswer, myWhy, discussionId, stepIntro, maxWordCount, maxCharCount, user, userId, round } = props
  const classes = useStylesFromThemeFunction()
  const [validByType, setValidByType] = useState({ myAnswer: false, myWhy: false })
  const [state, methods] = useAuth()

  /**
   * Authentication Flow for New Users
   *
   * When a new user first visits the site, `user` will be undefined. The flow is:
   *
   * 1. User sees Terms & Privacy checkbox (showTerms = true when !user?.id)
   * 2. User must check the Terms checkbox to proceed
   * 3. When user clicks Next button (and Terms is checked):
   *    - StepFooter calls onDone with valid=true
   *    - handleOnDone calls methods.skip() from useAuth
   * 4. methods.skip():
   *    - Makes POST request to /tempid endpoint
   *    - Server creates temporary user account with generated userId
   *    - Server sets session cookie with authentication
   *    - useAuth calls authenticateSocketIo() which:
   *      - Disconnects socket.io
   *      - Reconnects socket.io (now with auth cookie in headers)
   *      - Server authenticates the connection
   *    - Page reloads/redirects with authenticated session
   * 5. After reload:
   *    - user prop is now { id: 'generated-user-id' } (no email yet)
   *    - Terms checkbox no longer shows (showTerms = false)
   *    - User continues through tournament with temporary ID
   *    - All data saved to localStorage with key: cp_${discussionId}_${userId}
   * 6. At intermission after Round 1:
   *    - User prompted for email
   *    - Email associates with temporary userId via batch-upsert API
   *
   * Note: The /tempid route must be mocked in .storybook/middleware.js for Storybook tests
   */
  const showTerms = !user?.id

  // Store onNext callback so it persists and can be updated based on Terms state
  const onNextRef = useRef(undefined)

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
  // Determine overall validity:
  // - Both inputs must be valid
  // - If Terms are shown (no user), Terms must be agreed
  // - Otherwise, always valid from auth perspective
  // Calculate overall validity based on answers and auth state
  const calculateOverallValid = (validByType, agreeState) => {
    const answersValid = validByType.myAnswer && validByType.myWhy
    const authValid = !!user || !!agreeState
    return answersValid && authValid
  }

  const updateResponse =
    type =>
    ({ valid, value }) => {
      if (type === 'myWhy' && value.category !== 'most') value.category = 'most'
      const delta = { [type]: value }
      setValidByType(validByType => {
        validByType[type] = valid
        const overallValid = calculateOverallValid(validByType, state.agree)
        if (valid)
          setTimeout(() => {
            onDone({ valid: overallValid, value: percentDone(validByType), delta, onNext: onNextRef.current })
          })
        return validByType // abort the rerender
      })
    }

  // Handle Terms agreement change
  const handleTermsChange = ({ agree }) => {
    // Re-evaluate overall validity when Terms state changes
    const overallValid = calculateOverallValid(validByType, agree)

    // Store or clear onNext callback based on Terms checkbox state
    // If Terms are checked and user has no id, store callback to call skip
    // If Terms are unchecked, clear the callback
    if (agree && !user?.id) {
      onNextRef.current = () => {
        console.log('Terms agreed, calling skip to create temporary user')
        methods.skip()
      }
    } else {
      onNextRef.current = undefined
    }

    onDone({ valid: overallValid, value: percentDone(validByType), onNext: onNextRef.current })
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
        {showTerms && (
          <div key="terms" className={classes.termsContainer}>
            <TermsAgreement state={state} methods={methods} onDone={handleTermsChange} />
          </div>
        )}
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
  termsContainer: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: `1px solid ${theme.colors.secondaryDivider || '#ccc'}`,
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    pointsHr: {
      margin: '2rem 1.875rem',
    },
    termsContainer: {
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
    },
  },
}))
