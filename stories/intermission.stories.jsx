// https://github.com/EnCiv/civil-pursuit/issues/137

import React, { useState } from 'react'
import Intermission from '../app/components/intermission'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { DeliberationContextDecorator, onDoneDecorator, onDoneResult, buildApiDecorator } from './common'
import { within, userEvent, waitFor, expect } from '@storybook/test'

const uInfoRound0Incomplete = { 0: { shownStatementIds: { 123: { rank: 0 }, 234: { rank: 0 } } } }
const uInfoRound0Complete = { 0: { shownStatementIds: { 123: { rank: 1 }, 234: { rank: 0 } }, finished: true } }
const uInfoRound1Incomplete = { 0: { shownStatementIds: { 123: { rank: 1 }, 234: { rank: 0 } } }, 1: { shownStatementIds: { 345: { rank: 0 }, 456: { rank: 0 } } } }
const uInfoRound1Complete = { 0: { shownStatementIds: { 123: { rank: 1 }, 234: { rank: 0 } }, finished: true }, 1: { shownStatementIds: { 345: { rank: 1 }, 456: { rank: 0 } }, finished: true } }

export default {
  component: Intermission,
  decorators: [onDoneDecorator, DeliberationContextDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export const Empty = {
  args: {},
  decorators: [
    buildApiDecorator('set-user-info', {}),
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') return { error: 'could not send email' }
      else return { error: '' }
    }),
  ],
}

export const NoEmail = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1 },
    user: {},
    round: 1,
  },
  decorators: [
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') return { error: 'could not send email' }
      else return { error: '' }
    }),
    buildApiDecorator('set-user-info', info => {
      if (!info.email) return { error: 'email address not valid' }
      return { error: '' }
    }),
  ],
}

export const NoEmailSuccess = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1 },
    user: {},
    round: 1,
  },
  decorators: [
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') return { error: 'could not send email' }
      else return { error: '' }
    }),
    buildApiDecorator('set-user-info', info => {
      if (!info.email) return { error: 'email address not valid' }
      return { error: '' }
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'success@email.com')
    const continueButton = canvas.getByText('Invite me back')
    await userEvent.click(continueButton)
    await waitFor(async () => {
      expect(window.socket._socketEmitHandlerResults['set-user-info']).toHaveLength(1)
      expect(window.socket._socketEmitHandlerResults['set-user-info'][0][0]).toEqual({ email: 'success@email.com' })
      expect(window.socket._socketEmitHandlerResults['send-password']).toHaveLength(1)
      expect(window.socket._socketEmitHandlerResults['send-password'][0][0]).toEqual('success@email.com')
      const successMessage = canvas.getByText('Success, an email has been sent to success@email.com. Please check your inbox and follow the instructions to continue.')
      expect(successMessage).toBeInTheDocument()
    })
  },
}

export const NoEmailFail = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1 },
    user: {},
    round: 1,
  },
  decorators: [
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') return { error: 'could not send email' }
      else return { error: '' }
    }),
    buildApiDecorator('set-user-info', info => {
      if (!info.email) return { error: 'email address not valid' }
      return { error: '' }
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'fail@email.com')
    const continueButton = canvas.getByText('Invite me back')
    await userEvent.click(continueButton)
    await waitFor(async () => {
      expect(window.socket._socketEmitHandlerResults['set-user-info']).toHaveLength(1)
      expect(window.socket._socketEmitHandlerResults['set-user-info'][0][0]).toEqual({ email: 'fail@email.com' })
      expect(window.socket._socketEmitHandlerResults['send-password']).toHaveLength(1)
      expect(window.socket._socketEmitHandlerResults['send-password'][0][0]).toEqual('fail@email.com')
      const successMessage = canvas.getByText('could not send email')
      expect(successMessage).toBeInTheDocument()
    })
  },
}
export const NoEmailMobile = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1, uInfo: uInfoRound0Incomplete },
    user: {},
    round: 1,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const CanContinueToNextRound = {
  args: {
    defaultValue: { lastRound: 2, finalRound: 2, uInfo: uInfoRound1Complete },
    user: { id: '123456', email: 'user@email.com' },
    round: 1,
  },
}
export const CanContinueToNextRoundOnDone = {
  args: {
    defaultValue: { lastRound: 2, finalRound: 2, uInfo: uInfoRound1Complete },
    user: { id: '123456', email: 'user@email.com' },
    round: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const continueButton = canvas.getByText('Yes, Continue')
    await userEvent.click(continueButton)
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: true,
          value: 'continue',
        },
      })
    )
    const remindButton = canvas.getByText('Remind Me Later')
    await userEvent.click(remindButton)
    await waitFor(() => {
      const successMessage = canvas.getByText('We will send you a reminder email tomorrow')
      expect(successMessage).toBeInTheDocument()
    })
  },
}
export const CanNotFinishTheRound = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1, uInfo: uInfoRound0Incomplete },
    user: { id: '123456', email: 'user@email.com' },
    round: 0,
  },
}

export const CanNotContinueToNextRound = {
  args: {
    defaultValue: { lastRound: 0, finalRound: 1, uInfo: uInfoRound0Complete },
    user: { id: '123456', email: 'user@email.com' },
    round: 0,
  },
}

export const DiscussionFinished = {
  args: {
    defaultValue: { lastRound: 1, finalRound: 1, uInfo: uInfoRound1Complete },
    user: { id: '123456', email: 'user@email.com' },
    round: 1,
  },
}
