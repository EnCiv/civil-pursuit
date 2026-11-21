// https://github.com/EnCiv/civil-pursuit/issues/57

import React from 'react'
import ShowDualPointList from '../app/components/show-dual-point-list'
import { DemInfoProvider } from '../app/components/dem-info-context'
import { expect, userEvent, waitFor, within } from 'storybook/test'

export default {
  component: ShowDualPointList,
  args: {
    leftHeader: "Why It's most Important",
    rightHeader: "Why It's least Important",
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
  _id: '1',
  subject: 'Equality is a human right',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point2 = {
  _id: '2',
  subject: 'Income equality reduction',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

const point3 = {
  _id: '3',
  subject: 'Separation of wealth',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point4 = {
  _id: '4',
  subject: 'Not a crucial issue',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point5 = {
  _id: '5',
  subject: 'Poverty',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point6 = {
  _id: '6',
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

export const ExpandedWithDemInfo = {
  args: {
    leftPoints: [{ ...point1, subject: 'A longer response title that wraps onto several lines on smaller screens' }],
    rightPoints: [point4],
    vState: 'expanded',
  },
  decorators: [Story => (
    <DemInfoProvider demInfoProviderDefault={{ demInfoById: { 1: { state: 'NY', party: 'Independent' }, 4: { state: 'CA' } } }}>
      <Story />
    </DemInfoProvider>
  )],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const leftTitle = canvas.getByText('A longer response title that wraps onto several lines on smaller screens')
    const rightTitle = canvas.getByText(point4.subject)
    const leftDescription = canvas.getByText(point1.description)
    const rightDescription = canvas.getByText(point4.description)
    const badge = canvas.getByText('Independent • NY')
    await waitFor(() => {
      expect(leftDescription.getBoundingClientRect().top).toBeCloseTo(rightDescription.getBoundingClientRect().top, 0)
      expect(leftTitle.getBoundingClientRect().top).toBeCloseTo(rightTitle.getBoundingClientRect().top, 0)
      expect(getComputedStyle(badge).borderStyle).toBe('solid')
    })
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Table' }))
    await waitFor(() => expect(badge).not.toBeVisible())
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Table' }))
    await waitFor(() => expect(badge).toBeVisible())
  },
}

// cases when story data include some pointGroups
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

const point7 = createPointObj('7', 'Clear litter from creek corridors', 'Regular cleanups protect wildlife and keep trash from reaching neighborhood waterways.', [])
const point8 = createPointObj(
  '8',
  'Light neighborhood walking paths',
  'Well-placed lights can make popular paths feel safer after sunset. Residents who work late should be able to walk to transit and home with confidence. Fixtures should direct light downward to limit glare for nearby homes.',
  [],
  {
    dob: '1980-10-20T00:00:00.000Z',
    state: 'GA',
    party: 'Independent',
  }
)
const point9 = createPointObj('9', 'Offer evening adult classes', 'Flexible class times help working adults earn credentials and build new skills.', [], {
  dob: '1995-10-20T00:00:00.000Z',
  state: 'CA',
  party: 'Independent',
})
const point10 = createPointObj('10', 'Improve access to public restrooms', 'Clean, accessible facilities make downtown and park visits easier for everyone.')
const point11 = createPointObj('11', 'Create safer crossings near parks', 'Visible crosswalks and slower traffic help families reach nearby recreation areas.', [point7, point8, point9, point10])
const point12 = createPointObj('12', 'Repair playground equipment promptly', 'Routine inspections can prevent injuries and keep play areas open for children.')

// Case when the chart is collapsed:
export const CollapsedChartWithGroups = {
  args: {
    leftPoints: [point7, point8, point9],
    rightPoints: [point10, point11, point12],
    vState: 'collapsed',
  },
}

export const MobileCollapsedChartWithGroups = {
  args: {
    leftPoints: [point7, point8, point9],
    rightPoints: [point10, point11, point12],
    vState: 'collapsed',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

// Case when the chart is expanded:
export const ExpandedChartWithGroups = {
  args: {
    leftPoints: [point7, point11, point9],
    rightPoints: [point10, point11, point12],
    vState: 'expanded',
  },
}

export const MobileExpandedChartWithGroups = {
  args: {
    leftPoints: [point7, point11, point9],
    rightPoints: [point10, point11, point12],
    vState: 'expanded',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

// Case with Differing Number of Left and Right Points
// Case When There Are More Points on the Left Side
export const MorePointsOnLeftSide = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [point4],
  },
}

// Case When There Are More Points on the Right Side
export const MorePointsOnRightSide = {
  args: {
    leftPoints: [point1],
    rightPoints: [point4, point5, point6],
  },
}

// Cases When There Are No Points on One Side
// Case When There Are No Points on the Left Side
export const NoPointsOnLeftSide = {
  args: {
    leftPoints: [],
    rightPoints: [point4, point5, point6],
  },
}

// Case When There Are No Points on the Right Side
export const NoPointsOnRightSide = {
  args: {
    leftPoints: [point1, point2, point3],
    rightPoints: [],
  },
}
