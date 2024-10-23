// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

import React, { useEffect, useContext, useState } from 'react'
import DeliberationContext from '../app/components/deliberation-context'
import RerankStep, { Rerank } from '../app/components/steps/rerank'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'

export default {
  component: Rerank,
  decorators: [onDoneDecorator, DeliberationContextDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const round = 1
const discussionId = '1001'
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
  parentId: '0',
}

const point16 = {
  _id: '16',
  subject: 'Species Extinction',
  description: 'Numerous species face extinction due to environmental changes and human activities.',
  parentId: '0',
}

const point17 = {
  _id: '17',
  subject: 'Disrupted Food Chains',
  description: 'Loss of key species can disrupt food chains and lead to broader ecosystem instability.',
  parentId: '0',
}

const point18 = {
  _id: '18',
  subject: 'Economic Costs of Conservation',
  description: 'Conservation efforts can be expensive and divert resources from other critical areas.',
  parentId: '0',
  category: 'least',
}

const point19 = {
  _id: '19',
  subject: 'Conflicting Land Use',
  description: 'Balancing conservation with land use for agriculture and development can be challenging.',
  parentId: '0',
}

const point20 = {
  _id: '20',
  subject: 'Public Awareness and Education',
  description: 'Lack of public awareness about biodiversity and its importance can hinder conservation efforts.',
  parentId: '0',
}

const reviewPoints = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'description 1', parentId: discussionId },
    mosts: [
      { _id: '11', subject: 'subject 1 most 1', description: 'description 1 most 1', category: 'most', parentId: '1' },
      { _id: '12', subject: 'subject 1 most 2', description: 'description 1 most 2', category: 'most', parentId: '1' },
    ],
    leasts: [
      {
        _id: '13',
        subject: 'subject 1 least 1',
        description: 'description 1 least 1',
        category: 'least',
        parentId: '1',
      },
      {
        _id: '14',
        subject: 'subject 1 least 2',
        description: 'description 1 least 2',
        category: 'least',
        parentId: '1',
      },
    ],
    rank: {
      _id: '201',
      stage: 'post',
      category: 'most',
      parentId: '1',
      discussionId,
      round: 0,
    },
  },
  {
    point: { _id: '2', subject: 'subject 2', description: 'description 2', parentId: discussionId },
    mosts: [
      { _id: '21', subject: 'subject 2 most 1', description: 'description 2 most 1', category: 'most', parentId: '2' },
      { _id: '22', subject: 'subject 2 most 2', description: 'description 2 most 2', category: 'most', parentId: '2' },
    ],
    leasts: [
      {
        _id: '23',
        subject: 'subject 2 least 1',
        description: 'description 2 least 1',
        category: 'least',
        parentId: '2',
      },
      {
        _id: '24',
        subject: 'subject 1 least 2',
        description: 'description 1 least 2',
        category: 'least',
        parentId: '2',
      },
    ],
  },
  {
    point: { _id: '3', subject: 'subject 3', description: 'description 3', parentId: discussionId },
    mosts: [
      { _id: '31', subject: 'subject 3 most 1', description: 'description 3 most 1', category: 'most', parentId: '3' },
      { _id: '32', subject: 'subject 3 most 2', description: 'description 3 most 2', category: 'most', parentId: '3' },
    ],
    leasts: [
      {
        _id: '33',
        subject: 'subject 3 least 1',
        description: 'description 3 least 1',
        category: 'least',
        parentId: '3',
      },
      {
        _id: '34',
        subject: 'subject 3 least 2',
        description: 'description 3 least 2',
        category: 'least',
        parentId: '3',
      },
    ],
  },
]

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
  rank: { _id: '101', stage: 'post', category: 'most', parentId: point0._id, discussionId, round },
}

const reviewPoint5 = {
  point: point7,
  mosts: [point8, point9, point10],
  leasts: [point11, point12, point13],
  rank: { _id: '102', stage: 'post', category: 'least', parentId: point7._id, discussionId, round },
}

const reviewPoint6 = {
  point: point14,
  mosts: [point15, point16, point17],
  leasts: [point18, point19, point20],
  rank: { _id: '101', stage: 'post', category: 'neutral', parentId: point14._id, discussionId, round },
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
    discussionId,
    round,
  },
}

export const Mobile = {
  args: {
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
    discussionId,
    round,
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
    discussionId,
    round,
  },
}

export const PartialWithInitialRank = {
  args: {
    reviewPoints,
    discussionId,
    round,
  },
}

export const onDoneIsCalledIfInitialData = {
  args: {
    reviewPoints: [reviewPoint4, reviewPoint2, reviewPoint3],
    discussionId,
    round,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
    })
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])

    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
          delta: {
            _id: '101',
            stage: 'post',
            category: 'neutral',
            parentId: '0',
            discussionId: '1001',
            round: 1,
          },
        },
      })
    )
  },
}

export const onDoneIsCalledAfterUserChangesRank = {
  args: {
    reviewPoints: [reviewPoint4, reviewPoint2, reviewPoint3],
    discussionId,
    round,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])

    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
          delta: {
            _id: '101',
            stage: 'post',
            category: 'neutral',
            parentId: '0',
            discussionId: '1001',
            round: 1,
          },
        },
      })
    })
  },
}
function reviewPointsToContext(reviewPoints) {
  const cn = {
    ...reviewPoints.reduce(
      (cn, rp) => {
        console.info('cn, rp', cn, rp)
        // context, reviewPoint
        cn.pointById[rp.point._id] = rp.point
        rp.mosts && rp.mosts.forEach(p => (cn.topWhyById[p._id] = p))
        rp.leasts && rp.leasts.forEach(p => (cn.topWhyById[p._id] = p))
        rp.rank && (cn.postRankByParentId[rp.rank.parentId] = rp.rank)
        return cn
      },
      { pointById: {}, topWhyById: {}, postRankByParentId: {}, groupIdsLists: [] }
    ),
  }
  return cn
}

export const rerankStepWithPartialInitialData = {
  args: {
    reviewPoints,
    discussionId,
    round,
  },
  render: args => {
    // brute force set/mutate the initial value of the context data
    const { data = {}, upsert } = useContext(DeliberationContext)
    useState(() => {
      // execute this code once, before the component is initally rendered
      const cn = reviewPointsToContext(args.reviewPoints)
      upsert(cn)
    })
    return <RerankStep {...args} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const categories = canvas.getAllByText('Neutral')

    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
    })
    await userEvent.click(categories[0])
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          1: { _id: '201', stage: 'post', category: 'neutral', parentId: '1', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}

export const rerankStepWithTopDownUpdate = {
  args: {
    reviewPoints: reviewPoints,
    discussionId,
    round,
  },
  render: args => {
    const { data = {}, upsert } = useContext(DeliberationContext)
    const { reviewPoints, ...otherArgs } = args
    useState(() => {
      // execute this once before the component renders
      const cn = reviewPointsToContext(reviewPoints)
      upsert(cn)
      setTimeout(() => {
        upsert({
          postRankByParentId: {
            2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
          },
        })
      }, 1000)
    }, [])
    return <RerankStep {...otherArgs} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
    })
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: false,
          value: 0.6666666666666666,
        },
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}
