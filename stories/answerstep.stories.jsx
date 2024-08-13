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

const createPointObj = (_id, description = 'Point Description', groupedPoints = []) => {
  return {
    _id,
    description,
  }
}

const point1 = createPointObj(
  '1',
  "What one issue should 'We the People' unite and solve first to make our country even better?",
  []
)
const point2 = createPointObj('2', 'Why should everyone consider solving this issue?', [])

const defaultPoints = { startingPoint: [point1], whyMosts: [point2] }

export const Empty = {
  args: {},
}

export const Default = {
  args: {
    question: "What one issue should 'We the People' unite and solve first to make our country even better?",
    whyQuestion: 'Why should everyone consider solving this issue?',
  },
}
