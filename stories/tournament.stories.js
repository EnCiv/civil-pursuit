// https://github.com/EnCiv/civil-pursuit/issues/151

import React from 'react'
import Tournament from '../app/components/tournament'
import { onDoneDecorator } from './common'

const createPointDoc = (
  _id,
  subject,
  description = 'Point Description',
  groupedPoints = [],
  user = {
    dob: '1990-10-20T00:00:00.000Z',
    state: 'NY',
    party: 'Independent',
  }
) => {
  return {
    _id,
    subject,
    description,
    groupedPoints,
    user,
  }
}

const pointItems = Array.from({ length: 30 }, (_, index) =>
  createPointDoc(index, 'Point ' + index, 'Point Description ' + index)
)

const defaultSharedPointsWhyStep = {
  mosts: [pointItems[1], pointItems[2]],
  leasts: [pointItems[3], pointItems[4]],
  whyMosts: [pointItems[1], pointItems[2]],
  whyLeasts: [pointItems[3], pointItems[4]],
}

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

const testSteps = [
  {
    webComponent: 'Answer',
    stepName: 'Answer',
    stepIntro: {
      subject: 'Answer',
      description: 'Please provide a title and short description for your answer',
    },
    question: startingQuestionAnswerStep,
    whyQuestion: whyQuestionAnswerStep,
    shared: {},
  },
  {
    webComponent: 'GroupingStep',
    stepName: 'Group',
    stepIntro: {
      subject: 'Group Responses',
      description:
        'Of these issues, please group similar responses to facilitate your decision-making by avoiding duplicates. If no duplicates are found, you may continue to the next section below.',
    },
    shared: {
      pointList: pointItems,
      groupedPointList: [],
    },
  },
  {
    webComponent: 'ReviewPointList',
    stepName: 'Rank',
    stepIntro: {
      subject: 'Rank Responses',
      description:
        'Please rate the following responses as Most, Neutral, or Least important. You must rate two responses as Most Important, and one as Least Important.',
    },
    reviewPoints: [reviewPoint1, reviewPoint2, reviewPoint3],
  },
  {
    webComponent: 'WhyStep',
    type: 'most',
    stepName: 'Why Most',
    stepIntro: {
      subject: "Why it's Most Important",
      description:
        "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it.",
    },
    intro:
      "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPointsWhyStep,
  },
  {
    webComponent: 'WhyStep',
    type: 'least',
    stepName: 'Why Least',
    stepIntro: {
      subject: "Why it's Least Important",
      description:
        "Of the issues you thought were least important, please give a brief explanation of why it's important for everyone to consider it.",
    },
    intro:
      "Of the issues you thought were Least important, please give a brief explanation of why it's important for everyone to consider it",
    shared: defaultSharedPointsWhyStep,
  },
  {
    webComponent: 'CompareReasons',

    stepName: 'Compare Why Most',
    stepIntro: {
      subject: "Compare Reasons Why It's Most Important",
      description: 'Compare two responses and select a response that is most important for the community to consider.',
    },
    pointList: compareReasonsPointList,
    side: 'most',
  },
  {
    webComponent: 'CompareReasons',
    stepName: 'Compare Why Least',
    stepIntro: {
      subject: "Compare Reasons Why It's Least Important",
      description: 'Compare two responses and select a response that is most important for the community to consider.',
    },
    pointList: compareReasonsPointList,
    side: 'least',
  },
  {
    webComponent: 'Review',
    stepName: 'Review',
    stepIntro: {
      subject: 'Review',
      description:
        'These are the issues you sorted earlier, with reasons added by the discussion. Please consider the reasons and sort the list again. ',
    },
  },
  {
    webComponent: 'Intermission',
    stepName: 'Intermission',
    stepIntro: {
      subject: "Awesome, you've completed Round 1!",
      description: 'When more people have gotten to this point we will invite you back to continue the deliberation. ',
    },
  },
]

export default {
  component: Tournament,
  args: {
    steps: testSteps,
  },
  decorators: [onDoneDecorator],
}

export const Default = {
  args: {
    testSteps,
  },
}
