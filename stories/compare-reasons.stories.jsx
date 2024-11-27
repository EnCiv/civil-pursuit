// https://github.com/EnCiv/civil-pursuit/issues/200

import CompareWhysStep, { CompareWhys } from '../app/components/steps/compare-whys'
import { asyncSleep, onDoneDecorator } from './common'
import { within, userEvent, waitFor } from '@storybook/test'
import expect from 'expect'

export default { component: CompareWhys, args: {}, decorators: [onDoneDecorator] }

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
      { why: { _id: '22', subject: '21 is less than 2', description: '2 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '23', subject: '21 is less than 3', description: '3 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '24', subject: '21 is less than 4', description: '4 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '25', subject: '21 is less than 5', description: '5 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '26', subject: '21 is less than 6', description: '6 is why because', parentId: '21', category: 'most' } },
    ],
  },
  {
    point: { _id: '31', subject: 'subject 30', description: 'describe 30' },
    whyRankList: [
      { why: { _id: '32', subject: '21 is less than 2', description: '2 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '33', subject: '21 is less than 3', description: '3 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '34', subject: '21 is less than 4', description: '4 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '35', subject: '21 is less than 5', description: '5 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '36', subject: '21 is less than 6', description: '6 is why because', parentId: '31', category: 'most' } },
    ],
  },
  {
    point: { _id: '41', subject: 'subject 40', description: 'describe 40' },
    whyRankList: [
      { why: { _id: '42', subject: '21 is less than 2', description: '2 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '43', subject: '21 is less than 3', description: '3 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '44', subject: '21 is less than 4', description: '4 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '45', subject: '21 is less than 5', description: '5 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '46', subject: '21 is less than 6', description: '6 is why because', parentId: '41', category: 'least' } },
    ],
  },
]

export const threePointLists = { args: { pointWithWhyRankListList, side: 'most' } }

export const emptyPointList = { args: { pointWithWhyRankListList: [] } }

export const emptyArgs = { args: {} }

export const twoPointListsPlayThrough = {
  args: { pointWithWhyRankListList: [pointWithWhyRankListList[0], pointWithWhyRankListList[1]], side: 'least' },
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
    const two = canvas.getByText('21 is less than 2')
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
