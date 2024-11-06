import PairCompare from '../app/components/pair-compare'
import { onDoneDecorator, onDoneResult, asyncSleep } from './common'
import { within, userEvent, waitFor } from '@storybook/test'
import expect from 'expect'
import React from 'react'

export default {
  component: PairCompare,
  args: {},
  decorators: [onDoneDecorator],
}

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
    whyRankList: [whyRankList[0]],
  },
}

export const onePointRanked = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [rankedWhyRankList[0]],
  },
}
export const twoPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0], whyRankList[1]],
  },
}

export const threePoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0], whyRankList[1], whyRankList[2]],
  },
}
export const onDoneTest = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0], whyRankList[1], whyRankList[2], whyRankList[3]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Point1 = canvas.getByText('Point 1')
    await userEvent.click(Point1)
    await asyncSleep(500)
    const Point3 = canvas.getByText('Point 3')
    await userEvent.click(Point3)
    await asyncSleep(500)
    const Point4 = canvas.getByText('Point 4')
    await userEvent.click(Point4)
    waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 3,
        onDoneResult: {
          valid: true,
          value: {
            // _id will be auto generated
            category: 'most',
            parentId: '4',
            stage: 'why',
          },
        },
      })
    })
  },
}
