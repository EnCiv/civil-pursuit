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

const createPointObj = (_id, parentId = null, groupedPoints = []) => {
  return {
    _id,
    parentId,
  }
}

const startingPoint = createPointObj('1', [])
const whyPoint1 = createPointObj('2', '1', [])
const whyPoint2 = createPointObj('3', '1', [])
const whyPoint3 = createPointObj('4', '1', [])
const whyPoint4 = createPointObj('5', '1', [])

const defaultPoints = { startingPoint: startingPoint, whyMosts: [whyPoint1] }
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

export const MorePoints = {
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
      count: 3,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            answerSubject: 'This is the first subject!',
            answerDescription: 'This is the first description!',
          },
          whyMosts: [
            {
              _id: '2',
              answerSubject: 'This is the second subject!',
              answerDescription: 'This is the second description!',
              parentId: '1',
            },
          ],
        },
      },
    })
  },
}

export const onDoneTestMorePoints = {
  args: {
    question: startingQuestion,
    whyQuestion: whyQuestion,
    shared: morePoints,
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

    // fill in the third point subject and description
    await userEvent.type(subjectEle[2], 'This is the third subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[2], 'This is the third description!')
    await userEvent.tab()

    // fill in the fourth point subject and description
    await userEvent.type(subjectEle[3], 'This is the fourth subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[3], 'This is the fourth description!')
    await userEvent.tab()

    // fill in the fifth point subject and description
    await userEvent.type(subjectEle[4], 'This is the fifth subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[4], 'This is the fifth description!')
    await userEvent.tab()

    expect(onDoneResult(canvas)).toMatchObject({
      count: 9,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            answerSubject: 'This is the first subject!',
            answerDescription: 'This is the first description!',
          },
          whyMosts: [
            {
              _id: '2',
              answerSubject: 'This is the second subject!',
              answerDescription: 'This is the second description!',
              parentId: '1',
            },
            {
              _id: '3',
              answerSubject: 'This is the third subject!',
              answerDescription: 'This is the third description!',
              parentId: '1',
            },
            {
              _id: '4',
              answerSubject: 'This is the fourth subject!',
              answerDescription: 'This is the fourth description!',
              parentId: '1',
            },
            {
              _id: '5',
              answerSubject: 'This is the fifth subject!',
              answerDescription: 'This is the fifth description!',
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

    expect(onDoneResult(canvas)).toMatchObject({
      count: 3,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {
            _id: '1',
            answerSubject: 'This is the first subject!',
            answerDescription: 'This is the first description!',
          },
          whyMosts: [
            {
              _id: '2',
              answerSubject: 'This is the second subject!',
              answerDescription: 'This is the second description!',
              parentId: '1',
            },
          ],
        },
      },
    })
  },
}
