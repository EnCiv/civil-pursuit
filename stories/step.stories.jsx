import React from 'react'
import Step from '../app/components/step'
import { onDoneDecorator } from './common'
import { userEvent, within } from '@storybook/test'

export default {
  component: Step,
  args: {
    name: 'Step 2: Rate',
    title: 'this is a title',
  },
  decorators: [onDoneDecorator],
}

export const Active = { args: { active: true, complete: false } }
export const Complete = { args: { active: false, complete: true } }
export const Incomplete = { args: { active: false, complete: false } }
export const ParentsWidth = args => {
  return (
    <div style={{ maxWidth: '8.5rem' }}>
      <Step active={true} complete={false} {...args} />
    </div>
  )
}

// Clicking on an active step does not call onDone
export const ClickActiveDesktop = {
  args: { ...Active.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const step = canvas.getByTestId('testClick')

    setTimeout(async () => {
      await userEvent.click(step)
    }, 500)
  },
}

// Clicking on a complete step calls onDone
export const ClickCompleteDesktop = {
  args: { ...Complete.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const step = canvas.getByTestId('testClick')

    setTimeout(async () => {
      await userEvent.click(step)
    }, 500)
  },
}

// Clicking on an incomplete step does not call onDone
export const ClickIncompleteDesktop = {
  args: { ...Incomplete.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const step = canvas.getByTestId('testClick')

    setTimeout(async () => {
      await userEvent.click(step)
    }, 500)
  },
}
