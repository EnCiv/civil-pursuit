// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

import React, { useContext, useState } from 'react'
import DeliberationContext from '../app/components/deliberation-context'
import RerankStep, { Rerank } from '../app/components/steps/rerank'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'

import { onDoneDecorator, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator, asyncSleep } from './common'
import { within, userEvent, expect, waitFor } from 'storybook/test'

export default {
  component: Rerank,
  decorators: [onDoneDecorator],
}

const round = 1
const discussionId = '1001'

const reducedPointList = [
  {
    point: { _id: '1', subject: 'Make school crossings safer', description: 'Slower traffic and visible crosswalks can protect students on their walk to class.', parentId: discussionId },
  },
  {
    point: { _id: '2', subject: 'Run buses later on weekdays', description: 'Evening service helps shift workers reach home without needing a car.', parentId: discussionId },
  },
  {
    point: { _id: '3', subject: 'Expand affordable childcare', description: 'More local childcare options help parents work while children receive consistent care.', parentId: discussionId },
  },
]

const topWhysByCategoryByParentId = {
  most: {
    1: [
      { _id: '11', subject: 'A safe crossing protects every student', description: 'Clear markings and slower traffic reduce the risk for children walking to school.', category: 'most', parentId: '1' },
      { _id: '12', subject: 'Families need confidence at busy streets', description: 'A visible, well-designed crossing helps caregivers and students travel more safely.', category: 'most', parentId: '1' },
    ],
    2: [
      { _id: '21', subject: 'Reliable transit keeps jobs reachable', description: 'Frequent evening buses connect workers to jobs and essential services.', category: 'most', parentId: '2' },
      { _id: '22', subject: 'Late routes give workers more choices', description: 'People should not have to turn down a shift because the last bus leaves too early.', category: 'most', parentId: '2' },
    ],
    3: [
      { _id: '31', subject: 'Affordable care supports working parents', description: 'Lower childcare costs make it easier for parents to keep steady work.', category: 'most', parentId: '3' },
      { _id: '32', subject: 'Young children benefit from consistent care', description: 'Stable childcare gives children a safe place to learn and develop.', category: 'most', parentId: '3' },
    ],
  },
  least: {
    1: [
      { _id: '13', subject: 'Decorative upgrades can wait', description: 'Basic repairs and safe routes should come before cosmetic changes.', category: 'least', parentId: '1' },
      { _id: '14', subject: 'The current design already works for many', description: 'A small improvement may not be urgent compared with unmet community needs.', category: 'least', parentId: '1' },
    ],
    2: [
      { _id: '23', subject: 'Weekend service may have low ridership', description: 'A pilot can measure demand before committing to a permanent schedule.', category: 'least', parentId: '2' },
      { _id: '24', subject: 'Other routes need service first', description: 'Limited transit funds may be more useful on corridors with longer waits.', category: 'least', parentId: '2' },
    ],
    3: [
      { _id: '33', subject: 'A subsidy alone may not lower costs', description: 'Affordability also depends on the number of available childcare spaces.', category: 'least', parentId: '3' },
      { _id: '34', subject: 'Other family services may be more urgent', description: 'Families may need housing, healthcare, or food support alongside childcare.', category: 'least', parentId: '3' },
    ],
  },
}

const postRankByParentId = {
  1: { _id: '201', stage: 'post', category: 'most', parentId: '1', discussionId, round: 1 },
  2: { _id: '202', stage: 'post', category: 'neutral', parentId: '2', discussionId, round: 1 },
  3: { _id: '203', stage: 'post', category: 'least', parentId: '3', discussionId, round: 1 },
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
    discussionId,
    round,
  },
}

// Desktop with DemInfo data for all points
const DemInfoDecorator = ({ children }) => {
  const { upsert } = React.useContext(DemInfoContext)

  React.useEffect(() => {
    // Set UISchema
    upsert({
      uischema: {
        type: 'VerticalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/stateOfResidence' },
          { type: 'Control', scope: '#/properties/yearOfBirth' },
          { type: 'Control', scope: '#/properties/politicalParty' },
        ],
      },
    })
    // Set dem-info for all points (including nested whys)
    upsert({
      demInfoById: {
        1: { stateOfResidence: 'California', yearOfBirth: 1985, politicalParty: 'Democrat', shareInfo: 'Yes' },
        2: { stateOfResidence: 'Texas', yearOfBirth: 1990, politicalParty: 'Republican', shareInfo: 'Yes' },
        3: { stateOfResidence: 'New York', yearOfBirth: 1975, politicalParty: 'Independent', shareInfo: 'Yes' },
        11: { stateOfResidence: 'Florida', yearOfBirth: 1988, politicalParty: 'Democrat', shareInfo: 'Yes' },
        12: { stateOfResidence: 'Oregon', yearOfBirth: 1992, politicalParty: 'Green', shareInfo: 'Yes' },
        13: { stateOfResidence: 'Nevada', yearOfBirth: 1980, politicalParty: 'Libertarian', shareInfo: 'Yes' },
        14: { stateOfResidence: 'Washington', yearOfBirth: 1995, politicalParty: 'Democrat', shareInfo: 'Yes' },
        21: { stateOfResidence: 'Arizona', yearOfBirth: 1983, politicalParty: 'Republican', shareInfo: 'Yes' },
        22: { stateOfResidence: 'Georgia', yearOfBirth: 1987, politicalParty: 'Republican', shareInfo: 'Yes' },
        23: { stateOfResidence: 'Ohio', yearOfBirth: 1991, politicalParty: 'Independent', shareInfo: 'Yes' },
        24: { stateOfResidence: 'Michigan', yearOfBirth: 1978, politicalParty: 'Democrat', shareInfo: 'Yes' },
        31: { stateOfResidence: 'Pennsylvania', yearOfBirth: 1982, politicalParty: 'Independent', shareInfo: 'Yes' },
        32: { stateOfResidence: 'Colorado', yearOfBirth: 1989, politicalParty: 'Democrat', shareInfo: 'Yes' },
        33: { stateOfResidence: 'Virginia', yearOfBirth: 1993, politicalParty: 'Republican', shareInfo: 'Yes' },
        34: { stateOfResidence: 'North Carolina', yearOfBirth: 1986, politicalParty: 'Independent', shareInfo: 'Yes' },
      },
    })
  }, [upsert])

  return children
}

export const DesktopWithDemInfo = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
    discussionId,
    round,
  },
  decorators: [
    Story => (
      <DemInfoProvider>
        <DemInfoDecorator>
          <Story />
        </DemInfoDecorator>
      </DemInfoProvider>
    ),
  ],
}

export const Mobile = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
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
    reducedPointList,
    topWhysByCategoryByParentId,
    postRankByParentId,
    discussionId,
    round,
  },
}

export const PartialWithInitialRank = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
    postRankByParentId: { 1: postRankByParentId[1], 2: postRankByParentId[2] },
    discussionId,
    round,
  },
}

export const onDoneIsCalledIfInitialData = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
    postRankByParentId: { 1: postRankByParentId[1] },
    discussionId,
    round,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(args.onDone.mock.calls[0][0]).toMatchObject({
        valid: false,
        value: 0.3333333333333333,
      })
    })
  },
}

export const onDoneIsCalledAfterUserChangesRank = {
  args: {
    reducedPointList,
    topWhysByCategoryByParentId,
    postRankByParentId: { 1: postRankByParentId[1] },
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
        delta: { ...postRankByParentId[1], category: 'neutral' },
      })
    })
  },
}

// sets up the socket api mocks and renders the component
const rerankStepTemplate = args => {
  // topWhyById and postRankByParentId are taken from args to uses by the api call
  const { topWhysByCategoryByParentId, postRankByParentId, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-user-post-ranks-and-top-ranked-whys'] = (discussionId, round, ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-post-ranks-and-top-ranked-whys'] = [discussionId, round, ids]
      setTimeout(() => {
        // convert topWhysByCategoryByParentId to array of whys
        const whys = Object.values(topWhysByCategoryByParentId || {}).flatMap(categoryObj => Object.values(categoryObj).flat())
        const ranks = Object.values(postRankByParentId) // back to array
        cb({ ranks, whys })
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
  args: {
    defaultValue: {
      storageAvailable: false, // Force localStorage to appear disabled so socket.emit is used
      discussionId,
      reducedPointList,
    },
    topWhysByCategoryByParentId,
    postRankByParentId: { 1: postRankByParentId[1] },
    round,
  },
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
        round: 1,
      })
      expect(deliberationContextData(canvas)).toMatchObject({
        postRankByParentId: {
          1: { _id: '201', stage: 'post', category: 'neutral', parentId: '1', discussionId: '1001', round: 1 },
        },
      })
    })
  },
}

export const rerankStepWithTopDownUpdate = {
  args: { defaultValue: { discussionId, reducedPointList, uInfo: [{ shownStatementIds: {} }, { shownStatementIds: {} }] }, topWhysByCategoryByParentId, postRankByParentId: { 1: postRankByParentId[1] }, round },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: args => {
    // simulate a top down update after the component initially renders
    const { data = {}, upsert } = useContext(DeliberationContext)
    useState(() => {
      // execute this code once, before the component is initially rendered
      setTimeout(() => {
        upsert({
          postRankByParentId: {
            2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 1 },
          },
        })
      }, 100)
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
            round: 1,
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
          1: { _id: '201', stage: 'post', category: 'most', parentId: '1', discussionId: '1001', round: 1 },
          2: { _id: '211', stage: 'post', category: 'least', parentId: '2', discussionId: '1001', round: 1 },
        },
      })
    })
  },
}
