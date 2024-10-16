//https://github.com/EnCiv/civil-pursuit/issues/51
import RankStep from '../app/components/rank-step'
import React from 'react'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within } from '@storybook/test'
export default {
  component: RankStep,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [onDoneDecorator],
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
    _id,
    subject,
    description,
    groupedPoints,
    user,
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

async function clickSelections(points, selections) {
  for (let index = 0; index < points.length; index++) {
    await userEvent.click(within(points[index]).getByText(selections[index]))
  }
}

export const Empty = { args: {} }

export const emptyRank = {
  args: {
    pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    rankList: [],
  },
}

export const oneRankNeutral = {
  args: {
    pointList: [point1],
    rankList: [{ id: point1._id, rank: 'Neutral' }],
  },
}

export const sevenPointsWith3Ranked = {
  args: {
    pointList: [point1, point2, point3, point4, point5, point6, point7],
    rankList: [
      { id: point1._id, rank: 'Most' },
      { id: point2._id, rank: 'Most' },
      { id: point3._id, rank: 'Least' },
    ],
  },
}

export const threePoints = {
  args: {
    style: {},
    pointList: [point1, point2, point3],
    rankList: [
      { id: point1._id, rank: 'Most' },
      { id: point2._id, rank: 'Most' },
      { id: point3._id, rank: 'Least' },
    ],
  },
}

export const tenRanksCorrect = {
  args: {
    pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    rankList: [
      { id: point1._id, rank: 'Most' },
      { id: point2._id, rank: 'Most' },
      { id: point3._id, rank: 'Least' },
      { id: point4._id, rank: 'Neutral' },
      { id: point5._id, rank: 'Neutral' },
      { id: point6._id, rank: 'Neutral' },
      { id: point7._id, rank: 'Neutral' },
      { id: point8._id, rank: 'Neutral' },
      { id: point9._id, rank: 'Neutral' },
      { id: point10._id, rank: 'Neutral' },
    ],
  },
}

export const tenRanksTooManyMost = {
  args: {
    pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    rankList: [],
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
    pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    rankList: [],
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
    pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
    rankList: [],
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
    pointList: [
      point1,
      point2,
      point3,
      point4,
      point5,
      point6,
      point7,
      point8,
      point9,
      point10,
      point11,
      point12,
      point13,
    ],
    rankList: [
      { id: point1._id, rank: 'Most' },
      { id: point2._id, rank: 'Least' },
      { id: point3._id, rank: 'Least' },
      { id: point4._id, rank: 'Neutral' },
      { id: point5._id, rank: 'Neutral' },
      { id: point6._id, rank: 'Most' },
      { id: point7._id, rank: 'Most' },
      { id: point8._id, rank: 'Least' },
      { id: point9._id, rank: 'Neutral' },
      { id: point10._id, rank: 'Neutral' },
      { id: point11._id, rank: 'Neutral' },
      { id: point12._id, rank: 'Neutral' },
      { id: point13._id, rank: 'Neutral' },
    ],
  },
}
