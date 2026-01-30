// https://github.com/EnCiv/civil-pursuit/issues/221

import React from 'react'
import useDeliberationStats from '../app/components/use-deliberation-stats'
import { socketEmitDecorator } from './common'
import { userEvent, within, waitFor } from '@storybook/test'
import expect from 'expect'

export default {
  component: useDeliberationStats,
  decorators: [
    socketEmitDecorator,
    Story => (
      <div style={{ padding: '2rem', maxWidth: '800px', position: 'relative', minHeight: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

const Template = args => {
  const [DeliberationStats, InvisibleButton] = useDeliberationStats(args.discussionId)
  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0, border: '2px dashed red', padding: '0.5rem', backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
        <div style={{ fontSize: '0.75rem', color: 'red', marginBottom: '0.25rem' }}>Invisible Button Here ↓</div>
        <InvisibleButton />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <p>Click the invisible button in the top-right corner to trigger status fetch</p>
        <DeliberationStats />
      </div>
    </>
  )
}

export const Default = {
  render: Template,
  args: {
    discussionId: '507f1f77bcf86cd799439011',
  },
  play: async ({ canvasElement }) => {
    // Setup mock response
    window.socket._socketEmitHandlers['get-discussion-status'] = (discussionId, callback) => {
      setTimeout(() => {
        callback({
          round: 1,
          phase: 'grouping',
          totalParticipants: 42,
        })
      }, 100)
    }
  },
}

export const ComplexStatus = {
  render: Template,
  args: {
    discussionId: '507f1f77bcf86cd799439011',
  },
  play: async ({ canvasElement }) => {
    window.socket._socketEmitHandlers['get-discussion-status'] = (discussionId, callback) => {
      setTimeout(() => {
        callback({
          round: 2,
          phase: 'ranking',
          totalParticipants: 156,
          submittedStatements: 89,
          groupsFormed: 12,
          rankedGroups: 8,
          averageGroupSize: 4.2,
          completionPercentage: 67,
        })
      }, 100)
    }
  },
}

export const WithNestedData = {
  render: Template,
  args: {
    discussionId: '507f1f77bcf86cd799439011',
  },
  play: async ({ canvasElement }) => {
    window.socket._socketEmitHandlers['get-discussion-status'] = (discussionId, callback) => {
      setTimeout(() => {
        callback({
          round: 3,
          phase: 'comparison',
          participants: {
            total: 234,
            active: 189,
            completed: 45,
          },
          statistics: {
            averageResponseTime: '2m 34s',
            medianGroupSize: 5,
            mostCommonRanking: [1, 2, 3, 4, 5],
          },
        })
      }, 100)
    }
  },
}

export const ClickButtonAndRenderStatus = {
  render: Template,
  args: {
    discussionId: '507f1f77bcf86cd799439011',
  },
  play: async ({ canvasElement }) => {
    // Setup mock response
    window.socket._socketEmitHandlers['get-discussion-status'] = (discussionId, callback) => {
      setTimeout(() => {
        callback({
          round: 2,
          phase: 'ranking',
          totalParticipants: 156,
        })
      }, 100)
    }

    const canvas = within(canvasElement)

    // Find and click the invisible button (it's a div in the upper right corner)
    const invisibleButton = canvasElement.querySelector('[class*="invisibleButtonInUpperRight"]')

    expect(invisibleButton).toBeTruthy()
    await userEvent.click(invisibleButton)

    // Wait for the status data to be rendered
    await waitFor(
      async () => {
        const statusText = canvasElement.textContent
        expect(statusText).toContain('round')
        expect(statusText).toContain('2')
        expect(statusText).toContain('phase')
        expect(statusText).toContain('ranking')
        expect(statusText).toContain('totalParticipants')
        expect(statusText).toContain('156')
      },
      { timeout: 3000 }
    )
  },
}
