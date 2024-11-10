// https://github.com/EnCiv/civil-pursuit/issues/199

import React, { useContext, useState } from 'react'
import DeliberationContext from '../app/components/deliberation-context'
import RankStep from '../app/components/steps/rank-step'

import {
  onDoneDecorator,
  onDoneResult,
  DeliberationContextDecorator,
  deliberationContextData,
  socketEmitDecorator,
} from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'

const round = 1
const discussionId = '1001'

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
    point: {
      _id,
      subject,
      description,
      groupedPoints,
      discussionId: discussionId,
      round: round,
      parentId: '1',
      user,
    },
  }
}

const point1 = createPointObj('1', 'Point 1', 'Point 1 Description')
const point2 = createPointObj('2', 'Point 2', 'Point 2 Description')
const point3 = createPointObj('3', 'Point 3', 'Point 3 Description')
const point4 = createPointObj('4', 'Point 4', 'Point 4 Description')
const point5 = createPointObj('5', 'Point 5', 'Point 5 Description')
const point6 = createPointObj('6', 'Point 6', 'Point 6 Description')
const point7 = createPointObj('7', 'Point 7', 'Point 7 Description')
const point8 = createPointObj('8', 'Point 8', 'Point 8 Description')
const point9 = createPointObj('9', 'Point 9', 'Point 9 Description')
const point10 = createPointObj('10', 'Point 10', 'Point 10 Description')

function rankPointsToContext(pointRankGroupList) {
  const cn = {
    ...pointRankGroupList.reduce(
      (cn, rp) => {
        // context, rankPoint
        console.log(pointRankGroupList)
        cn.pointById[rp.point._id] = rp.point
        rp.rank && (cn.preRankByParentId[rp.rank.parentId] = rp.rank)
        return cn
      },
      { pointById: {}, preRankByParentId: {}, groupIdsLists: [] }
    ),
  }
  console.log(cn)
  return cn
}

function getRankStepArgsFrom(pointRankGroupList) {
  const cn = rankPointsToContext(pointRankGroupList)
  const { preRankByParentId, ...defaultValue } = { ...cn, round, discussionId }
  return { preRankByParentId, defaultValue }
}

// sets up the socket api mocks and renders the component
const rankStepTemplate = args => {
  const { preRankByParentId, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-user-ranks'] = (discussionId, round, ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-ranks'] = [discussionId, round, ids]
      setTimeout(() => {
        const ranks = Object.values(preRankByParentId) // back to array
        cb([ranks])
      })
    }
    window.socket._socketEmitHandlers['upsert-rank'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['upsert-rank'] = rank
      cb && cb()
    }
  })
  return <RankStep {...otherArgs} />
}

export default {
  component: RankStep,
  decorators: [onDoneDecorator],
}

export const rerankStepWithPartialDataAndUserUpdate = {
  args: {
    ...getRankStepArgsFrom([
      { ...point1, rank: 'Most' },
      { ...point2, rank: 'Most' },
      { ...point3, rank: 'Least' },
      { ...point4, rank: '' },
      { ...point5, rank: '' },
      { ...point6, rank: '' },
      { ...point7, rank: '' },
    ]),
  },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: rankStepTemplate,
}
