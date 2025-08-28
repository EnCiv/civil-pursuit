// https://github.com/EnCiv/civil-pursuit/issues/298

import React from 'react'
import { onDoneDecorator, socketEmitDecorator } from './common'
import { useState } from 'react'

import Conclusion from '../app/components/steps/conclusion'

// sets up the socket api mocks and renders the component
const conclusionStepTemplate = args => {
  const { discussionId, stepIntro, ...otherArgs } = args

  const conclusionInfo = {
    101: {
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
    },
  }

  useState(() => {
    window.socket._socketEmitHandlers['get-conclusion'] = (discussionId, cb) => {
      window.socket._socketEmitHandlerResults['get-conclusion'] = [discussionId]
      console.log('Socket emit for get-conclusion:', discussionId)
      setTimeout(() => {
        cb(conclusionInfo[discussionId])
      })
    }
  })
  return <Conclusion discussionId={discussionId} stepIntro={stepIntro} {...otherArgs} />
}

export default {
  title: 'conclusion',
  component: Conclusion,
  decorators: [onDoneDecorator, socketEmitDecorator],
  parameters: {
    layout: 'fullscreen',
  },
}

export const renderTest = {
  args: { discussionId: 101, stepIntro: { subject: 'Conclusion', description: 'The group decided this was the most important issue:' } },
  decorators: [onDoneDecorator, socketEmitDecorator],
  render: conclusionStepTemplate,
}
