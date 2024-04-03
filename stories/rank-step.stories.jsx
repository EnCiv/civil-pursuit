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

export const emptyRank = Template(RankStep).bind({})
emptyRank.args = {
  style: {},
  onDone: null,
  pointList: [
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
  ],
}

export const tenRanks = Template(RankStep).bind({})
tenRanks.args = {
  style: {},
  onDone: null,
  pointList: [
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
    <Point />,
  ],
  rankList: [
    { id: 1, rank: 'Most' },
    { id: 2, rank: 'Most' },
    { id: 3, rank: 'Least' },
    { id: 4, rank: 'Neutral' },
    { id: 5, rank: 'Neutral' },
    { id: 6, rank: 'Neutral' },
    { id: 7, rank: 'Neutral' },
    { id: 8, rank: 'Neutral' },
    { id: 9, rank: 'Neutral' },
    { id: 10, rank: 'Neutral' },
  ],
}
export const sevenPoints = Template(RankStep).bind({})
sevenPoints.args = {
  style: {},
  onDone: null,
  pointList: [<Point />, <Point />, <Point />, <Point />, <Point />, <Point />, <Point />],
  rankList: [
    { id: 1, rank: 'Most' },
    { id: 2, rank: 'Most' },
    { id: 3, rank: 'Least' },
    { id: 4, rank: 'Neutral' },
    { id: 5, rank: 'Neutral' },
    { id: 6, rank: 'Neutral' },
    { id: 7, rank: 'Neutral' },
  ],
}

export const threePoints = Template(RankStep).bind({})
threePoints.args = {
  style: {},
  onDone: null,
  pointList: [<Point />, <Point />, <Point />],
  rankList: [
    { id: 1, rank: 'Most' },
    { id: 2, rank: 'Least' },
    { id: 3, rank: 'Neutral' },
  ],
}
