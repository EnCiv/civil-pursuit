// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within, waitFor, expect } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React, { useState, useEffect } from 'react'
import AnswerStep, { Answer } from '../app/components/steps/answer'
import { DeliberationContextDecorator, deliberationContextData, onDoneDecorator, onDoneResult, socketEmitDecorator } from './common'
import ObjectId from 'bson-objectid'
import { withAuthTestState, authFlowDecorators } from './mocks/auth-flow'
import LocalStorageManager from '../app/lib/local-storage-manager'

export default {
  component: Answer,
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const startingQuestion = {
  _id: '5d0137260dacd06732a1d814',
  subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
  description: `This task is testing an application for large scale online discussion that is unbiased, thoughtful, doesn’t require reading millions of answers, and leads to awesome results. We are only asking about a concern - an issue or problem, not about any possible solutions. Think about it before answering, think outside the box, think big and think about everyone in the country uniting on this. At the end, your feedback will be welcomed.`,
}

const whyQuestion = 'Why should everyone consider solving this issue?'

const startingPoint = { _id: '1', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point', description: 'Starting Point Description', userId: 'a' }
const whyPoint1 = { _id: '2', parentId: '1', subject: 'Congress', description: 'Congress is too slow', userId: 'a', category: 'most' }
const discussionId = startingQuestion._id

export const Empty = {
  args: { question: '', whyQuestion: '' },
}

export const Default = {
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
  },
}

export const Prefilled_1 = {
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
  },
}

export const onDoneTestDefault = {
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
    round: 0,
    user: { id: 'a', email: 'test@example.com' },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)

    // fill in the first point subject and description
    await userEvent.type(subjectEle[0], 'This is the first subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[0], 'This is the first description!')
    await userEvent.tab()

    // fill in the second point subject and description
    await userEvent.type(subjectEle[1], 'This is the second subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[1], 'This is the second description!')
    await userEvent.tab()

    expect(onDone.mock.calls[0][0]).toMatchObject({ delta: { myAnswer: { description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!' } }, valid: false, value: 0.5 })
    expect(ObjectId.isValid(onDone.mock.calls[0][0].delta.myAnswer._id)).toBe(true)
    expect(onDone.mock.calls[1][0]).toMatchObject({ delta: { myWhy: { description: 'This is the second description!', subject: 'This is the second subject!' } }, valid: true, value: 1 })
    expect(onDone.mock.calls[1][0].delta.myWhy.parentId).toEqual(onDone.mock.calls[0][0].delta.myAnswer._id)
    expect(ObjectId.isValid(onDone.mock.calls[1][0].delta.myWhy._id)).toBe(true)
  },
}

// Test that verifies 'unknown' userId is used when user has no id (new user before skip())
export const onDoneTestUnknownUserId = {
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
    round: 0,
    user: undefined, // No user - simulates new user before skip() is called
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)

    // fill in the first point subject and description
    await userEvent.type(subjectEle[0], 'My new user issue')
    await userEvent.tab()
    await userEvent.type(descriptionEle[0], 'Description of my new user issue')
    await userEvent.tab()

    // fill in the second point subject and description
    await userEvent.type(subjectEle[1], 'Why this matters')
    await userEvent.tab()
    await userEvent.type(descriptionEle[1], 'Because it affects everyone')
    await userEvent.tab()

    // Verify myAnswer has userId: 'unknown'
    expect(onDone.mock.calls[0][0]).toMatchObject({
      delta: {
        myAnswer: {
          description: 'Description of my new user issue',
          parentId: '5d0137260dacd06732a1d814',
          subject: 'My new user issue',
          userId: 'unknown', // Key assertion: new user gets 'unknown' userId
        },
      },
      valid: false,
      value: 0.5,
    })
    expect(ObjectId.isValid(onDone.mock.calls[0][0].delta.myAnswer._id)).toBe(true)

    // Verify myWhy also has userId: 'unknown'
    expect(onDone.mock.calls[1][0]).toMatchObject({
      delta: {
        myWhy: {
          description: 'Because it affects everyone',
          subject: 'Why this matters',
          userId: 'unknown', // Key assertion: new user gets 'unknown' userId
        },
      },
      valid: false, // Still not valid because Terms checkbox not checked
    })
    expect(onDone.mock.calls[1][0].delta.myWhy.parentId).toEqual(onDone.mock.calls[0][0].delta.myAnswer._id)
    expect(ObjectId.isValid(onDone.mock.calls[1][0].delta.myWhy._id)).toBe(true)
  },
}

export const onDoneTestSwap = {
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    user: { id: 'a', email: 'test@example.com' },
    round: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)

    // fill in the second point subject and description
    await userEvent.type(subjectEle[1], 'This is the second subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[1], 'This is the second description!')
    await userEvent.tab()

    // fill in the first point subject and description
    await userEvent.type(subjectEle[0], 'This is the first subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[0], 'This is the first description!')
    await userEvent.tab()

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: { delta: { myAnswer: { description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!' } }, valid: true, value: 1 },
    })
  },
}

export const asyncUpdate = {
  decorators: [
    (Story, context) => {
      const [updated, setUpdated] = useState(false)
      useEffect(() => {
        const subject0 = context.args.myWhy.subject
        const description0 = context.args.myWhy.description
        setTimeout(() => {
          context.args.myWhy = {
            ...context.args.myWhy,
            subject: 'This is the first subject!',
            description: 'This is the first description!',
          }
          setUpdated(true)
        }, 100)
        // resetting so the test will pass on retest
        setTimeout(() => {
          context.args.myWhy.subject = subject0
          context.args.myWhy.description = description0
          setUpdated(true)
        }, 200)
      }, [])
      return <Story thisTestIsDone={updated} />
    },
  ],
  args: {
    discussionId,
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
    round: 0,
    user: { id: 'a', email: 'test@example.com' }, // Authenticated user, no Terms needed
  },
  play: async ({ canvasElement, args }) => {
    const { onDone } = args
    await waitFor(() =>
      expect(onDone.mock.calls[0][0]).toMatchObject({ delta: { myAnswer: { _id: '1', description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point' } }, valid: false, value: 1 })
    )
    await waitFor(() => expect(onDone.mock.calls[1][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'Congress is too slow', parentId: '1', subject: 'Congress' } }, valid: true, value: 1 }))
    await waitFor(() => expect(onDone.mock.calls[2][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'This is the first description!', parentId: '1', subject: 'This is the first subject!' } }, valid: true, value: 1 }))
  },
}

export const AnswerStepEmpty = {
  args: {},
  render: args => <AnswerStep {...args} />,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

function AnswerStepTemplate(args) {
  const { myAnswer, myWhy, defaultValue, testState, ...otherProps } = args

  useState(() => {
    window.socket._socketEmitHandlers['get-points-of-ids'] = (ids, cb) => {
      cb({ points: (myAnswer && [myAnswer]) || [], myWhys: (myWhy && [myWhy]) || [] })
    }
    window.socket._socketEmitHandlers['insert-dturn-statement'] = (discussionId, point, cb) => {
      window.socket._socketEmitHandlerResults['insert-dturn-statement'].push([discussionId, point])
      cb && cb()
    }
    window.socket._socketEmitHandlerResults['insert-dturn-statement'] = []

    window.socket._socketEmitHandlers['upsert-why'] = (why, cb) => {
      window.socket._socketEmitHandlerResults['upsert-why'].push([why])
      cb && cb()
    }
    window.socket._socketEmitHandlerResults['upsert-why'] = []
  })
  return <AnswerStep {...otherProps} />
}

export const AnswerStepUserEntersData = {
  args: {
    defaultValue: {
      userId: 'a',
      round: 0,
      discussionId: startingQuestion._id,
      user: { id: 'a', email: 'test@example.com' }, // User already has an ID from skip, so no Terms needed
      storageAvailable: false, // Force localStorage to appear disabled so socket.emit is used
    }, // to deliberation context
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
    onDone: undefined,
    round: 0,
  },
  render: AnswerStepTemplate,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)

    // fill in the second point subject and description
    await userEvent.type(subjectEle[1], 'This is the second subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[1], 'This is the second description!')
    await userEvent.tab()

    // fill in the first point subject and description
    await userEvent.clear(subjectEle[0]) // because there is already text there
    await userEvent.type(subjectEle[0], 'This is the first subject!')
    await userEvent.tab()
    await userEvent.clear(descriptionEle[0])
    await userEvent.type(descriptionEle[0], 'This is the first description!')
    await userEvent.tab()

    await waitFor(() => {
      console.info('onDone.mock.calls', onDone.mock.calls)
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: true,
        value: 1,
      })
      expect(window.socket._socketEmitHandlerResults['insert-dturn-statement'][0]).toMatchObject([
        '5d0137260dacd06732a1d814',
        { /*_id: changes every time,*/ description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!', userId: 'a' },
      ])
      expect(window.socket._socketEmitHandlerResults['upsert-why'][0]).toMatchObject([
        { /*_id: changes every time, */ description: 'This is the second description!', /*parentId: changes every time should be _id of above,*/ subject: 'This is the second subject!', userId: 'a' },
      ])
      const pointId = window.socket._socketEmitHandlerResults['insert-dturn-statement'][0][1]._id
      const whyId = window.socket._socketEmitHandlerResults['upsert-why'][0][0]._id
      expect(ObjectId.isValid(pointId)).toBe(true)
      expect(window.socket._socketEmitHandlerResults['upsert-why'][0][0].parentId).toEqual(pointId)
      expect(deliberationContextData(canvas)).toMatchObject({
        myWhyByCategoryByParentId: { most: { [pointId]: { _id: whyId, description: 'This is the second description!', parentId: pointId, subject: 'This is the second subject!' } } },
        pointById: { [pointId]: { _id: pointId, description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!' } },
        reducedPointList: [{ point: { _id: pointId, description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!', userId: 'a' } }],
      })
    })
  },
}

export const AnswerStepPreviousDataComesFromServer = {
  args: {
    defaultValue: {
      userId: 'a',
      discussionId: startingQuestion._id,
      uInfo: [{ shownStatementIds: { [startingPoint._id]: { authored: true, rank: 0 } } }],
      user: { id: 'a', email: 'test@example.com' }, // User already has an ID from previous session, so no Terms needed
    }, // to deliberation context
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
    round: 0,
  },
  render: AnswerStepTemplate,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: 1,
      })
    })
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: true,
        value: 1,
      })
    })
    const pointId = '1'
    const whyId = '2'
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        myWhyByCategoryByParentId: { most: { [pointId]: { _id: whyId, description: 'Congress is too slow', parentId: pointId, subject: 'Congress', userId: 'a' } } },
        pointById: { [pointId]: { _id: pointId, description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point', userId: 'a' } },
        reducedPointList: [{ point: { _id: '1', description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point', userId: 'a' } }],
      })
    })
  },
}

export const AnswerStepWithTermsAgreement = {
  args: {
    defaultValue: {
      userId: 'a',
      round: 0,
      discussionId: startingQuestion._id,
      pointById: { [startingPoint._id]: startingPoint },
      myWhyByCategoryByParentId: { most: { [startingPoint._id]: whyPoint1 } },
    }, // to deliberation context
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint, // Pre-filled answer data
    myWhy: whyPoint1, // Pre-filled why data
    round: 0,
    user: undefined, // No user, so Terms should be shown
  },
  render: AnswerStepTemplate,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args

    // Initially, answers are valid but Terms not checked, so overall should be invalid
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({
        valid: false, // Not valid because Terms not checked
        value: 1, // But answers are complete (100%)
      })
    })

    // Find and check the Terms checkbox
    const termsCheckbox = canvas.getByRole('checkbox')
    expect(termsCheckbox.checked).toBe(false)

    await userEvent.click(termsCheckbox)

    // After checking Terms, should become valid
    await waitFor(() => {
      // Find the most recent call where valid is true
      const validCall = onDone.mock.calls.find(call => call[0].valid === true)
      expect(validCall).toBeDefined()
      expect(validCall[0]).toMatchObject({
        valid: true, // Now valid because Terms are checked
        value: 1,
      })
    })
  },
}

// Test the full authentication flow with superagent interception
// This story tests that methods.skip() properly calls /tempid via superagent
// Simulates a new user with no pre-filled data
export const AnswerStepWithAuthFlow = {
  args: {
    defaultValue: {
      userId: undefined, // New user has no userId yet
      round: 0,
      discussionId: startingQuestion._id,
      user: undefined, // Start with no user
    },
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined, // No pre-filled answer
    myWhy: undefined, // No pre-filled why
    round: 0,
    user: undefined, // No user, so Terms should be shown
    // testState will be initialized by authFlowDecorator
  },
  render: withAuthTestState(AnswerStepTemplate),
  decorators: [socketEmitDecorator, DeliberationContextDecorator, ...authFlowDecorators],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone, testState } = args

    console.log('🎬 Starting AnswerStepWithAuthFlow test')

    // Step 1: Fill in the answer fields first
    const subjectInputs = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionInputs = canvas.getAllByPlaceholderText(/description/i)

    console.log('📝 Filling in answer subject')
    await userEvent.type(subjectInputs[0], 'Healthcare Reform')
    await userEvent.tab()

    console.log('📝 Filling in answer description')
    await userEvent.type(descriptionInputs[0], 'We need better healthcare for everyone')
    await userEvent.tab()

    console.log('📝 Filling in why subject')
    await userEvent.type(subjectInputs[1], 'Universal Coverage')
    await userEvent.tab()

    console.log('📝 Filling in why description')
    await userEvent.type(descriptionInputs[1], 'Everyone deserves access to quality healthcare')
    await userEvent.tab()

    // Wait for inputs to be fully processed
    await new Promise(resolve => setTimeout(resolve, 500))

    // Step 2: Find and check the Terms checkbox
    const termsCheckbox = await waitFor(
      () => {
        const checkbox = canvas.queryByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
        return checkbox
      },
      { timeout: 5000 }
    )

    console.log('✅ Found Terms checkbox')

    await userEvent.click(termsCheckbox)
    console.log('✅ Checked Terms checkbox')

    // Step 3: Verify onNext callback was provided and form is valid
    await waitFor(
      () => {
        const validCall = onDone.mock.calls.find(call => call[0].valid === true && call[0].onNext)
        expect(validCall).toBeDefined()
        console.log('validCall:', validCall)
        expect(typeof validCall[0].onNext).toBe('function')
      },
      { timeout: 2000 }
    )

    console.log('✅ onNext callback was provided in onDone')

    // Step 4: Call the onNext callback to trigger skip
    const validCall = onDone.mock.calls.find(call => call[0].valid === true && call[0].onNext)
    const onNextCallback = validCall[0].onNext

    console.log('🚀 Calling onNext callback (should trigger methods.skip())')
    onNextCallback()

    // Step 5: Wait for tempid to be called
    await waitFor(
      () => {
        console.log('⏳ Waiting for tempid call... testState.tempidCalled:', testState.tempidCalled)
        expect(testState.tempidCalled).toBe(true)
      },
      { timeout: 5000 }
    )

    console.log('✅ /tempid was called successfully!')
    console.log('📝 Request data:', testState.tempidRequestData)
    console.log('📝 Response:', testState.tempidResponse)
  },
}
