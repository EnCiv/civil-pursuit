// https://github.com/EnCiv/civil-pursuit/issue/247
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
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
  },
  pointList: [],
}

export const onePointCanBeYesStartOverNo = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
    whyRankList: [whyRankList[0]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Yes = canvas.getByText('Yes')
    await userEvent.click(Yes)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: {
            // _id will be auto generated
            category: 'most',
            parentId: '1',
            stage: 'why',
          },
        },
      })
    })
    const StartOver = canvas.getByText('Start Over')
    await userEvent.click(StartOver)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: null,
        },
      })
    })
    const No = canvas.getByText('No')
    await userEvent.click(No)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 3,
        onDoneResult: {
          valid: true,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '1',
            stage: 'why',
          },
        },
      })
    })
  },
}

export const onePointRankedGetsOnDone = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
    whyRankList: [rankedWhyRankList[0]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
        },
      })
    })
  },
}
export const twoPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
    whyRankList: [whyRankList[0], whyRankList[1]],
  },
}

export const UserChoosesNoPoint = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
    whyRankList: [whyRankList[0], whyRankList[1], whyRankList[2]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Neither = canvas.getByText('Neither')
    // don't await users event so not to miss the onDone calls from the same event
    userEvent.click(Neither)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: false,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '1',
            stage: 'why',
          },
        },
      })
    })
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '2',
            stage: 'why',
          },
        },
      })
    })
    const No = canvas.getByText('No')
    await userEvent.click(No)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 3,
        onDoneResult: {
          valid: true,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '3',
            stage: 'why',
          },
        },
      })
    })
  },
}

export const onDoneTest = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: (
        <div style={{ lineHeight: '3em' }}>
          Climate change and global warming
          <div style={{ height: '2em' }}></div>
        </div>
      ),
    },
    whyRankList: [whyRankList[0], whyRankList[1], whyRankList[2], whyRankList[3]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Point1 = canvas.getByText('Point 1')
    await userEvent.click(Point1)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: false,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '2',
            stage: 'why',
          },
        },
      })
    })
    await asyncSleep(500)
    const Point3 = canvas.getByText('Point 3')
    await userEvent.click(Point3)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '1',
            stage: 'why',
          },
        },
      })
    })
    await asyncSleep(500)
    const Point4 = canvas.getByText('Point 4')
    /* don't await - there are two onDone updates in succession and if we await the user event we miss the first one */
    userEvent.click(Point4)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 3,
        onDoneResult: {
          valid: false,
          value: {
            // _id will be auto generated
            category: 'neutral',
            parentId: '3',
            stage: 'why',
          },
        },
      })
    })
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 4,
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
