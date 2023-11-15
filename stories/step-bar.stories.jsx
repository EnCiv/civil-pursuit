import StepBar from '../app/components/step-bar'
import React from 'react'

let primarySteps = Array.from({ length: 9 }, (_, i) => ({
  name: `Step ${i + 1}: Test`,
  title: `this is step ${i + 1}`,
  complete: false,
}))

let secondarySteps = [...primarySteps]
secondarySteps[0] = {
  name: `Step 1: Test`,
  title: `this is step 1`,
  complete: true,
}

export default {
  component: StepBar,
  args: {
    steps: primarySteps,
    current: 0,
  },
  decorators: [
    Story => {
      return (
        <div style={{ outline: '1px solid #90EE90' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const PrimaryDesktop = {}

export const SecondaryDesktop = args => {
  return <StepBar current={1} steps={secondarySteps} />
}

export const ParentsWidth = args => {
  return <StepBar style={{ maxWidth: '56.375rem' }} {...args} />
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

export const SecondaryMobileView = {}
SecondaryMobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
}
SecondaryMobileView.args = {
  steps: secondarySteps,
  current: 1,
}
