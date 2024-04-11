import StepBar from '../app/components/step-bar'
import React from 'react'
import { onDoneDecorator } from './common'
import { userEvent, within } from '@storybook/testing-library'

let primarySteps = Array.from({ length: 9 }, (_, i) => ({
  name: `Step ${i + 1}: Test MMMMMMMMMM`,
  title: `this is step ${i + 1}`,
  complete: false,
}))
primarySteps[0].complete = true

let secondarySteps = Array.from({ length: 9 }, (_, i) => ({
  name: `Step ${i + 1}: Test`,
  title: `this is step ${i + 1}`,
  complete: true,
}))
secondarySteps[8].complete = false

export default {
  component: StepBar,
  args: {
    steps: primarySteps,
    current: 2,
  },
  decorators: [
    Story => {
      return (
        <div style={{ outline: '1px solid #90EE90' }}>
          <Story />
        </div>
      )
    },
    onDoneDecorator,
  ],
}

export const PrimaryDesktop = {}

export const ParentsWidth = args => {
  return <StepBar style={{ maxWidth: '50.375rem' }} {...args} />
}

export const MobileViewOne = {}
MobileViewOne.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
}

export const MobileViewTwo = {}
MobileViewTwo.parameters = {
  viewport: {
    defaultViewport: 'mobile2',
  },
}

export const ScrollRight = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const rightScroll = canvas.getByTestId('rightclick')

    setTimeout(async () => {
      await userEvent.tripleClick(rightScroll)
    }, 500)
  },
}

export const ScrollLeft = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const leftScroll = canvas.getByTestId('leftclick')

    setTimeout(async () => {
      await userEvent.tripleClick(leftScroll)
    }, 500)
  },
}
ScrollLeft.args = { steps: secondarySteps, current: 9 }
