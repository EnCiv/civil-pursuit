// https://github.com/EnCiv/civil-pursuit/issues/152

import React from 'react'
import CivilPursuit from '../app/components/civil-pursuit'
import { onDoneDecorator } from './common'

const testSteps = [
  { webComponent: 'SignUp' },
  { webComponent: 'Details', questions: [['What party are you with']] },
  // Copy paste the data from tournament.stories.js to make things easy
  {
    webComponent: 'Tournment',
    steps: [
      {
        webComponent: 'Answer',
        stepName: 'Answer',
        stepIntro: {
          subject: 'Answer',
          description: 'Please provide a title and short description for your answer',
        },
      },
      {
        webComponent: 'GroupingStep',
        stepName: 'Group',
        stepIntro: {
          subject: 'Group Responses',
          description:
            'Of these issues, please group similar responses to facilitate your decision-making by avoiding duplicates. If no duplicates are found, you may continue to the next section below.',
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
      },
      {
        webComponent: 'WhyStep',
        category: 'most',
        stepName: 'Why Most',
        stepIntro: {
          subject: "Why it's Most Important",
          description:
            "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it.",
        },
      },
      {
        webComponent: 'WhyStep',
        category: 'least',
        stepName: 'Why Least',
        stepIntro: {
          subject: "Why it's Least Important",
          description:
            "Of the issues you thought were least important, please give a brief explanation of why it's important for everyone to consider it.",
        },
      },
      {
        webComponent: 'CompareReasons',
        category: 'most',
        stepName: 'Compare Why Most',
        stepIntro: {
          subject: "Compare Reasons Why It's Most Important",
          description:
            'Compare two responses and select a response that is most important for the community to consider.',
        },
      },
      {
        webComponent: 'CompareReasons',
        category: 'least',
        stepName: 'Compare Why Least',
        stepIntro: {
          subject: "Compare Reasons Why It's Least Important",
          description:
            'Compare two responses and select a response that is most important for the community to consider.',
        },
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
        stepName: '',
        stepIntro: {
          subject: "Awesome, you've completed Round 1!",
          description:
            'When more people have gotten to this point we will invite you back to continue the deliberation. ',
        },
      },
    ],
  },
  { webComponent: 'Conclusion' },
  { webComponent: 'Feedback' },
]

export default {
  component: CivilPursuit,
  args: {
    steps: testSteps,
  },
  decorators: [onDoneDecorator],
}

export const Default = {
  args: {
    subject: 'What One Issue Should We The People Unite and Solve First?',
    description:
      'This is a large scale online discussion with the purpose of starting unbiased, and thoughtful conversations, that lead to amazing new solutions. **But here, we are asking about concerns**, we will get to the solutions later.',
    steps: testSteps,
  },
}
