import React from 'react'
import { expect } from '@storybook/jest'
import PointGroup from '../app/components/point-group'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/testing-library'

export default {
  component: PointGroup,
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
  }
) => {
  return {
    _id,
    subject,
    description,
    groupedPoints,
    demInfo,
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
const point3 = createPointObj('3', 'Point 3', 'Point 3 Description', [], {
  dob: '1995-10-20T00:00:00.000Z',
  state: 'CA',
  party: 'Independent',
})
const point4 = createPointObj('4', 'Point 4', 'Point 4 Description')
const point6 = createPointObj('6', 'Point 6', 'Point 6 Description')
const point5 = createPointObj('5', 'Point 5', 'Point 5 Description', [point2, point3, point4, point6])

export const DefaultSinglePoint = { args: { point: point1, vState: 'default' } }
export const SelectedSinglePoint = { args: { point: point1, vState: 'default', select: true } }
export const EditSinglePoint = { args: { point: point1, vState: 'edit' } }

export const defaultMultiplePoints = { args: { point: point5, vState: 'default' } }
export const selectedDefaultMultiplePoints = { args: { point: point5, vState: 'default', select: true } }
export const editMultiplePoints = { args: { point: point5, vState: 'edit' } }
export const selectedEditMultiplePoints = { args: { point: point5, vState: 'edit', select: true } }

export const mobileSinglePoint = {
  args: { point: point1, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const mobileDefaultPoints = {
  args: { point: point5, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const collapsedPoints = {
  args: { point: point5, vState: 'collapsed' },
}

export const selectLeadPoints = {
  args: { point: point5, vState: 'selectLead' },
}

export const mobileSelectLeadPoints = {
  args: { point: point5, vState: 'selectLead' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const selectLeadPoint3OnDone = {
  args: { point: point5, vState: 'selectLead' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const SelectedPoint = canvas.getByTitle('Select as Lead: Point 3')
    await userEvent.click(SelectedPoint)
    const DoneButton = canvas.getByTitle('Done')
    await userEvent.click(DoneButton)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          pointObj: {
            _id: '3',
            subject: 'Point 3',
            description: 'Point 3 Description',
            groupedPoints: [
              {
                _id: '2',
                subject: 'Point 2',
                description:
                  'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
                demInfo: {
                  dob: '1980-10-20T00:00:00.000Z',
                  state: 'GA',
                  party: 'Independent',
                },
              },
              {
                _id: '4',
                subject: 'Point 4',
                description: 'Point 4 Description',
                deminfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: '6',
                subject: 'Point 6',
                description: 'Point 6 Description',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
            demInfo: {
              dob: '1995-10-20T00:00:00.000Z',
              state: 'CA',
              party: 'Independent',
            },
          },
        },
      },
    })
  },
}

export const selectLeadUngroupOnDone = {
  args: { point: point5, vState: 'selectLead' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Ungroup and close')
    await userEvent.click(element)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          removedPointObjs: [
            {
              _id: '2',
              subject: 'Point 2',
              description:
                'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
              groupedPoints: [],
              demInfo: {
                dob: '1980-10-20T00:00:00.000Z',
                state: 'GA',
                party: 'Independent',
              },
            },
            {
              _id: '3',
              subject: 'Point 3',
              description: 'Point 3 Description',
              groupedPoints: [],
              demInfo: {
                dob: '1995-10-20T00:00:00.000Z',
                state: 'CA',
                party: 'Independent',
              },
            },
            {
              _id: '4',
              subject: 'Point 4',
              description: 'Point 4 Description',
              groupedPoints: [],
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            {
              _id: '6',
              subject: 'Point 6',
              description: 'Point 6 Description',
              groupedPoints: [],
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
          ],
        },
      },
    })
  },
}

export const editMultiplePointsRemovePoint3OnDone = {
  args: { pointObj: point5, vState: 'edit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Remove from Group: Point 3')
    await userEvent.click(element)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          pointObj: {
            _id: '5',
            subject: 'Point 5',
            description: 'Point 5 Description',
            demInfo: {
              dob: '1990-10-20T00:00:00.000Z',
              state: 'NY',
              party: 'Independent',
            },
            groupedPoints: [
              {
                _id: '2',
                subject: 'Point 2',
                description:
                  'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
                groupedPoints: [],
                demInfo: {
                  dob: '1980-10-20T00:00:00.000Z',
                  state: 'GA',
                  party: 'Independent',
                },
              },
              {
                _id: '4',
                subject: 'Point 4',
                description: 'Point 4 Description',
                groupedPoints: [],
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: '6',
                subject: 'Point 6',
                description: 'Point 6 Description',
                groupedPoints: [],
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
          },
          removedPointObjs: [
            {
              _id: '3',
              subject: 'Point 3',
              description: 'Point 3 Description',
              groupedPoints: [],
              demInfo: {
                dob: '1995-10-20T00:00:00.000Z',
                state: 'CA',
                party: 'Independent',
              },
            },
          ],
        },
      },
    })
  },
}
