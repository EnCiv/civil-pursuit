// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Story: New user with enough participants - full UI flow through all steps

import React from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, socketEmitDecorator, buildApiDecorator, mockBatchUpsertDeliberationDataRoute } from './common'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { authFlowDecorators, withAuthTestState } from './mocks/auth-flow'
import { tournamentSteps, demInfoDecorator, tournamentDefaultValueMinimal, samplePoints, sampleWhys } from './tournament.stories'
import { waitForStepSlider } from './step-slider.stories'

export default {
  title: 'Tournament',
  component: Tournament,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

// New user with enough participants - full flow through all steps
// This tests the complete user journey (step order from tournamentSteps):
// 1. Answer - agree to terms, enter answer and why
// 2. Group - group similar points
// 3. Rank - rank points (Most/Neutral/Least)
// 4. Why Most - explain why most important (auto-complete if user's answer ranked Most)
// 5. Why Least - explain why least important
// 6. Compare Why Most - compare reasons for most important
// 7. Compare Why Least - compare reasons for least important
// 8. Review - rerank after seeing whys
// 9. Feedback - provide feedback on the experience
// 10. Intermission - provide email, batch-upsert with full round data
export const NewUserFullFlow = {
  render: withAuthTestState(Tournament),
  args: {
    steps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      round: 0,
      user: undefined, // New user - no ID yet
      participants: 25, // Enough participants for full flow
    },
  },
  decorators: [
    demInfoDecorator,
    mockBatchUpsertDeliberationDataRoute, // Mock fetch for batch-upsert HTTP endpoint
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
      console.log('⚠️ set-user-info called - this should NOT happen for temp user completing full round')
      cb({ error: 'Test mock - set-user-info should not be called' })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => cb({ success: true })),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      console.log('🔔 subscribe-deliberation called for discussion:', discussionId)
      requestHandler({
        uInfo: [{ shownStatementIds: {}, finished: false, userId: 'temp-user-123' }],
        lastRound: 0,
        participants: 25, // Enough participants!
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    // Reset global state for test isolation
    window.setUserInfoCalls = []
    testState.authFlowUserSet = false
    // Reset socket emit handler results to avoid cross-test pollution
    if (window.socket?._socketEmitHandlerResults) {
      Object.keys(window.socket._socketEmitHandlerResults).forEach(key => {
        window.socket._socketEmitHandlerResults[key] = []
      })
    }

    console.log('🧪 NewUserFullFlow test starting...')

    // ========== STEP 1: Answer step ==========
    console.log('Step 1: Answer step - entering data and agreeing to Terms')

    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })

    // Fill in the answer fields
    const subjectInputs = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionInputs = canvas.getAllByPlaceholderText(/description/i)

    await userEvent.type(subjectInputs[0], 'My Full Flow Issue')
    await userEvent.tab()
    await userEvent.type(descriptionInputs[0], 'This is my description of the full flow issue')
    await userEvent.tab()
    await userEvent.type(subjectInputs[1], 'Why this matters for full flow')
    await userEvent.tab()
    await userEvent.type(descriptionInputs[1], 'Because it affects everyone in the full flow')
    await userEvent.tab()
    console.log('  ✓ Filled in answer and why fields')

    // Check Terms checkbox
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)
    console.log('  ✓ Checked Terms checkbox')

    // Click Next to proceed to grouping
    let nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 2: Grouping step ==========
    console.log('Step 2: Grouping step - grouping similar points')

    // Wait for grouping step - look for heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Group Responses/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Grouping step loaded')

    // Click Next to proceed
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Grouping step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 3: Ranking step ==========
    console.log('Step 3: Ranking step - ranking points')

    // Wait for ranking step - look for heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Rank Responses/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Ranking step loaded')

    // Rank each point directly using the radio buttons
    // The ranking radio buttons are directly available - no need to "open" each point
    // Get all Most, Neutral, and Least radio buttons
    const allMostRadios = await waitFor(() => {
      const radios = canvas.getAllByRole('radio', { name: 'Most' })
      expect(radios.length).toBeGreaterThan(0)
      return radios
    })
    const allNeutralRadios = canvas.getAllByRole('radio', { name: 'Neutral' })
    const allLeastRadios = canvas.getAllByRole('radio', { name: 'Least' })
    console.log(`  Found ${allMostRadios.length} points to rank`)

    // First point (user's answer) -> Most
    // Last point -> Least
    // All others -> Neutral
    for (let i = 0; i < allMostRadios.length; i++) {
      if (i === 0) {
        await userEvent.click(allLeastRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Most`)
      } else if (i === allMostRadios.length - 1) {
        // Last point (user's answer) -> Most
        await userEvent.click(allMostRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Least`)
      } else {
        // Middle points -> Neutral
        await userEvent.click(allNeutralRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Neutral`)
      }
    }

    // Now Next button should be enabled
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Ranking step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 4: Why step (Why Most) ==========
    console.log('Step 4: Why Most step - our answer was ranked Most so this should auto-complete')

    // Since we ranked our own answer as Most, the Why Most step should be complete
    // (we already provided a why for our answer)

    // Click Next to proceed - should be active since our answer is already complete
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Why Most step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 5: Why Least step ==========
    console.log('Step 5: Why Least step - need to provide input')

    // Wait for Why Least step to be visible
    let whyLeastHeading
    await waitFor(() => {
      // The why least step should show the point we ranked as least
      whyLeastHeading = canvas.queryByRole('heading', { name: /Why it's Least Important/i })
      expect(whyLeastHeading).toBeInTheDocument()
    })
    console.log('  ✓ Why Least step loaded')

    // Find the why input fields within the current step's wrapper
    // Previous steps' panels remain in the DOM, so we need to scope to the current step
    const whyLeastWrapper = whyLeastHeading.parentNode.parentNode
    const whySubjectInput = whyLeastWrapper.querySelector('input[placeholder="Type some thing here"]')
    const whyDescriptionInput = whyLeastWrapper.querySelector('textarea[placeholder="Description"]')

    await userEvent.type(whySubjectInput, 'This is why I ranked it least')
    await userEvent.tab()
    console.log('  ✓ Filled in why subject')

    await userEvent.type(whyDescriptionInput, 'Because it does not address the core issue effectively')
    await userEvent.tab()
    console.log('  ✓ Filled in why description')

    // Click Next to proceed
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Why Least step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 6: Compare Why Most step ==========
    console.log('Step 6: Compare Why Most step - click Useful for the single why-most entry')

    // Wait for the Compare Why Most heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Compare Reasons Why It's Most Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Compare Why Most step loaded')

    // Click Useful button to mark the single why-most as useful
    // The button has title="Recommend for further consideration" and text "Useful"
    const usefulButton = await waitFor(() => {
      const btn = canvas.getByTitle('Recommend for further consideration')
      console.log('usefuleButton:', btn)
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(usefulButton)
    console.log('  ✓ Clicked Useful on Compare Why Most step')

    // Wait for Next button to become active and click it
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Compare Why Most step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 7: Compare Why Least step ==========
    console.log('Step 7: Compare Why Least step - click on why text twice then Next')

    // Wait for the compare whys step to load - it uses StepIntro which renders subject as heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Compare Reasons Why It's Least Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Compare Why Least step loaded')

    // Wait for user's why and first sample why to be visible
    await waitFor(() => {
      const userWhy = canvas.queryByText('This is why I ranked it least')
      const sampleWhy1 = canvas.queryByText('First reason for least important')
      expect(userWhy).toBeInTheDocument()
      expect(sampleWhy1).toBeInTheDocument()
    })
    console.log('  ✓ User why and first sample why visible')

    // Click on user's why (first comparison)
    const userWhyText1 = canvas.getByText('This is why I ranked it least')
    await userEvent.click(userWhyText1)
    console.log('  ✓ Clicked on user why (1st comparison)')

    // Wait for second sample why to appear in visible container (after animation)
    // The point buttons have title attributes we can check
    await waitFor(() => {
      const sampleWhy2Button = canvas.queryByTitle('Choose as more important: Second reason for least important')
      expect(sampleWhy2Button).toBeInTheDocument()
    })
    console.log('  ✓ Second sample why visible in comparison')

    // Click on user's why again (second comparison)
    const userWhyText2 = canvas.getByText('This is why I ranked it least')
    await userEvent.click(userWhyText2)
    console.log('  ✓ Clicked on user why (2nd comparison)')

    // Wait for Next button to become active
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Compare Why Least step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 8: Rerank step ==========
    console.log('Step 8: Rerank step - reranking after seeing whys')
    function contains(elements, text) {
      return Array.prototype.filter.call(elements, function (element) {
        return RegExp(text).test(element.textContent)
      })
    }
    // Wait for rerank step - look for heading
    let rerankHeading
    await waitFor(() => {
      rerankHeading = canvas.queryByRole('heading', { name: /Re-Rank Responses|Review/i })
      expect(rerankHeading).toBeInTheDocument()
    })
    console.log('  ✓ Rerank step loaded')
    const rerankWrapper = rerankHeading.parentNode.parentNode

    // Get all the radio button groups - need to rank again
    // Rank first as Least, last as Most, others Neutral
    // there are actually 2 sets of radio buttons rendered, one for desktop and one for mobile. toRowContent is for desktop
    const rerankMostButtons = contains(rerankWrapper.querySelectorAll('[class^="topRowContent"] div[role="radio"]'), 'Most')
    const rerankNeutralButtons = contains(rerankWrapper.querySelectorAll('[class^="topRowContent"] div[role="radio"]'), 'Neutral')
    const rerankLeastButtons = contains(rerankWrapper.querySelectorAll('[class^="topRowContent"] div[role="radio"]'), 'Least')

    console.log(`  Found ${rerankMostButtons.length} points to rerank`)

    // Rerank each point - first as Least, last as Most, others Neutral
    for (let i = 0; i < rerankMostButtons.length; i++) {
      if (i === 0) {
        await userEvent.click(rerankLeastButtons[i])
        console.log(`  ✓ Reranked point ${i + 1} as Least`)
      } else if (i === rerankMostButtons.length - 1) {
        await userEvent.click(rerankMostButtons[i])
        console.log(`  ✓ Reranked point ${i + 1} as Most`)
      } else {
        await userEvent.click(rerankNeutralButtons[i])
        console.log(`  ✓ Reranked point ${i + 1} as Neutral`)
      }
    }

    // Wait for Next button to become active after reranking
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Rerank step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 9: Feedback step ==========
    console.log('Step 9: Feedback step - providing feedback')

    // Wait for feedback step - look for heading with exact text "Feedback"
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /^Feedback$/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Feedback step loaded')

    // The feedback form has 3 "Rating" dropdowns and 1 "Description" textarea
    // Fields: experience, comfort, interest (dropdowns), improvements (textarea)
    const ratingDropdowns = await waitFor(() => {
      const dropdowns = canvas.getAllByLabelText('Rating')
      expect(dropdowns.length).toBe(3)
      return dropdowns
    })

    // Select options for each dropdown
    await userEvent.selectOptions(ratingDropdowns[0], 'Very Positive')
    console.log('  ✓ Selected experience: Very Positive')

    await userEvent.selectOptions(ratingDropdowns[1], 'Very Comfortable')
    console.log('  ✓ Selected comfort: Very Comfortable')

    await userEvent.selectOptions(ratingDropdowns[2], 'Very Interested')
    console.log('  ✓ Selected interest: Very Interested')

    // Fill in improvements textarea
    const improvementsTextarea = canvas.getByLabelText('Description')
    await userEvent.type(improvementsTextarea, 'Great tool, would love to see more features.')
    console.log('  ✓ Filled in improvements')

    // Click Submit button to complete the form
    const submitButton = await waitFor(() => {
      const btn = canvas.getByRole('button', { name: /Submit/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(submitButton)
    console.log('  ✓ Clicked Submit on Feedback step')

    // Wait for Next button to become active after submit
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Feedback step')

    // Wait for step slider transition to complete
    await waitForStepSlider(canvasElement)

    // ========== STEP 10: Intermission - enter email ==========
    console.log('Step 10: Intermission - entering email')

    await waitFor(() => {
      const emailInput = canvas.queryByPlaceholderText('Please provide your email')
      expect(emailInput).toBeInTheDocument()
    })

    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'success@email.com', { delay: 10 })
    await userEvent.tab()
    console.log('  ✓ Entered email')

    // Wait for auth flow to complete - the user must be set in context before clicking save
    await waitFor(
      () => {
        expect(testState.authFlowUserSet).toBe(true)
      },
      { timeout: 3000 }
    )
    console.log('  ✓ Auth flow complete - user set in context')

    // Click Save button
    const saveButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })
    await userEvent.click(saveButton)

    // Wait for batch-upsert
    await waitFor(
      () => {
        const calls = window._fetchRouteHandlers?.get('/api/batch-upsert-deliberation-data')?.calls || []
        expect(calls.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // Verify batch-upsert data for full round using toMatchObject
    const batchData = window._fetchRouteHandlers.get('/api/batch-upsert-deliberation-data').calls[0]
    console.log('  📊 Verifying batch-upsert data for full round...')
    console.log('  Batch-upsert data:', JSON.stringify(batchData, null, 2))

    // Find the user's answer point ID (the one with userId: 'temp-user-123' or 'unknown')
    const userAnswerPointId = Object.keys(batchData.data.myPointById).find(key => batchData.data.myPointById[key].userId === 'temp-user-123' || batchData.data.myPointById[key].userId === 'unknown')
    expect(userAnswerPointId).toBeDefined()

    // Get the user's "why most" entry ID from myWhyByCategoryByParentId.most
    const userWhyMostId = batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId]._id
    expect(userWhyMostId).toBeDefined()

    // Get the "why least" entry ID for point-1
    const whyLeastId = batchData.data.myWhyByCategoryByParentId.least['point-1']._id
    expect(whyLeastId).toBeDefined()
    expect(batchData.data.whyRankByParentId[whyLeastId]).toBeDefined()

    // Normalize dynamic IDs in batchData for comparison
    // Normalize user answer point
    batchData.data.myPointById['user-full-flow-point'] = { ...batchData.data.myPointById[userAnswerPointId], _id: 'user-full-flow-point' }
    delete batchData.data.myPointById[userAnswerPointId]

    // Normalize user's "why most" entry in myWhyByCategoryByParentId
    batchData.data.myWhyByCategoryByParentId.most['user-full-flow-point'] = {
      ...batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId],
      _id: 'user-full-flow-why',
      parentId: 'user-full-flow-point',
    }
    delete batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId]

    // Normalize "why least" entry for point-1
    batchData.data.myWhyByCategoryByParentId.least['point-1']._id = 'why-least-point-1'

    // Normalize whyRankByParentId entries
    batchData.data.whyRankByParentId['why-least-point-1'] = { ...batchData.data.whyRankByParentId[whyLeastId], parentId: 'why-least-point-1' }
    delete batchData.data.whyRankByParentId[whyLeastId]

    batchData.data.whyRankByParentId['user-full-flow-why'] = { ...batchData.data.whyRankByParentId[userWhyMostId], parentId: 'user-full-flow-why' }
    delete batchData.data.whyRankByParentId[userWhyMostId]

    // Normalize preRankByParentId for user's answer
    batchData.data.preRankByParentId['user-full-flow-point'] = {
      ...batchData.data.preRankByParentId[userAnswerPointId],
      parentId: 'user-full-flow-point',
    }
    delete batchData.data.preRankByParentId[userAnswerPointId]

    // Normalize postRankByParentId for user's answer
    batchData.data.postRankByParentId['user-full-flow-point'] = {
      ...batchData.data.postRankByParentId[userAnswerPointId],
      parentId: 'user-full-flow-point',
    }
    delete batchData.data.postRankByParentId[userAnswerPointId]

    // Normalize idRanks for user's answer
    batchData.data.idRanks = batchData.data.idRanks.map(rank => {
      if (rank[userAnswerPointId] !== undefined) {
        return { 'user-full-flow-point': rank[userAnswerPointId] }
      }
      return rank
    })

    expect(batchData).toMatchObject({
      discussionId: '5d0137260dacd06732a1d814',
      round: 0,
      email: 'success@email.com',
      data: {
        myPointById: {
          'user-full-flow-point': {
            _id: 'user-full-flow-point',
            subject: 'My Full Flow Issue',
            description: 'This is my description of the full flow issue',
            parentId: '5d0137260dacd06732a1d814',
            userId: expect.stringMatching(/temp-user-123|unknown/),
          },
        },
        myWhyByCategoryByParentId: {
          least: {
            'point-1': {
              subject: 'This is why I ranked it least',
              description: 'Because it does not address the core issue effectively',
              _id: 'why-least-point-1',
              parentId: 'point-1',
              category: 'least',
            },
          },
          most: {
            'user-full-flow-point': {
              _id: 'user-full-flow-why',
              subject: 'Why this matters for full flow',
              description: 'Because it affects everyone in the full flow',
              parentId: 'user-full-flow-point',
              userId: expect.stringMatching(/temp-user-123|unknown/),
              category: 'most',
            },
          },
        },
        preRankByParentId: {
          'point-1': {
            stage: 'pre',
            category: 'least',
            parentId: 'point-1',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-2': {
            stage: 'pre',
            category: 'neutral',
            parentId: 'point-2',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-3': {
            stage: 'pre',
            category: 'neutral',
            parentId: 'point-3',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-4': {
            stage: 'pre',
            category: 'neutral',
            parentId: 'point-4',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'user-full-flow-point': {
            stage: 'pre',
            category: 'most',
            parentId: 'user-full-flow-point',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
        },
        postRankByParentId: {
          'point-3': {
            stage: 'post',
            category: 'neutral',
            parentId: 'point-3',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-2': {
            stage: 'post',
            category: 'neutral',
            parentId: 'point-2',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-1': {
            stage: 'post',
            category: 'least',
            parentId: 'point-1',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-4': {
            stage: 'post',
            category: 'neutral',
            parentId: 'point-4',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'user-full-flow-point': {
            stage: 'post',
            category: 'most',
            parentId: 'user-full-flow-point',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
        },
        whyRankByParentId: {
          'why-least-point-1': {
            category: 'most',
            parentId: 'why-least-point-1',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'why-least-2': {
            category: 'neutral',
            parentId: 'why-least-2',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'why-least-1': {
            category: 'neutral',
            parentId: 'why-least-1',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'user-full-flow-why': {
            category: 'most',
            parentId: 'user-full-flow-why',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
        },
        jsformData: {},
        idRanks: [
          {
            'point-1': 0,
          },
          {
            'point-2': 0,
          },
          {
            'point-3': 0,
          },
          {
            'point-4': 0,
          },
          {
            'user-full-flow-point': 1,
          },
        ],
      },
    })
    console.log('  ✓ batch-upsert data structure verified')

    // need to wait for all rendering to finish before exiting the test
    await waitFor(() => {
      const finalMessage = canvas.getByText("Success! Your data has been saved and we've sent a password email to success@email.com.")
      expect(finalMessage).toBeInTheDocument()
    })
    /*** 
**there is still rendering going on** and we need to make sure it settles before returning from this test or when we will get errors during test-storybook 
  
    page.evaluate: Execution context was destroyed, most likely because of a navigation

*/
    await new Promise(resolve => setTimeout(resolve, 0))
    console.log('✅ NewUserFullFlow test completed successfully!')
  },
}
