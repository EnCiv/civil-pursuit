// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React, { useState, useEffect } from 'react'
import AnswerStep from '../app/components/answer-step'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'

export default {
  component: AnswerStep,
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

const createPointObj = (_id, parentId = null, subject, description, groupedPoints = []) => {
  return {
    _id,
    parentId,
    subject,
    description,
  }
}

const emptyStartingPoint = createPointObj('1', [])
const emptyWhyPoint = createPointObj('0', '1', [])

const startingPoint = createPointObj('1', '1', 'Starting Point', 'Starting Point Description', [])
const whyPoint1 = createPointObj('2', '1', 'Congress', 'Congress is too slow', [])
const whyPoint2 = createPointObj('3', '6', 'blah', 'ytyesysey', [])
const whyPoint3 = createPointObj('4', '7', "i don't know", 'actually i do know', [])
const whyPoint4 = createPointObj('5', '8', 'yes', 'no', [])

const defaultPoints = { startingPoint: emptyStartingPoint, whyMosts: [emptyWhyPoint] }
const morePoints = { startingPoint: startingPoint, whyMosts: [whyPoint1, whyPoint2, whyPoint3, whyPoint4] }

export const Empty = {
  args: { question: '', whyQuestion: '' },
}

export const Default = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: {},
  },
}

export const Prefilled_1 = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: morePoints,
  },
}

export const onDoneTestDefault = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: defaultPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
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

    expect(onDoneResult(canvas)).toMatchObject({
      count: 6,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            parentId: '5d0137260dacd06732a1d814',
            subject: 'This is the first subject!',
            description: 'This is the first description!',
          },
          whyMost: {
            _id: '0',
            parentId: '1',
            subject: 'This is the second subject!',
            description: 'This is the second description!',
          },
        },
      },
    })
  },
}

export const onDoneTestSwap = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: defaultPoints,
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
    await userEvent.tab() // 2 tabs needed to update startingPoint

    expect(onDoneResult(canvas)).toMatchObject({
      count: 7,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            subject: 'This is the first subject!',
            description: 'This is the first description!',
            parentId: '5d0137260dacd06732a1d814',
          },
          whyMost: {
            _id: '0',
            subject: 'This is the second subject!',
            description: 'This is the second description!',
            parentId: '1',
          },
        },
      },
    })
  },
}

export const asyncUpdate = {
  decorators: [
    (Story, context) => {
      const [updated, setUpdated] = useState(false)
      useEffect(() => {
        const subject0 = context.args.shared.whyMosts[0].subject
        const description0 = context.args.shared.whyMosts[0].description
        setTimeout(() => {
          context.args.shared.whyMosts[0] = {
            ...context.args.shared.whyMosts[0],
            subject: 'This is the first subject!',
            description: 'This is the first description!',
          }
          context.args.shared.whyMosts = [...context.args.shared.whyMosts] //needs to change to cause a rerender
          context.args.shared = { ...context.args.shared } //needs to change to cause a rerender
          setUpdated(true)
        }, 1000)
        // resetting so the test will pass on retest
        setTimeout(() => {
          context.args.shared.whyMosts[0].subject = subject0
          context.args.shared.whyMosts[0].description = description0
          setUpdated(true)
        }, 2000)
      }, [])
      return <Story thisTestIsDone={updated} />
    },
  ],
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: morePoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: true,
          value: {
            startingPoint: {
              _id: '1',
              parentId: '5d0137260dacd06732a1d814',
              subject: 'Starting Point',
              description: 'Starting Point Description',
            },
            whyMost: {
              _id: '2',
              parentId: '1',
              subject: 'Congress',
              description: 'Congress is too slow',
            },
          },
        },
      })
    )
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 3,
        onDoneResult: {
          valid: true,
          value: {
            startingPoint: {
              _id: '1',
              parentId: '5d0137260dacd06732a1d814',
              subject: 'Starting Point',
              description: 'Starting Point Description',
            },
            whyMost: {
              _id: '2',
              parentId: '1',
              subject: 'This is the first subject!',
              description: 'This is the first description!',
            },
          },
        },
      })
    )
  },
}
