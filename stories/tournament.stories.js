// https://github.com/EnCiv/civil-pursuit/issues/151

import React, { useState } from 'react'
import Tournament from '../app/components/tournament'
import { DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator, buildApiDecorator } from './common'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'
import { resetRequestedById } from '../app/components/hooks/use-fetch-dem-info'

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
  component: Tournament,
  args: {
    steps: tournamentSteps,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator],
  excludeStories: ['tournamentDecorators', 'tournamentDefaultValue', 'tournamentSteps'],
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

// export so they can be used in other stories like civil-pursuit
export const tournamentDecorators = [
  Story => {
    // Reset the static requestedById cache
    useState(() => {
      resetRequestedById()
    })

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
  },
  buildApiDecorator('subscribe-deliberation', (discussionId, requestHandler, updateHandler) => {
    requestHandler({ uInfo: [{ shownStatementIds: {}, userId: '67bf9d6ae49200d1349ab34a' }], lastRound: 0, participants: 1 })
  }),
  buildApiDecorator('get-user-ranks', []),
  buildApiDecorator('get-points-of-ids', []),
  buildApiDecorator('get-why-ranks-and-points', { ranks: [], whys: [] }),
  buildApiDecorator('get-user-post-ranks-and-top-ranked-whys', (discussionId, round, parentIds, cb) => {
    // Return ranks and whys for the review step (RerankStep)
    const ranks = [] // Empty ranks array - user hasn't ranked yet in this step
    const whys = make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())
    cb({ ranks, whys })
  }),
  buildApiDecorator('upsert-rank', () => {}),
  buildApiDecorator('get-conclusion', (discussionId, cb) => {
    cb && cb([{ point: pointList[0], mosts: make5Whys([pointList[0]], 'most').flat(), leasts: make5Whys([pointList[0]], 'least').flat(), counts: { most: 7, neutral: 2, least: 5 } }])
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
]

export const tournamentDefaultValue = {
  // this goes into the deliberation context
  userId: '67bf9d6ae49200d1349ab34a',
  discussionId: '5d0137260dacd06732a1d814',
  dturn: { finalRound: 2 },
  pointById: byId(pointList),
  groupIdsLists: [],
  randomWhyById: byId(make5Whys(pointList, 'most').flat().concat(make5Whys(pointList, 'least').flat())),
  whyRankByParentId: {},
  postRankByParentId: {},
}

export const Normal = {
  args: {
    testSteps: tournamentSteps,
    defaultValue: tournamentDefaultValue,
  },
  decorators: tournamentDecorators,
}
