// https://github.com/EnCiv/civil-pursuit/issues/200
import React, { useState } from 'react'
import CompareWhysStep, { CompareWhys } from '../app/components/steps/compare-whys'
import { getLoadedStepComplete } from '../app/components/tournament'
import { useDeliberationContext } from '../app/components/deliberation-context'
import { asyncSleep, onDoneDecorator, socketEmitDecorator, DeliberationContextDecorator, deliberationContextData } from './common'
import { expect, within, userEvent, waitFor } from 'storybook/test'

export default { component: CompareWhys, args: {}, decorators: [onDoneDecorator] }

const round = 1
const discussionId = '1001'

async function clickReason(canvas, subject) {
  await userEvent.click(canvas.getByText(subject))
}

async function goToReason(canvas, index, total) {
  const nextReason = canvas.getByRole('button', { name: 'Next reason' })
  expect(nextReason).not.toBeDisabled()
  await userEvent.click(nextReason)
  await waitFor(() => expect(canvas.getByText(`${index} / ${total}`)).toBeVisible())
}

async function waitForRankDelta(onDone, expectedDelta) {
  await waitFor(() => {
    const matchingCall = onDone.mock.calls.find(([result]) => {
      if (!result?.delta) return false
      const delta = Array.isArray(result.delta) ? result.delta : [result.delta]
      return delta.some(item => Object.entries(expectedDelta).every(([key, value]) => item[key] === value))
    })
    expect(matchingCall).toBeTruthy()
  })
}

const pointWithWhyRankListList = [
  {
    point: { _id: '1', subject: 'Reliable evening bus service', description: 'Later and more frequent routes help residents reach work and essential services.' },
    whyRankList: [
      { why: { _id: '2', subject: 'Late routes help workers get home', description: 'Evening service gives shift workers a reliable trip after work.', parentId: '1', category: 'most' } },
      { why: { _id: '3', subject: 'Frequent buses reduce long waits', description: 'Shorter waits make transit more useful for people with tight schedules.', parentId: '1', category: 'most' } },
      { why: { _id: '4', subject: 'Transit connects residents to care', description: 'Reliable routes help people reach clinics, pharmacies, and other services.', parentId: '1', category: 'most' } },
      { why: { _id: '5', subject: 'Reliable service expands job choices', description: 'Workers can consider jobs farther away when buses run consistently.', parentId: '1', category: 'most' } },
      { why: { _id: '6', subject: 'Evening trips can reduce car dependence', description: 'Useful transit gives households another way to travel after dark.', parentId: '1', category: 'most' } },
    ],
  },
  {
    point: { _id: '21', subject: 'Safer school crossings', description: 'Clear crossings and slower traffic help students travel safely to class.' },
    whyRankList: [
      { why: { _id: '22', subject: 'A safe crossing protects every student', description: 'Visible markings and slower traffic reduce risks on the school commute.', parentId: '21', category: 'most' } },
      { why: { _id: '23', subject: 'Clear markings help drivers see walkers', description: 'Well-marked crossings make it easier for drivers to notice people crossing.', parentId: '21', category: 'most' } },
      { why: { _id: '24', subject: 'Slower traffic gives children time', description: 'Lower speeds give young pedestrians more time to cross safely.', parentId: '21', category: 'most' } },
      { why: { _id: '25', subject: 'Accessible ramps support every family', description: 'Curb ramps help people using mobility devices and families with strollers.', parentId: '21', category: 'most' } },
      { why: { _id: '26', subject: 'Safer routes encourage walking', description: 'Families are more likely to walk when crossings feel predictable and safe.', parentId: '21', category: 'most' } },
    ],
  },
  {
    point: { _id: '31', subject: 'Affordable childcare nearby', description: 'Local childcare options help parents work while children receive consistent care.' },
    whyRankList: [
      { why: { _id: '32', subject: 'Affordable care supports working parents', description: 'Lower costs make it easier for parents to keep steady work.', parentId: '31', category: 'most' } },
      { why: { _id: '33', subject: 'Stable care helps children learn', description: 'Consistent caregivers give young children a secure place to grow.', parentId: '31', category: 'most' } },
      { why: { _id: '34', subject: 'Nearby programs save families time', description: 'Local options reduce the time parents spend traveling between care and work.', parentId: '31', category: 'most' } },
      { why: { _id: '35', subject: 'Lower fees ease family budgets', description: 'Reduced childcare costs leave families more for food, housing, and savings.', parentId: '31', category: 'most' } },
      { why: { _id: '36', subject: 'More slots shorten waiting lists', description: 'Additional spaces help parents find care when they need it.', parentId: '31', category: 'most' } },
    ],
  },
  {
    point: { _id: '41', subject: 'Neighborhood shade trees', description: 'Tree cover cools sidewalks and makes walking more comfortable in summer.' },
    whyRankList: [
      { why: { _id: '42', subject: 'Tree shade cools hot sidewalks', description: 'Canopy lowers heat on walking routes during summer.', parentId: '41', category: 'least' } },
      { why: { _id: '43', subject: 'Healthy trees improve local air', description: 'Trees can filter some pollution and make streets more pleasant.', parentId: '41', category: 'least' } },
      { why: { _id: '44', subject: 'Green streets invite more walking', description: 'Shaded routes are more comfortable for everyday trips on foot.', parentId: '41', category: 'least' } },
      { why: { _id: '45', subject: 'Canopy helps protect people from heat', description: 'Shade is especially useful for older adults and others vulnerable to heat.', parentId: '41', category: 'least' } },
      { why: { _id: '46', subject: 'Trees make public spaces welcoming', description: 'Green streets create comfortable places for neighbors to gather.', parentId: '41', category: 'least' } },
    ],
  },
]

const rankedWhyRankList = pointWithWhyRankListList[0].whyRankList.map(({ why }, index) => ({
  why,
  rank: { _id: String(60 + index), stage: 'why', category: index === 0 ? 'most' : 'neutral', parentId: why._id },
}))

const pointWithWhyRankListListWithRanks = [
  { ...pointWithWhyRankListList[0], whyRankList: rankedWhyRankList },
  ...pointWithWhyRankListList.slice(1),
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
    expect(canvas.getByText('1 / 2')).toBeInTheDocument()
    const nextReason = canvas.getByRole('button', { name: 'Next reason' })
    expect(nextReason).not.toBeDisabled()
    await userEvent.click(nextReason)
    expect(canvas.getByText('2 / 2')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Previous reason' }))
    expect(canvas.getByText('1 / 2')).toBeInTheDocument()
    await clickReason(canvas, 'Late routes help workers get home')
    await asyncSleep(500) // allow transitions on the component to complete
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '3' })
    await clickReason(canvas, 'Late routes help workers get home')
    await asyncSleep(500)
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '4' })
    await clickReason(canvas, 'Late routes help workers get home')
    await asyncSleep(500)
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '5' })
    userEvent.click(canvas.getByText('Late routes help workers get home'))
    await asyncSleep(500)
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '6' })
    await waitForRankDelta(onDone, { category: 'most', stage: 'why', parentId: '2' })
    await goToReason(canvas, 2, 2)
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500)
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500)
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500)
    await clickReason(canvas, 'A safe crossing protects every student')
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '23' })
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '24' })
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '25' })
    await waitForRankDelta(onDone, { category: 'neutral', stage: 'why', parentId: '26' })
    await waitForRankDelta(onDone, { category: 'most', stage: 'why', parentId: '22' })
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
      { defaultValue: { reducedPointList: [], preRankByParentId, round, discussionId, storageAvailable: false }, apiResult: { whys: [], ranks: [] } }
    ),
  }
  return cn
}

// sets up the socket api mocks and renders the component
const StepTemplate = args => {
  // topWhyById and preRankByParentId are taken from args to uses by the api call
  const { defaultValue, apiResult, fetchDelay = 0, fetchFailure = false, ...otherArgs } = args
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    let failureDelivered = false
    window.socket._socketEmitHandlers['get-why-ranks-and-points'] = (discussionId, round, mostIds, leastIds, cb) => {
      window.socket._socketEmitHandlerResults['get-why-ranks-and-points'].push([discussionId, round, mostIds, leastIds])
      setTimeout(() => {
        if (fetchFailure && !failureDelivered) {
          failureDelivered = true
          cb(null)
        } else {
          cb(apiResult)
        }
      }, fetchDelay)
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

const CompareReasonsCompletionStatus = ({ category, round }) => {
  const { data } = useDeliberationContext()
  const complete = getLoadedStepComplete({ webComponent: 'CompareReasons', category }, data, round)
  return <output data-testid="compare-reasons-loaded-status">{complete === undefined ? 'loading' : complete ? 'complete' : 'incomplete'}</output>
}

const StepTemplateWithCompletionStatus = props => (
  <>
    <StepTemplate {...props} />
    <CompareReasonsCompletionStatus category={props.category} round={props.round} />
  </>
)

export const BeginStepMost = {
  args: { ...getStepArgsFrom(pointWithWhyRankListList), category: 'most', round: 1 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
}

export const FetchFailureCanRetry = {
  args: { ...getStepArgsFrom(pointWithWhyRankListList), category: 'most', round: 1, fetchFailure: true },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplate {...props} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(canvas.getByRole('alert')).toHaveTextContent('Explanations could not be loaded.')
      expect(args.onDone.mock.calls.at(-1)?.[0]).toMatchObject({ valid: false, value: 0 })
    })

    const retry = await waitFor(() => canvas.getByRole('button', { name: 'Retry loading explanations' }))
    await userEvent.click(retry)
    await waitFor(() => {
      expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
      expect(canvas.queryByText('Loading explanations...')).not.toBeInTheDocument()
    })
  },
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
    expect(canvas.getByText('1 / 3')).toBeInTheDocument()
  },
}

export const TournamentCompletionWaitsForWhyData = {
  args: { ...getStepArgsFrom([pointWithWhyRankListList[0]]), category: 'most', round, fetchDelay: 200 },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
  render: props => <StepTemplateWithCompletionStatus {...props} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByTestId('compare-reasons-loaded-status')
    await waitFor(() => expect(status).toHaveTextContent('loading'))
    await waitFor(() => expect(status).toHaveTextContent('incomplete'), { timeout: 3000 })
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
    await goToReason(canvas, 2, 3)
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500) // allow transitions on the component to complete
    await waitFor(() => {
      expect(onDone.mock.calls[1][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[2][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    await clickReason(canvas, 'A safe crossing protects every student')
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[3][0]).toMatchObject({ valid: false, value: 1 / 3 })
    })
    userEvent.click(canvas.getByText('A safe crossing protects every student'))
    await asyncSleep(500)
    await waitFor(() => {
      expect(onDone.mock.calls[4][0]).toMatchObject({ valid: false, value: 1 / 3 })
      expect(onDone.mock.calls[5][0]).toMatchObject({ valid: false, value: 2 / 3 })
      expect(onDone.mock.calls.length).toBe(6)
    })
    await goToReason(canvas, 3, 3)
    await clickReason(canvas, 'Affordable care supports working parents')
    await asyncSleep(500)
    await clickReason(canvas, 'Affordable care supports working parents')
    await asyncSleep(500)
    await clickReason(canvas, 'Affordable care supports working parents')
    await asyncSleep(500)
    await clickReason(canvas, 'Affordable care supports working parents')
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
    await userEvent.click(canvas.getByRole('button', { name: 'Previous reason' }))
    await userEvent.click(canvas.getByText('Start Over'))
    await userEvent.click(canvas.getByRole('button', { name: 'Next reason' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Previous reason' }))
    await waitFor(() => {
      expect(canvas.queryByText('Start Over')).not.toBeInTheDocument()
      expect(onDone.mock.calls.at(-1)[0]).toMatchObject({ valid: false, value: 2 / 3 })
    })
  },
}
