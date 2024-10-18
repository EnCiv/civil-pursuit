import PairCompare from '../app/components/pair-compare'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/test'
import expect from 'expect'
import React from 'react'

export default {
  component: PairCompare,
  args: {},
  decorators: [onDoneDecorator],
}

const pointOne = { subject: 'Point 1', description: 'This is the first point' }
const pointTwo = { subject: 'Point 2', description: 'This is the second point' }
const pointThree = { subject: 'Point 3', description: 'This is the third point' }
const pointFour = { subject: 'Point 4', description: 'This is the fourth point' }
const pointFive = { subject: 'Point 5', description: 'This is the fifth point' }
const pointSix = { subject: 'Point 6', description: 'This is the sixth point' }

export const sixPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne, pointTwo, pointThree, pointFour, pointFive, pointSix],
  },
}

export const empty = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
  },
  pointList: [],
}

export const onePoint = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne],
  },
}

export const twoPoints = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne, pointTwo],
  },
}

export const onDoneTest = {
  args: {
    mainPoint: {
      subject: 'Global Warming',
      description: 'Climate change and global warming',
    },
    pointList: [pointOne, pointTwo, pointThree, pointFour],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const Point1 = canvas.getByText('Point 1')
    await userEvent.click(Point1)

    setTimeout(() => {
      // wait for transition to occur
      const Point3 = canvas.getByText('Point 3')
      userEvent.click(Point3)
    }, 500)

    setTimeout(() => {
      const Point4 = canvas.getByText('Point 4')
      userEvent.click(Point4)
    }, 1300)

    setTimeout(() => {
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
        onDoneResult: {
          valid: true,
          value: {
            description: 'This is the fourth point',
            subject: 'Point 4',
          },
        },
      })
    }, 1500)
  },
}
