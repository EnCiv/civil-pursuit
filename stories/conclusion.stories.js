// https://github.com/EnCiv/civil-pursuit/issues/298

import React from 'react'
import { onDoneDecorator, socketEmitDecorator, buildApiDecorator } from './common'
import { useState } from 'react'
import { userEvent, within } from '@storybook/test'
import expect from 'expect'

import Conclusion from '../app/components/steps/conclusion'

// sets up the socket api mocks and renders the component
const conclusionStepTemplate = args => {
  const { discussionId, stepIntro, ...otherArgs } = args
}

const decorators = [
  onDoneDecorator,
  socketEmitDecorator,
  buildApiDecorator('upsert-jsform', (discussionId, name, data, cb) => () => {}),
  buildApiDecorator('get-conclusion', (discussionId, cb) => {
    cb({
      leasts: [
        {
          _id: '6864611dda8eca6f38256714',
          description: '0.123456789',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
        {
          _id: '6864611dda8eca6f38256715',
          description: '0.234567891',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
        {
          _id: '6864611dda8eca6f38256716',
          description: '0.345678912',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
      ],
      mosts: [
        {
          _id: '6864611dda8eca6f38256717',
          description: '9.123456789',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
        {
          _id: '6864611dda8eca6f38256718',
          description: '9.234567891',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
        {
          _id: '6864611dda8eca6f38256719',
          description: '9.345678912',
          subject: 'proxy random number',
          userId: '6864611dda8eca6f38256712',
        },
      ],
      point: {
        _id: '6864611dda8eca6f38256713',
        description: '1.5870962407368285',
        subject: 'proxy random number',
        userId: '6864611dda8eca6f38256712',
      },
    })
  }),
]

export default {
  title: 'conclusion',
  component: Conclusion,
  decorators: decorators,
  parameters: {
    layout: 'fullscreen',
  },
}

export const renderTest = {
  args: { discussionId: 110, stepIntro: { subject: 'Conclusion', description: 'The next group decided this was the most important issue:' } },
}

export const playTest = {
  args: { discussionId: 111, stepIntro: { subject: 'Conclusion', description: 'The third group decided this was the most important issue:' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Awesome!'))
    expect(window.socket._socketEmitHandlerResults['upsert-jsform'][0]).toMatchObject([args.discussionId, 'conclusion', { howDoYouFeel: 'Awesome!' }])
  },
}
