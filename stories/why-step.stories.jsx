import React, { useState, useEffect } from 'react'
import { userEvent, within, waitFor } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import WhyStep from '../app/components/why-step'
import expect from 'expect'
import { asyncSleep, onDoneDecorator, onDoneResult } from './common'

export default {
  component: WhyStep,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const createPointObj = (
  _id,
  subject,
  description = 'Point Description',
  groupedPoints = [],
  demInfo = {
    dob: '1990-10-20T00:00:00.000Z',
    state: 'NY',
    party: 'Independent',
  },
  parentId
) => {
  return {
    _id,
    subject,
    description,
    demInfo,
    parentId,
  }
}

const point1 = createPointObj('1', 'Point 1', 'Point 1 Description', [])
const point2 = createPointObj(
  '2',
  'Point 2',
  'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
  [],
  {
    dob: '1980-10-20T00:00:00.000Z',
    state: 'GA',
    party: 'Independent',
  }
)
const point3 = createPointObj(
  '3',
  'Point 3',
  'Point 3 Description',
  [],
  {
    dob: '1995-10-20T00:00:00.000Z',
    state: 'CA',
    party: 'Independent',
  },
  '1'
)
const point4 = createPointObj(
  '4',
  'Point 4',
  'Point 4 Description',
  [],
  {
    dob: '1998-10-20T00:00:00.000Z',
    state: 'CO',
    party: 'Independent',
  },
  '2'
)

const defaultSharedPoints = {
  mosts: [point1, point2],
  leasts: [point1, point2],
  whyMosts: [point3, point4],
  whyLeasts: [point3, point4],
}

export const mostPoints = {
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: { mosts: [point1, point2], whyMosts: [] },
  },
}

export const mostPointsWithDefault = {
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPoints,
  },
}

export const leastPoints = {
  args: {
    type: 'least',
    intro:
      "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPoints,
  },
}

export const mobileMostPoints = {
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPoints,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const mobileLeastPoints = {
  args: {
    type: 'least',
    intro:
      "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPoints,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const zeroPoints = {
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: { mosts: [], leasts: [], whyMosts: [], whyLeasts: [] },
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: [],
        },
      })
    )
  },
}

export const empty = {
  args: {},

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: [],
        },
      })
    )
  },
}

export const onDoneTest = {
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
    shared: {
      mosts: [point1, point2],
      leasts: [point3],
      whyMosts: [point1, point2],
      whyLeasts: [point3],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const subjectEle = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getAllByPlaceholderText(/description/i)

    // fill in the first point subject and description
    await userEvent.type(subjectEle[0], 'This is the first subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[0], 'This is the first description!')
    await userEvent.tab()

    // fill in the second point subject and description
    await userEvent.type(subjectEle[1], 'This is the second subject!')
    await userEvent.tab()
    await userEvent.type(descriptionEle[1], 'This is the second description!')
    await userEvent.tab()

    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 4,
        onDoneResult: {
          valid: true,
          value: [
            {
              subject: 'This is the first subject!',
              description: 'This is the first description!',
              parentId: '1',
            },
            {
              subject: 'This is the second subject!',
              description: 'This is the second description!',
              parentId: '2',
            },
          ],
        },
      })
    )
    // reset values so tests will run again next time
    onDoneTest.args.shared.whyMosts = [point1, point2]
    onDoneTest.args.shared.whyLeasts = [point3]
  },
}

export const asyncUpdate = {
  decorators: [
    (Story, context) => {
      const [updated, setUpdated] = useState(false)
      useEffect(() => {
        const subject0 = context.args.shared.whyMosts[0].subject
        const description0 = context.args.shared.whyMosts[0].description
        const subject1 = context.args.shared.whyMosts[1].subject
        const description1 = context.args.shared.whyMosts[1].description
        setTimeout(() => {
          console.info('updating')
          context.args.shared.whyMosts[0].subject = 'This is the first subject!'
          context.args.shared.whyMosts[0].description = 'This is the first description!'
          context.args.shared.whyMosts[1].subject = 'This is the second subject!'
          context.args.shared.whyMosts[1].description = 'This is the second description!'
          setUpdated(true)
          console.info('after updating')
        }, 1000)
        // resetting so the test will pass on retest
        setTimeout(() => {
          console.info('updating')
          context.args.shared.whyMosts[0].subject = subject0
          context.args.shared.whyMosts[0].description = description0
          context.args.shared.whyMosts[1].subject = subject1
          context.args.shared.whyMosts[1].description = description1
          setUpdated(true)
          console.info('after updating')
        }, 2000)
      }, [])
      return <Story thisTestIsDone={updated} />
    },
  ],
  args: {
    type: 'most',
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPoints,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: [
            {
              _id: '3',
              demInfo: { dob: '1995-10-20T00:00:00.000Z', party: 'Independent', state: 'CA' },
              description: 'Point 3 Description',
              parentId: '1',
              subject: 'Point 3',
            },
            {
              _id: '4',
              demInfo: { dob: '1998-10-20T00:00:00.000Z', party: 'Independent', state: 'CO' },
              description: 'Point 4 Description',
              parentId: '2',
              subject: 'Point 4',
            },
          ],
        },
      })
    )
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: true,
          value: [
            {
              _id: '3',
              subject: 'This is the first subject!',
              description: 'This is the first description!',
              parentId: '1',
            },
            {
              _id: '4',
              subject: 'This is the second subject!',
              description: 'This is the second description!',
              parentId: '2',
            },
          ],
        },
      })
    )
  },
}
