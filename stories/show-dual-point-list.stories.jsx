// https://github.com/EnCiv/civil-pursuit/issues/57

import React from 'react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import ShowDualPointList from '../app/components/show-dual-point-list'

export default {
  component: ShowDualPointList,
  args: {
    leftHeader: "Why It's most Important",
    rightHeader: "Why It's least Important",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

// Case when props are undefined:
export const UndefinedProps = {
  args: {},
}

// Case when lists are empty:
export const ListsEmpty = {
  args: {
    leftPoints: [],
    rightPoints: [],
  },
}

export const MobileListsEmpty = {
  args: {
    leftPoints: [],
    rightPoints: [],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

const point1 = {
  subject: 'Equality is a human right',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point2 = {
  subject: 'Income equality reduction',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

const point3 = {
  subject: 'Separation of wealth',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point4 = {
  subject: 'Not a crucial issue',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point5 = {
  subject: 'Poverty',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point6 = {
  subject: 'Poverty increasing with time',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

// Case when the chart is collapsed:
export const CollapsedChart = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [point4, point5, point6],
    vState: 'collapsed',
  },
}

export const MobileCollapsedChart = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [point4, point5, point6],
    vState: 'collapsed',
  },

  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

// Case when the chart is expanded:
export const ExpandedChart = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [point4, point5, point6],
    vState: 'expanded',
  },
}

export const MobileExpandedChart = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [point4, point5, point6],
    vState: 'expanded',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}
