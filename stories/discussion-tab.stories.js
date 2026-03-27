// https://github.com/EnCiv/civil-pursuit/issues/385

import React, { useState } from 'react'
import { ThemeProvider } from 'react-jss'
import theme from '../app/components/theme'
import DiscussionTab from '../app/web-components/discussion-tab'
import { buildApiDecorator } from './common'

// Mock activity data for the stories
const mockActivityData = {
  '67db9da4c6019fba8de3eafe': {
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
      ],
    ],
  },
  '68687cdeb4e0c47144419fde': {
    subject: "What's the largest number",
    userResponse: {
      description: 'I think the largest random number should be 42 because it represents the answer to everything.',
    },
    rankCounts: {
      mosts: 5,
      leasts: 2,
      neutrals: 1,
    },
    userRanks: [
      [
        {
          point: {
            subject: 'Random Number Theory',
            description: 'The concept of randomness in mathematics is fundamental to probability and statistics.',
          },
          pre: 'most',
          post: 'most',
        },
        {
          point: {
            subject: 'Computer Science Applications',
            description: 'Random numbers are crucial for cryptography, simulations, and algorithms.',
          },
          pre: 'neutral',
          post: 'least',
        },
      ],
    ],
  },
  '69abc123def456789012345': {
    subject: 'How can we improve public transportation in urban areas?',
    userResponse: {
      description: 'Investing in electric buses and expanding subway networks while making public transit more affordable and accessible to all communities.',
    },
    rankCounts: {
      mosts: 32,
      leasts: 8,
      neutrals: 15,
    },
    userRanks: [
      [
        {
          point: {
            subject: 'Accessibility for Disabled Passengers',
            description: 'All public transportation should be fully accessible with proper accommodations for passengers with disabilities.',
          },
          pre: 'most',
          post: 'most',
        },
        {
          point: {
            subject: 'Environmental Impact',
            description: 'Transitioning to electric and clean energy public transport reduces urban pollution and carbon footprint.',
          },
          pre: 'neutral',
          post: 'most',
        },
        {
          point: {
            subject: 'Cost vs Efficiency',
            description: 'Balancing the cost of transportation infrastructure with efficient service delivery and maintenance.',
          },
          pre: 'least',
          post: 'neutral',
        },
      ],
    ],
  },
  '70def456abc789012345678': {
    subject: 'What role should technology play in modern education?',
    userResponse: {
      description: 'Technology should enhance learning through personalized AI tutors and interactive platforms while ensuring equal access and maintaining human connection in education.',
    },
    rankCounts: {
      mosts: 48,
      leasts: 12,
      neutrals: 25,
    },
    userRanks: [
      [
        {
          point: {
            subject: 'Digital Divide and Equity',
            description: 'Ensuring all students have equal access to technology and high-speed internet, regardless of socioeconomic background.',
          },
          pre: 'most',
          post: 'most',
        },
        {
          point: {
            subject: 'Screen Time and Health Concerns',
            description: 'Balancing the benefits of digital learning with concerns about excessive screen time and its impact on student health.',
          },
          pre: 'neutral',
          post: 'least',
        },
        {
          point: {
            subject: 'Teacher Training and Support',
            description: 'Providing adequate training and ongoing support for educators to effectively integrate technology into their teaching methods.',
          },
          pre: 'least',
          post: 'most',
        },
      ],
    ],
  },
}

// Mock discussions data for the stories
const mockDiscussions = [
  {
    _id: '67db9da4c6019fba8de3eafe',
    subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
    description: "This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We're asking about concerns, not solutions.",
    path: '/what-long-term-usa-1',
    participants: 127,
    currentRound: 2,
    isComplete: false,
    userLastActivity: '2024-02-08T14:22:00.000Z',
    discussionLastActivity: '2024-02-07T16:45:00.000Z',
  },
  {
    _id: '68687cdeb4e0c47144419fde',
    subject: "What's the largest number",
    description: "What's the largest random number between 0 and 100. This is a test of the Civil Server.",
    path: '/largest-number-test-1',
    participants: 8,
    currentRound: 3,
    isComplete: true,
    userLastActivity: '2024-02-09T11:30:00.000Z',
    discussionLastActivity: '2024-02-08T09:20:00.000Z',
  },
  {
    _id: '69abc123def456789012345',
    subject: 'How can we improve public transportation in urban areas?',
    description: 'A discussion about transportation infrastructure, accessibility, and sustainability in cities across the nation.',
    path: '/public-transportation-1',
    participants: 45,
    currentRound: 1,
    isComplete: false,
    userLastActivity: '2024-02-07T16:12:00.000Z',
    discussionLastActivity: '2024-02-06T13:35:00.000Z',
  },
  {
    _id: '70def456abc789012345678',
    subject: 'What role should technology play in modern education?',
    description: 'Exploring how digital tools, AI, and online learning platforms can enhance education while addressing concerns about screen time and digital equity.',
    path: '/technology-education-1',
    participants: 73,
    currentRound: 2,
    isComplete: false,
    userLastActivity: '2024-02-08T12:45:00.000Z',
    discussionLastActivity: '2024-02-07T18:10:00.000Z',
  },
]

// Sets up socket API mocks and renders the component
const DiscussionTabTemplate = args => {
  const { mockDiscussions, ...otherArgs } = args

  return (
    <ThemeProvider theme={theme}>
      <DiscussionTab {...otherArgs} />
    </ThemeProvider>
  )
}

export default {
  component: DiscussionTab,
  title: 'discussion-tab',
  decorators: [
    buildApiDecorator('get-user-discussions', cb =>
      setTimeout(() => {
        cb(mockDiscussions)
      }, 1000)
    ),
    buildApiDecorator('get-activity', (discussionId, cb) =>
      setTimeout(() => {
        cb(mockActivityData[discussionId])
      }, 500)
    ),
  ],
}

export const WithDiscussions = {
  render: DiscussionTabTemplate,
  args: {
    mockDiscussions,
  },
}

export const EmptyState = {
  render: DiscussionTabTemplate,
  args: {
    mockDiscussions: [],
  },
}

export const NoDiscussions = {
  render: DiscussionTabTemplate,
  args: {
    mockDiscussions: null,
  },
}
