// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

import React, { useContext, useState } from 'react'
import DeliberationContext from '../app/components/deliberation-context'
import RerankStep, { Rerank } from '../app/components/steps/rerank'

import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator, asyncSleep } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import { cloneDeep } from 'lodash'

export default {
  component: Rerank,
  decorators: [onDoneDecorator],
}

const round = 1
const discussionId = '1001'

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
const rank1postMost = {
  _id: '201',
  stage: 'post',
  category: 'most',
  parentId: '1',
  discussionId,
  round: 0,
}

const rank2postNeutral = {
  _id: '202',
  stage: 'post',
  category: 'neutral',
  parentId: '2',
  discussionId,
  round: 0,
}
const rank3postLeast = {
  _id: '203',
  stage: 'post',
  category: 'least',
  parentId: '3',
  discussionId,
  round: 0,
}
// different story cases want different combinations of reviewpoints and ranks
function mergeRanksIntoReviewPoints(reviewPoints, ranks) {
  const rps = cloneDeep(reviewPoints)
  ranks.forEach(rank => (rps.find(rp => rp.point._id == rank.parentId).rank = rank))
  return rps
}

// rip reviewPoints into the separate objects that go into the context
function reviewPointsToContext(reviewPoints) {
  const cn = {
    ...reviewPoints.reduce(
      (cn, rp) => {
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

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reviewPoints,
    discussionId,
    round,
  },
}

export const Mobile = {
  args: {
    reviewPoints,
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
    reviewPoints: mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost, rank2postNeutral, rank3postLeast]),
    discussionId,
    round,
  },
}

export const PartialWithInitialRank = {
  args: {
    reviewPoints: mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost, rank2postNeutral]),
    discussionId,
    round,
  },
}

export const onDoneIsCalledIfInitialData = {
  args: {
    reviewPoints: mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost]),
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
  },
}

export const onDoneIsCalledAfterUserChangesRank = {
  args: {
    reviewPoints: mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost]),
    discussionId,
    round,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    expect(onDone.mock.calls[0][0]).toMatchObject({
      valid: false,
      value: 1 / 3,
    })
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])

    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: false,
        value: 1 / 3,
        delta: { ...rank1postMost, category: 'neutral' },
      })
    })
  },
}

// need to have one source of data {reviewPoints}, but split it into defaultValue representing what should be setup in the context before RerankStep renders
// and topWhyById and postRankByParentId which are for the simulated response to the get-user-post-ranks-and-top-ranked-whys socket api call
function getRerankArgsFrom(reviewPoints) {
  const cn = reviewPointsToContext(reviewPoints)
  const { topWhyById, postRankByParentId, ...defaultValue } = { ...cn, round, discussionId }
  return { topWhyById, postRankByParentId, defaultValue }
}

// sets up the socket api mocks and renders the component
const rerankStepTemplate = args => {
  // topWhyById and postRankByParentId are taken from args to uses by the api call
  const { topWhyById, postRankByParentId, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-user-post-ranks-and-top-ranked-whys'] = (discussionId, round, ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-post-ranks-and-top-ranked-whys'] = [discussionId, round, ids]
      setTimeout(() => {
        const whys = Object.values(topWhyById) // back to array
        const ranks = Object.values(postRankByParentId) // back to array
        cb([ranks, whys])
      })
    }
    window.socket._socketEmitHandlers['upsert-rank'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['upsert-rank'] = rank
      cb && cb()
    }
  })
  return <RerankStep {...otherArgs} />
}

export const rerankStepWithPartialDataAndUserUpdate = {
  args: { ...getRerankArgsFrom(mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost])) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: rerankStepTemplate,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: 0,
      })
      expect(window.socket._socketEmitHandlerResults['get-user-post-ranks-and-top-ranked-whys']).toEqual([discussionId, round, ['1', '2', '3']])
    })
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: false,
        value: 1 / 3,
      })
      expect(window.socket._socketEmitHandlerResults['upsert-rank']).toEqual({
        _id: '201',
        stage: 'post',
        category: 'neutral',
        parentId: '1',
        discussionId: '1001',
        round: 0,
      })
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          1: { _id: '201', stage: 'post', category: 'neutral', parentId: '1', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}

export const rerankStepWithTopDownUpdate = {
  args: { ...getRerankArgsFrom(mergeRanksIntoReviewPoints(reviewPoints, [rank1postMost])) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: args => {
    // simulate a top down update after the component initially renders
    const { data = {}, upsert } = useContext(DeliberationContext)
    useState(() => {
      // execute this code once, before the component is initally rendered
      setTimeout(() => {
        upsert({
          postRankByParentId: {
            2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
          },
        })
      }, 1000)
    })
    return rerankStepTemplate(args)
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { onDone } = args
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: 0,
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          1: {
            _id: '201',
            stage: 'post',
            category: 'most',
            parentId: '1',
            discussionId: '1001',
            round: 0,
          },
        },
      })
      expect(onDone.mock.calls[1][0]).toMatchObject({
        valid: false,
        value: 1 / 3,
      })
    })
    await asyncSleep(1000)
    await waitFor(() => {
      expect(onDone.mock.calls[2][0]).toMatchObject({
        valid: false,
        value: 0.6666666666666666,
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          1: { _id: '201', stage: 'post', category: 'most', parentId: '1', discussionId: '1001', round: 0 },
          2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}
