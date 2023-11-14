import StepBar from '../app/components/step-bar'
import React from 'react'

export default {
  component: StepBar,
  args: {
    steps: Array.from({ length: 9 }, (_, i) => ({
      name: `Step ${i + 1}: Test`,
      title: `this is step ${i + 1}`,
      complete: false,
    })),
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

export const Primary = {}
export const ParentsWidth = args => {
  return <StepBar style={{ maxWidth: '42.375rem' }} {...args} />
}
