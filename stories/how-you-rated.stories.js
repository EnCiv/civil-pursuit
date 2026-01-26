// https://github.com/EnCiv/civil-pursuit/issues/[ISSUE_NUMBER]

import HowYouRated from '../app/components/how-you-rated'

const sampleEntries = [
  {
    point: {
      subject: 'Inequality',
      description: 'Inequality can hinder economic growth and stability',
    },
    pre: 'neutral',
    post: 'most',
  },
  {
    point: {
      subject: 'Healthcare access',
      description: 'Universal healthcare should be accessible to all',
    },
    pre: 'least',
    post: 'most',
  },
]

export default {
  component: HowYouRated,
  args: {
    defaultSelectedRound: 0,
  },
}

export const singleRound = {
  args: {
    entries: [
      // Round 1 only
      sampleEntries,
    ],
  },
}

export const twoRounds = {
  args: {
    entries: [
      // Round 1
      [
        {
          point: {
            subject: 'R1: Economic policy',
            description: 'Round 1: Economic policies need reform',
          },
          pre: 'neutral',
          post: 'most',
        },
        {
          point: {
            subject: 'R1: Social programs',
            description: 'Round 1: Social safety nets are important',
          },
          pre: 'least',
          post: 'most',
        },
      ],
      // Round 2
      [
        {
          point: {
            subject: 'R2: Environmental action',
            description: 'Round 2: Climate change requires immediate response',
          },
          pre: 'most',
          post: 'neutral',
        },
        {
          point: {
            subject: 'R2: Technology innovation',
            description: 'Round 2: Tech advancement drives progress',
          },
          pre: 'neutral',
          post: 'most',
        },
      ],
    ],
  },
}

export const threeRounds = {
  args: {
    entries: [
      // Round 1 - Economic Focus
      [
        {
          point: {
            subject: 'R1: Taxation policy',
            description: 'Round 1: Tax reform could reduce inequality',
          },
          pre: 'neutral',
          post: 'most',
        },
        {
          point: {
            subject: 'R1: Job creation',
            description: 'Round 1: Employment opportunities are crucial',
          },
          pre: 'most',
          post: 'most',
        },
      ],
      // Round 2 - Social Focus
      [
        {
          point: {
            subject: 'R2: Education funding',
            description: 'Round 2: Schools need adequate resources',
          },
          pre: 'least',
          post: 'most',
        },
        {
          point: {
            subject: 'R2: Healthcare reform',
            description: 'Round 2: Medical system needs improvement',
          },
          pre: 'neutral',
          post: 'most',
        },
      ],
      // Round 3 - Environmental Focus
      [
        {
          point: {
            subject: 'R3: Renewable energy',
            description: 'Round 3: Clean energy transition is essential',
          },
          pre: 'most',
          post: 'neutral',
        },
        {
          point: {
            subject: 'R3: Conservation efforts',
            description: 'Round 3: Environmental protection matters',
          },
          pre: 'neutral',
          post: 'most',
        },
      ],
    ],
  },
}

export const fiveRounds = {
  args: {
    entries: Array.from({ length: 5 }, (_, roundIdx) => [
      {
        point: {
          subject: `R${roundIdx + 1}: Topic A`,
          description: `Round ${roundIdx + 1}: First discussion topic`,
        },
        pre: ['neutral', 'most', 'least', 'neutral', 'most'][roundIdx],
        post: ['most', 'neutral', 'most', 'least', 'neutral'][roundIdx],
      },
      {
        point: {
          subject: `R${roundIdx + 1}: Topic B`,
          description: `Round ${roundIdx + 1}: Second discussion topic`,
        },
        pre: ['least', 'neutral', 'most', 'most', 'least'][roundIdx],
        post: ['neutral', 'most', 'neutral', 'most', 'most'][roundIdx],
      },
    ]),
  },
}

export const emptyRounds = {
  args: {
    entries: [], // No rounds at all
  },
}
