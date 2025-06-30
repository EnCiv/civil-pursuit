// https://github.com/EnCiv/civil-pursuit/issues/137

import React, { useState } from 'react'
import Intermission from '../app/components/intermission'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { DeliberationContextDecorator, onDoneDecorator, onDoneResult, buildApiDecorator } from './common'
import { within, userEvent, waitFor, expect } from '@storybook/test'

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
    defaultValue: { user: {}, round: 1, lastRound: 1, finalRound: 1 },
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
    defaultValue: { user: {}, round: 1, lastRound: 1, finalRound: 1 },
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
    defaultValue: { user: {}, round: 1, lastRound: 1, finalRound: 1 },
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
    defaultValue: { userId: '', round: 1, lastRound: 1, finalRound: 1, completedByRound: { 1: true } },
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const CanContinueToNextRound = {
  args: {
    defaultValue: { round: 1, lastRound: 2, finalRound: 2, completedByRound: { 1: true } },
    user: { id: '123456', email: 'user@email.com' },
  },
}
export const CanContinueToNextRoundOnDone = {
  args: {
    defaultValue: { round: 1, lastRound: 2, finalRound: 2, completedByRound: { 1: true } },
    user: { id: '123456', email: 'user@email.com' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const continueButton = canvas.getByText('Yes, Continue')
    await userEvent.click(continueButton)
    await waitFor(() =>
      expect(onDoneResult(canvas)).toMatchObject({
        count: 1,
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
    defaultValue: { round: 0, lastRound: 1, finalRound: 1, completedByRound: { 0: false } },
    user: { id: '123456', email: 'user@email.com' },
  },
}

export const CanNotContinueToNextRound = {
  args: {
    defaultValue: { round: 0, lastRound: 0, finalRound: 1, completedByRound: { 0: true } },
    user: { id: '123456', email: 'user@email.com' },
  },
}

export const DiscussionFinished = {
  args: {
    defaultValue: { round: 1, lastRound: 1, finalRound: 1, completedByRound: { 1: true } },
    user: { id: '123456', email: 'user@email.com' },
  },
}
