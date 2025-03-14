// https://github.com/EnCiv/civil-pursuit/issues/199

import React, { useContext, useState } from 'react'
import DeliberationContext from '../app/components/deliberation-context'
import RankStep, { RankPoints } from '../app/components/steps/rank'

import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import { cloneDeep } from 'lodash'

export default {
  component: RankPoints,
  decorators: [onDoneDecorator],
}

const round = 1
const discussionId = '1001'

const rankPoints = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'description 1', parentId: discussionId },
  },
  {
    point: { _id: '2', subject: 'subject 2', description: 'description 2', parentId: discussionId },
  },
  {
    point: { _id: '3', subject: 'subject 3', description: 'description 3', parentId: discussionId },
  },
]
const rank1preMost = {
  _id: '201',
  stage: 'pre',
  category: 'most',
  parentId: '1',
  discussionId,
  round: 0,
}

const rank2preNeutral = {
  _id: '202',
  stage: 'pre',
  category: 'neutral',
  parentId: '2',
  discussionId,
  round: 0,
}
const rank3preLeast = {
  _id: '203',
  stage: 'pre',
  category: 'least',
  parentId: '3',
  discussionId,
  round: 0,
}
// different story cases want different combinations of reviewpoints and ranks
function mergeRanksIntoReviewPoints(rankPoints, ranks) {
  const rps = cloneDeep(rankPoints)
  ranks.forEach(rank => (rps.find(rp => rp.point._id == rank.parentId).rank = rank))
  return rps
}

// rip rankPoints into the separate objects that go into the context
function rankPointsToContext(rankPoints) {
  const cn = {
    ...rankPoints.reduce(
      (cn, rp) => {
        // context, reviewPoint
        cn.pointById[rp.point._id] = rp.point
        rp.rank && (cn.preRankByParentId[rp.rank.parentId] = rp.rank)
        return cn
      },
      { pointById: {}, preRankByParentId: {}, groupIdsLists: [] }
    ),
  }
  return cn
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, []),
    discussionId,
    round,
  },
}

export const Mobile = {
  args: {
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, []),
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
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, [rank1preMost, rank2preNeutral, rank3preLeast]),
    discussionId,
    round,
  },
}

export const PartialWithInitialRank = {
  args: {
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, [rank1preMost, rank2preNeutral]),
    discussionId,
    round,
  },
}

export const onDoneIsCalledIfInitialData = {
  args: {
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, [rank1preMost]),
    discussionId,
    round,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
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
    pointRankGroupList: mergeRanksIntoReviewPoints(rankPoints, [rank1preMost]),
    discussionId,
    round,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])

    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
          delta: { ...rank1preMost, category: 'neutral' },
        },
      })
    })
  },
}

// need to have one source of data {rankPoints}, but split it into defaultValue representing what should be setup in the context before RankStep renders
// and topWhyById and postRankByParentId which are for the simulated response to the get-user-post-ranks-and-top-ranked-whys socket api call
function getRankArgsFrom(rankPoints) {
  const cn = rankPointsToContext(rankPoints)
  const { preRankByParentId, ...defaultValue } = { ...cn, round, discussionId }
  return { preRankByParentId, defaultValue }
}

// sets up the socket api mocks and renders the component
const rankStepTemplate = args => {
  // topWhyById and postRankByParentId are taken from args to uses by the api call
  const { preRankByParentId, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-user-ranks'] = (discussionId, round, ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-ranks'] = [discussionId, round, ids]
      setTimeout(() => {
        const ranks = Object.values(preRankByParentId) // back to array
        cb(ranks)
      })
    }
    window.socket._socketEmitHandlers['upsert-rank'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['upsert-rank'] = rank
      cb && cb()
    }
  })
  return <RankStep {...otherArgs} />
}

export const rankStepWithPartialDataAndUserUpdate = {
  args: { ...getRankArgsFrom(mergeRanksIntoReviewPoints(rankPoints, [rank1preMost])) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: rankStepTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
      expect(window.socket._socketEmitHandlerResults['get-user-ranks']).toEqual([discussionId, round, 'pre'])
    })
    const categories = canvas.getAllByText('Neutral')
    await userEvent.click(categories[0])

    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsert-rank']).toEqual({
        _id: '201',
        stage: 'pre',
        category: 'neutral',
        parentId: '1',
        discussionId: '1001',
        round: 0,
      })
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: { _id: '201', stage: 'pre', category: 'neutral', parentId: '1', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}

export const rankStepWithTopDownUpdate = {
  args: { ...getRankArgsFrom(mergeRanksIntoReviewPoints(rankPoints, [rank1preMost])) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: args => {
    // simulate a top down update after the component initially renders
    const { data = {}, upsert } = useContext(DeliberationContext)
    useState(() => {
      // execute this code once, before the component is initally rendered
      setTimeout(() => {
        upsert({
          preRankByParentId: {
            2: { _id: '211', stage: 'pre', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
          },
        })
      }, 1000)
    })
    return rankStepTemplate(args)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: {
            _id: '201',
            stage: 'pre',
            category: 'most',
            parentId: '1',
            discussionId: '1001',
            round: 0,
          },
        },
      })
    })
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.6666666666666666,
        },
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: { _id: '201', stage: 'pre', category: 'most', parentId: '1', discussionId: '1001', round: 0 },
          2: { _id: '211', stage: 'pre', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}

export const rankStepWithClearRanks = {
  args: { ...getRankArgsFrom(mergeRanksIntoReviewPoints(rankPoints, [rank1preMost])) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: args => {
    // simulate a top down update after the component initially renders
    const { data = {}, upsert } = useContext(DeliberationContext)
    useState(() => {
      // execute this code once, before the component is initally rendered
      setTimeout(() => {
        upsert({
          preRankByParentId: {
            2: { _id: '211', stage: 'pre', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
          },
        })
      }, 1000)
    })
    return rankStepTemplate(args)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const clearButton = canvas.getAllByText('Clear All')

    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.3333333333333333,
        },
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: {
            _id: '201',
            stage: 'pre',
            category: 'most',
            parentId: '1',
            discussionId: '1001',
            round: 0,
          },
        },
      })
    })
    await waitFor(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        onDoneResult: {
          valid: false,
          value: 0.6666666666666666,
        },
      })
    })
    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: { _id: '201', stage: 'pre', category: 'most', parentId: '1', discussionId: '1001', round: 0 },
          2: { _id: '211', stage: 'pre', category: 'least', parentId: '2', discussionId: '1001', round: 0 },
        },
      })
    })

    await userEvent.click(clearButton[0])

    await waitFor(() => {
      expect(deliberationContextData(canvas)).toMatchObject({
        preRankByParentId: {
          1: { _id: '201', stage: 'pre', category: '', parentId: '1', discussionId: '1001', round: 0 },
          2: { _id: '211', stage: 'pre', category: '', parentId: '2', discussionId: '1001', round: 0 },
        },
      })
    })
  },
}
