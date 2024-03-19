import React from 'react'
import { expect } from '@storybook/jest'
import PointGroup from '../app/components/point-group'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'

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

export const DefaultSinglePoint = { args: { pointObj: point1, vState: 'default' } }
export const EditSinglePoint = { args: { pointObj: point1, vState: 'edit' } }
export const ViewSinglePoint = { args: { pointObj: point1, vState: 'view' } }

export const defaultMultiplePoints = { args: { pointObj: point5, vState: 'default' } }
export const editMultiplePoints = { args: { pointObj: point5, vState: 'edit' } }
export const viewMultiplePoints = { args: { pointObj: point5, vState: 'view' } }

export const mobileSingePoint = {
  args: { pointObj: point1, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const mobileDefaultPoints = {
  args: { pointObj: point5, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const mobileViewPoints = {
  args: { pointObj: point5, vState: 'view' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const collapsedPoints = {
  args: { pointObj: point5, vState: 'collapsed' },
}

export const selectLeadPoints = {
  args: { pointObj: point5, vState: 'selectLead' },
}

export const mobileSelectLeadPoints = {
  args: { pointObj: point5, vState: 'selectLead' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}
