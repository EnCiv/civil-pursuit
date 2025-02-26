// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React, { useState, useEffect } from 'react'
import AnswerStep, { Answer } from '../app/components/steps/answer'
import expect from 'expect'
import { DeliberationContextDecorator, deliberationContextData, onDoneDecorator, onDoneResult, socketEmitDecorator } from './common'
import ObjectId from 'bson-objectid'
import DeliberationContext from '../app/components/deliberation-context'

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
const whyPoint1 = { _id: '2', parentId: '1', subject: 'Congress', description: 'Congress is too slow', userId: 'a' }

export const Empty = {
  args: { question: '', whyQuestion: '' },
}

export const Default = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
  },
}

export const Prefilled_1 = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
  },
}

export const onDoneTestDefault = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
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

export const onDoneTestSwap = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
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
        }, 1000)
        // resetting so the test will pass on retest
        setTimeout(() => {
          context.args.myWhy.subject = subject0
          context.args.myWhy.description = description0
          setUpdated(true)
        }, 2000)
      }, [])
      return <Story thisTestIsDone={updated} />
    },
  ],
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
  },
  play: async ({ canvasElement, args }) => {
    const { onDone } = args
    await waitFor(() => expect(onDone.mock.calls[0][0]).toMatchObject({ delta: { myAnswer: { _id: '1', description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point' } }, valid: true, value: 1 }))
    await waitFor(() => expect(onDone.mock.calls[1][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'Congress is too slow', parentId: '1', subject: 'Congress' } }, valid: true, value: 1 }))
    await waitFor(() => expect(onDone.mock.calls[2][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'This is the first description!', parentId: '1', subject: 'This is the first subject!' } }, valid: true, value: 1 }))
  },
}

export const AnswerStepEmpty = {
  args: {},
  render: args => <AnswerStep {...args} />,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

function answerStepTemplate(args) {
  const { myAnswer, myWhy, defaultValue, ...otherProps } = args
  if (!window.socket._socketEmitHandlers['get-points-of-ids']) {
    window.socket._socketEmitHandlers['get-points-of-ids'] = (ids, cb) => {
      cb({ points: [myAnswer], myWhys: [myWhy] })
    }
  }
  if (!window.socket._socketEmitHandlers['insert-dturn-statement']) {
    window.socket._socketEmitHandlers['insert-dturn-statement'] = (discussionId, point, cb) => {
      window.socket._socketEmitHandlerResults['insert-dturn-statement'].push([discussionId, point])
      cb && cb()
    }
    window.socket._socketEmitHandlerResults['insert-dturn-statement'] = []
  }
  if (!window.socket._socketEmitHandlers['upsert-why']) {
    window.socket._socketEmitHandlers['upsert-why'] = (why, cb) => {
      window.socket._socketEmitHandlerResults['upsert-why'].push([why])
      cb && cb()
    }
    window.socket._socketEmitHandlerResults['upsert-why'] = []
  }
  return <AnswerStep {...otherProps} />
}

export const AnswerStepUserEntersData = {
  args: {
    defaultValue: { userId: 'a', round: '0', deliberationId: startingQuestion._id }, // to deliberation context
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: undefined,
    myWhy: undefined,
    onDone: undefined,
  },
  render: answerStepTemplate,
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
    await userEvent.type(subjectEle[0], 'This is the first subject!')
    await userEvent.tab()
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
        myWhyByParentId: { [pointId]: { _id: whyId, description: 'This is the second description!', parentId: pointId, subject: 'This is the second subject!' } },
        pointById: { [pointId]: { _id: pointId, description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!' } },
        reducedPointList: [],
      })
    })
  },
}

export const AnswerStepPreviousDataComesFromServer = {
  args: {
    defaultValue: { userId: 'a', round: '0', deliberationId: startingQuestion._id, uInfo: [{ statementIds: ['1'] }] }, // to deliberation context
    question: startingQuestion,
    whyQuestion: whyQuestion,
    myAnswer: startingPoint,
    myWhy: whyPoint1,
  },
  render: answerStepTemplate,
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: true,
        value: 1,
      })
      const pointId = '1'
      const whyId = '2'
      expect(deliberationContextData(canvas)).toMatchObject({
        myWhyByParentId: { [pointId]: { _id: whyId, description: 'Congress is too slow', parentId: pointId, subject: 'Congress', userId: 'a' } },
        pointById: { [pointId]: { _id: pointId, description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point', userId: 'a' } },
        reducedPointList: [],
      })
    })
  },
}
