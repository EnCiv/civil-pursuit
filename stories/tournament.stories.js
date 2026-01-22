// https://github.com/EnCiv/civil-pursuit/issues/151

/**
 * # Important Notes for Writing Tournament Interaction Tests
 *
 * These stories use play functions to simulate user interactions through multi-step
 * tournament flows. When writing or modifying these tests, keep the following in mind:
 *
 * ## 1. Wait for Rendering to Complete
 *
 * - Always ensure all rendering is complete before the play function returns
 * - Use `waitFor()` to wait for expected UI elements to appear
 * - Failure to do this will cause errors during `test-storybook` runs
 * - Example:
 *   ```js
 *   await waitFor(() => expect(canvas.getByText('Success')).toBeInTheDocument())
 *   ```
 *
 * ## 2. Previous Step Panels Remain in the DOM
 *
 * - The step-slider keeps all previous step panels in the DOM (for back navigation)
 * - When querying for input elements, you **MUST** scope to the current step's panel
 * - Use the step's heading to find the wrapper, then query within it:
 *   ```js
 *   const heading = canvas.queryByRole('heading', { name: /Why it's Least Important/i })
 *   const wrapper = heading.parentNode.parentNode
 *   const input = wrapper.querySelector('input[placeholder="Type some thing here"]')
 *   ```
 * - Using `canvas.getAllByPlaceholderText()` may find inputs from previous steps!
 *
 * ## 3. Wait for Step Transitions
 *
 * - Use `waitForStepSlider(canvasElement)` after clicking Next to wait for:
 *   - The CSS transition to complete
 *   - The new step's height to stabilize
 * - This helper is imported from `'./step-slider.stories'`
 *
 * ## 4. Test Isolation
 *
 * - Reset global state at the start of play functions:
 *   ```js
 *   window.batchUpsertCalls = []
 *   if (window.socket?._socketEmitHandlerResults) {
 *     Object.keys(window.socket._socketEmitHandlerResults).forEach(key => {
 *       window.socket._socketEmitHandlerResults[key] = []
 *     })
 *   }
 *   ```
 * - The `DeliberationContextDecorator` clears localStorage automatically before each story
 *   (unless `preserveLocalStorage: true` is set in args)
 * - If you need to manually clear localStorage in a play function:
 *   ```js
 *   window.localStorage.clear()
 *   ```
 *
 * ## 5. Shared Test Data
 *
 * - Common data (`demInfoDecorator`, `samplePoints`, `sampleWhys`, `tournamentSteps`, etc.)
 *   is exported from this file for use in other tournament story files
 * - This reduces duplication and ensures consistency across tests
 *
 * ## 6. Verifying Results with toMatchObject
 *
 * - Use `toMatchObject()` to explicitly show what properties are important in results
 * - This makes it easier for reviewers to verify what should and shouldn't be there
 * - Development workflow:
 *   1. First use `console.log(JSON.stringify(result, null, 2))` to see the actual object
 *   2. Copy the relevant properties into your `toMatchObject()` assertion
 *   3. Normalize dynamic values (IDs, timestamps) to predictable values if needed
 * - Example:
 *   ```js
 *   // Good: explicitly shows expected structure
 *   expect(batchUpsertCalls[0]).toMatchObject({
 *     upserts: {
 *       postRankByParentId: { 'point-1': { rank: 0 } }
 *     }
 *   })
 *   // Avoid: doesn't show what's actually being tested
 *   expect(batchUpsertCalls).toHaveLength(1)
 *   ```
 */

import React, { useState } from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator, buildApiDecorator, deliberationContextData, mockBatchUpsertDeliberationDataRoute } from './common'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { authFlowDecorators, withAuthTestState } from './mocks/auth-flow'
import { waitForStepSlider } from './step-slider.stories'

const pointItems = Array.from({ length: 30 }, (_, index) => ({
  _id: index + 'a', //
  subject: 'Point ' + index,
  description: 'Point Description ' + index,
  userId: '1000' + index,
}))

// Generate demographic data for each point
const demInfoByPointId = pointItems.reduce((acc, point, index) => {
  acc[point._id] = {
    yearOfBirth: (1960 + index).toString(), // Increments from 1960 to 1989
    stateOfResidence: ['California', 'Texas', 'New York', 'Florida', 'Illinois'][index % 5],
    politicalParty: ['Democrat', 'Republican', 'Independent', 'Green', 'Libertarian'][index % 5],
    shareInfo: 'Yes',
  }
  return acc
}, {})

const reviewPoint1 = {
  point: pointItems[0],
  leftPoints: [pointItems[1], pointItems[2], pointItems[3]],
  rightPoints: [pointItems[4], pointItems[5], pointItems[6]],
  rank: '',
}

const reviewPoint2 = {
  point: pointItems[7],
  leftPoints: [pointItems[8], pointItems[9], pointItems[10]],
  rightPoints: [pointItems[11], pointItems[12], pointItems[13]],
  rank: '',
}

const reviewPoint3 = {
  point: pointItems[14],
  leftPoints: [pointItems[15], pointItems[16], pointItems[17]],
  rightPoints: [pointItems[18], pointItems[19], pointItems[20]],
  rank: '',
}

const compareReasonsPointList = [
  {
    subject: 'Headline Issue #1',
    description: 'Description for Headline Issue #1',
    reasonPoints: {
      most: [pointItems[0], pointItems[1], pointItems[2], pointItems[3], pointItems[4]],
      least: [pointItems[5], pointItems[6], pointItems[7], pointItems[8], pointItems[9]],
    },
  },
  {
    subject: 'Headline Issue #2',
    description: 'Description for Headline Issue #2',
    reasonPoints: {
      most: [pointItems[10], pointItems[11]],
      least: [pointItems[12], pointItems[13]],
    },
  },
  {
    subject: 'Headline Issue #3',
    description: 'Description for Headline Issue #3',
    reasonPoints: {
      most: [pointItems[14], pointItems[15]],
      least: [pointItems[16], pointItems[17]],
    },
  },
]

const startingQuestionAnswerStep = {
  _id: '5d0137260dacd06732a1d814',
  subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
  description: `This task is testing an application for large scale online discussion that is unbiased, thoughtful, doesn’t require reading millions of answers, and leads to awesome results. We are only asking about a concern - an issue or problem, not about any possible solutions. Think about it before answering, think outside the box, think big and think about everyone in the country uniting on this. At the end, your feedback will be welcomed.`,
}

const whyQuestionAnswerStep = 'Why should everyone consider solving this issue?'

export const tournamentSteps = [
  {
    webComponent: 'Answer',
    stepName: 'Answer',
    stepIntro: {
      subject: 'Answer',
      description: 'Please provide a title and short description for your answer',
    },
    question: startingQuestionAnswerStep,
    whyQuestion: whyQuestionAnswerStep,
  },
  {
    webComponent: 'GroupingStep',
    stepName: 'Group',
    stepIntro: {
      subject: 'Group Responses',
      description: 'Of these issues, please group similar responses to facilitate your decision-making by avoiding duplicates. If no duplicates are found, you may continue to the next section below.',
    },
    shared: {
      pointList: makePoints(9),
      groupedPointList: [],
    },
  },
  {
    webComponent: 'RankStep',
    stepName: 'Rank',
    stepIntro: {
      subject: 'Rank Responses',
      description: 'Please rate the following responses as Most, Neutral, or Least important. You must rate two responses as Most Important, and one as Least Important.',
    },
    pointList: pointItems,
    rankList: [],
  },
  {
    webComponent: 'WhyStep',
    category: 'most',
    stepName: 'Why Most',
    stepIntro: {
      subject: "Why it's Most Important",
      description: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it.",
    },
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  {
    webComponent: 'WhyStep',
    category: 'least',
    stepName: 'Why Least',
    stepIntro: {
      subject: "Why it's Least Important",
      description: "Of the issues you thought were least important, please give a brief explanation of why it's important for everyone to consider it.",
    },
    intro: "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
  },
  {
    webComponent: 'CompareReasons',

    stepName: 'Compare Why Most',
    stepIntro: {
      subject: "Compare Reasons Why It's Most Important",
      description: 'Compare two responses and select a response that is most important for the community to consider.',
    },
    pointList: compareReasonsPointList,
    category: 'most',
  },
  {
    webComponent: 'CompareReasons',
    stepName: 'Compare Why Least',
    stepIntro: {
      subject: "Compare Reasons Why It's Least Important",
      description: 'Compare two responses and select a response that is most important for the community to consider.',
    },
    pointList: compareReasonsPointList,
    category: 'least',
  },
  {
    webComponent: 'ReviewPointList',
    stepName: 'Review',
    stepIntro: {
      subject: 'Review',
      description: 'These are the issues you sorted earlier, with reasons added by the discussion. Please consider the reasons and sort the list again. ',
    },
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
  },
  {
    webComponent: 'Jsform',
    name: 'earlyFeedback',
    stepName: 'Feedback',
    allowedRounds: [0], // only show this step in round 0
    stepIntro: {
      subject: 'Feedback',
      description: "Now that you've completed this round, please tells us what you think so far. This is a work in progress and your feedback matters.",
    },
    schema: {
      type: 'object',
      properties: {
        experience: {
          title: 'Rating',
          type: 'string',
          enum: ['Very Positive', 'Somewhat Positive', 'Neutral', 'Somewhat Negative', 'Very Negative'],
        },
        comfort: {
          title: 'Rating',
          type: 'string',
          enum: ['Very Comfortable', 'Somewhat Comfortable', 'Neutral', 'Somewhat Uncomfortable', 'Very Uncomfortable'],
        },
        interest: {
          title: 'Rating',
          type: 'string',
          enum: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Somewhat Uninterested', 'Very Uninterested'],
        },
        improvements: {
          title: 'Description',
          type: 'string',
        },
      },
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'H', text: 'How has your experience been so far?' },
        {
          type: 'Control',
          scope: '#/properties/experience',
        },
        { type: 'H', text: 'How comfortable would you feel inviting close friends or family to participate in this discussion too?' },
        {
          type: 'Control',
          scope: '#/properties/comfort',
        },
        { type: 'H', text: 'How interested are you in getting to the next round of this discussion?' },
        {
          type: 'Control',
          scope: '#/properties/interest',
        },
        { type: 'H', text: 'What can we do to make this tool better?' },
        {
          type: 'Control',
          scope: '#/properties/improvements',
          options: { multi: true, rows: 5 },
        },
      ],
    },
  },
  {
    webComponent: 'Intermission',
    stepName: 'Intermission',
    stepIntro: {
      subject: 'Intermission',
      description: 'When more people have gotten to this point we will invite you back to continue the deliberation.',
    },
    user: { email: 'example@gmail.com', tempid: '123456' },
  },
]

export default {
  title: 'Tournament',
  component: Tournament,
  args: {
    steps: tournamentSteps,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator],
  excludeStories: ['tournamentDecorators', 'tournamentDefaultValue', 'tournamentSteps', 'demInfoDecorator', 'samplePoints', 'sampleWhys', 'tournamentDefaultValueMinimal', 'tournamentDecoratorsWithPointData'],
}

function makePoints(n) {
  return Array.from({ length: n }, (_, i) => ({ _id: i + 1 + '', subject: 'Point ' + i, description: 'Point Description ' + i, parentId: 'd' }))
}
const pointList = makePoints(9)

// Add demographic data for pointList items
pointList.forEach((point, index) => {
  demInfoByPointId[point._id] = {
    yearOfBirth: (1990 + index).toString(), // Increments from 1990
    stateOfResidence: ['California', 'Texas', 'New York', 'Florida', 'Illinois'][index % 5],
    politicalParty: ['Democrat', 'Republican', 'Independent', 'Green', 'Libertarian'][index % 5],
    shareInfo: 'Yes',
  }
})

let id = 100
function make5Whys(points, category) {
  return points.map(point =>
    Array.from({ length: 5 }, (_, i) => {
      const whyPoint = { _id: id++, subject: `Why ${category} ` + point._id + i, description: `Why ${category} Description ` + point._id + i, parentId: point._id, category }
      // Add demographic data for why points
      demInfoByPointId[whyPoint._id] = {
        yearOfBirth: (1970 + (id % 30)).toString(), // Increments based on id
        stateOfResidence: ['California', 'Texas', 'New York', 'Florida', 'Illinois'][id % 5],
        politicalParty: ['Democrat', 'Republican', 'Independent', 'Green', 'Libertarian'][id % 5],
        shareInfo: 'Yes',
      }
      return whyPoint
    })
  )
}
function byId(docs) {
  return docs.reduce((byId, doc) => ((byId[doc._id] = doc), byId), {})
}

function byParentIdList(docs) {
  return docs.reduce((byPId, doc) => (byPId[doc.parentId] ? byPId[doc.parentId].push(doc) : (byPId[doc.parentId] = [doc]), byPId), {})
}

// Shared DemInfo decorator for all tournament stories
export const demInfoDecorator = Story => {
  // Each DemInfoProvider has its own requestedById tracking

  // DemInfoSetup runs inside the provider so useContext works correctly
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

// Sample points for grouping/ranking steps - shared across tournament stories
export const samplePoints = [
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

// Sample whys for compare-whys step - shared across tournament stories
export const sampleWhys = {
  ranks: [],
  whys: [
    {
      _id: 'why-most-1',
      subject: 'Reason why this is most important',
      description: 'This issue is most important because...',
      parentId: 'point-4', // The point ranked as Most
      category: 'most',
    },
    {
      _id: 'why-least-1',
      subject: 'First reason for least important',
      description: 'Reason for issue one',
      parentId: 'point-1', // The point ranked as Least
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

// Common API decorators shared by all tournament stories
const commonTournamentApiDecorators = [
  buildApiDecorator('get-user-ranks', []),
  buildApiDecorator('get-points-of-ids', []),
  buildApiDecorator('upsert-rank', () => {}),
  buildApiDecorator('get-conclusion', (discussionId, cb) => {
    cb && cb([{ point: pointList[0], mosts: make5Whys([pointList[0]], 'most').flat(), leasts: make5Whys([pointList[0]], 'least').flat(), counts: { most: 7, neutral: 2, least: 5 } }])
  }),
]

// Standard decorators for Normal/NotEnoughParticipantsYet stories
// Data comes from defaultValue (pointById, randomWhyById in context)
const standardApiDecorators = [
  buildApiDecorator('get-why-ranks-and-points', { ranks: [], whys: [] }),
  buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
    const ranks = []
    const whys = make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())
    cb({ ranks, whys })
  }),
  buildApiDecorator('get-dem-info', (pointIds, cb) => {
    const demInfo = {}
    pointIds.forEach(id => {
      if (demInfoByPointId[id]) {
        demInfo[id] = demInfoByPointId[id]
      }
    })
    cb(demInfo)
  }),
  // subscribe-deliberation is at the end so it can be sliced off and replaced
  buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
    requestHandler({ uInfo: [{ shownStatementIds: {}, userId: 'temp-user-123' }], lastRound: 0, participants: 20 })
  }),
]

// API decorators for LocalStoragePreserved story
// Data comes from API calls instead of defaultValue
const apiDecoratorsWithPointData = [
  buildApiDecorator('get-why-ranks-and-points', (discussionId, round, mostIds, leastIds, cb) => {
    const whys = make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())
    cb({ ranks: [], whys })
  }),
  buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
    const ranks = []
    const whys = make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())
    cb({ ranks, whys })
  }),
  buildApiDecorator('get-points-for-round', (discussionId, round, cb) => {
    cb(pointList)
  }),
  buildApiDecorator('get-dem-info', (pointIds, cb) => {
    const demInfo = {}
    pointIds.forEach(id => {
      if (demInfoByPointId[id]) {
        demInfo[id] = demInfoByPointId[id]
      }
    })
    cb(demInfo)
  }),
  buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
    requestHandler({
      uInfo: [{ shownStatementIds: {}, userId: 'temp-user-123' }],
      lastRound: 0,
      participants: 20,
    })
  }),
]

// Export for use in other stories like civil-pursuit
export const tournamentDecorators = [demInfoDecorator, ...commonTournamentApiDecorators, ...standardApiDecorators]

export const tournamentDefaultValue = {
  // this goes into the deliberation context
  userId: 'temp-user-123',
  discussionId: '5d0137260dacd06732a1d814',
  dturn: { finalRound: 2, group_size: 5 },
  pointById: byId(pointList),
  groupIdsLists: [],
  randomWhyById: byId(make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())),
  whyRankByParentId: {},
  postRankByParentId: {},
}

// Default value for LocalStoragePreserved - data comes from localStorage or API calls
export const tournamentDefaultValueMinimal = {
  userId: 'temp-user-123',
  discussionId: '5d0137260dacd06732a1d814',
  dturn: { finalRound: 2, group_size: 5 },
}

// Decorators for LocalStoragePreserved story - provides data via API calls
export const tournamentDecoratorsWithPointData = [demInfoDecorator, ...commonTournamentApiDecorators, ...apiDecoratorsWithPointData]

export const Normal = {
  args: {
    testSteps: tournamentSteps,
    defaultValue: tournamentDefaultValue,
  },
  decorators: [...tournamentDecorators],
}

export const NotEnoughParticipantsYet = {
  args: {
    testSteps: tournamentSteps,
    defaultValue: tournamentDefaultValue,
  },
  decorators: [
    ...tournamentDecorators.slice(0, -1),
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      requestHandler({ uInfo: [{ shownStatementIds: {}, userId: 'temp-user-123' }], lastRound: 0, participants: 1 })
    }),
  ],
}

export const LocalStoragePreserved = {
  args: {
    testSteps: tournamentSteps,
    defaultValue: tournamentDefaultValueMinimal,
    preserveLocalStorage: true,
  },
  decorators: [...tournamentDecoratorsWithPointData],
}

// Test story for batch-upsert-deliberation-data API using play function
// Simulates user interaction at intermission to trigger batch-upsert
//
// This test starts with user: undefined and tests the full authentication flow:
// 1. New user visits (user = undefined)
// 2. Answer step shows Terms checkbox
// 3. Play function checks Terms and clicks Next
// 4. methods.skip() is called by Answer step, which POSTs to /tempid
// 5. Decorator intercepts /tempid response and updates context with user: { id: 'temp-user-123' }
// 6. User continues through tournament steps with temporary ID
// 7. At intermission, batch-upsert is called to save all localStorage data
//
// The /tempid endpoint is mocked in .storybook/middleware.js to return { userId: 'temp-user-123' }.
// A custom decorator intercepts the fetch call and updates the deliberation context,
// simulating the user prop update that would normally happen after page reload.
export const BatchUpsertInteractionTest = {
  render: withAuthTestState(Tournament),
  args: {
    testSteps: tournamentSteps,
    defaultValue: {
      ...tournamentDefaultValueMinimal,
      round: 0, // Round 1 (0-based indexing)
      user: undefined, // Start with no user - will be set after tempid mock is called
      participants: 20, // Need >= 2 * group_size to show all steps (default group_size is 10)
      // Simulate data from all completed steps
      pointById: {
        // User's answer point - use ObjectId string for new points
        '67bf9d6ae49200d1349ab350': { _id: '67bf9d6ae49200d1349ab350', subject: 'My Important Issue', description: 'This is why this issue matters', userId: 'temp-user-123' },
        // Points from tournament that are referenced by parentId
        1: { _id: '1', subject: 'Point 0', description: 'Point Description 0', parentId: 'd' },
        2: { _id: '2', subject: 'Point 1', description: 'Point Description 1', parentId: 'd' },
        3: { _id: '3', subject: 'Point 2', description: 'Point Description 2', parentId: 'd' },
        4: { _id: '4', subject: 'Point 3', description: 'Point Description 3', parentId: 'd' },
        5: { _id: '5', subject: 'Point 4', description: 'Point Description 4', parentId: 'd' },
        6: { _id: '6', subject: 'Point 5', description: 'Point Description 5', parentId: 'd' },
        7: { _id: '7', subject: 'Point 6', description: 'Point Description 6', parentId: 'd' },
        8: { _id: '8', subject: 'Point 7', description: 'Point Description 7', parentId: 'd' },
        9: { _id: '9', subject: 'Point 8', description: 'Point Description 8', parentId: 'd' },
      },
      myWhyByCategoryByParentId: {
        // Why responses - parentId must match user's point _id above
        most: {
          '67bf9d6ae49200d1349ab350': { _id: '67bf9d6ae49200d1349ab351', subject: 'Why Most Important', description: 'Explanation for most', parentId: '67bf9d6ae49200d1349ab350', category: 'most', userId: 'temp-user-123' },
          1: { _id: '67bf9d6ae49200d1349ab352', subject: 'Why Also Most', description: 'Another most explanation', parentId: '1', category: 'most', userId: 'temp-user-123' },
        },
        least: {
          9: { _id: '67bf9d6ae49200d1349ab353', subject: 'Why Least Important', description: 'Explanation for least', parentId: '9', category: 'least', userId: 'temp-user-123' },
        },
      },
      groupIdsLists: [
        ['1', '2', '3'], // Group 1
        ['4', '5'], // Group 2
        ['6', '7', '8'], // Group 3 - must have at least 2 items
      ],
      preRankByParentId: {
        '67bf9d6ae49200d1349ab350': { parentId: '67bf9d6ae49200d1349ab350', category: 'most', userId: 'temp-user-123' },
        1: { parentId: '1', category: 'neutral', userId: 'temp-user-123' },
        2: { parentId: '2', category: 'neutral', userId: 'temp-user-123' },
        3: { parentId: '3', category: 'neutral', userId: 'temp-user-123' },
        4: { parentId: '4', category: 'neutral', userId: 'temp-user-123' },
        5: { parentId: '5', category: 'neutral', userId: 'temp-user-123' },
        6: { parentId: '6', category: 'neutral', userId: 'temp-user-123' },
        7: { parentId: '7', category: 'neutral', userId: 'temp-user-123' },
        8: { parentId: '8', category: 'neutral', userId: 'temp-user-123' },
        9: { parentId: '9', category: 'least', userId: 'temp-user-123' },
      },
      whyRankByParentId: {
        // Rankings of why points from compare-reasons step
        //100: { parentId: '100', rank: 5, userId: '67bf9d6ae49200d1349ab34a' },
        //101: { parentId: '101', rank: 3, userId: '67bf9d6ae49200d1349ab34a' },
        190: {
          _id: '691f7ef8402ac2f7b8d338ee',
          category: 'neutral',
          parentId: 190,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        191: {
          _id: '691f7ef2402ac2f7b8d338ea',
          category: 'neutral',
          parentId: 191,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        192: {
          _id: '691f7ef4402ac2f7b8d338eb',
          category: 'neutral',
          parentId: 192,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        193: {
          _id: '691f7ef5402ac2f7b8d338ec',
          category: 'neutral',
          parentId: 193,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        194: {
          _id: '691f7ef6402ac2f7b8d338ed',
          category: 'neutral',
          parentId: 194,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        275: {
          _id: '691f7fbe402ac2f7b8d338fa',
          category: 'neutral',
          parentId: 275,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        276: {
          _id: '691f7fb1402ac2f7b8d338f1',
          category: 'neutral',
          parentId: 276,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        277: {
          _id: '691f7fb2402ac2f7b8d338f2',
          category: 'neutral',
          parentId: 277,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        278: {
          _id: '691f7fb3402ac2f7b8d338f3',
          category: 'neutral',
          parentId: 278,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        279: {
          _id: '691f7fb4402ac2f7b8d338f4',
          category: 'neutral',
          parentId: 279,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        365: {
          _id: '691f7fb6402ac2f7b8d338f5',
          category: 'neutral',
          parentId: 365,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        366: {
          _id: '691f7fb7402ac2f7b8d338f6',
          category: 'neutral',
          parentId: 366,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        367: {
          _id: '691f7fb9402ac2f7b8d338f7',
          category: 'neutral',
          parentId: 367,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        368: {
          _id: '691f7fba402ac2f7b8d338f8',
          category: 'neutral',
          parentId: 368,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        369: {
          _id: '691f7fbc402ac2f7b8d338f9',
          category: 'neutral',
          parentId: 369,
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        '67bf9d6ae49200d1349ab353': {
          _id: '691f7fbe402ac2f7b8d338fb',
          category: 'most',
          parentId: '67bf9d6ae49200d1349ab353',
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        '67bf9d6ae49200d1349ab351': {
          _id: '691f7f61402ac2f7b8d338f0',
          category: 'most',
          parentId: '67bf9d6ae49200d1349ab351',
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
        '67bf9d6ae49200d1349ab352': {
          _id: '691f7ef8402ac2f7b8d338ef',
          category: 'most',
          parentId: '67bf9d6ae49200d1349ab352',
          stage: 'why',
          discussionId: '5d0137260dacd06732a1d814',
          round: 0,
        },
      },
      postRankByParentId: {
        // Post-rankings from rerank step
        1: {
          parentId: '1',
          category: 'most',
          rank: 10,
          userId: 'temp-user-123',
        },
        4: {
          parentId: '4',
          category: 'neutral',
          rank: 8,
          userId: 'temp-user-123',
        },
        6: {
          _id: '691f802b402ac2f7b8d338fc',
          stage: 'post',
          category: 'neutral',
          parentId: '6',
          round: 0,
          discussionId: '5d0137260dacd06732a1d814',
        },
        7: {
          _id: '691f802d402ac2f7b8d338fd',
          stage: 'post',
          category: 'neutral',
          parentId: '7',
          round: 0,
          discussionId: '5d0137260dacd06732a1d814',
        },
        8: {
          _id: '691f8030402ac2f7b8d338fe',
          stage: 'post',
          category: 'neutral',
          parentId: '8',
          round: 0,
          discussionId: '5d0137260dacd06732a1d814',
        },
        9: {
          parentId: '9',
          category: 'least',
          rank: 2,
          userId: 'temp-user-123',
        },
        '67bf9d6ae49200d1349ab350': {
          _id: '691f8035402ac2f7b8d338ff',
          stage: 'post',
          category: 'most',
          parentId: '67bf9d6ae49200d1349ab350',
          round: 0,
          discussionId: '5d0137260dacd06732a1d814',
        },
      },
      roundCompleteData: {
        0: {
          // Round 1 completion data from rerank step
          idRanks: ['1', '4', '6', '7', '8', '9'], // Ordered list of ranked point IDs
          groupings: [
            ['1', '2', '3'],
            ['4', '5'],
            ['6', '7', '8'],
          ],
        },
      },
      // Simulate that all steps are complete but Round 1 NOT finished yet
      // This will make tournament render all steps from the beginning
      uInfo: [
        {
          shownStatementIds: {}, // Empty - no steps finished yet
          userId: 'temp-user-123',
          finished: false, // Round 1 is NOT complete - play function will complete it
        },
      ],
    },
  },
  decorators: [
    ...tournamentDecoratorsWithPointData.slice(0, -1), // All except subscribe-deliberation
    ...authFlowDecorators, // Add auth flow decorators for /tempid interception
    mockBatchUpsertDeliberationDataRoute, // Mock fetch for batch-upsert HTTP endpoint
    // Provide jsform data via API
    buildApiDecorator('get-jsform', (discussionId, cb) => {
      cb({
        earlyFeedback: {
          experience: 'Very Positive',
          comfort: 'Very Comfortable',
          interest: 'Very Interested',
          improvements: 'Great tool, would love to see more features.',
        },
      })
    }),
    // Capture batch-upsert-deliberation-data socket calls (for authenticated users)
    buildApiDecorator('batch-upsert-deliberation-data', (batchData, cb) => {
      // Store the call for inspection in browser console and window object
      if (!window.batchUpsertCalls) window.batchUpsertCalls = []
      window.batchUpsertCalls.push(batchData)
      console.log('✅ batch-upsert-deliberation-data socket called with:', batchData)
      console.log('📊 Summary:', {
        discussionId: batchData.discussionId,
        round: batchData.round,
        email: batchData.email,
        points: Object.keys(batchData.data?.myPointById || {}).length,
        groupings: batchData.data?.groupIdsLists?.length,
        idRanksLength: batchData.data?.idRanks?.length,
        jsformKeys: Object.keys(batchData.data?.jsformData || {}),
      })
      // Simulate success response
      cb({ success: true })
    }),
    buildApiDecorator('set-user-info', ({ email }, cb) => {
      console.log('⚠️ set-user-info called with email:', email, '(This means Invite me back flow was used, not batch-upsert)')
      if (!window.setUserInfoCalls) window.setUserInfoCalls = []
      window.setUserInfoCalls.push({ email })
      cb({ success: true })
    }),
    buildApiDecorator('send-password', (email, pathname, cb) => {
      console.log('send-password called with email:', email)
      cb({ success: true })
    }),
    // Override subscribe-deliberation - Round 1 NOT finished yet
    buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
      requestHandler({
        uInfo: [
          {
            shownStatementIds: {},
            userId: 'temp-user-123',
            finished: false, // Not finished - play function will complete steps
          },
        ],
        lastRound: 0,
        participants: 20,
      })
    }),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const { testState } = args

    // Initialize tracking arrays and auth flow state
    // Clear existing arrays instead of creating new ones (decorator may have created them)
    if (window.batchUpsertCalls) window.batchUpsertCalls.length = 0
    else window.batchUpsertCalls = []
    if (window.setUserInfoCalls) window.setUserInfoCalls.length = 0
    else window.setUserInfoCalls = []
    testState.authFlowUserSet = false

    // Map of step names to their identifying content
    const stepMarkers = {
      answer: { type: 'text', pattern: /provide a title and short description/i },
      grouping: { type: 'text', pattern: /Group Responses/i },
      rank: { type: 'text', pattern: /Rank Responses/i },
      whyMost: { type: 'text', pattern: /Why it's Most Important/i },
      whyLeast: { type: 'text', pattern: /Why it's Least Important/i },
      compareMost: { type: 'text', pattern: /Please choose the most convincing explanation for.../i },
      compareLeast: { type: 'text', pattern: /Please choose the least convincing explanation for.../i },
      review: { type: 'text', pattern: /These are the issues you sorted earlier, with reasons added by the discussion. Please consider the reasons and sort the list again./i },
      jsform: { type: 'text', pattern: /Now that you've completed this round, please tells us what you think so far. This is a work in progress and your feedback matters./i },
      intermission: { type: 'text', pattern: /Great you've completed Round.*/i },
    }

    // Helper to wait for step content, then click Next button
    const clickNext = async currentStep => {
      console.log(`  On ${currentStep} step, waiting for content then clicking Next`)

      // First wait for the current step's content to be visible
      const marker = stepMarkers[currentStep]
      if (marker) {
        await waitFor(() => {
          let element
          if (marker.type === 'text') {
            element = canvas.queryByText(marker.pattern)
          } else if (marker.type === 'role') {
            element = canvas.queryAllByRole(marker.role)[0]
          } else if (marker.type === 'placeholder') {
            element = canvas.queryByPlaceholderText(marker.pattern)
          }
          if (!element) throw new Error(`${currentStep} step content not found`)
          return element
        })
        console.log(`    ✓ ${currentStep} content visible`)
      }

      // Wait for Next button to appear and be enabled
      const nextButton = await waitFor(() => {
        const btn = canvas.queryByRole('button', { name: /Next/i })
        expect(btn).toBeInTheDocument()
        expect(btn).not.toBeDisabled()
        return btn
      })

      await userEvent.click(nextButton)
      console.log(`    → Clicked Next`)

      // Wait for step slider transition to complete
      await waitForStepSlider(canvasElement)
      console.log(`    ✓ Step transition complete`)
    }

    // Step 1: Answer step - check "Yes, I agree" then click Next
    console.log('Step 1: Answer step')

    // Wait for Terms checkbox and click it
    await waitFor(() => {
      const termsCheckbox = canvas.queryByRole('checkbox')
      if (!termsCheckbox) throw new Error('Terms checkbox not found')
      return termsCheckbox
    })
    const termsCheckbox = canvas.getByRole('checkbox')
    await userEvent.click(termsCheckbox)
    console.log('  Clicked "Yes, I agree" checkbox')

    await clickNext('answer')

    // Wait for auth flow to complete - user must be set in context before clicking save
    await waitFor(
      () => {
        expect(testState.authFlowUserSet).toBe(true)
      },
      { timeout: 3000 }
    )
    console.log('  Auth flow complete - user set in context')

    // Step 2: Grouping step
    console.log('Step 2: Grouping step')
    await clickNext('grouping')

    // Step 3: Rank step
    console.log('Step 3: Rank step')
    await clickNext('rank')

    // Step 4: Why Most step
    console.log('Step 4: Why Most step')
    await clickNext('why-most')

    // Step 5: Why Least step
    console.log('Step 5: Why Least step')
    await clickNext('why-least')

    // Step 6: Compare Why Most step
    console.log('Step 6: Compare Why Most step')
    await clickNext('compare-most')

    // Step 7: Compare Why Least step
    console.log('Step 7: Compare Why Least step')
    await clickNext('compare-least')

    // Step 8: Review/Rerank step
    console.log('Step 8: Review/Rerank step')
    await clickNext('review')

    // Step 9: Jsform (Feedback) step
    console.log('Step 9: Jsform (Feedback) step')
    await clickNext('jsform')

    // Step 10: Intermission - should now be visible
    console.log('Step 10: Intermission - entering email')

    // Wait for intermission content and ensure round is marked complete
    await waitFor(() => {
      const emailInput = canvas.queryByPlaceholderText('Please provide your email')
      expect(emailInput).toBeInTheDocument()
    })

    // Debug: Check the current state before clicking button
    console.log('  Checking intermission state...')
    const debugButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })
    console.log('  Button text:', debugButton.textContent)
    console.log('  This tells us: isTemporaryUser =', debugButton.textContent.includes('Save') ? 'true (has id, no email)' : 'unknown')
    console.log('  This tells us: isRound1Complete =', debugButton.textContent.includes('Save') ? 'true (round 0, finished)' : 'false')

    // Type email address
    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'success@email.com', { delay: 10 })
    await userEvent.tab() // Trigger blur event

    // Wait for typing to complete and verify the email value
    await waitFor(
      () => {
        expect(emailInput.value).toBe('success@email.com')
      },
      { timeout: 2000 }
    )
    console.log('  Email typed successfully:', emailInput.value)

    // Click the button
    const saveButton = canvas.getByRole('button', { name: /(Save and Continue|Invite me back)/i })
    console.log('  Clicking button:', saveButton.textContent)
    await userEvent.click(saveButton)
    // Wait for batch-upsert API to be called
    await waitFor(
      () => {
        // Check if batch-upsert was called (correct flow for temporary user with completed round)
        if (window.batchUpsertCalls && window.batchUpsertCalls.length > 0) {
          return true
        }
        // If set-user-info was called instead, the test setup is wrong
        if (window.setUserInfoCalls && window.setUserInfoCalls.length > 0) {
          throw new Error(
            'WRONG FLOW: set-user-info was called instead of batch-upsert. ' +
              'This means either: (1) user does not have id, (2) round is not marked as finished, or (3) round !== 0. ' +
              'Check that /tempid interceptor updated user correctly and that rerank onNext set finished=true.'
          )
        }
        throw new Error('Neither batch-upsert nor set-user-info was called yet')
      },
      { timeout: 3000 }
    )

    // Verify the batch-upsert call data
    const batchData = window.batchUpsertCalls[0]
    console.log('  📊 Verifying batch-upsert data...')

    // This test uses pre-populated data with known IDs, so no ID normalization needed
    // Note: myPointById only contains user's own point (filtered by intermission.jsx)
    expect(batchData).toMatchObject({
      discussionId: '5d0137260dacd06732a1d814',
      round: 0,
      email: 'success@email.com',
      data: {
        myPointById: {
          // Only user's point - points 1-9 are from other users and not sent
          '67bf9d6ae49200d1349ab350': {
            _id: '67bf9d6ae49200d1349ab350',
            subject: 'My Important Issue',
            description: 'This is why this issue matters',
            userId: 'temp-user-123',
            parentId: '5d0137260dacd06732a1d814',
          },
        },
        myWhyByCategoryByParentId: {
          most: {
            1: {
              _id: '67bf9d6ae49200d1349ab352',
              subject: 'Why Also Most',
              description: 'Another most explanation',
              parentId: '1',
              category: 'most',
              userId: 'temp-user-123',
            },
            '67bf9d6ae49200d1349ab350': {
              _id: '67bf9d6ae49200d1349ab351',
              subject: 'Why Most Important',
              description: 'Explanation for most',
              parentId: '67bf9d6ae49200d1349ab350',
              category: 'most',
              userId: 'temp-user-123',
            },
          },
          least: {
            9: {
              _id: '67bf9d6ae49200d1349ab353',
              subject: 'Why Least Important',
              description: 'Explanation for least',
              parentId: '9',
              category: 'least',
              userId: 'temp-user-123',
            },
          },
        },
        groupIdsLists: [
          ['1', '2', '3'],
          ['4', '5'],
          ['6', '7', '8'],
        ],
        idRanks: [{ 1: 1 }, { 4: 0 }, { 6: 0 }, { 9: 0 }, { '67bf9d6ae49200d1349ab350': 1 }],
        jsformData: {},
      },
    })
    console.log('  ✓ batch-upsert data structure verified')
    // need to wait for the final message to appear and all rendering before ending the test
    await waitFor(() => {
      const finalMessage = canvas.getByText(/Success! Your data has been saved and we've sent a password reset email to success@email.com/)
      expect(finalMessage).toBeInTheDocument()
    })
    /*** 
**there is still rendering going on** and we need to make sure it settles before returning from this test or when we will get errors during test-storybook 
  
    ● tournament › BatchUpsertInteractionTest › play-test
    page.evaluate: Execution context was destroyed, most likely because of a navigation

*/
    await new Promise(resolve => setTimeout(resolve, 0))
    // sometime on this test we get that error even after the above, so we add one more
    await new Promise(resolve => setTimeout(resolve, 0))
    console.log('✅ All batch-upsert assertions passed!')
  },
}
