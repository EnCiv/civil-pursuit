// https://github.com/EnCiv/civil-pursuit/issues/241

import React from 'react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import Metadata from './../app/components/metadata'
import Point from '../app/components/point'

export default {
  component: Metadata,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const pointDoc = {
  subject: 'Phasellus diam sapien, placerat id sollicitudin eget',
  description: 'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
  demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' },
}

export const Empty = {
  args: {},
}

export const NoChild = {
  args: {
    title: 'View Dates',
    data: [
      { label: 'Created', value: 'Sep 16, 2024' },
      { label: 'Last Accessed', value: 'Jan 29, 2023' },
      { label: 'Last Modified', value: 'Oct 7, 2022' },
    ],
  },
}

export const ThreeRowsWithChild = {
  args: {
    child: <Point point={pointDoc} />,
    title: 'View Dates',
    data: [
      { label: 'Created', value: 'Sep 16, 2024' },
      { label: 'Last Accessed', value: 'Jan 29, 2023' },
      { label: 'Last Modified', value: 'Oct 7, 2022' },
    ],
  },
}

export const FiveRowsWithChild = {
  args: {
    child: <Point point={pointDoc} />,
    title: 'Statistics',
    data: [
      { label: 'Viewed', value: '143,494 times' },
      { label: 'Published', value: 'Last week' },
      { label: 'Created', value: 'Sep 16, 2024' },
      { label: 'Last Accessed', value: 'Jan 29, 2023' },
      { label: 'Last Modified', value: 'Oct 7, 2022' },
    ],
  },
}
