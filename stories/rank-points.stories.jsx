//https://github.com/EnCiv/civil-pursuit/issues/51

import { RankPoints } from '../app/components/steps/rank'
import React from 'react'
import { onDoneDecorator } from './common'
import { userEvent, within, expect, waitFor } from 'storybook/test'
import { reduce } from 'lodash'

const discussionId = '1101'
const round = 0

export default {
  component: RankPoints,
  args: { round, discussionId },
  decorators: [onDoneDecorator],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
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

const point1 = createPointObj('1', 'Build safer crossings near schools', 'Raised crosswalks and slower traffic can protect students on their daily walk.')
const point2 = createPointObj('2', 'Run buses more often after work', 'Frequent evening trips help shift workers get home without a car.')
const point3 = createPointObj('3', 'Make childcare more affordable', 'More local childcare slots let parents work while children receive consistent care.')
const point4 = createPointObj('4', 'Repair sidewalks before winter', 'Smooth, accessible sidewalks help people travel safely in every season.')
const point5 = createPointObj('5', 'Protect mature neighborhood trees', 'Healthy trees cool streets and provide shade during hotter summers.')
const point6 = createPointObj('6', 'Keep libraries open later', 'Evening hours make study spaces and public computers available to more residents.')
const point7 = createPointObj('7', 'Expand local mental health services', 'Nearby counseling can reduce wait times and make support easier to reach.')
const point8 = createPointObj('8', 'Test drinking water more often', 'Regular testing helps identify contamination before it affects households.')
const point9 = createPointObj('9', 'Add shade to public parks', 'Trees and covered seating make parks more usable on hot days.')
const point10 = createPointObj('10', 'Support neighborhood small businesses', 'Affordable storefronts help local shops stay open and keep jobs nearby.')
const point11 = createPointObj('11', 'Create accessible playgrounds', 'Inclusive equipment gives children with different abilities more ways to play together.')
const point12 = createPointObj('12', 'Donate surplus food locally', 'Food recovery programs can redirect good groceries to families facing shortages.')
const point13 = createPointObj('13', 'Offer training for new careers', 'Practical job programs help adults build skills for growing local industries.')

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
      [point3.point._id]: createRank('Neutral', point3.point._id),
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({
        valid: true,
        value: 1,
      })
    })
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
    await waitFor(() => {
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: 1,
      })
    })
    const point10Heading = await canvas.findByRole('heading', { level: 2, name: 'Support neighborhood small businesses' })
    const point10Div = point10Heading.closest('div')
    await userEvent.click(within(point10Div).getByText('Neutral'))
    await waitFor(() => {
      expect(args.onDone.mock.calls[1][0]).toMatchObject({
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
      })
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, ['Most', 'Most', 'Least', 'Least', 'Neutral', 'Neutral', 'Neutral', 'Neutral', 'Neutral', 'Neutral'])

    expect(args.onDone.mock.calls[1][0]).toMatchObject({
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const points = await canvas.findAllByTestId('point')

    await clickSelections(points, ['Most', 'Least', 'Least', 'Most', 'Neutral', 'Neutral', 'Most', 'Least', 'Neutral', 'Neutral'])

    expect(args.onDone.mock.calls[4][0]).toMatchObject({
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
    })
  },
}

export const numRanksNotInLookup = {
  args: {
    reducedPointList: [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10, point11, point12, point13],
  },
}
