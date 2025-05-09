// https://github.com/EnCiv/civil-pursuit/issues/198

import React, { useContext, useState } from 'react'
import GroupingStep, { GroupPoints } from '../app/components/steps/grouping'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const discussionId = '1101'
const round = 0

export default {
  component: GroupPoints,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
  decorators: [onDoneDecorator],
}

const createPointDoc = (
  _id,
  subject,
  description = 'Point Description',
  demInfo = {
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
      demInfo,
    },
    group: [],
  }
}

const pointItems = Array.from({ length: 10 }, (_, index) => createPointDoc(index, 'Point ' + index, 'Point Description ' + index))

function groupingPointsToContext(groupingPoints) {
  const cn = {
    ...groupingPoints.reduce(
      (cn, gp) => {
        // context, reviewPoint
        cn.pointById[gp.point._id] = gp.point
        return cn
      },
      { pointById: {}, groupIdsLists: [] }
    ),
  }
  return cn
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reducedPointList: pointItems,
  },
}

export const Mobile = {
  args: {
    reducedPointList: pointItems,

    onDone: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const canCreateGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const point1 = canvas.getByText('Point 1')
    await userEvent.click(point1)
    const point2 = canvas.getByText('Point 2')
    await userEvent.click(point2)
    const CreateGroup = canvas.getByText('Create Group')
    await userEvent.click(CreateGroup)
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: false,
        value: {},
      },
    })
    const selectAsLead = canvas.getByTitle('Select as Lead: Point 1')
    await userEvent.click(selectAsLead)
    await userEvent.click(canvas.getByTitle('Done'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}
export const canUnGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByTitle('Ungroup'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        value: [
          {
            point: {
              _id: 0,
              subject: 'Point 0',
              description: 'Point Description 0',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 3,
              subject: 'Point 3',
              description: 'Point Description 3',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 4,
              subject: 'Point 4',
              description: 'Point Description 4',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 5,
              subject: 'Point 5',
              description: 'Point Description 5',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 6,
              subject: 'Point 6',
              description: 'Point Description 6',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 7,
              subject: 'Point 7',
              description: 'Point Description 7',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 8,
              subject: 'Point 8',
              description: 'Point Description 8',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 9,
              subject: 'Point 9',
              description: 'Point Description 9',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 2,
              subject: 'Point 2',
              description: 'Point Description 2',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
        ],
      },
    })
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the pointList doesn't go back to it's initial state
export const canCreateGroupWithAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByText('Point 3'))
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 3,
                subject: 'Point 3',
                description: 'Point Description 3',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the groupPoints doesn't go back to it's initial state
export const canRemoveOnePointFromAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByText('Point 3'))
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByTitle('Edit'))
    await userEvent.click(canvas.getByTitle('Remove from Group: Point 2'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        value: [
          { point: { _id: 0, subject: 'Point 0', description: 'Point Description 0', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 4, subject: 'Point 4', description: 'Point Description 4', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 5, subject: 'Point 5', description: 'Point Description 5', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 6, subject: 'Point 6', description: 'Point Description 6', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 7, subject: 'Point 7', description: 'Point Description 7', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 8, subject: 'Point 8', description: 'Point Description 8', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 9, subject: 'Point 9', description: 'Point Description 9', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 2, subject: 'Point 2', description: 'Point Description 2', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          {
            point: { _id: 1, subject: 'Point 1', description: 'Point Description 1', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } },
            group: [
              { _id: 3, subject: 'Point 3', description: 'Point Description 3', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } },
              { _id: 2, subject: 'Point 2', description: 'Point Description 2', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } },
            ],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}

function getGroupingArgsFrom(groupingPoints) {
  const cn = groupingPointsToContext(groupingPoints)
  const { pointById, ...defaultValue } = { ...cn, round, discussionId }
  return { pointById, defaultValue }
}

const groupingPoints = [
  {
    point: {
      _id: 0,
      subject: 'Point 0',
      description: 'Point Description 0',
      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
  {
    point: {
      _id: 4,
      subject: 'Point 4',
      description: 'Point Description 4',
      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
  {
    point: {
      _id: 5,
      subject: 'Point 5',
      description: 'Point Description 5',

      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
]

export const canStartGroupingTheXOut = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Ungroup and close'))
    // make sure they are still there
    canvas.getByText('Point 1')
    canvas.getByText('Point 2')
  },
}

const groupingStepTemplate = args => {
  const { pointById, ...otherArgs } = args

  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-points-for-round'] = (discussionId, round, cb) => {
      window.socket._socketEmitHandlerResults['get-points-for-round'] = [discussionId, round]
      setTimeout(() => {
        const points = Object.values(pointById)
        cb([points])
      })
    }
    window.socket._socketEmitHandlers['post-point-groups'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['post-point-groups'] = rank
      cb && cb()
    }
  })
  return <GroupingStep {...otherArgs} />
}
export const groupingStepWithPartialDataAndUserUpdate = {
  args: { ...getGroupingArgsFrom(groupingPoints) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator, onDoneDecorator],
  render: groupingStepTemplate,
}
