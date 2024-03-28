import React from 'react'
import GroupingStep from '../app/components/grouping-step'
import Point from '../app/components/point'
import Theme from '../app/components/theme'

export default {
  component: GroupingStep,
  args: {},
}

const pointItems = [
  {
    subject: 'Subject 1',
    description: 'Description for subject 1...',
    vState: 'default',
    children: null,
  },
  {
    subject: 'Subject 2',
    description: 'Description for subject 2...',
    vState: 'default',
    children: null,
  },
  {
    subject: 'Subject 3',
    description: 'Description for subject 3...',
    vState: 'default',
    children: null,
  },
]

export const TestGroupingStep = {
  args: {
    shared: {
      pointList: pointItems,
      groupedPointList: [],
    },
    onDone: () => {},
  },
}
