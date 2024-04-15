//https://github.com/EnCiv/civil-pursuit/issues/51
import RankStep from '../app/components/rank-step'
import React from 'react'
import expect from 'expect'

import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within } from '@storybook/testing-library'
import Point from '../app/components/point'
export default {
  component: RankStep,
  parameters: {
    layout: 'fullscreen',
  },
}
const Template = Component => args => <Component {...args} />

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

export const emptyRank = Template(RankStep).bind({})
emptyRank.args = {
  style: {},
  onDone: null,
  pointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10],
}

export const tenRanks = Template(RankStep).bind({})
tenRanks.args = {
  style: {},
  onDone: null,
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
}
export const sevenPoints = Template(RankStep).bind({})
sevenPoints.args = {
  style: {},
  onDone: null,
  pointList: [point1, point2, point3, point4, point5, point6, point7],
  rankList: [
    { id: point1._id, rank: 'Most' },
    { id: point2._id, rank: 'Most' },
    { id: point3._id, rank: 'Least' },
    { id: point4._id, rank: 'Neutral' },
    { id: point5._id, rank: 'Neutral' },
    { id: point6._id, rank: 'Neutral' },
    { id: point7._id, rank: 'Neutral' },
  ],
}

export const threePoints = Template(RankStep).bind({})
threePoints.args = {
  style: {},
  onDone: null,
  pointList: [point1, point2, point3],
  rankList: [
    { id: point1._id, rank: 'Most' },
    { id: point2._id, rank: 'Most' },
    { id: point3._id, rank: 'Least' },
  ],
}
