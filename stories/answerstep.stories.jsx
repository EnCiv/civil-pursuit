// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import AnswerStep from '../app/components/answerstep'
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

const createPointObj = (_id, parentId, groupedPoints = []) => {
  return {
    _id,
    parentId,
  }
}

const point1 = createPointObj('1', '1', [])
const point2 = createPointObj('2', '1', [])
const point3 = createPointObj('3', '1', [])
const point4 = createPointObj('4', '1', [])

const defaultPoints = { startingPoint: {}, whyMosts: [point1] }
const morePoints = { startingPoint: {}, whyMosts: [point1, point2, point3, point4] }

export const Empty = {
  args: { question: '', whyQuestion: '' },
}

export const Default = {
  args: {
    question: "What one issue should 'We the People' unite and solve first to make our country even better?",
    whyQuestion: 'Why should everyone consider solving this issue?',
    shared: defaultPoints,
  },
}

export const MorePoints = {
  args: {
    question: "What one issue should 'We the People' unite and solve first to make our country even better?",
    whyQuestion: 'Why should everyone consider solving this issue?',
    shared: morePoints,
  },
}

export const onDoneTest1 = {
  args: {
    question: "What one issue should 'We the People' unite and solve first to make our country even better?",
    whyQuestion: 'Why should everyone consider solving this issue?',
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
      count: 5,
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
              _id: '1',
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

export const onDoneTest2 = {
  args: {
    question: "What one issue should 'We the People' unite and solve first to make our country even better?",
    whyQuestion: 'Why should everyone consider solving this issue?',
    shared: defaultPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)
    await userEvent.type(subjectEle[0], 'This is the subject!')
    await userEvent.tab() // onDone will be called after moving out of input field

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: false,
        value: {
          startingPoint: {
            _id: '1',
            answerSubject: 'This is the first subject!',
            answerDescription: '',
          },
          whyMosts: [
            {
              _id: '1',
              answerSubject: '',
              answerDescription: '',
              parentId: '1',
            },
          ],
        },
      },
    })

    await userEvent.type(descriptionEle, 'This is the description!')
    await userEvent.tab() // onDone will be called after moving out of input field

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: {
        valid: true,
        value: {
          subject: 'This is the subject!',
          description: 'This is the description!',
        },
      },
    })
  },
}
