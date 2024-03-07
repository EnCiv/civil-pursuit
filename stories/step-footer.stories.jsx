import StepFooter from '../app/components/step-footer'
import React from 'react'

export default {
  component: StepFooter,
  parameters: {
    layout: 'fullscreen',
  },
}

const Template = Component => args => <Component {...args} />

export const activeTrue = Template(StepFooter).bind({})
activeTrue.args = {
  style: {},
  className: '',
  subject: 'Active is true',
  description: 'Your description for when active is true...',
  active: true,
  onDone: () => {},
  onBack: () => {},
}

export const activeFalse = Template(StepFooter).bind({})
activeFalse.args = {
  style: {},
  className: '',
  subject: 'Active is false',
  description: 'Your description for when active is false...',
  active: false,
  onDone: () => {},
  onBack: () => {},
}

export const onBackNotPresent = Template(StepFooter).bind({})
onBackNotPresent.args = {
  style: {},
  className: '',
  subject: 'onBack is not present',
  description: 'Your description for when onBack is not present...',
  onDone: () => {},
}

export const onDoneNotPresent = Template(StepFooter).bind({})
onDoneNotPresent.args = {
  style: {},
  className: '',
  subject: 'onDone is not present',
  description: 'Your description for when onDone is not present...',
  onBack: () => {},
}
