import React from 'react'
import GroupingStep from '../app/components/grouping-step'
import Point from '../app/components/point'
import Theme from '../app/components/theme'

export default {
  component: GroupingStep,
  args: {},
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

const pointItems = Array.from({ length: 10 }, (_, index) => createPointObj(index, 'Point ' + index, 'Point Description ' + index));

export const TestGroupingStep = () => (
  <div style={{ width: '1174px', height: '1720px' }}>
    <GroupingStep
      shared={{
        pointList: pointItems,
        groupedPointList: [],
      }}
      onDone={() => {}}
      viewports={['desktop']}
    />
  </div>
);

export const mobileOverview = {
  component: GroupingStep,
  args: {
    shared: {
      pointList: pointItems,
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

