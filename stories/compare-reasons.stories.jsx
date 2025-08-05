// https://github.com/EnCiv/civil-pursuit/issues/200
import React, { useState } from 'react'
import CompareWhysStep, { CompareWhys } from '../app/components/steps/compare-whys'
import { asyncSleep, onDoneDecorator, socketEmitDecorator, DeliberationContextDecorator, deliberationContextData } from './common'
import { within, userEvent, waitFor } from '@storybook/test'
import expect from 'expect'

export default { component: CompareWhys, args: {}, decorators: [onDoneDecorator] }

const round = 1
const discussionId = '1001'

const pointWithWhyRankListList = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'describe 1' },
    whyRankList: [
      { why: { _id: '2', subject: '1 is less than 2', description: '2 is why because', parentId: '1', category: 'most' } },
      { why: { _id: '3', subject: '1 is less than 3', description: '3 is why because', parentId: '1', category: 'most' } },
      { why: { _id: '4', subject: '1 is less than 4', description: '4 is why because', parentId: '1', category: 'most' } },
      { why: { _id: '5', subject: '1 is less than 5', description: '5 is why because', parentId: '1', category: 'most' } },
      { why: { _id: '6', subject: '1 is less than 6', description: '6 is why because', parentId: '1', category: 'most' } },
    ],
  },
  {
    point: { _id: '21', subject: 'subject 20', description: 'describe 20' },
    whyRankList: [
      { why: { _id: '22', subject: '21 is greater than 2', description: '2 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '23', subject: '21 is greater than 3', description: '3 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '24', subject: '21 is greater than 4', description: '4 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '25', subject: '21 is greater than 5', description: '5 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '26', subject: '21 is greater than 6', description: '6 is why because', parentId: '21', category: 'most' } },
    ],
  },
  {
    point: { _id: '31', subject: 'subject 30', description: 'describe 30' },
    whyRankList: [
      { why: { _id: '32', subject: '30 is greater than 2', description: '2 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '33', subject: '30 is greater than 3', description: '3 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '34', subject: '30 is greater than 4', description: '4 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '35', subject: '20 is greater than 5', description: '5 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '36', subject: '20 is greater than 6', description: '6 is why because', parentId: '31', category: 'most' } },
    ],
  },
  {
    point: { _id: '41', subject: 'subject 40', description: 'describe 40' },
    whyRankList: [
      { why: { _id: '42', subject: '40 is greater than 2', description: '2 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '43', subject: '40 is greater than 3', description: '3 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '44', subject: '40 is greater than 4', description: '4 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '45', subject: '40 is greater than 5', description: '5 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '46', subject: '40 is greater than 6', description: '6 is why because', parentId: '41', category: 'least' } },
    ],
  },
]

const pointWithWhyRankListListWithRanks = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'describe 1' },
    whyRankList: [
      { why: { _id: '2', subject: '1 is less than 2', description: '2 is why because', parentId: '1', category: 'most' }, rank: { _id: '60', stage: 'why', category: 'most', parentId: '2' } },
      { why: { _id: '3', subject: '1 is less than 3', description: '3 is why because', parentId: '1', category: 'most' }, rank: { _id: '61', stage: 'why', category: 'neutral', parentId: '3' } },
      { why: { _id: '4', subject: '1 is less than 4', description: '4 is why because', parentId: '1', category: 'most' }, rank: { _id: '62', stage: 'why', category: 'neutral', parentId: '4' } },
      { why: { _id: '5', subject: '1 is less than 5', description: '5 is why because', parentId: '1', category: 'most' }, rank: { _id: '63', stage: 'why', category: 'neutral', parentId: '5' } },
      { why: { _id: '6', subject: '1 is less than 6', description: '6 is why because', parentId: '1', category: 'most' }, rank: { _id: '64', stage: 'why', category: 'neutral', parentId: '6' } },
    ],
  },
  {
    point: { _id: '21', subject: 'subject 20', description: 'describe 20' },
    whyRankList: [
      { why: { _id: '22', subject: '21 is greater than 2', description: '2 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '23', subject: '21 is greater than 3', description: '3 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '24', subject: '21 is greater than 4', description: '4 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '25', subject: '21 is greater than 5', description: '5 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '26', subject: '21 is greater than 6', description: '6 is why because', parentId: '21', category: 'most' } },
    ],
  },
  {
    point: { _id: '31', subject: 'subject 30', description: 'describe 30' },
    whyRankList: [
      { why: { _id: '32', subject: '30 is greater than 2', description: '2 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '33', subject: '30 is greater than 3', description: '3 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '34', subject: '30 is greater than 4', description: '4 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '35', subject: '30 is greater than 5', description: '5 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '36', subject: '30 is greater than 6', description: '6 is why because', parentId: '31', category: 'most' } },
    ],
  },
  {
    point: { _id: '41', subject: 'subject 40', description: 'describe 40' },
    whyRankList: [
      { why: { _id: '42', subject: '40 is greater than 2', description: '2 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '43', subject: '40 is greater than 3', description: '3 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '44', subject: '40 is greater than 4', description: '4 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '45', subject: '40 is greater than 5', description: '5 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '46', subject: '40 is greater than 6', description: '6 is why because', parentId: '41', category: 'least' } },
    ],
  },
]

const preRankByParentId = {
  1: { _id: '51', stage: 'pre', category: 'most', parentId: '1' },
  21: { _id: '52', stage: 'pre', category: 'most', parentId: '21' },
  31: { _id: '53', stage: 'pre', category: 'most', parentId: '31' },
  41: { _id: '54', stage: 'pre', category: 'least', parentId: '41' },
}

export const threePointLists = { args: { pointWithWhyRankListList, side: 'most', round: 1 } }

export const emptyPointList = { args: { pointWithWhyRankListList: [], round: 1 } }

export const emptyArgs = { args: {} }

export const withFirstItemRanked = { args: { pointWithWhyRankListList: pointWithWhyRankListListWithRanks, side: 'most', round: 1 } }

export const twoPointListsPlayThrough = {
  args: { pointWithWhyRankListList: [pointWithWhyRankListList[0], pointWithWhyRankListList[1]], side: 'least', round: 1 },
  play: async ({ canvasElement, args }) => {
    const { onDone } = args
    const canvas = within(canvasElement)
    const one = canvas.getByText('1 is less than 2')
    await userEvent.click(one)
    await asyncSleep(500) // allow transitions on the component to complete
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({ valid: false, value: 0, delta: { category: 'neutral', stage: 'why', parentId: '3' } })
    })
    await userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({ valid: false, value: 0, delta: { category: 'neutral', stage: 'why', parentId: '4' } })
    })
    await userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[2][0]).toMatchObject({ valid: false, value: 0, delta: { category: 'neutral', stage: 'why', parentId: '5' } })
    })
    userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[3][0]).toMatchObject({ valid: false, value: 0, delta: { category: 'neutral', stage: 'why', parentId: '6' } })
      expect(onDone.mock.calls[4][0]).toMatchObject({ valid: false, value: 0.5, delta: { category: 'most', stage: 'why', parentId: '2' } })
    })
    const two = canvas.getByText('21 is greater than 2')
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await waitFor(() => {
      expect(onDone.mock.calls[5][0]).toMatchObject({ valid: false, value: 0.5, delta: { category: 'neutral', stage: 'why', parentId: '23' } })
      expect(onDone.mock.calls[6][0]).toMatchObject({ valid: false, value: 0.5, delta: { category: 'neutral', stage: 'why', parentId: '24' } })
      expect(onDone.mock.calls[7][0]).toMatchObject({ valid: false, value: 0.5, delta: { category: 'neutral', stage: 'why', parentId: '25' } })
      expect(onDone.mock.calls[8][0]).toMatchObject({ valid: false, value: 0.5, delta: { category: 'neutral', stage: 'why', parentId: '26' } })
      expect(onDone.mock.calls[9][0]).toMatchObject({ valid: true, value: 1, delta: { category: 'most', stage: 'why', parentId: '22' } })
    })
  },
}

// rip pointWithWhyRankListList into the separate objects that go into the context
function getStepArgsFrom(pointWithWhyRankListList) {
  const cn = {
    ...pointWithWhyRankListList.reduce(
      (cn, rp) => {
        cn.defaultValue.reducedPointList.push({ point: rp.point })
        for (const whyRank of rp.whyRankList) {
          if (whyRank.why) cn.apiResult.whys.push(whyRank.why)
          if (whyRank.rank) cn.apiResult.ranks.push(whyRank.rank)
        }
        return cn
      },
      { defaultValue: { reducedPointList: [], preRankByParentId, round, discussionId }, apiResult: { whys: [], ranks: [] } }
    ),
  }
  return cn
}

// sets up the socket api mocks and renders the component
const StepTemplate = args => {
  // topWhyById and preRankByParentId are taken from args to uses by the api call
  const { defaultValue, apiResult, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-why-ranks-and-points'] = (discussionId, round, mostIds, leastIds, cb) => {
      window.socket._socketEmitHandlerResults['get-why-ranks-and-points'].push([discussionId, round, mostIds, leastIds])
      setTimeout(() => {
        cb(apiResult)
      })
    }
    window.socket._socketEmitHandlerResults['get-why-ranks-and-points'] = []
    window.socket._socketEmitHandlers['upsert-rank'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['upsert-rank'].push(rank)
      cb && cb()
    }
    window.socket._socketEmitHandlerResults['upsert-rank'] = []
  })
  return <CompareWhysStep {...otherArgs} />
}
export const BeginStepMost = {
  args: { ...getStepArgsFrom(pointWithWhyRankListList), category: 'most', round: 1 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
}

export const BeginStepLeast = {
  args: { ...getStepArgsFrom(pointWithWhyRankListList), category: 'least', round: 1 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
}

export const FirstMostFetchFromApi = {
  args: { ...getStepArgsFrom(pointWithWhyRankListListWithRanks), category: 'most', round: 1 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
  play: async ({ canvasElement, args }) => {
    const { onDone } = args
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
  },
}

export const FirstMostFetchFromApiTheUserCompletes = {
  args: { ...getStepArgsFrom(pointWithWhyRankListListWithRanks), category: 'most', round: 1 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
  play: async ({ canvasElement, args }) => {
    const { onDone } = args
    const canvas = within(canvasElement)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[0][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    const one = canvas.getByText('21 is greater than 2')
    await userEvent.click(one)
    await asyncSleep(500) // allow transitions on the component to complete
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    await userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[2][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    await userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[3][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    userEvent.click(one)
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[4][0]).toMatchObject({ valid: false, value: 1 / 3 })
      expect(onDone.mock.calls[5][0]).toMatchObject({ valid: false, value: 2 / 3 })
      expect(onDone.mock.calls.length).toBe(6)
    })
    const two = canvas.getByText('30 is greater than 2')
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await asyncSleep(500)
    await userEvent.click(two)
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsert-rank'][5]).toMatchObject({
        // id will be random so ignored
        category: 'neutral',
        parentId: '33',
        stage: 'why',
        discussionId: '1001',
        round: 1,
      })
      expect(onDone.mock.calls[7][0]).toMatchObject({ valid: false, value: 2 / 3 })
      expect(onDone.mock.calls[8][0]).toMatchObject({ valid: false, value: 2 / 3 })
      expect(onDone.mock.calls[9][0]).toMatchObject({ valid: false, value: 2 / 3 })
      expect(onDone.mock.calls[10][0]).toMatchObject({ valid: true, value: 1 })
      expect(deliberationContextData(canvas)).toMatchObject({
        whyRankByParentId: {
          2: { _id: '60', stage: 'why', category: 'most', parentId: '2' },
          3: { _id: '61', stage: 'why', category: 'neutral', parentId: '3' },
          4: { _id: '62', stage: 'why', category: 'neutral', parentId: '4' },
          5: { _id: '63', stage: 'why', category: 'neutral', parentId: '5' },
          6: { _id: '64', stage: 'why', category: 'neutral', parentId: '6' },
          22: { category: 'most', parentId: '22', stage: 'why', discussionId: '1001', round: 1 },
          23: { category: 'neutral', parentId: '23', stage: 'why', discussionId: '1001', round: 1 },
          24: { category: 'neutral', parentId: '24', stage: 'why', discussionId: '1001', round: 1 },
          25: { category: 'neutral', parentId: '25', stage: 'why', discussionId: '1001', round: 1 },
          26: { category: 'neutral', parentId: '26', stage: 'why', round: 1 },
          32: { category: 'most', parentId: '32', stage: 'why', discussionId: '1001', round: 1 },
          33: { category: 'neutral', parentId: '33', stage: 'why', discussionId: '1001', round: 1 },
          34: { category: 'neutral', parentId: '34', stage: 'why', discussionId: '1001', round: 1 },
          35: { category: 'neutral', parentId: '35', stage: 'why', discussionId: '1001', round: 1 },
          36: { category: 'neutral', parentId: '36', stage: 'why', discussionId: '1001', round: 1 },
        },
      })
    })
  },
}
