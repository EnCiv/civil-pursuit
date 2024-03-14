import StepFooter from '../app/components/step-footer'
import React from 'react'
import expect from 'expect'

import { onDoneDecorator, onDoneResult, onBackDecorator, onBackResult } from './common'
import { userEvent, within } from '@storybook/testing-library'

export default {
  component: StepFooter,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [onDoneDecorator, onBackDecorator],
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
  onBack: undefined,
}

export const onDoneNotPresent = Template(StepFooter).bind({})
onDoneNotPresent.args = {
  style: {},
  className: '',
  subject: 'onDone is not present',
  description: 'Your description for when onDone is not present...',
  onDone: undefined,
}

//Story name, each story is a state of the component
export const OnDoneClicked = {
  args: {
    style: {},
    title: 'Press me',
    children: 'Click Here',
    onBack: undefined,
  },
  //Property we use to define test case for this story
  play: async ({ canvasElement }) => {
    //Query the component so we can interact with it
    const canvas = within(canvasElement)
    //userEvent will simulate user behavior to test the element of the component
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }))

    let result = onDoneResult(canvas)
    expect(result.count).toEqual(1)
  },
}

export const OnBackClicked = {
  args: {
    style: {},
    title: 'Press me',
    children: 'Click Here',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '< Back' }))
    let result = onBackResult(canvas)

    expect(result.count).toEqual(1)
  },
}
