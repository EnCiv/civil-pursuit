import StepBar from '../app/components/step-bar'
import React from 'react'
import { asyncSleep, onDoneDecorator } from './common'
import { userEvent, waitFor, within, expect } from '@storybook/test'

let primarySteps = Array.from({ length: 9 }, (_, i) => ({
  name: `Step ${i + 1}: The ${stepLengthGenerator()}`,
  title: `this is step ${i + 1}`,
  complete: false,
}))
primarySteps[0].complete = true
primarySteps[1].name = 'Step 2: Rate'

let secondarySteps = Array.from({ length: 9 }, (_, i) => ({
  name: `Step ${i + 1}: The ${stepLengthGenerator()}`,
  title: `this is step ${i + 1}`,
  complete: true,
}))
secondarySteps[8].complete = false

// Generate "random" step lengths for each step name
function stepLengthGenerator() {
  const subjects = ['Cat ', 'Mountain ', 'Teacher ', 'Bird ', 'Astronaut ']
  const verbs = ['Eats ', 'Discovers ', 'Teaches ', 'Climbs ', 'Paints ']
  const predicates = ['Quickly', 'Mathematics', 'Delicious Meals', 'Happily ', 'Stunning Landscapes']
  const words = [subjects, verbs, predicates]

  let sentence = ''
  for (let i = 0; i < 3; i++) {
    const random = Math.floor((Math.random() * 10) % 5)
    sentence += words[i][random]
  }

  return sentence
}

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

export const MobileViewOne = {
  parameters: { viewport: { defaultViewport: 'galaxys5' } },
}

export const MobileViewTwo = {
  parameters: { viewport: { defaultViewport: 'iphone14promax' } },
}

// tests the right scroll button
export const ScrollRight = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const rightScroll = canvas.getByTestId('rightclick')

    const timeout = setTimeout(async () => {
      await userEvent.tripleClick(rightScroll)
      clearTimeout(timeout)
    }, 500)
  },
}

// tests the left scroll button
export const ScrollLeft = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const leftScroll = canvas.getByTestId('leftclick')

    const timeout = setTimeout(async () => {
      await userEvent.tripleClick(leftScroll)
      clearTimeout(timeout)
    }, 500)
  },
}
ScrollLeft.args = { steps: secondarySteps, current: 9 }

// Accessibility tests
export const AccessibilityTestDesktop = {
  play: async ({ canvasElement }) => {
    await userEvent.keyboard('{tab}')
    await asyncSleep(500)
    await userEvent.keyboard('{tab}')
    await asyncSleep(500)
  },
}

// Accessibility tests
export const AccessibilityTestMobile = {
  parameters: { viewport: { defaultViewport: 'iphone13' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    let select
    // it takes time for the viewport to change
    await waitFor(() => {
      select = canvas.getByTestId('mobile-select-bar')
      expect(select).toBeInTheDocument()
    })
    await asyncSleep(500)
    await userEvent.click(select)
    await asyncSleep(500)
    await userEvent.keyboard('{tab}')
    await asyncSleep(500)
  },
}
