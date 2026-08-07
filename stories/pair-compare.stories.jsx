import PairCompare from '../app/components/pair-compare'
import { onDoneDecorator } from './common'
import { expect, within, userEvent, waitFor } from 'storybook/test'
import React, { useState } from 'react'

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

export const onePointCanBeUsefulStartOverNotUseful = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0]],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const Useful = canvas.getByText('Useful')
    await userEvent.click(Useful)
    await waitFor(() => {
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: true,
        value: {
          // _id will be auto generated
          category: 'most',
          parentId: '1',
          stage: 'why',
        },
      })
    })
    const StartOver = canvas.getByText('Start Over')
    await userEvent.click(StartOver)
    await waitFor(() => {
      expect(args.onDone.mock.calls[1][0]).toMatchObject({
        valid: false,
        value: null,
      })
    })
    const NotUseful = canvas.getByText('Not useful')
    await userEvent.click(NotUseful)
    await waitFor(() => {
      expect(args.onDone.mock.calls[2][0]).toMatchObject({
        valid: true,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '1',
          stage: 'why',
        },
      })
    })
  },
}

export const onePointRankedGetsOnDone = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [rankedWhyRankList[0]],
  },
  play: async ({ canvasElement, args }) => {
    await waitFor(() => {
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: true,
      })
    })
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

export const UserChoosesNoPoint = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0], whyRankList[1], whyRankList[2]],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const Neither = canvas.getByText('Neither')
    // don't await users event so not to miss the onDone calls from the same event
    userEvent.click(Neither)
    await waitFor(() => {
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '1',
          stage: 'why',
        },
      })
    })
    await waitFor(() => {
      expect(args.onDone.mock.calls[1][0]).toMatchObject({
        valid: false,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '2',
          stage: 'why',
        },
      })
    })
    const NotUseful = canvas.getByText('Not useful')
    await userEvent.click(NotUseful)
    await waitFor(() => {
      expect(args.onDone.mock.calls[2][0]).toMatchObject({
        valid: true,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '3',
          stage: 'why',
        },
      })
    })
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const Point1 = await waitFor(() => canvas.getByText('Point 1'))
    await userEvent.click(Point1)
    await waitFor(() => {
      const calls = args.onDone.mock.calls
      if (!calls[0]) throw new Error(`[after click Point1] onDone.calls[0] undefined — total calls: ${calls.length}`)
      expect(calls[0][0]).toMatchObject({
        valid: false,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '2',
          stage: 'why',
        },
      })
    })
    // Wait for Point 3 to be in the visible clickable button (not the disabled hidden
    // transition container). asyncSleep(500) races with the component's own 500ms
    // transition timer; getByTitle only matches the <button title="Choose as more
    // important: Point 3"> which only renders when idxRight=2 is committed.
    const Point3 = await waitFor(() => canvas.getByTitle('Choose as more important: Point 3'))
    await userEvent.click(Point3)
    await waitFor(() => {
      const calls = args.onDone.mock.calls
      if (!calls[1]) throw new Error(`[after click Point3] onDone.calls[1] undefined — total calls: ${calls.length}, calls[0]: ${JSON.stringify(calls[0])}`)
      expect(calls[1][0]).toMatchObject({
        valid: false,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '1',
          stage: 'why',
        },
      })
    })
    // Same: wait for Point 4 to be in the clickable button position
    const Point4 = await waitFor(() => canvas.getByTitle('Choose as more important: Point 4'))
    /* don't await - there are two onDone updates in succession and if we await the user event we miss the first one */
    userEvent.click(Point4)
    await waitFor(() => {
      const calls = args.onDone.mock.calls
      if (!calls[2]) throw new Error(`[after click Point4] onDone.calls[2] undefined — total calls: ${calls.length}`)
      expect(calls[2][0]).toMatchObject({
        valid: false,
        value: {
          // _id will be auto generated
          category: 'neutral',
          parentId: '3',
          stage: 'why',
        },
      })
    })
    await waitFor(() => {
      const calls = args.onDone.mock.calls
      if (!calls[3]) throw new Error(`[after click Point4, waiting for call 3] onDone.calls[3] undefined — total calls: ${calls.length}`)
      expect(calls[3][0]).toMatchObject({
        valid: true,
        value: {
          // _id will be auto generated
          category: 'most',
          parentId: '4',
          stage: 'why',
        },
      })
    })
  },
}

export const OnePointRankedInitially = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [rankedWhyRankList[0]],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      canvas.getByText('Start Over')
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: true,
      })
    })
  },
}

export const OnePointRankedAfterFirstRendered = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    whyRankList: [whyRankList[0]],
  },
  decorators: [
    (Story, context) => {
      const [updated, setUpdated] = useState(false)
      // after it's rendered without a rank, add the rank - as if fetched from the db
      setTimeout(() => {
        context.args.whyRankList[0].rank = { _id: '11', parentId: '1', stage: 'why', category: 'most' }
        context.args.whyRankList = [...context.args.whyRankList] // make it different to force it to rerender
        setUpdated(true)
      }, 100)
      return <Story />
    },
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      canvas.getByText('Start Over')
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: true,
      })
    })
  },
}
