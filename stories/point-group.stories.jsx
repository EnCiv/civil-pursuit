import React from 'react'
import PointGroup from '../app/components/point-group'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent, expect } from '@storybook/test'
import DemInfo from '../app/components/dem-info'

export default {
  component: PointGroup,
  decorators: [onDoneDecorator],
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
    demInfo,
  }
}

const createPointGroupDoc = (point, group = []) => {
  return { point, group }
}

const pointDoc1 = createPointDoc('1', 'Point 1', 'Point 1 Description', [])
const pointDoc2 = createPointDoc('2', 'Point 2', 'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ', [], {
  dob: '1980-10-20T00:00:00.000Z',
  state: 'GA',
  party: 'Independent',
})
const pointDoc3 = createPointDoc('3', 'Point 3', 'Point 3 Description', [], {
  dob: '1995-10-20T00:00:00.000Z',
  state: 'CA',
  party: 'Independent',
})
const pointDoc4 = createPointDoc('4', 'Point 4', 'Point 4 Description')
const pointDoc6 = createPointDoc('6', 'Point 6', 'Point 6 Description')
const pointDoc5 = createPointDoc('5', 'Point 5', 'Point 5 Description')
const pointGroupDoc5 = createPointGroupDoc(pointDoc5, [pointDoc2, pointDoc3, pointDoc4, pointDoc6])

export const DefaultSinglePoint = { args: { pointGroupDoc: createPointGroupDoc(pointDoc1), vState: 'default' } }
export const SelectedSinglePoint = { args: { pointGroupDoc: createPointGroupDoc(pointDoc1), vState: 'default', select: true } }
export const EditSinglePoint = { args: { pointGroupDoc: createPointGroupDoc(pointDoc1), vState: 'edit' } }

export const defaultMultiplePoints = { args: { pointGroupDoc: pointGroupDoc5, vState: 'default' } }
export const selectedDefaultMultiplePoints = { args: { pointGroupDoc: pointGroupDoc5, vState: 'default', select: true } }
export const editMultiplePoints = { args: { pointGroupDoc: pointGroupDoc5, vState: 'edit' } }
export const selectedEditMultiplePoints = { args: { pointGroupDoc: pointGroupDoc5, vState: 'edit', select: true } }

export const mobileSinglePoint = {
  args: { pointGroupDoc: createPointGroupDoc(pointDoc1), vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const selectedEditMultiplePointsWithChildren = {
  args: {
    pointGroupDoc: pointGroupDoc5,
    vState: 'edit',
    select: true,
    children: [<DemInfo dob="1995-10-20T00:00:00.000Z" state="CA" party="Independent" />],
  },
}

export const mobileDefaultPoints = {
  args: { pointGroupDoc: pointGroupDoc5, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const collapsedPoints = {
  args: { pointGroupDoc: pointGroupDoc5, vState: 'collapsed' },
}

export const selectLeadPoints = {
  args: { pointGroupDoc: { point: pointDoc1, group: [pointDoc1, pointDoc2, pointDoc3, pointDoc4, pointDoc6] }, vState: 'selectLead' },
}

export const mobileSelectLeadPoints = {
  args: { pointGroupDoc: pointGroupDoc5, vState: 'selectLead' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const selectLeadPoint3OnDone = {
  args: { pointGroupDoc: pointGroupDoc5, vState: 'selectLead' },
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
          pointDoc: {
            _id: '3',
            subject: 'Point 3',
            description: 'Point 3 Description',
            groupedPoints: [
              {
                _id: '2',
                subject: 'Point 2',
                description: 'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
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
  args: { pointGroupDoc: pointGroupDoc5, vState: 'selectLead' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Ungroup and close')
    await userEvent.click(element)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          removedPointDocs: [
            {
              _id: '2',
              subject: 'Point 2',
              description: 'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
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
  args: { pointGroupDoc: pointGroupDoc5, vState: 'edit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Remove from Group: Point 3')
    await userEvent.click(element)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          pointDoc: {
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
                description: 'Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, Point 2 Description, ',
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
          removedPointDocs: [
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
