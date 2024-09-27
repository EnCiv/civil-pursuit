// https://github.com/EnCiv/civil-pursuit/issues/61

import React from 'react'
import { expect } from '@storybook/jest'
import { Rerank } from '../app/components/steps/rerank'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/testing-library'

export default {
  component: Rerank,
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}
const point0 = {
  _id: '0',
  subject: 'Inequality',
  description: 'Inequality can hinder economic growth and stability',
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

const point7 = {
  _id: '7',
  subject: 'Rising Sea Levels',
  description:
    'This poses a significant threat to coastal cities and low-lying regions, potentially displacing millions of people.',
}

const point8 = {
  _id: '8',
  subject: 'Global Warming Effects',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point9 = {
  _id: '9',
  subject: 'Impact on Agriculture',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

const point10 = {
  _id: '10',
  subject: 'Infrastructure Damage',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point11 = {
  _id: '11',
  subject: 'Climate Change Denial',
  description: 'Fusce nibh quam, sollicitudin ut sodales id, molestie sit amet mi. Nunc nec augue odio.',
}

const point12 = {
  _id: '12',
  subject: 'Cost of Mitigation',
  description:
    'Suspendisse eget tortor sit amet sapien facilisis dictum sed et nisl. Nam pellentesque dapibus sem id ullamcorper.',
}

const point13 = {
  _id: '13',
  subject: 'Economic Impact',
  description:
    'Proin nec metus facilisis, dignissim erat a, scelerisque leo. Quisque a posuere arcu, sed luctus mi. Sed fermentum vel ante eget consequat.',
}

const point14 = {
  _id: '14',
  subject: 'Biodiversity Loss',
  description:
    'As temperatures rise, many species struggle to adapt or migrate to cooler habitats. This can result in disruptions to ecosystems, loss of biodiversity, and even extinction of vulnerable species.',
}

const point15 = {
  _id: '15',
  subject: 'Habitat Destruction',
  description:
    'The destruction of natural habitats due to urbanization and deforestation leads to a loss of biodiversity.',
}

const point16 = {
  _id: '16',
  subject: 'Species Extinction',
  description: 'Numerous species face extinction due to environmental changes and human activities.',
}

const point17 = {
  _id: '17',
  subject: 'Disrupted Food Chains',
  description: 'Loss of key species can disrupt food chains and lead to broader ecosystem instability.',
}

const point18 = {
  _id: '18',
  subject: 'Economic Costs of Conservation',
  description: 'Conservation efforts can be expensive and divert resources from other critical areas.',
}

const point19 = {
  _id: '19',
  subject: 'Conflicting Land Use',
  description: 'Balancing conservation with land use for agriculture and development can be challenging.',
}

const point20 = {
  _id: '20',
  subject: 'Public Awareness and Education',
  description: 'Lack of public awareness about biodiversity and its importance can hinder conservation efforts.',
}

const reviewPoint1 = {
  point: point0,
  mosts: [point1, point2, point3],
  leasts: [point4, point5, point6],
  rank: undefined,
}

const reviewPoint2 = {
  point: point7,
  mosts: [point8, point9, point10],
  leasts: [point11, point12, point13],
  rank: undefined,
}

const reviewPoint3 = {
  point: point14,
  mosts: [point15, point16, point17],
  leasts: [point18, point19, point20],
  rank: undefined,
}

const reviewPoint4 = {
  point: point0,
  mosts: [point1, point2, point3],
  leasts: [point4, point5, point6],
  rank: { id: '101', stage: 'post', category: 'most', parentId: point0._id, deliberationId: '1001' },
}

const reviewPoint5 = {
  point: point7,
  mosts: [point8, point9, point10],
  leasts: [point11, point12, point13],
  rank: { id: '102', stage: 'post', category: 'least', parentId: point7._id, deliberationId: '1001' },
}

const reviewPoint6 = {
  point: point14,
  mosts: [point15, point16, point17],
  leasts: [point18, point19, point20],
  rank: { id: '101', stage: 'post', category: 'neutral', parentId: point14._id, deliberationId: '1001' },
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
  },
}

export const Mobile = {
  args: {
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const AllWithInitialRank = {
  args: {
    reviewPoints: [reviewPoint4, reviewPoint5, reviewPoint6],
  },
}

export const PartialWithInitialRank = {
  args: {
    reviewPoints: [reviewPoint4, reviewPoint2, reviewPoint3],
  },
}
