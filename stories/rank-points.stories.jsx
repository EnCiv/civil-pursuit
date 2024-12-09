//https://github.com/EnCiv/civil-pursuit/issues/51

import { RankPoints } from '../app/components/steps/rank'
import React from 'react'
import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within, expect } from '@storybook/test'

const discussionId = '1101'

export default {
  component: RankPoints,
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

function createRank(category) {
  return {
    _id: '100',
    stage: 'pre',
    category: category,
    parentId: '200',
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
    pointRankGroupList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
  },
}

export const oneRankNeutral = {
  args: {
    pointRankGroupList: [{ ...point1, rank: createRank('Neutral') }],
  },
}

export const sevenPointsWith3Ranked = {
  args: {
    pointRankGroupList: [
      { ...point1, rank: createRank('Most') },
      { ...point2, rank: createRank('Most') },
      { ...point3, rank: createRank('Least') },
      point4,
      point5,
      point6,
      point7,
    ],
  },
}

export const threePoints = {
  args: {
    style: {},
    pointRankGroupList: [
      { ...point1, rank: createRank('Most') },
      { ...point2, rank: createRank('Neutral') },
      { ...point3, rank: createRank('Least') },
    ],
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
    pointRankGroupList: tenRankPoints,
  },
}

export const tenRanksTooManyMost = {
  args: {
    pointRankGroupList: tenRankPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, [
      'Most',
      'Neutral',
      'Most',
      'Most',
      'Least',
      'Neutral',
      'Neutral',
      'Neutral',
      'Neutral',
      'Neutral',
    ])
    expect(onDoneResult(canvas)).toMatchObject({
      count: 5,
      onDoneResult: {
        valid: false,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'neutral',
          parentId: '200',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const tenRanksTooManyLeast = {
  args: {
    pointRankGroupList: tenRankPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, [
      'Most',
      'Least',
      'Least',
      'Most',
      'Neutral',
      'Neutral',
      'Neutral',
      'Neutral',
      'Neutral',
      'Neutral',
    ])

    expect(onDoneResult(canvas)).toMatchObject({
      count: 13,
      onDoneResult: {
        valid: false,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'neutral',
          parentId: '200',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const tenRanksTooManyMostAndLeast = {
  args: {
    pointRankGroupList: tenRankPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, [
      'Most',
      'Least',
      'Least',
      'Most',
      'Neutral',
      'Neutral',
      'Most',
      'Least',
      'Neutral',
      'Neutral',
    ])

    expect(onDoneResult(canvas)).toMatchObject({
      count: 13,
      onDoneResult: {
        valid: false,
        value: 1,
        delta: {
          _id: '100',
          stage: 'pre',
          category: 'neutral',
          parentId: '200',
          discussionId: '1101',
          round: 0,
        },
      },
    })
  },
}

export const numRanksNotInLookup = {
  args: {
    pointRankGroupList: [
      { ...point1, rank: createRank('Most') },
      { ...point2, rank: createRank('Least') },
      { ...point3, rank: createRank('Least') },
      { ...point4, rank: createRank('Neutral') },
      { ...point5, rank: createRank('Neutral') },
      { ...point6, rank: createRank('Most') },
      { ...point7, rank: createRank('Most') },
      { ...point8, rank: createRank('Least') },
      { ...point9, rank: createRank('Neutral') },
      { ...point10, rank: createRank('Neutral') },
      { ...point11, rank: createRank('Neutral') },
      { ...point12, rank: createRank('Neutral') },
      { ...point13, rank: createRank('Neutral') },
    ],
  },
}
