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
  },
  {
    subject: 'Subject 2',
    description: 'Description for subject 2...',
    vState: 'default',
  },
  {
    subject: 'Subject 3',
    description: 'Description for subject 3...',
    vState: 'default',
  },
]

const pointsList = pointItems.map((point, index) => (
  <Point key={index} subject={point.subject} description={point.description} vState={point.vState} />
))

export const TestGroupingStep = {
  args: {
    shared: {
      pointList: pointsList,
      groupedPointList: [],
    },
    onDone: () => {},
  },
}
