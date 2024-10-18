// https://github.com/EnCiv/civil-pursuit/issues/58

import React from 'react'
import ReviewPoint from '../app/components/review-point'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent, expect } from '@storybook/test'

export default {
  component: ReviewPoint,
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const point0 = {
  _id: '0',
  subject: 'Inequality',
  description: 'Inequality can hinder economic growth and stability',
}

const point1 = {
  _id: '1',
  subject: 'Equality is a human right',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point2 = {
  _id: '2',
  subject: 'Income equality reduction',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

const point3 = {
  _id: '3',
  subject: 'Separation of wealth',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point4 = {
  _id: '4',
  subject: 'Not a crucial issue',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point5 = {
  _id: '5',
  subject: 'Poverty',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point6 = {
  _id: '6',
  subject: 'Poverty increasing with time',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
}

export const Mobile = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const WithDefaultRank = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
    rank: 'Neutral',
  },
}

export const ReviewOnDone = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTitle('open'))
    await userEvent.click(canvas.getByText('Expand Chart'))
    await userEvent.click(canvas.getByText('Collapse Chart'))
    await userEvent.click(canvas.getByText('Most'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        value: 'Most',
      },
    })
  },
}
