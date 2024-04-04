import React from 'react'
import GroupingStep from '../app/components/grouping-step'
import Point from '../app/components/point'
import Theme from '../app/components/theme'

export default {
  component: GroupingStep,
  args: {},
}

const pointItems = Array.from({ length: 5 }, (_, index) => ({
  subject: `Subject ${index + 1}`,
  description: `Description for subject ${index + 1}...`,
  vState: 'default',
  children: null,
}));

export const TestGroupingStep = {
  args: {
    shared: {
      pointList: pointItems,
      groupedPointList: [],
    },
    onDone: () => {},
  },
}
