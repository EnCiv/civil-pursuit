// https://github.com/EnCiv/civil-pursuit/issues/XXX

import MyActivity from '../app/components/my-activity'

// Sample realistic data
const sampleData = {
  subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
  userResponse: {
    description: 'Unifying efforts to reform the criminal justice system, promoting fairness, equity, and rehabilitation over punishment.',
  },
  rankCounts: {
    mosts: 15,
    leasts: 85,
    neutrals: 50,
  },
  userRanks: [
    // Round 1
    [
      {
        point: {
          subject: 'Healthcare Reform',
          description: 'Universal healthcare access is essential for addressing systemic inequalities and ensuring basic human dignity for all Americans.',
        },
        pre: 'neutral',
        post: 'most',
      },
      {
        point: {
          subject: 'Climate Action',
          description: 'Immediate action on climate change is critical to prevent catastrophic environmental damage and secure a sustainable future.',
        },
        pre: 'least',
        post: 'neutral',
      },
      {
        point: {
          subject: 'Economic Inequality',
          description: 'Growing wealth gaps threaten social stability and the American dream of upward mobility for working families.',
        },
        pre: 'neutral',
        post: 'least',
      },
      {
        point: {
          subject: 'Immigration Policy',
          description: 'Comprehensive immigration reform is needed to address border security while providing pathways for legal immigration.',
        },
        pre: 'most',
        post: 'neutral',
      },
      {
        point: {
          subject: 'Gun Violence Prevention',
          description: 'Sensible gun safety measures can reduce violence while respecting Second Amendment rights.',
        },
        pre: 'neutral',
        post: 'most',
      },
    ],
    // Round 2
    [
      {
        point: {
          subject: 'Education Funding',
          description: 'Adequate public education funding is fundamental to ensuring equal opportunities and building a skilled workforce.',
        },
        pre: 'most',
        post: 'most',
      },
      {
        point: {
          subject: 'Infrastructure Investment',
          description: 'Modernizing our roads, bridges, and broadband networks is essential for economic competitiveness and quality of life.',
        },
        pre: 'neutral',
        post: 'least',
      },
      {
        point: {
          subject: 'Social Security Reform',
          description: 'Strengthening Social Security ensures retirement security for current and future generations of Americans.',
        },
        pre: 'least',
        post: 'most',
      },
      {
        point: {
          subject: 'Mental Health Services',
          description: 'Expanding access to mental health care is crucial for addressing the nationwide mental health crisis.',
        },
        pre: 'neutral',
        post: 'neutral',
      },
      {
        point: {
          subject: 'Technology Privacy',
          description: 'Protecting personal data and digital privacy rights is essential in our increasingly connected world.',
        },
        pre: 'most',
        post: 'least',
      },
    ],
  ],
}

export default {
  component: MyActivity,
  args: {
    data: sampleData,
  },
}

export const Default = {
  args: {
    data: sampleData,
  },
}
