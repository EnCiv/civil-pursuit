// https://github.com/EnCiv/civil-pursuit/blob/main/docs/participant-threshold.md
// Stories testing participant threshold feature

import React from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, socketEmitDecorator, buildApiDecorator, mockBatchUpsertDeliberationDataRoute, clearGlobalStateDecorator, resetTournamentStoryState, getTournamentNextButton, fillTournamentAnswer } from './common'
import { userEvent, within, waitFor, expect } from 'storybook/test'
import { authFlowDecorators, withAuthTestState } from './mocks/auth-flow'
import { tournamentSteps, demInfoDecorator, tournamentDefaultValueMinimal, samplePoints, sampleWhys } from './tournament.stories'
import { clear } from '../app/lib/local-storage-manager'

export default {
  title: 'Tournament/Participant Threshold',
  component: Tournament,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

// Test: Threshold blocks progression
// Participants below threshold - should only show Answer and Intermission steps
export const ThresholdBlocksProgression = {
  render: withAuthTestState(Tournament),
  args: {
    steps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      dturn: { finalRound: 1, group_size: 5, participantThreshold: 20 },
      round: 0,
      user: undefined,
      userId: undefined,
      participants: 10, // Below threshold
    },
  },
  decorators: [
    demInfoDecorator,
    mockBatchUpsertDeliberationDataRoute,
    buildApiDecorator('get-user-ranks', []),
    buildApiDecorator('get-points-of-ids', []),
    buildApiDecorator('upsert-rank', () => {}),
    buildApiDecorator('get-conclusion', (discussionId, cb) => cb && cb([])),
    buildApiDecorator('get-why-ranks-and-points', { ranks: [], whys: [] }),
    buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
      cb({ ranks: [], whys: [] })
    }),
    buildApiDecorator('get-dem-info', (pointIds, cb) => cb({})),
    ...authFlowDecorators,
    buildApiDecorator('get-jsform', (discussionId, cb) => cb({})),
    buildApiDecorator('set-user-info', (email, cb) => {
      cb({ error: 'Test mock - set-user-info should not be called' })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => cb({ success: true })),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      requestHandler({
        uInfo: [{ shownStatementIds: {} }],
        lastRound: 0,
        participants: 10, // Below threshold
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    resetTournamentStoryState(testState)

    console.log('🧪 Testing threshold blocks progression (10 < 20)...')

    // Step 1: Verify Answer step is visible
    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })
    console.log('  ✓ Answer step is visible')

    await fillTournamentAnswer(canvas, {
      answerSubject: 'Threshold Test Issue',
      answerDescription: 'Testing threshold blocking',
      whySubject: 'Why it matters',
      whyDescription: 'Because thresholds work',
    })

    // Check Terms
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)

    // Click Next
    const nextButton = await getTournamentNextButton(canvas, true)
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next from Answer step')

    // Wait for step transition
    const stepSliderWrapper = canvasElement.querySelector('[data-transitioning]')
    if (stepSliderWrapper) {
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-transition-complete')).toBe('true'), { timeout: 2000 })
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-height-stable')).toBe('true'), { timeout: 1000 })
    }

    // Step 2: Intermission - enter email first
    console.log('Step 2: Intermission - entering email')

    await waitFor(() => {
      const emailInput = canvas.queryByPlaceholderText('Please provide your email')
      expect(emailInput).toBeInTheDocument()
    })

    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'success@email.com', { delay: 10 })
    await userEvent.tab()
    console.log('  ✓ Entered email')

    // Wait for auth flow to complete
    await waitFor(
      () => {
        expect(testState.authFlowUserSet).toBe(true)
      },
      { timeout: 3000 }
    )
    console.log('  ✓ Auth flow complete')

    // Click Save/Invite Me Back button
    const saveButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })
    await userEvent.click(saveButton)
    console.log('  ✓ Clicked Save button')

    // Wait for batch-upsert
    await waitFor(
      () => {
        const calls = window._fetchRouteHandlers?.get('/api/batch-upsert-deliberation-data')?.calls || []
        expect(calls.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // Now verify threshold message appears
    await waitFor(() => {
      const thresholdText = canvas.queryByText(/Your voice is in./i)
      expect(thresholdText).toBeInTheDocument()
    })
    console.log('  ✓ Threshold message shown after save')

    // Verify threshold message shows correct numbers (10 participants away from 20)
    await waitFor(() => {
      const participantsAwayText = canvas.queryByText(/10 \/ 20 Participants/i)
      expect(participantsAwayText).toBeInTheDocument()
    })
    console.log('  ✓ Threshold shows correct participant count (10 away from 20)')

    // Wait for rendering to settle
    await new Promise(resolve => setTimeout(resolve, 0))

    console.log('✅ ThresholdBlocksProgression test passed!')
  },
}

// Test: Threshold allows progression
// Participants at or above threshold - should show all steps
export const ThresholdAllowsProgression = {
  render: withAuthTestState(Tournament),
  args: {
    steps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      dturn: { finalRound: 1, group_size: 5, participantThreshold: 20 },
      round: 0,
      user: undefined,
      userId: undefined,
      participants: 20, // At threshold
    },
  },
  decorators: [
    demInfoDecorator,
    mockBatchUpsertDeliberationDataRoute,
    buildApiDecorator('get-user-ranks', []),
    buildApiDecorator('get-points-of-ids', []),
    buildApiDecorator('upsert-rank', () => {}),
    buildApiDecorator('upsert-groupings', () => {}),
    buildApiDecorator('get-conclusion', (discussionId, cb) => cb && cb([])),
    buildApiDecorator('get-why-ranks-and-points', sampleWhys),
    buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
      cb(sampleWhys)
    }),
    buildApiDecorator('get-dem-info', (pointIds, cb) => cb({})),
    buildApiDecorator('get-points-for-round', (discussionId, round, cb) => {
      cb(samplePoints)
    }),
    ...authFlowDecorators,
    buildApiDecorator('get-jsform', (discussionId, cb) => cb({})),
    buildApiDecorator('set-user-info', (email, cb) => {
      cb({ error: 'Test mock - set-user-info should not be called' })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => cb({ success: true })),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      requestHandler({
        uInfo: [{ shownStatementIds: {}, finished: false, userId: 'temp-user-123' }],
        lastRound: 0,
        participants: 20, // At threshold
      })
    }),
    clearGlobalStateDecorator,
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    resetTournamentStoryState(testState)

    console.log('🧪 Testing threshold allows progression (20 >= 20)...')

    // Step 1: Verify Answer step is visible
    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })
    console.log('  ✓ Answer step is visible')

    await fillTournamentAnswer(canvas, {
      answerSubject: 'Threshold Met Test',
      answerDescription: 'Testing when threshold is met',
      whySubject: 'Why threshold met',
      whyDescription: 'Full progression available',
    })

    // Check Terms
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)

    // Click Next - should go to Grouping step (not Intermission with threshold block)
    const nextButton = await getTournamentNextButton(canvas, true)
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next from Answer step')

    // Wait for step transition
    const stepSliderWrapper = canvasElement.querySelector('[data-transitioning]')
    if (stepSliderWrapper) {
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-transition-complete')).toBe('true'), { timeout: 2000 })
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-height-stable')).toBe('true'), { timeout: 1000 })
    }

    // Verify we're at Grouping step (threshold met, so full progression)
    await waitFor(
      () => {
        const groupingText = canvas.queryByText(/group similar responses/i)
        expect(groupingText).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
    console.log('  ✓ Grouping step shown (threshold met, full progression allowed)')

    // Verify NO threshold blocking message is present
    const thresholdBlockMessage = canvas.queryByText(/Your voice is in./i)
    expect(thresholdBlockMessage).not.toBeInTheDocument()
    console.log('  ✓ No threshold blocking message (participants >= threshold)')

    // Wait for rendering to settle
    await new Promise(resolve => setTimeout(resolve, 0))

    console.log('✅ ThresholdAllowsProgression test passed!')
  },
}

// Test: Default threshold behavior
// No explicit participantThreshold - should use default (2 * group_size - 1)
export const DefaultThresholdBehavior = {
  render: withAuthTestState(Tournament),
  args: {
    steps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      dturn: { finalRound: 1, group_size: 5 }, // No participantThreshold
      round: 0,
      user: undefined,
      userId: undefined,
      participants: 8, // Below default threshold (2 * 5 - 1 = 9)
    },
  },
  decorators: [
    demInfoDecorator,
    mockBatchUpsertDeliberationDataRoute,
    buildApiDecorator('get-user-ranks', []),
    buildApiDecorator('get-points-of-ids', []),
    buildApiDecorator('upsert-rank', () => {}),
    buildApiDecorator('get-conclusion', (discussionId, cb) => cb && cb([])),
    buildApiDecorator('get-why-ranks-and-points', { ranks: [], whys: [] }),
    buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
      cb({ ranks: [], whys: [] })
    }),
    buildApiDecorator('get-dem-info', (pointIds, cb) => cb({})),
    ...authFlowDecorators,
    buildApiDecorator('get-jsform', (discussionId, cb) => cb({})),
    buildApiDecorator('set-user-info', (email, cb) => {
      cb({ error: 'Test mock - set-user-info should not be called' })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => cb({ success: true })),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      requestHandler({
        uInfo: [{ shownStatementIds: {} }],
        lastRound: 0,
        participants: 8, // Below default threshold
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    resetTournamentStoryState(testState)

    console.log('🧪 Testing default threshold behavior (8 < 9)...')

    // Step 1: Verify Answer step is visible
    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })
    console.log('  ✓ Answer step is visible')

    await fillTournamentAnswer(canvas, {
      answerSubject: 'Default Threshold Test',
      answerDescription: 'Testing default threshold',
      whySubject: 'Why default',
      whyDescription: 'Default calculation works',
    })

    // Check Terms
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)

    // Click Next
    const nextButton = await getTournamentNextButton(canvas, true)
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next from Answer step')

    // Wait for step transition
    const stepSliderWrapper = canvasElement.querySelector('[data-transitioning]')
    if (stepSliderWrapper) {
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-transition-complete')).toBe('true'), { timeout: 2000 })
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-height-stable')).toBe('true'), { timeout: 1000 })
    }

    // Step 2: Intermission - enter email first
    console.log('Step 2: Intermission - entering email')

    await waitFor(() => {
      const emailInput = canvas.queryByPlaceholderText('Please provide your email')
      expect(emailInput).toBeInTheDocument()
    })

    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'success@email.com', { delay: 10 })
    await userEvent.tab()
    console.log('  ✓ Entered email')

    // Wait for auth flow to complete
    await waitFor(
      () => {
        expect(testState.authFlowUserSet).toBe(true)
      },
      { timeout: 3000 }
    )
    console.log('  ✓ Auth flow complete')

    // Click Save/Invite Me Back button
    const saveButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })
    await userEvent.click(saveButton)
    console.log('  ✓ Clicked Save button')

    // Wait for batch-upsert
    await waitFor(
      () => {
        const calls = window._fetchRouteHandlers?.get('/api/batch-upsert-deliberation-data')?.calls || []
        expect(calls.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // Now verify standard intermission message (not enhanced threshold message since no explicit threshold)
    await waitFor(() => {
      const intermissionText = canvas.queryByText(/when we get responses from/i)
      expect(intermissionText).toBeInTheDocument()
    })
    console.log('  ✓ Standard intermission message shown (no explicit threshold)')

    // Verify message shows correct participant count needed (1 more person for default threshold of 9)
    await waitFor(() => {
      const responsesText = canvas.queryByText(/1 more people/i)
      expect(responsesText).toBeInTheDocument()
    })
    console.log('  ✓ Default threshold calculated correctly (2 * 5 - 1 = 9, need 1 more)')

    // Wait for rendering to settle
    await new Promise(resolve => setTimeout(resolve, 0))

    console.log('✅ DefaultThresholdBehavior test passed!')
  },
}
