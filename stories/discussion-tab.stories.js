// https://github.com/EnCiv/civil-pursuit/issues/XXX

import React, { useState } from 'react'
import { ThemeProvider } from 'react-jss'
import theme from '../app/components/theme'
import DiscussionTab from '../app/components/discussion-tab'

const fakeDiscussions = [
  {
    _id: '67db9da4c6019fba8de3eafe',
    subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
    description: "This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We're asking about concerns, not solutions.",
    created: '2024-01-15T10:30:00.000Z',
    lastAccessed: '2024-02-08T14:22:00.000Z',
    lastActive: '2024-02-07T16:45:00.000Z',
    participants: 127,
    currentRound: 2,
    isComplete: true,
  },
  {
    _id: '68687cdeb4e0c47144419fde',
    subject: "What's the largest number",
    description: "What's the largest random number between 0 and 100. This is a test of the Civil Server.",
    created: '2024-01-10T09:15:00.000Z',
    lastAccessed: '2024-02-05T11:30:00.000Z',
    lastActive: '2024-01-25T13:20:00.000Z',
    participants: 8,
    currentRound: 3,
    isComplete: true,
  },
  {
    _id: '69abc123def456789012345',
    subject: 'How can we improve public transportation in urban areas?',
    description: 'A discussion about transportation infrastructure, accessibility, and sustainability in cities across the nation.',
    created: '2024-01-20T08:45:00.000Z',
    lastAccessed: '2024-02-09T10:15:00.000Z',
    lastActive: '2024-02-08T19:30:00.000Z',
    participants: 45,
    currentRound: 1,
    isComplete: true,
  },
  {
    _id: '70def456abc789012345678',
    subject: 'What role should technology play in modern education?',
    description: 'Exploring how digital tools, AI, and online learning platforms can enhance education while addressing concerns about screen time and digital equity.',
    created: '2024-01-25T12:00:00.000Z',
    lastAccessed: '2024-02-10T16:45:00.000Z',
    lastActive: '2024-02-09T14:30:00.000Z',
    participants: 73,
    currentRound: 2,
    isComplete: true,
  },
]

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

// Sets up socket API mocks and renders the component
const DiscussionTabTemplate = args => {
  const { discussions, ...otherArgs } = args
  useState(() => {
    // Execute this code once before the component initially renders
    if (!window.socket) window.socket = {}
    if (!window.socket._socketEmitHandlers) window.socket._socketEmitHandlers = {}
    if (!window.socket._socketEmitHandlerResults) window.socket._socketEmitHandlerResults = {}

    // Mock the get-activity API call
    window.socket._socketEmitHandlers['get-activity'] = (discussionId, cb) => {
      window.socket._socketEmitHandlerResults['get-activity'] = discussionId
      setTimeout(() => {
        const activityData = mockActivityData[discussionId]
        cb(activityData)
      }, 500)
    }

    // Setup socket.emit if not already present
    if (!window.socket.emit) {
      window.socket.emit = (handle, ...args) => {
        if (window.socket._socketEmitHandlers[handle]) {
          window.socket._socketEmitHandlers[handle](...args)
        } else {
          console.error('Socket emit handler not found:', handle)
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <DiscussionTab discussions={discussions} {...otherArgs} />
    </ThemeProvider>
  )
}

export default {
  component: DiscussionTab,
  title: 'discussion-tab',
}

export const Default = () => {
  return (
    <ThemeProvider theme={theme}>
      <DiscussionTab />
    </ThemeProvider>
  )
}

export const WithDiscussions = {
  render: DiscussionTabTemplate,
  args: {
    discussions: fakeDiscussions,
  },
}

export const WithMyActivityInteraction = {
  render: DiscussionTabTemplate,
  args: {
    discussions: fakeDiscussions,
  },
}
