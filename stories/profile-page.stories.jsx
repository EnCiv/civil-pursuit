// https://github.com/EnCiv/civil-pursuit/issues/385
// https://github.com/EnCiv/civil-pursuit/issues/388

import React from 'react'
import { ThemeProvider } from 'react-jss'
import { expect, userEvent, within } from 'storybook/test'
import theme from '../app/components/theme'
import ProfilePage from '../app/web-components/profile-page'
import { buildApiDecorator } from './common'

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
]

export default {
  component: ProfilePage,
  title: 'profile-page',
  decorators: [
    buildApiDecorator('get-user-discussions', cb =>
      setTimeout(() => {
        cb(mockDiscussions)
      }, 1000)
    ),
    Story => (
      <ThemeProvider theme={theme}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export const Default = () => {
  return <ProfilePage />
}

export const EmptyDiscussions = {
  decorators: [
    buildApiDecorator('get-user-discussions', cb =>
      setTimeout(() => {
        cb([])
      }, 1000)
    ),
  ],
  render: () => <ProfilePage initialTab="Discussions" />,
}

export const SingleDiscussion = {
  decorators: [
    buildApiDecorator('get-user-discussions', cb =>
      setTimeout(() => {
        cb([mockDiscussions[0]])
      }, 1000)
    ),
  ],
  render: () => <ProfilePage initialTab="Discussions" />,
}

export const DiscussionsTabActive = () => {
  return <ProfilePage initialTab="Discussions" />
}

export const ProfileAndSettingsTabsDisabled = {
  render: () => <ProfilePage initialTab="Discussions" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const profileTab = canvas.getByRole('button', { name: 'Profile' })
    const settingsTab = canvas.getByRole('button', { name: 'Settings' })

    expect(profileTab).toBeDisabled()
    expect(settingsTab).toBeDisabled()
    await userEvent.click(profileTab)
    await userEvent.click(settingsTab)
    expect(canvas.getByRole('heading', { name: 'Discussions' })).toBeInTheDocument()
  },
}

export const MobileDiscussionsTab = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'profileMobile',
      viewports: {
        profileMobile: {
          name: 'Profile Mobile (375px)',
          styles: {
            width: '375px',
            height: '812px',
          },
        },
      },
    },
  },
  render: () => <ProfilePage initialTab="Discussions" />,
  play: async () => {
    expect(window.innerWidth).toBeLessThanOrEqual(375)
  },
}

