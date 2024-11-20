import { userEvent, within } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import WhyInput from '../app/components/why-input'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'
import DemInfo from '../app/components/dem-info'

export default {
  component: WhyInput,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const point = {
  subject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
  _id: 'ExampleId',
  demInfo: {
    dob: '1990-10-20T00:00:00.000Z',
    state: 'NY',
    party: 'Independent',
  },
}

export const ExamplePoint = {
  args: {
    point,
  },
}

export const Empty = {
  args: {},
}

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
  args: {
    point,
  },
}

export const onDoneTest = {
  args: {
    point: {
      subject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
      _id: 'ExampleId',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const subjectEle = canvas.getByPlaceholderText(/type some thing here/i)
    const descriptionEle = canvas.getByPlaceholderText(/description/i)
    await userEvent.type(subjectEle, 'This is the subject!')
    await userEvent.tab() // onDone will be called after moving out of input field

    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: { valid: false, value: { subject: 'This is the subject!', description: '' } },
    })

    await userEvent.type(descriptionEle, 'This is the description!')
    await userEvent.tab() // onDone will be called after moving out of input field

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: {
        valid: true,
        value: {
          subject: 'This is the subject!',
          description: 'This is the description!',
        },
      },
    })
  },
}
