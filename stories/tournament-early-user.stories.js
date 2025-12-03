// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Story: New user, not enough participants - goes directly from Answer to Intermission

import React from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, socketEmitDecorator, buildApiDecorator } from './common'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { authFlowDecorators, withAuthTestState } from './mocks/auth-flow'
import { tournamentSteps } from './tournament.stories'

const demInfoDecorator = Story => {
  const DemInfoSetup = () => {
    const { upsert } = React.useContext(DemInfoContext)
    React.useEffect(() => {
      if (upsert) {
        upsert({
          uischema: {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/yearOfBirth' },
              { type: 'Control', scope: '#/properties/stateOfResidence' },
              { type: 'Control', scope: '#/properties/politicalParty' },
            ],
          },
        })
      }
    }, [upsert])
    return null
  }

  return (
    <DemInfoProvider>
      <DemInfoSetup />
      <Story />
    </DemInfoProvider>
  )
}

const tournamentDefaultValueMinimal = {
  userId: 'temp-user-123',
  discussionId: '5d0137260dacd06732a1d814',
  dturn: { finalRound: 2 },
}

export default {
  title: 'Tournament',
  component: Tournament,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

// New user, not enough participants - goes directly from Answer to Intermission
// This tests the "early user" scenario where:
// 1. User agrees to Terms, enters answer and why
// 2. Not enough participants for grouping/ranking steps (participants < 2 * group_size)
// 3. User skips to intermission, provides email
// 4. batch-upsert should only contain answer data (no grouping, ranking, etc.)
export const NewUserNotEnoughParticipants = {
  render: withAuthTestState(Tournament),
  args: {
    steps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      round: 0,
      user: undefined, // New user - no ID yet
      participants: 1, // Not enough participants
    },
  },
  decorators: [
    demInfoDecorator,
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
      console.log('⚠️ set-user-info called with:', email, '- this should NOT happen for temp user at round 0')
      cb({ error: 'Test mock - set-user-info should not be called' })
    }),
    buildApiDecorator('batch-upsert-deliberation-data', (batchData, cb) => {
      if (!window.batchUpsertCalls) window.batchUpsertCalls = []
      window.batchUpsertCalls.push(batchData)
      console.log('✅ batch-upsert-deliberation-data called with:', batchData)
      cb({ success: true })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => cb({ success: true })),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      console.log('🔔 subscribe-deliberation called for discussion:', discussionId)
      requestHandler({
        uInfo: [{ shownStatementIds: {}, finished: false, userId: 'temp-user-123' }], // finished: false - early user, round not complete (not enough participants)
        lastRound: 0,
        participants: 1, // Not enough!
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    // Reset global state for test isolation
    window.batchUpsertCalls = []
    window.setUserInfoCalls = []
    testState.authFlowUserSet = false
    // Reset socket emit handler results to avoid cross-test pollution
    if (window.socket?._socketEmitHandlerResults) {
      Object.keys(window.socket._socketEmitHandlerResults).forEach(key => {
        window.socket._socketEmitHandlerResults[key] = []
      })
    }

    console.log('🧪 NewUserNotEnoughParticipants test starting...')

    // Step 1: Answer step - fill in answer and why, check Terms, click Next
    console.log('Step 1: Answer step - entering data and agreeing to Terms')

    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })

    // Fill in the answer fields
    const subjectInputs = canvas.getAllByPlaceholderText(/type some thing here/i)
    const descriptionInputs = canvas.getAllByPlaceholderText(/description/i)

    await userEvent.type(subjectInputs[0], 'My Early User Issue')
    await userEvent.tab()
    await userEvent.type(descriptionInputs[0], 'This is my description of the early user issue')
    await userEvent.tab()
    await userEvent.type(subjectInputs[1], 'Why this matters')
    await userEvent.tab()
    await userEvent.type(descriptionInputs[1], 'Because it affects everyone')
    await userEvent.tab()
    console.log('  ✓ Filled in answer and why fields')

    // Check Terms checkbox
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)
    console.log('  ✓ Checked Terms checkbox')

    // Click Next
    const nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next')

    // Wait for transition
    const stepSliderWrapper = canvasElement.querySelector('[data-transitioning]')
    if (stepSliderWrapper) {
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-transition-complete')).toBe('true'), { timeout: 2000 })
      await waitFor(() => expect(stepSliderWrapper.getAttribute('data-height-stable')).toBe('true'), { timeout: 1000 })
    }

    // Step 2: Intermission - enter email
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

    // Wait for auth flow to complete - the user must be set in context before clicking save
    await waitFor(
      () => {
        expect(testState.authFlowUserSet).toBe(true)
      },
      { timeout: 3000 }
    )
    console.log('  ✓ Auth flow complete - user set in context')

    // Now find and click the save button
    const saveButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })

    // Click Save button
    await userEvent.click(saveButton)

    // Wait for batch-upsert
    await waitFor(() => expect(window.batchUpsertCalls.length).toBeGreaterThan(0), { timeout: 3000 })

    // Verify batch-upsert data
    const batchData = window.batchUpsertCalls[0]
    console.log('  📊 Verifying batch-upsert data...')
    console.log('  Batch-upsert data:', JSON.stringify(batchData, null, 2))

    // Find the user's answer point ID (the one with userId: 'temp-user-123')
    const userAnswerPointId = Object.keys(batchData.data.pointById).find(key => batchData.data.pointById[key].userId === 'temp-user-123')
    expect(userAnswerPointId).toBeDefined()

    // Get the user's "why most" entry ID
    const userWhyMostId = batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId]._id
    expect(userWhyMostId).toBeDefined()

    // Normalize dynamic IDs in batchData for comparison
    // Normalize user answer point
    batchData.data.pointById['user-early-point'] = { ...batchData.data.pointById[userAnswerPointId], _id: 'user-early-point' }
    delete batchData.data.pointById[userAnswerPointId]

    // Normalize user's "why most" entry in myWhyByCategoryByParentId
    batchData.data.myWhyByCategoryByParentId.most['user-early-point'] = {
      ...batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId],
      _id: 'user-early-why',
      parentId: 'user-early-point',
    }
    delete batchData.data.myWhyByCategoryByParentId.most[userAnswerPointId]

    expect(batchData).toMatchObject({
      discussionId: '5d0137260dacd06732a1d814',
      round: 0,
      email: 'success@email.com',
      data: {
        pointById: {
          'user-early-point': {
            _id: 'user-early-point',
            subject: 'My Early User Issue',
            description: 'This is my description of the early user issue',
            parentId: '5d0137260dacd06732a1d814',
            userId: 'temp-user-123',
          },
        },
        myWhyByCategoryByParentId: {
          most: {
            'user-early-point': {
              _id: 'user-early-why',
              subject: 'Why this matters',
              description: 'Because it affects everyone',
              parentId: 'user-early-point',
              userId: 'temp-user-123',
              category: 'most',
            },
          },
        },
      },
    })
    console.log('  ✓ batch-upsert data structure verified')
    // need to wait for the final message to appear before ending the test
    await waitFor(() => {
      const finalMessage = canvas.getByText("Success! Your answer has been saved and we've sent a password email to success@email.com. We'll invite you back when more participants join.")
      expect(finalMessage).toBeInTheDocument()
    })
    /*** 
**there is still rendering going on** and we need to make sure it settles before returning from this test or when we will get errors during test-storybook 
  
    page.evaluate: Execution context was destroyed, most likely because of a navigation

*/
    await new Promise(resolve => setTimeout(resolve, 0))

    console.log('✅ NewUserNotEnoughParticipants test passed!')
  },
}
