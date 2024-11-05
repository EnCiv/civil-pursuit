import PairCompare from '../app/components/pair-compare'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/test'
import expect from 'expect'
import React from 'react'

export default {
  component: PairCompare,
  args: {},
  decorators: [onDoneDecorator],
}

const pointOne = { _id: '1', subject: 'Point 1', description: 'This is the first point' }
const pointTwo = { _id: '2', subject: 'Point 2', description: 'This is the second point' }
const pointThree = { _id: '3', subject: 'Point 3', description: 'This is the third point' }
const pointFour = { _id: '4', subject: 'Point 4', description: 'This is the fourth point' }
const pointFive = { _id: '5', subject: 'Point 5', description: 'This is the fifth point' }
const pointSix = { _id: '6', subject: 'Point 6', description: 'This is the sixth point' }

const whyRankList = [
  { why: { _id: '1', subject: 'Point 1', description: 'This is the first point' } },
  { why: { _id: '2', subject: 'Point 2', description: 'This is the second point' } },
  { why: { _id: '3', subject: 'Point 3', description: 'This is the third point' } },
  { why: { _id: '4', subject: 'Point 4', description: 'This is the fourth point' } },
  { why: { _id: '5', subject: 'Point 5', description: 'This is the fifth point' } },
  { why: { _id: '6', subject: 'Point 6', description: 'This is the sixth point' } },
]

const rankedWhyRankList = [
  { why: { _id: '1', subject: 'Point 1', description: 'This is the first point' }, rank: { _id: '11', parentId: '1', stage: 'why', category: 'most' } },
  { why: { _id: '2', subject: 'Point 2', description: 'This is the second point' }, rank: { _id: '12', parentId: '2', stage: 'why', category: 'neutral' } },
  { why: { _id: '3', subject: 'Point 3', description: 'This is the third point' }, rank: { _id: '13', parentId: '3', stage: 'why', category: 'neutral' } },
  { why: { _id: '4', subject: 'Point 4', description: 'This is the fourth point' }, rank: { _id: '14', parentId: '4', stage: 'why', category: 'neutral' } },
  { why: { _id: '5', subject: 'Point 5', description: 'This is the fifth point' }, rank: { _id: '15', parentId: '5', stage: 'why', category: 'neutral' } },
  { why: { _id: '6', subject: 'Point 6', description: 'This is the sixth point' }, rank: { _id: '16', parentId: '6', stage: 'why', category: 'neutral' } },
]
export const sixPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList,
  },
}

export const sixPointsRanked = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: rankedWhyRankList,
  },
}

export const empty = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
  },
  pointList: [],
}

export const onePoint = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne],
  },
}

export const twoPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne, pointTwo],
  },
}

export const onDoneTest = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne, pointTwo, pointThree, pointFour],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Point1 = canvas.getByText('Point 1')
    await userEvent.click(Point1)

    setTimeout(() => {
      // wait for transition to occur
      const Point3 = canvas.getByText('Point 3')
      userEvent.click(Point3)
    }, 500)

    setTimeout(() => {
      const Point4 = canvas.getByText('Point 4')
      userEvent.click(Point4)
    }, 1300)

    setTimeout(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: {
            description: 'This is the fourth point',
            subject: 'Point 4',
          },
        },
      })
    }, 1500)
  },
}
