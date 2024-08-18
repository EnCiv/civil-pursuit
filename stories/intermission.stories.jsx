// https://github.com/EnCiv/civil-pursuit/issues/137

import React from 'react'
import Intermission from '../app/components/intermission'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  component: Intermission,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const Template = args => <Intermission {...args} />

export const Empty = Template.bind({})
Empty.args = {}

export const NoEmail = Template.bind({})
NoEmail.args = {
  user: {},
}

export const NoEmailMobile = Template.bind({})
NoEmailMobile.args = {
  user: {},
}
NoEmailMobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
}
export const HasEmailFirst = Template.bind({})
HasEmailFirst.args = {
  user: { email: 'example@gmail.com', tempid: '123456' },
}

export const HasEmailSecond = Template.bind({})
HasEmailSecond.args = {
  user: { email: 'example@gmail.com', tempid: '123456' },
  round: 2,
}
