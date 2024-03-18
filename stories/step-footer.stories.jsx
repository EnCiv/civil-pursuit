//https://github.com/EnCiv/civil-pursuit/issues/51
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
}

const Template = Component => args => <Component {...args} />

export const activeTrue = Template(StepFooter).bind({})
activeTrue.args = {
  style: {},
  subject: 'Active is true',
  active: true,
  onDone: () => {},
  onBack: () => {},
}

export const ActiveFalse = Template(StepFooter).bind({})
ActiveFalse.args = {
  style: {},
  subject: 'Active is false',
  active: false,
  onDone: () => {},
  onBack: () => {},
}

export const onBackNotPresent = Template(StepFooter).bind({})
onBackNotPresent.args = {
  style: {},
  className: '',
  subject: 'onBack is not present',
  onBack: undefined,
  onDone: () => {},
}

export const onDoneNotPresent = Template(StepFooter).bind({})
onDoneNotPresent.args = {
  style: {},
  className: '',
  subject: 'onDone is not present',
  onDone: undefined,
  onBack: () => {},
}

//Story name, each story is a state of the component
export const OnDoneClicked = {
  args: {
    style: {},
    title: 'Press me',
    onBack: undefined,
    onDone: () => {},
    onBack: () => {},
  },
  decorators: [onDoneDecorator, onBackDecorator],

  //Property we use to define test case for this story
  play: async ({ canvasElement }) => {
    //Query the component so we can interact with it
    console.log(decorators)
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
  },
  decorators: [onDoneDecorator, onBackDecorator],

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '< Back' }))
    let result = onBackResult(canvas)

    expect(result.count).toEqual(1)
  },
}
