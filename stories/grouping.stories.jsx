// https://github.com/EnCiv/civil-pursuit/issues/198

import React, { useContext, useState } from 'react'
import GroupPoints from '../app/components/steps/grouping'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

import DeliberationContext from '../app/components/deliberation-context'

import { cloneDeep } from 'lodash'

const discussionId = '1101'

export default {
  component: GroupPoints,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const createPointDoc = (
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

const pointItems = Array.from({ length: 10 }, (_, index) => createPointDoc(index, 'Point ' + index, 'Point Description ' + index))

function groupingPointsToContext(groupingPoints) {
  const cn = {
    ...groupingPoints.reduce(
      (cn, gp) => {
        // context, reviewPoint
        cn.pointById[gp._id] = gp
        return cn
      },
      { pointById: {} }
    ),
  }
  return cn
}

export const Empty = {
  args: {},
}

export const SharedEmpty = {
  args: { shared: {} },
}

export const Desktop = {
  args: {
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
  },
}

export const Mobile = {
  args: {
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
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
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
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
        value: [
          {
            _id: 0,
            subject: 'Point 0',
            description: 'Point Description 0',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 3,
            subject: 'Point 3',
            description: 'Point Description 3',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 4,
            subject: 'Point 4',
            description: 'Point Description 4',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 5,
            subject: 'Point 5',
            description: 'Point Description 5',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 6,
            subject: 'Point 6',
            description: 'Point Description 6',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 7,
            subject: 'Point 7',
            description: 'Point Description 7',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 8,
            subject: 'Point 8',
            description: 'Point Description 8',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 9,
            subject: 'Point 9',
            description: 'Point Description 9',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 1,
            subject: 'Point 1',
            description: 'Point Description 1',
            groupedPoints: [
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                user: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
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
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
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
            _id: 0,
            subject: 'Point 0',
            description: 'Point Description 0',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 3,
            subject: 'Point 3',
            description: 'Point Description 3',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 4,
            subject: 'Point 4',
            description: 'Point Description 4',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 5,
            subject: 'Point 5',
            description: 'Point Description 5',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 6,
            subject: 'Point 6',
            description: 'Point Description 6',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 7,
            subject: 'Point 7',
            description: 'Point Description 7',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 8,
            subject: 'Point 8',
            description: 'Point Description 8',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 9,
            subject: 'Point 9',
            description: 'Point Description 9',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 2,
            subject: 'Point 2',
            description: 'Point Description 2',
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 1,
            subject: 'Point 1',
            description: 'Point Description 1',
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
            groupedPoints: [],
          },
        ],
      },
    })
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the pointList doesn't go back to it's initial state
export const canCreateGroupWithAGroup = {
  args: {
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
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
        value: [
          {
            _id: 0,
            subject: 'Point 0',
            description: 'Point Description 0',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 4,
            subject: 'Point 4',
            description: 'Point Description 4',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 5,
            subject: 'Point 5',
            description: 'Point Description 5',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 6,
            subject: 'Point 6',
            description: 'Point Description 6',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 7,
            subject: 'Point 7',
            description: 'Point Description 7',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 8,
            subject: 'Point 8',
            description: 'Point Description 8',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 9,
            subject: 'Point 9',
            description: 'Point Description 9',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 1,
            subject: 'Point 1',
            description: 'Point Description 1',
            groupedPoints: [
              {
                _id: 3,
                subject: 'Point 3',
                description: 'Point Description 3',
                user: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                user: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
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
    groupingPoints: pointItems,
    shared: {
      groupedPointList: [],
    },
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
          {
            _id: 0,
            subject: 'Point 0',
            description: 'Point Description 0',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 4,
            subject: 'Point 4',
            description: 'Point Description 4',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 5,
            subject: 'Point 5',
            description: 'Point Description 5',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 6,
            subject: 'Point 6',
            description: 'Point Description 6',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 7,
            subject: 'Point 7',
            description: 'Point Description 7',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 8,
            subject: 'Point 8',
            description: 'Point Description 8',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 9,
            subject: 'Point 9',
            description: 'Point Description 9',
            groupedPoints: [],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 2,
            subject: 'Point 2',
            description: 'Point Description 2',
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
          {
            _id: 1,
            subject: 'Point 1',
            description: 'Point Description 1',
            groupedPoints: [
              {
                _id: 3,
                subject: 'Point 3',
                description: 'Point Description 3',
                user: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                user: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
            user: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}
