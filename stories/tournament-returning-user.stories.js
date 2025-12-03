// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Story: Authenticated user returning to complete steps 2-10 after having completed Answer step
// Local storage has previous data from the Answer step

import React from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, socketEmitDecorator, buildApiDecorator } from './common'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { tournamentSteps } from './tournament.stories'
import { waitForStepSlider } from './step-slider.stories'

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

// Sample points for grouping/ranking steps (same as tournament-full-flow)
const samplePoints = [
  {
    _id: 'point-1',
    subject: 'Issue One',
    description: 'Description of issue one',
    parentId: '5d0137260dacd06732a1d814',
  },
  {
    _id: 'point-2',
    subject: 'Issue Two',
    description: 'Description of issue two',
    parentId: '5d0137260dacd06732a1d814',
  },
  {
    _id: 'point-3',
    subject: 'Issue Three',
    description: 'Description of issue three',
    parentId: '5d0137260dacd06732a1d814',
  },
  {
    _id: 'point-4',
    subject: 'Issue Four',
    description: 'Description of issue four',
    parentId: '5d0137260dacd06732a1d814',
  },
]

// Sample whys for compare-whys step
const sampleWhys = {
  ranks: [],
  whys: [
    {
      _id: 'why-most-1',
      subject: 'Reason why this is most important',
      description: 'This issue is most important because...',
      parentId: 'point-4',
      category: 'most',
    },
    {
      _id: 'why-least-1',
      subject: 'First reason for least important',
      description: 'Reason for issue one',
      parentId: 'point-1',
      category: 'least',
    },
    {
      _id: 'why-least-2',
      subject: 'Second reason for least important',
      description: 'Another reason for issue one',
      parentId: 'point-1',
      category: 'least',
    },
  ],
}

// User's previously saved answer point (from localStorage)
const userAnswerPoint = {
  _id: 'user-answer-point-123',
  subject: 'My Previously Saved Issue',
  description: 'This is an issue I entered in a previous session',
  parentId: '5d0137260dacd06732a1d814',
  userId: 'returning-user-456',
}

// User's previously saved why for their answer
const userAnswerWhy = {
  _id: 'user-answer-why-123',
  subject: 'Why my issue matters',
  description: 'Because it affects everyone significantly',
  parentId: 'user-answer-point-123',
  category: 'most',
  userId: 'returning-user-456',
}

export default {
  title: 'Tournament',
  component: Tournament,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
}

// Authenticated user returning to complete steps 2-10
// User has already completed Answer step in a previous session
// localStorage has their answer point and why
// They start at Step 2 (Grouping) and go through to Intermission
export const ReturningUserCompleteFlow = {
  args: {
    steps: tournamentSteps,
    defaultValue: {
      userId: 'returning-user-456',
      discussionId: '5d0137260dacd06732a1d814',
      dturn: { finalRound: 2 },
      round: 0,
      // User is authenticated (has id and email)
      user: { id: 'returning-user-456', email: 'returning@example.com' },
      participants: 25,
      // Previous data from Answer step (simulating localStorage)
      pointById: {
        [userAnswerPoint._id]: userAnswerPoint,
      },
      myWhyByCategoryByParentId: {
        most: {
          [userAnswerPoint._id]: userAnswerWhy,
        },
        least: {},
      },
      // Since user has already completed Answer, they should skip to Grouping
      // The uInfo indicates the user has seen their own statement
      uInfo: [
        {
          shownStatementIds: {},
          finished: false,
          userId: 'returning-user-456',
        },
      ],
    },
  },
  decorators: [
    demInfoDecorator,
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
      // Return sample points plus the user's own answer
      cb([...samplePoints, userAnswerPoint])
    }),
    buildApiDecorator('get-jsform', (discussionId, cb) => cb({})),
    buildApiDecorator('set-user-info', ({ email }, cb) => {
      console.log('set-user-info called with email:', email)
      if (!window.setUserInfoCalls) window.setUserInfoCalls = []
      window.setUserInfoCalls.push({ email })
      cb({ success: true })
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
        uInfo: [
          {
            shownStatementIds: {},
            finished: false,
            userId: 'returning-user-456',
          },
        ],
        lastRound: 0,
        participants: 25,
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Reset global state for test isolation
    window.batchUpsertCalls = []
    window.setUserInfoCalls = []

    console.log('🧪 ReturningUserCompleteFlow test starting...')
    console.log('  Returning user with email - should see Answer step with pre-filled data')

    // ========== STEP 1: Answer step (returning user sees their previous data) ==========
    console.log('Step 1: Answer step - verify pre-filled data and proceed')

    // Wait for answer step content
    await waitFor(() => {
      const element = canvas.queryByText(/provide a title and short description/i)
      expect(element).toBeInTheDocument()
    })
    console.log('  ✓ Answer step loaded')

    // User already has email, so no Terms checkbox needed
    // Just click Next to proceed
    let nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Answer step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 2: Grouping step ==========
    console.log('Step 2: Grouping step - grouping similar points')

    // Wait for grouping step - look for heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Group Responses/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Grouping step loaded')

    // Group first two points together
    // Find the first point and drag it to create a group
    // For simplicity, just click Next (grouping is optional)
    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Grouping step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 3: Ranking step ==========
    console.log('Step 3: Ranking step - ranking points')

    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Rank Responses/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Ranking step loaded')

    // Rank points
    const allMostRadios = await waitFor(() => {
      const radios = canvas.getAllByRole('radio', { name: 'Most' })
      expect(radios.length).toBeGreaterThan(0)
      return radios
    })
    const allNeutralRadios = canvas.getAllByRole('radio', { name: 'Neutral' })
    const allLeastRadios = canvas.getAllByRole('radio', { name: 'Least' })
    console.log(`  Found ${allMostRadios.length} points to rank`)

    // First point -> Least, Last point -> Most, rest -> Neutral
    for (let i = 0; i < allMostRadios.length; i++) {
      if (i === 0) {
        await userEvent.click(allLeastRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Least`)
      } else if (i === allMostRadios.length - 1) {
        await userEvent.click(allMostRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Most`)
      } else {
        await userEvent.click(allNeutralRadios[i])
        console.log(`  ✓ Ranked point ${i + 1} as Neutral`)
      }
    }

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Ranking step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 4: Why Most step ==========
    console.log('Step 4: Why Most step')

    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Why it's Most Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Why Most step loaded')

    // Enter why for the most important point
    const whyMostInputs = canvas.getAllByPlaceholderText(/type some thing here/i)
    const whyMostDescs = canvas.getAllByPlaceholderText(/description/i)

    if (whyMostInputs.length > 0) {
      await userEvent.type(whyMostInputs[0], 'This is why it matters most')
      await userEvent.tab()
      if (whyMostDescs.length > 0) {
        await userEvent.type(whyMostDescs[0], 'Detailed explanation of importance')
        await userEvent.tab()
      }
      console.log('  ✓ Entered why most data')
    }

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Why Most step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 5: Why Least step ==========
    console.log('Step 5: Why Least step - need to provide input')

    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Why it's Least Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Why Least step loaded')

    // Find the why input fields - use the last ones which are on the current step
    const allSubjectInputs = canvas.getAllByPlaceholderText(/type some thing here/i)
    const allDescriptionInputs = canvas.getAllByPlaceholderText(/description/i)

    const whySubjectInput = allSubjectInputs[allSubjectInputs.length - 1]
    const whyDescriptionInput = allDescriptionInputs[allDescriptionInputs.length - 1]

    await userEvent.type(whySubjectInput, 'This is why it is least important')
    await userEvent.tab()
    console.log('  ✓ Filled in why subject')

    await userEvent.type(whyDescriptionInput, 'Detailed explanation of least importance')
    await userEvent.tab()
    console.log('  ✓ Filled in why description')

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Why Least step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 6: Compare Why Most step ==========
    console.log('Step 6: Compare Why Most step')

    // Wait for the Compare Why Most heading (from stepIntro)
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Compare Reasons Why It's Most Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Compare Why Most step loaded')

    // Click the "Recommend for further consideration" button (Useful button)
    const usefulButton = await waitFor(() => {
      const btn = canvas.queryByTitle('Recommend for further consideration')
      expect(btn).toBeInTheDocument()
      return btn
    })
    await userEvent.click(usefulButton)
    console.log('  ✓ Clicked Useful button')

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Compare Why Most step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 7: Compare Why Least step ==========
    console.log('Step 7: Compare Why Least step')

    // Wait for the Compare Why Least heading (from stepIntro)
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Compare Reasons Why It's Least Important/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Compare Why Least step loaded')

    // Wait for user's why and first sample why to be visible
    await waitFor(() => {
      const userWhy = canvas.queryByText('This is why it is least important')
      const sampleWhy1 = canvas.queryByText('First reason for least important')
      expect(userWhy).toBeInTheDocument()
      expect(sampleWhy1).toBeInTheDocument()
    })
    console.log('  ✓ User why and first sample why visible')

    // Click on user's why (first comparison)
    const userWhyText1 = canvas.getByText('This is why it is least important')
    await userEvent.click(userWhyText1)
    console.log('  ✓ Clicked on user why (1st comparison)')

    // Wait for second sample why to appear in visible container (after animation)
    await waitFor(() => {
      const sampleWhy2Button = canvas.queryByTitle('Choose as more important: Second reason for least important')
      expect(sampleWhy2Button).toBeInTheDocument()
    })
    console.log('  ✓ Second sample why visible in comparison')

    // Click on user's why again (second comparison)
    const userWhyText2 = canvas.getByText('This is why it is least important')
    await userEvent.click(userWhyText2)
    console.log('  ✓ Clicked on user why (2nd comparison)')

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Compare Why Least step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 8: Review/Rerank step ==========
    console.log('Step 8: Rerank step - reranking after seeing whys')

    // Wait for rerank step - look for heading
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /Re-Rank Responses|Review/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Rerank step loaded')

    // Get all the radio button groups - need to rank again
    // Rank first as Least, last as Most, others Neutral
    const rerankMostButtons = canvas.getAllByRole('radio', { name: 'Most' })
    const rerankNeutralButtons = canvas.getAllByRole('radio', { name: 'Neutral' })
    const rerankLeastButtons = canvas.getAllByRole('radio', { name: 'Least' })

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

    await waitForStepSlider(canvasElement)

    // ========== STEP 9: Feedback step ==========
    console.log('Step 9: Feedback step')

    // Wait for feedback step - look for heading with exact text "Feedback"
    await waitFor(() => {
      const heading = canvas.queryByRole('heading', { name: /^Feedback$/i })
      expect(heading).toBeInTheDocument()
    })
    console.log('  ✓ Feedback step loaded')

    // The feedback form has 3 "Rating" dropdowns and 1 "Description" textarea
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
    console.log('  ✓ Clicked Submit on Feedback')

    nextButton = await waitFor(() => {
      const btn = canvas.queryByRole('button', { name: /Next/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
      return btn
    })
    await userEvent.click(nextButton)
    console.log('  ✓ Clicked Next on Feedback step')

    await waitForStepSlider(canvasElement)

    // ========== STEP 10: Intermission ==========
    console.log('Step 10: Intermission')

    // For authenticated user with email who completed the round:
    // - batch-upsert was already called at Step 8 (Rerank) since user has email
    // - Intermission shows a completion message (no "Invite me back" button needed)
    // - lastRound=0 and round=0, so nextRoundAvailable is false
    // - They see: "Great you've completed Round 1, we will send you an invite..."

    await waitFor(() => {
      const text = canvas.queryByText(/Great you've completed Round/i)
      expect(text).toBeInTheDocument()
    })
    console.log('  ✓ Intermission step loaded with completion message')

    // Verify batch-upsert was called at Step 8 (Rerank onNext) since user has email
    await waitFor(() => expect(window.batchUpsertCalls.length).toBeGreaterThan(0), { timeout: 3000 })
    console.log('  ✓ batch-upsert was called (at Rerank step for authenticated user)')

    // Verify batch-upsert data using toMatchObject for structured assertion
    const batchData = window.batchUpsertCalls[0]
    console.log('  📊 Verifying batch-upsert data...')
    // Normalize dynamic IDs in batchData for comparison
    const whyLeastId = batchData.data.myWhyByCategoryByParentId.least['point-1']._id
    expect(batchData.data.whyRankByParentId[whyLeastId]).toBeDefined()
    batchData.data.myWhyByCategoryByParentId.least['point-1']._id = 'why-least-point-1'
    batchData.data.whyRankByParentId['why-least-point-1'] = { ...batchData.data.whyRankByParentId[whyLeastId], parentId: 'why-least-point-1' }
    delete batchData.data.whyRankByParentId[whyLeastId]
    expect(batchData).toMatchObject({
      discussionId: '5d0137260dacd06732a1d814',
      round: 0,
      email: 'returning@example.com',
      data: {
        pointById: {
          'user-answer-point-123': {
            _id: 'user-answer-point-123',
            subject: 'My Previously Saved IssueThis is why it matters most',
            description: 'This is an issue I entered in a previous sessionDetailed explanation of importance',
            parentId: '5d0137260dacd06732a1d814',
            userId: 'returning-user-456',
          },
          'point-1': {
            _id: 'point-1',
            subject: 'Issue One',
            description: 'Description of issue one',
            parentId: '5d0137260dacd06732a1d814',
          },
          'point-2': {
            _id: 'point-2',
            subject: 'Issue Two',
            description: 'Description of issue two',
            parentId: '5d0137260dacd06732a1d814',
          },
          'point-3': {
            _id: 'point-3',
            subject: 'Issue Three',
            description: 'Description of issue three',
            parentId: '5d0137260dacd06732a1d814',
          },
          'point-4': {
            _id: 'point-4',
            subject: 'Issue Four',
            description: 'Description of issue four',
            parentId: '5d0137260dacd06732a1d814',
          },
        },
        myWhyByCategoryByParentId: {
          least: {
            'point-1': {
              subject: 'This is why it is least important',
              description: 'Detailed explanation of least importance',
              _id: 'why-least-point-1',
              parentId: 'point-1',
              category: 'least',
            },
          },
          most: {
            'user-answer-point-123': {
              _id: 'user-answer-why-123',
              subject: 'Why my issue matters',
              description: 'Because it affects everyone significantly',
              parentId: 'user-answer-point-123',
              category: 'most',
              userId: 'returning-user-456',
            },
          },
        },
        postRankByParentId: {
          'point-3': {
            //_id: '692fb881f074d84b7d4bd2c0',
            stage: 'post',
            category: 'neutral',
            parentId: 'point-3',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-2': {
            //_id: '692fb881f074d84b7d4bd2bf',
            stage: 'post',
            category: 'neutral',
            parentId: 'point-2',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'point-1': {
            //_id: '692fb880f074d84b7d4bd2be',
            stage: 'post',
            category: 'neutral',
            parentId: 'point-1',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
          'user-answer-point-123': {
            //_id: '692fb880f074d84b7d4bd2bd',
            stage: 'post',
            category: 'neutral',
            parentId: 'user-answer-point-123',
            round: 0,
            discussionId: '5d0137260dacd06732a1d814',
          },
        },
        whyRankByParentId: {
          'why-least-point-1': {
            //_id: '692fb870f074d84b7d4bd2bc',
            category: 'most',
            parentId: 'why-least-point-1',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'why-least-2': {
            //_id: '692fb870f074d84b7d4bd2bb',
            category: 'neutral',
            parentId: 'why-least-2',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'why-least-1': {
            //_id: '692fb86ff074d84b7d4bd2ba',
            category: 'neutral',
            parentId: 'why-least-1',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
          'user-answer-why-123': {
            //_id: '692fb86ef074d84b7d4bd2b9',
            category: 'most',
            parentId: 'user-answer-why-123',
            stage: 'why',
            discussionId: '5d0137260dacd06732a1d814',
            round: 0,
          },
        },
        groupIdsLists: [],
        jsformData: {},
        idRanks: [
          {
            'user-answer-point-123': 0,
          },
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
            'point-4': 1,
          },
        ],
      },
    })
    console.log('  ✓ batch-upsert data structure verified')

    // Allow rendering to settle
    await new Promise(resolve => setTimeout(resolve, 0))

    console.log('✅ ReturningUserCompleteFlow test completed successfully!')
  },
}
