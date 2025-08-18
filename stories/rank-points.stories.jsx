//https://github.com/EnCiv/civil-pursuit/issues/51

import { RankPoints } from '../app/components/steps/rank'
import React from 'react'
import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within, expect } from '@storybook/test'
import { reduce } from 'lodash'

const discussionId = '1101'
const round = 0

export default {
  component: RankPoints,
  args: { round, discussionId },
  decorators: [onDoneDecorator],
  parameters: {
    layout: 'fullscreen',
  },
}

const createPointObj = (
  _id,
  subject,
  description = 'Point Description',
  groupedPoints = [],
  user = {
    dob: '1990-10-20T00:00:00.000Z',
    state: 'NY',
    party: 'Independent',
  }
) => {
  return {
    point: {
      _id,
      subject,
      description,
      groupedPoints,
      user,
    },
  }
}

const point1 = createPointObj('1', 'Point 1', 'Point 1 Description')
const point2 = createPointObj('2', 'Point 2', 'Point 2 Description')
const point3 = createPointObj('3', 'Point 3', 'Point 3 Description')
const point4 = createPointObj('4', 'Point 4', 'Point 4 Description')
const point5 = createPointObj('5', 'Point 5', 'Point 5 Description')
const point6 = createPointObj('6', 'Point 6', 'Point 6 Description')
const point7 = createPointObj('7', 'Point 7', 'Point 7 Description')
const point8 = createPointObj('8', 'Point 8', 'Point 8 Description')
const point9 = createPointObj('9', 'Point 9', 'Point 9 Description')
const point10 = createPointObj('10', 'Point 10', 'Point 10 Description')
const point11 = createPointObj('11', 'Point 11', 'Point 11 Description')
const point12 = createPointObj('12', 'Point 12', 'Point 12 Description')
const point13 = createPointObj('13', 'Point 13', 'Point 13 Description')

function createRank(category, parentId = '200') {
  return {
    _id: '100',
    stage: 'pre',
    category: category.toLowerCase(),
    parentId,
    discussionId,
    round: 0,
  }
}

async function clickSelections(points, selections) {
  for (let index = 0; index < points.length; index++) {
    await userEvent.click(within(points[index]).getByText(selections[index]))
  }
}

export const Empty = { args: {} }

export const emptyRank = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    preRankByParentId: {},
  },
}

export const oneRankNeutral = {
  args: {
    reducedPointList: [point1],
    preRankByParentId: { [point1.point._id]: createRank('Neutral', point1.point._id) },
  },
}

export const sevenPointsWith3Ranked = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Most', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
    },
  },
}

export const threePoints = {
  args: {
    style: {},
    reducedPointList: [point1, point2, point3],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Neutral', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
    },
  },
}

const tenRankPoints = [
  { ...point1, rank: createRank('Most') },
  { ...point2, rank: createRank('Most') },
  { ...point3, rank: createRank('Least') },
  { ...point4, rank: createRank('Neutral') },
  { ...point5, rank: createRank('Neutral') },
  { ...point6, rank: createRank('Neutral') },
  { ...point7, rank: createRank('Neutral') },
  { ...point8, rank: createRank('Neutral') },
  { ...point9, rank: createRank('Neutral') },
  { ...point10, rank: createRank('Neutral') },
]

export const tenRanksCorrect = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Most', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
      [point4.point._id]: createRank('Neutral', point4.point._id),
      [point5.point._id]: createRank('Neutral', point5.point._id),
      [point6.point._id]: createRank('Neutral', point6.point._id),
      [point7.point._id]: createRank('Neutral', point7.point._id),
      [point8.point._id]: createRank('Neutral', point8.point._id),
      [point9.point._id]: createRank('Neutral', point9.point._id),
      [point10.point._id]: createRank('Neutral', point10.point._id),
    },
  },
}

export const tenRanksTooManyMost = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Most', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
      [point4.point._id]: createRank('Neutral', point4.point._id),
      [point5.point._id]: createRank('Neutral', point5.point._id),
      [point6.point._id]: createRank('Neutral', point6.point._id),
      [point7.point._id]: createRank('Neutral', point7.point._id),
      [point8.point._id]: createRank('Neutral', point8.point._id),
      [point9.point._id]: createRank('Neutral', point9.point._id),
      [point10.point._id]: createRank('Most', point10.point._id),
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    expect(onDone.mock.calls[0][0]).toMatchObject({
      valid: false,
      value: 1,
    })
    const point10Heading = await canvas.findByRole('heading', { level: 2, name: 'Point 10' })
    const point10Div = point10Heading.closest('div')
    await userEvent.click(within(point10Div).getByText('Neutral'))

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: {
        valid: true,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'neutral',
          parentId: '10',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const tenRanksTooManyLeast = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Most', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
      [point4.point._id]: createRank('Neutral', point4.point._id),
      [point5.point._id]: createRank('Neutral', point5.point._id),
      [point6.point._id]: createRank('Neutral', point6.point._id),
      [point7.point._id]: createRank('Neutral', point7.point._id),
      [point8.point._id]: createRank('Neutral', point8.point._id),
      [point9.point._id]: createRank('Neutral', point9.point._id),
      [point10.point._id]: createRank('Neutral', point10.point._id),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, ['Most', 'Most', 'Least', 'Least', 'Neutral', 'Neutral', 'Neutral', 'Neutral', 'Neutral', 'Neutral'])

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: {
        valid: false,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'least',
          parentId: '4',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const tenRanksTooManyMostAndLeast = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    preRankByParentId: {
      [point1.point._id]: createRank('Most', point1.point._id),
      [point2.point._id]: createRank('Most', point2.point._id),
      [point3.point._id]: createRank('Least', point3.point._id),
      [point4.point._id]: createRank('Neutral', point4.point._id),
      [point5.point._id]: createRank('Neutral', point5.point._id),
      [point6.point._id]: createRank('Neutral', point6.point._id),
      [point7.point._id]: createRank('Neutral', point7.point._id),
      [point8.point._id]: createRank('Neutral', point8.point._id),
      [point9.point._id]: createRank('Neutral', point9.point._id),
      [point10.point._id]: createRank('Neutral', point10.point._id),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, ['Most', 'Least', 'Least', 'Most', 'Neutral', 'Neutral', 'Most', 'Least', 'Neutral', 'Neutral'])

    expect(onDoneResult(canvas)).toMatchObject({
      count: 5,
      onDoneResult: {
        valid: false,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'least',
          parentId: '8',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const numRanksNotInLookup = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10, point11, point12, point13],
  },
}
