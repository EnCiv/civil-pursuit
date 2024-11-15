//https://github.com/EnCiv/civil-pursuit/issues/51
import { RankPoints } from '../app/components/steps/rank'
import React from 'react'
import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within } from '@storybook/test'

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
    pointRankGroupList: [{ ...point1, rank: createRank('neutral') }],
  },
}

export const sevenPointsWith3Ranked = {
  args: {
    pointRankGroupList: [
      { ...point1, rank: createRank('most') },
      { ...point2, rank: createRank('most') },
      { ...point3, rank: createRank('least') },
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
      { ...point1, rank: createRank('most') },
      { ...point2, rank: createRank('neutral') },
      { ...point3, rank: createRank('least') },
    ],
  },
}

const tenRankPoints = [
  { ...point1, rank: createRank('most') },
  { ...point2, rank: createRank('most') },
  { ...point3, rank: createRank('least') },
  { ...point4, rank: createRank('neutral') },
  { ...point5, rank: createRank('neutral') },
  { ...point6, rank: createRank('neutral') },
  { ...point7, rank: createRank('neutral') },
  { ...point8, rank: createRank('neutral') },
  { ...point9, rank: createRank('neutral') },
  { ...point10, rank: createRank('neutral') },
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
      count: expect.any(Number),
      onDoneResult: [false, 1],
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
      count: expect.any(Number),
      onDoneResult: [false, 1],
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
      count: expect.any(Number),
      onDoneResult: [false, 1],
    })
  },
}

export const numRanksNotInLookup = {
  args: {
    pointRankGroupList: [
      { ...point1, rank: createRank('most') },
      { ...point2, rank: createRank('least') },
      { ...point3, rank: createRank('least') },
      { ...point4, rank: createRank('neutral') },
      { ...point5, rank: createRank('neutral') },
      { ...point6, rank: createRank('most') },
      { ...point7, rank: createRank('most') },
      { ...point8, rank: createRank('least') },
      { ...point9, rank: createRank('neutral') },
      { ...point10, rank: createRank('neutral') },
      { ...point11, rank: createRank('neutral') },
      { ...point12, rank: createRank('neutral') },
      { ...point13, rank: createRank('neutral') },
    ],
  },
}
