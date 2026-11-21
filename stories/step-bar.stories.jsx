import StepBar from '../app/components/step-bar'
import React from 'react'
import { onDoneDecorator } from './common'
import { userEvent, waitFor, within, expect } from 'storybook/test'

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

export const ResponsiveLayoutUpdatesOnResize = {
  parameters: { a11y: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalWidth = window.innerWidth
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    const setViewportWidth = width => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
      window.dispatchEvent(new Event('resize'))
    }

    try {
      setViewportWidth(1200)
      await waitFor(() => expect(canvas.getByTestId('rightclick')).toBeInTheDocument())

      setViewportWidth(600)
      await waitFor(() => expect(canvas.getByTestId('mobile-select-bar')).toBeInTheDocument())

      setViewportWidth(1200)
      await waitFor(() => expect(canvas.getByTestId('rightclick')).toBeInTheDocument())
    } finally {
      if (originalDescriptor) Object.defineProperty(window, 'innerWidth', originalDescriptor)
      else delete window.innerWidth
      window.dispatchEvent(new Event('resize'))
      await waitFor(() => {
        if (originalWidth < 640) expect(canvas.getByTestId('mobile-select-bar')).toBeInTheDocument()
        else expect(canvas.getByTestId('rightclick')).toBeInTheDocument()
      })
    }
  },
}

export const LaterStepStaysLockedUntilPreviousCompletes = {
  parameters: { a11y: { disable: true } },
  args: {
    steps: [
      { name: 'Answer', title: 'Complete the answer first', complete: false, seen: true },
      { name: 'Grouping', title: 'Group similar responses', complete: true, seen: true },
      { name: 'Rank', title: 'Rank the responses', complete: false, seen: false },
    ],
    current: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const groupingStep = canvas.getAllByTestId('testClick').find(step => step.textContent.includes('Grouping'))
    expect(groupingStep).toBeDefined()
    expect(groupingStep).toHaveAttribute('tabindex', '-1')
  },
}

export const LaterVisitedStepStaysLockedUntilAllPreviousStepsComplete = {
  parameters: { a11y: { disable: true } },
  args: {
    steps: [
      { name: 'Answer', title: 'Answer completed', complete: true, seen: true },
      { name: 'Grouping', title: 'Grouping still incomplete', complete: false, seen: true },
      { name: 'Rank', title: 'Previously visited rank step', complete: true, seen: true },
      { name: 'Why Most', title: 'A later step', complete: false, seen: true },
    ],
    current: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rankStep = canvas.getAllByTestId('testClick').find(step => step.textContent.includes('Rank'))
    expect(rankStep).toBeDefined()
    expect(rankStep).toHaveAttribute('tabindex', '-1')
  },
}

export const SkippedStepStaysOutOfTabOrderOnMobile = {
  args: {
    steps: [
      { name: 'Answer', title: 'Answer complete', complete: true, seen: true },
      { name: 'Optional', title: 'This step was skipped', complete: false, seen: true, skip: true },
      { name: 'Group', title: 'Continue to grouping', complete: false, seen: true },
    ],
    current: 3,
  },
  parameters: {
    viewport: { defaultViewport: 'iphone14promax' },
    a11y: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
    window.dispatchEvent(new Event('resize'))
    await waitFor(() => expect(canvas.getByTestId('mobile-select-bar')).toBeInTheDocument())
    await userEvent.click(canvas.getByTestId('mobile-select-bar'))
    await waitFor(() => {
      const stepItems = canvas.getAllByTestId('testClick')
      const skippedStep = stepItems.find(step => step.textContent.includes('Optional'))
      const groupStep = stepItems.find(step => step.textContent.includes('Group'))
      expect(skippedStep).toHaveAttribute('tabindex', '-1')
      expect(groupStep).toHaveAttribute('tabindex', '0')
    })
    if (originalDescriptor) Object.defineProperty(window, 'innerWidth', originalDescriptor)
    else delete window.innerWidth
    window.dispatchEvent(new Event('resize'))
  },
}

export const FiveStepsVisibleOnWideScreens = {
  args: { steps: primarySteps, current: 5 },
  parameters: {
    a11y: { disable: true },
    viewport: {
      viewports: {
        wideDesktop: { name: 'Wide desktop', styles: { width: '1920px', height: '1080px' } },
      },
      defaultViewport: 'wideDesktop',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    const originalCanvasWidth = canvasElement.style.width
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1920 })
    canvasElement.style.width = '1920px'
    window.dispatchEvent(new Event('resize'))

    try {
      await waitFor(() => {
        const stepContainer = canvas.getByTestId('leftclick').nextElementSibling
        const bounds = stepContainer.getBoundingClientRect()
        const fullyVisibleSteps = canvas.getAllByTestId('testClick').filter(step => {
          const stepBounds = step.getBoundingClientRect()
          return stepBounds.left >= bounds.left - 1 && stepBounds.right <= bounds.right + 1
        })
        expect(fullyVisibleSteps).toHaveLength(5)
      })
    } finally {
      canvasElement.style.width = originalCanvasWidth
      if (originalDescriptor) Object.defineProperty(window, 'innerWidth', originalDescriptor)
      else delete window.innerWidth
      window.dispatchEvent(new Event('resize'))
    }
  },
}

// tests the right scroll button
export const ScrollRight = {
  parameters: { a11y: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() => expect(canvas.getByTestId('rightclick')).toBeInTheDocument())
    const rightScroll = canvas.getByTestId('rightclick')

    await userEvent.tripleClick(rightScroll)
  },
}

// tests the left scroll button
export const ScrollLeft = {
  parameters: { a11y: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() => expect(canvas.getByTestId('leftclick')).toBeInTheDocument())
    const leftScroll = canvas.getByTestId('leftclick')

    await userEvent.tripleClick(leftScroll)
  },
}
ScrollLeft.args = { steps: secondarySteps, current: 9 }

// Accessibility tests
export const AccessibilityTestDesktop = {
  parameters: { a11y: { disable: true } },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(document.activeElement).toBe(document.body))
    await userEvent.keyboard('{tab}')
    await waitFor(() => expect(document.activeElement).not.toBe(document.body))
    await userEvent.keyboard('{tab}')
  },
}

// Accessibility tests
export const AccessibilityTestMobile = {
  parameters: {
    viewport: { defaultViewport: 'iphone13' },
    a11y: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
    window.dispatchEvent(new Event('resize'))

    await waitFor(() => {
      expect(canvas.getByTestId('mobile-select-bar')).toBeInTheDocument()
    })
    const select = canvas.getByTestId('mobile-select-bar')
    await userEvent.click(select)
    await waitFor(() => {
      expect(select).toHaveAttribute('aria-expanded', 'true')
    })
    await userEvent.keyboard('{tab}')
    if (originalDescriptor) Object.defineProperty(window, 'innerWidth', originalDescriptor)
    else delete window.innerWidth
    window.dispatchEvent(new Event('resize'))
  },
}
