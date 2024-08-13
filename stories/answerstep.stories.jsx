// https://github.com/EnCiv/civil-pursuit/issues/102

import { userEvent, within } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import AnswerStep from '../app/components/answerstep'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'

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

const point = {
  subject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien',
  _id: 'ExampleId',
}

export const ExamplePoint = {
  args: {
    point,
  },
}
