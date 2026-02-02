// https://github.com/EnCiv/civil-pursuit/issues/112
// https://github.com/EnCiv/civil-pursuit/issues/332

import React, { useState } from 'react'
import StepSlider from '../app/components/step-slider'
import TopNavBar from '../app/components/top-nav-bar'
import Footer from '../app/components/footer'
import { userEvent, within, waitFor, expect } from '@storybook/test'

/**
 * Helper to wait for step slider transitions to complete.
 * Call this after clicking a Next/Back button to ensure the step slider
 * has finished its CSS transition and height adjustment.
 *
 * - `canvasElement` - The root element from the story's play function
 */
export async function waitForStepSlider(canvasElement) {
  const startTime = Date.now()
  const stepSliderWrapper = canvasElement.querySelector('[data-transitioning]')
  if (!stepSliderWrapper) {
    throw new Error('Could not find step slider wrapper with [data-transitioning] attribute')
  }
  // First wait for the CSS transition (left property animation)
  await waitFor(
    () => {
      const isComplete = stepSliderWrapper.getAttribute('data-transition-complete')
      expect(isComplete).toBe('true')
    },
    { timeout: 2000, interval: 50 }
  )

  // Then wait for height adjustment and scrollIntoView to settle
  await waitFor(
    () => {
      const isStable = stepSliderWrapper.getAttribute('data-height-stable')
      expect(isStable).toBe('true')
    },
    { timeout: 1000, interval: 50 }
  )

  // make sure everything in the process queue has been handled before proceeding
  await new Promise(resolve => setTimeout(resolve, 1))

  // Wait again to ensure height is still stable after any final adjustments
  await waitFor(
    () => {
      const isStable = stepSliderWrapper.getAttribute('data-height-stable')
      expect(isStable).toBe('true')
    },
    { timeout: 1000, interval: 50 }
  )
  const endTime = Date.now()
  console.log(`waitForStepSlider took ${endTime - startTime} ms`)
}

export default {
  component: StepSlider,
  parameters: {
    layout: 'fullscreen',
  },
  excludeStories: ['waitForStepSlider'],
}

const storybookPadding = '2rem' // it padds the iframe with 1rem all around

const stepNames = ['Answer', 'Group', 'Rank', 'Why Most', 'Why Least', 'Compare Why Most', 'Compare Why Least', 'Review', 'Intermission']

function createPrimarySteps(num = 4) {
  let primarySteps = Array.from({ length: num }, (_, i) => ({
    name: stepNames[i],
    title: `this is step ${i + 1} names ${stepNames[i]}`,
  }))

  return primarySteps
}

const Template = args => {
  const [backgroundColor, setBackgroundColor] = useState('white')
  return (
    <div
      style={{
        width: `calc(100vw - ${storybookPadding})`,
        minHeight: `calc(100vh - ${storybookPadding})`,
        backgroundColor: backgroundColor,
      }}
    >
      <TopNavBar />
      <div
        style={{
          width: '48em',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          padding: 0,
          backgroundColor: 'black',
          minHeight: `calc(100vh - ${storybookPadding})`,
        }}
      >
        <StepSlider {...args} onDone={val => (val ? setBackgroundColor('black') : setBackgroundColor('white'))} />
      </div>
      <Footer />
    </div>
  )
}

const Panel = props => (
  <div style={{ width: 'inherit', height: '150vh', backgroundColor: props.backGroundColor }}>
    <div style={{ position: 'relative', width: 'inherit', height: 'inherit' }}>
      <button onClick={() => props.onDone({ valid: true, value: 1 })} style={{ position: 'absolute', top: '20vh' }}>
        Done
      </button>

      <button onClick={() => props.onDone({ valid: true, value: 'skip' })} style={{ position: 'absolute', top: '40vh' }}>
        Skip
      </button>

      <button onClick={() => props.onDone({ valid: true, value: 'Rank' })} style={{ position: 'absolute', top: '60vh' }}>
        Move To Rank
      </button>
    </div>
  </div>
)

const list = [<Panel backGroundColor="green" />, <Panel backGroundColor="blue" />, <Panel backGroundColor="red" />, <Panel backGroundColor="purple" />]

function createPanels(panels = 4) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray']
  const panelList = []

  for (let count = 0; count < panels; count++) {
    panelList.push(<Panel backGroundColor={colors[count % colors.length]} stepName={stepNames[count]} />)
  }

  return panelList
}

export const WithNoSteps = Template.bind({})
WithNoSteps.args = { children: createPanels(4) }

export const WithFourSteps = Template.bind({})
WithFourSteps.args = { steps: createPrimarySteps(4), children: createPanels(4) }

export const WithSevenSteps = Template.bind({})
WithSevenSteps.args = { steps: createPrimarySteps(7), children: createPanels(7) }

const childrenWithNestedSlider = createPanels(5)
childrenWithNestedSlider[2] = <StepSlider steps={createPrimarySteps(3)} children={createPanels(3)} />
export const NestedSliders = {
  args: { children: childrenWithNestedSlider },
  render: Template,
}

// Test for waitForStepSlider helper
export const WaitForStepSliderTest = {
  args: { steps: createPrimarySteps(4), children: createPanels(4) },
  render: Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for the step slider to be ready
    await waitFor(() => {
      const stepSlider = canvasElement.querySelector('[data-transitioning]')
      expect(stepSlider).toBeInTheDocument()
    })
    console.log('Step slider found')

    // Click Done button to mark step as complete
    const doneButton = canvas.getAllByRole('button', { name: /Done/i })[0]
    await userEvent.click(doneButton)
    console.log('Clicked Done button')

    // Click Next button to trigger transition to next step
    const nextButton = await waitFor(() => {
      const btn = canvas.getByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('Clicked Next button')

    // Use waitForStepSlider to wait for transition
    await waitForStepSlider(canvasElement)
    console.log('waitForStepSlider completed successfully')

    // Verify we're on step 2 - click Done again to go to step 3
    const doneButton2 = canvas.getAllByRole('button', { name: /Done/i })[0]
    await userEvent.click(doneButton2)
    console.log('Clicked Done button (2nd time)')

    // Click Next to trigger second transition
    const nextButton2 = await waitFor(() => {
      const btn = canvas.getByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(nextButton2)
    console.log('Clicked Next button (2nd time)')

    await waitForStepSlider(canvasElement)
    console.log('waitForStepSlider completed successfully (2nd time)')

    console.log('✅ WaitForStepSliderTest passed!')
  },
}
