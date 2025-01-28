// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React, { useState, useEffect } from 'react'
import { Answer } from '../app/components/steps/answer'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'
import ObjectId from 'bson-objectid'

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

const startingPoint = { _id: '1', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point', description: 'Starting Point Description' }
const whyPoint1 = { _id: '2', parentId: '1', subject: 'Congress', description: 'Congress is too slow' }

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

    expect(onDone.mock.calls[1][0]).toMatchObject({ delta: { myAnswer: { description: 'This is the first description!', parentId: '5d0137260dacd06732a1d814', subject: 'This is the first subject!' } }, valid: false, value: 0.5 })
    expect(ObjectId.isValid(onDone.mock.calls[1][0].delta.myAnswer._id)).toBe(true)
    expect(onDone.mock.calls[3][0]).toMatchObject({ delta: { myWhy: { description: 'This is the second description!', subject: 'This is the second subject!' } }, valid: true, value: 1 })
    expect(onDone.mock.calls[3][0].delta.myWhy.parentId).toEqual(onDone.mock.calls[1][0].delta.myAnswer._id)
    expect(ObjectId.isValid(onDone.mock.calls[3][0].delta.myWhy._id)).toBe(true)
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
    //await userEvent.tab() // 2 tabs needed to update startingPoint

    expect(onDoneResult(canvas)).toMatchObject({
      count: 4,
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
    await waitFor(() =>
      expect(onDone.mock.calls[0][0]).toMatchObject({ delta: { myAnswer: { _id: '1', description: 'Starting Point Description', parentId: '5d0137260dacd06732a1d814', subject: 'Starting Point' } }, valid: false, value: 0.5 })
    )
    await waitFor(() => expect(onDone.mock.calls[1][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'Congress is too slow', parentId: '1', subject: 'Congress' } }, valid: true, value: 1 }))
    await waitFor(() => expect(onDone.mock.calls[2][0]).toMatchObject({ delta: { myWhy: { _id: '2', description: 'This is the first description!', parentId: '1', subject: 'This is the first subject!' } }, valid: true, value: 1 }))
  },
}
