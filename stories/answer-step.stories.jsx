// https://github.com/EnCiv/civil-pursuit/issues/102
import React from 'react'
import AnswerStep from '../app/components/answer-step'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { onDoneDecorator, onDoneResult } from './common'
import { within, userEvent } from '@storybook/testing-library'
import expect from 'expect'
export default {
  component: AnswerStep,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const defaultStartingPoint = {
  subject: 'Starting Point',
  description: 'Starting Point Description',
  _id: 'id_startingPoint',
}

const point1 = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  // description: 'Point 1 Description',
  _id: '1',
  parentId: defaultStartingPoint._id,
}

const point2 = {
  subject: 'Why should everyone consider solving this issue?',
  // description: 'Point 2 Description',
  _id: '2',
  parentId: defaultStartingPoint._id,
}

const point3 = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  // description: 'Point 3 Description',
  _id: '3',
  parentId: defaultStartingPoint._id,
}
const point4 = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  // description: 'Point 4 Description',
  _id: '4',
  parentId: 'None',
}
const point5 = {
  subject: 'Why should everyone consider solving this issue?',
  // description: 'Point 5 Description',
  _id: '5',
  parentId: 'None',
}

const defaultSharedPoints = {
  startingPoint: defaultStartingPoint,
  whyMosts: [point1, point2],
}

const multipleWhyMostsSharedPoints = {
  startingPoint: defaultStartingPoint,
  whyMosts: [point3, point4],
}

// set starting point after why
const startingAfterWhySharedPoints = {
  startingPoint: {},
  whyMosts: [point4, point5],
}

const Template = args => <AnswerStep {...args} />

// create a default case
export const Default = Template.bind({})
Default.args = {
  className: '',
  intro: 'Please provide a title and short description of your answer.',
  whyQuestion1: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  whyQuestion2: 'Why should everyone consider solving this issue?',
  shared: defaultSharedPoints,
}

export const Empty = {
  args: {},

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          startingPoint: {},
          whyMosts: [],
        },
      },
    })
  },
}

// create a mobile case
export const Mobile = Template.bind({})
Mobile.args = {
  className: '',
  intro: 'Please provide a title and short description of your answer.',
  whyQuestion1: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  whyQuestion2: 'Why should everyone consider solving this issue?',
  shared: defaultSharedPoints,
}
Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
}

// create a case where there are multiple whyMosts, but only one has a parentId of the startingPoint
export const MultipleWhyMosts = Template.bind({})
MultipleWhyMosts.args = {
  className: '',
  intro: 'Please provide a title and short description of your answer.',
  whyQuestion1: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  whyQuestion2: 'Why should everyone consider solving this issue?',
  shared: multipleWhyMostsSharedPoints,
}

// create a test case where the use sets the why answer first, and then the startingPoint - this case needs to get the parentId right
export const SetStartingPointAfterWhy = Template.bind({})
SetStartingPointAfterWhy.args = {
  className: '',
  intro: 'Please provide a title and short description of your answer.',
  whyQuestion1: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  whyQuestion2: 'Why should everyone consider solving this issue?',
  shared: startingAfterWhySharedPoints,
}
SetStartingPointAfterWhy.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)

  const subjectEle = await canvas.findAllByPlaceholderText(/type some thing here/i)
  const descriptionEle = await canvas.findAllByPlaceholderText(/description/i)

  await userEvent.type(subjectEle[0], 'first subject')
  await userEvent.tab()
  await userEvent.type(descriptionEle[0], 'first description')
  await userEvent.tab()
  await userEvent.type(subjectEle[1], 'second subject')
  await userEvent.tab()
  await userEvent.type(descriptionEle[1], 'second description')
  await userEvent.tab()
}
