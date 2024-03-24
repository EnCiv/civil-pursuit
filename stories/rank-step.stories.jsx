//https://github.com/EnCiv/civil-pursuit/issues/51
import RankStep from '../app/components/rank-step'
import React from 'react'
import expect from 'expect'

import { onDoneDecorator, onDoneResult } from './common'
import { userEvent, within } from '@storybook/testing-library'

export default {
  component: RankStep,
  parameters: {
    layout: 'fullscreen',
  },
}
const Template = Component => args => <Component {...args} />

export const Base = Template(RankStep).bind({})
Base.args = {
  style: {},
  onDone: null,
}
