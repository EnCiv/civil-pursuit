// https://github.com/EnCiv/civil-pursuit/issues/200

import CompareReasons from '../app/components/steps/compare-whys'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/test'
import expect from 'expect'

export default {
  component: CompareReasons,
  args: {},
  decorators: [onDoneDecorator],
}

const pointWithWhyRankListList = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'describe 1' },
    whyRankList: [
      {
        why: {
          _id: '2',
          subject: '1 is less than 2',
          description: '2 is why because',
          parentId: '1',
          category: 'most',
        },
      },
      {
        why: {
          _id: '3',
          subject: '1 is less than 3',
          description: '3 is why because',
          parentId: '1',
          category: 'most',
        },
      },
      {
        why: {
          _id: '4',
          subject: '1 is less than 4',
          description: '4 is why because',
          parentId: '1',
          category: 'most',
        },
      },
      {
        why: {
          _id: '5',
          subject: '1 is less than 5',
          description: '5 is why because',
          parentId: '1',
          category: 'most',
        },
      },
      {
        why: {
          _id: '6',
          subject: '1 is less than 6',
          description: '6 is why because',
          parentId: '1',
          category: 'most',
        },
      },
    ],
  },
  {
    point: { _id: '21', subject: 'subject 20', description: 'describe 20' },
    whyRankList: [
      {
        why: {
          _id: '22',
          subject: '21 is less than 2',
          description: '2 is why because',
          parentId: '21',
          category: 'most',
        },
      },
      {
        why: {
          _id: '23',
          subject: '21 is less than 3',
          description: '3 is why because',
          parentId: '21',
          category: 'most',
        },
      },
      {
        why: {
          _id: '24',
          subject: '21 is less than 4',
          description: '4 is why because',
          parentId: '21',
          category: 'most',
        },
      },
      {
        why: {
          _id: '25',
          subject: '21 is less than 5',
          description: '5 is why because',
          parentId: '21',
          category: 'most',
        },
      },
      {
        why: {
          _id: '26',
          subject: '21 is less than 6',
          description: '6 is why because',
          parentId: '21',
          category: 'most',
        },
      },
    ],
  },
  {
    point: { _id: '31', subject: 'subject 30', description: 'describe 30' },
    whyRankList: [
      {
        why: {
          _id: '32',
          subject: '21 is less than 2',
          description: '2 is why because',
          parentId: '31',
          category: 'most',
        },
      },
      {
        why: {
          _id: '33',
          subject: '21 is less than 3',
          description: '3 is why because',
          parentId: '31',
          category: 'most',
        },
      },
      {
        why: {
          _id: '34',
          subject: '21 is less than 4',
          description: '4 is why because',
          parentId: '31',
          category: 'most',
        },
      },
      {
        why: {
          _id: '35',
          subject: '21 is less than 5',
          description: '5 is why because',
          parentId: '31',
          category: 'most',
        },
      },
      {
        why: {
          _id: '36',
          subject: '21 is less than 6',
          description: '6 is why because',
          parentId: '31',
          category: 'most',
        },
      },
    ],
  },
  {
    point: { _id: '41', subject: 'subject 40', description: 'describe 40' },
    whyRankList: [
      {
        why: {
          _id: '42',
          subject: '21 is less than 2',
          description: '2 is why because',
          parentId: '41',
          category: 'least',
        },
      },
      {
        why: {
          _id: '43',
          subject: '21 is less than 3',
          description: '3 is why because',
          parentId: '41',
          category: 'least',
        },
      },
      {
        why: {
          _id: '44',
          subject: '21 is less than 4',
          description: '4 is why because',
          parentId: '41',
          category: 'least',
        },
      },
      {
        why: {
          _id: '45',
          subject: '21 is less than 5',
          description: '5 is why because',
          parentId: '41',
          category: 'least',
        },
      },
      {
        why: {
          _id: '46',
          subject: '21 is less than 6',
          description: '6 is why because',
          parentId: '41',
          category: 'least',
        },
      },
    ],
  },
]
const pointOne = { subject: 'Point 1', description: 'This is the first point' }
const pointTwo = { subject: 'Point 2', description: 'This is the second point' }
const pointThree = { subject: 'Point 3', description: 'This is the third point' }
const pointFour = { subject: 'Point 4', description: 'This is the fourth point' }
const pointFive = { subject: 'Point 5', description: 'This is the fifth point' }
const pointSix = { subject: 'Point 6', description: 'This is the sixth point' }
const pointSeven = { subject: 'Point 7', description: 'This is the seventh point' }
const pointEight = { subject: 'Point 8', description: 'This is the eighth point' }
const pointNine = { subject: 'Point 9', description: 'This is the ninth point' }
const pointTen = { subject: 'Point 10', description: 'This is the tenth point' }

const pointEleven = { subject: 'Point 11', description: 'This is the eleventh point' }
const pointTwelve = { subject: 'Point 12', description: 'This is the twelfth point' }
const pointThirteen = { subject: 'Point 13', description: 'This is the thirteenth point' }
const pointFourteen = { subject: 'Point 14', description: 'This is the fourteenth point' }
const pointFifteen = { subject: 'Point 15', description: 'This is the fifteenth point' }
const pointSixteen = { subject: 'Point 16', description: 'This is the sixteenth point' }
const pointSeventeen = { subject: 'Point 17', description: 'This is the seventeenth point' }
const pointEighteen = { subject: 'Point 18', description: 'This is the eighteenth point' }

const pointList = [
  {
    subject: 'Headline Issue #1',
    description: 'Description for Headline Issue #1',
    pointWithWhyRankListList,
    reasonPoints: {
      most: [pointOne, pointTwo, pointThree, pointFour, pointFive],
      least: [pointSix, pointSeven, pointEight, pointNine, pointTen],
    },
  },
  {
    subject: 'Headline Issue #2',
    description: 'Description for Headline Issue #2',
    reasonPoints: {
      most: [pointEleven, pointTwelve],
      least: [pointThirteen, pointFourteen],
    },
  },
  {
    subject: 'Headline Issue #3',
    description: 'Description for Headline Issue #3',
    reasonPoints: {
      most: [pointFifteen, pointSixteen],
      least: [pointSeventeen, pointEighteen],
    },
  },
]

export const threePointLists = {
  args: {
    pointWithWhyRankListList,
    side: 'most',
  },
}

export const emptyPointList = {
  args: {
    pointList: [],
  },
}

export const emptyArgs = {
  args: {},
}

export const twoPointListsPlayThrough = {
  args: {
    pointList: pointList.slice(1, 3),
    side: 'least',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pointThirteen = canvas.getByText('Point 13')
    const pointSeventeen = canvas.getByText('Point 17')

    await userEvent.click(pointThirteen)
    await userEvent.click(pointSeventeen)
    expect(onDoneResult(canvas)).toMatchObject({
      count: 5,
      onDoneResult: {
        valid: true,
        value: 100,
      },
    })
  },
}
