// https://github.com/EnCiv/civil-pursuit/issues/XXX

import React from 'react'
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
    isComplete: false,
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
    isComplete: false,
  },
]

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

export const WithDiscussions = () => {
  return (
    <ThemeProvider theme={theme}>
      <DiscussionTab discussions={fakeDiscussions} />
    </ThemeProvider>
  )
}
