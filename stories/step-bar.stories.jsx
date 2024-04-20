import StepBar from '../app/components/step-bar'
import React from 'react'
import { onDoneDecorator } from './common'
import { userEvent, within } from '@storybook/testing-library'

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

// tests the right scroll button
export const ScrollRight = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const rightScroll = canvas.getByTestId('rightclick')

    setTimeout(async () => {
      await userEvent.tripleClick(rightScroll)
    }, 500)
  },
}

// tests the left scroll button
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
