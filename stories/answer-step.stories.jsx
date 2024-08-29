// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import AnswerStep from '../app/components/answer-step'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'

export default {
  component: AnswerStep,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const startingQuestion = "What one issue should 'We the People' unite and solve first to make our country even better?"
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
const whyPoint2 = createPointObj('3', '1', 'blah', 'ytyesysey', [])
const whyPoint3 = createPointObj('4', '1', "i don't know", 'actually i do know', [])
const whyPoint4 = createPointObj('5', '1', 'yes', 'no', [])

const defaultPoints = { startingPoint: emptyStartingPoint, whyMosts: [emptyWhyPoint] }
const morePoints = { startingPoint: startingPoint, whyMosts: [whyPoint1, whyPoint2, whyPoint3, whyPoint4] }

export const Empty = {
  args: { question: '', whyQuestion: '' },
}

export const Default = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: defaultPoints,
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
      count: 4,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            subject: 'This is the first subject!',
            description: 'This is the first description!',
          },
          whyMosts: [
            {
              _id: '0',
              subject: 'This is the second subject!',
              description: 'This is the second description!',
              parentId: '1',
            },
          ],
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
      count: 5,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            subject: 'This is the first subject!',
            description: 'This is the first description!',
          },
          whyMosts: [
            {
              _id: '0',
              subject: 'This is the second subject!',
              description: 'This is the second description!',
              parentId: '1',
            },
          ],
        },
      },
    })
  },
}
