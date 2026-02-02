// https://github.com/EnCiv/civil-pursuit/issues/137
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md

import React from 'react'
import Intermission from '../app/components/intermission'
import { DeliberationContextDecorator, onDoneDecorator, onDoneResult, buildApiDecorator, mockBatchUpsertDeliberationDataRoute } from './common'
import { authFlowDecorator } from './mocks/auth-flow'
import { within, userEvent, waitFor, expect } from '@storybook/test'

const round0Incomplete = { 0: undefined }
const round0Complete = { 0: { idRanks: [] } }
const round1Complete = { 0: { idRanks: [] }, 1: { idRanks: [] } }
const round1Incomplete = { 0: { idRanks: [] }, 1: undefined }

export default {
  component: Intermission,
  decorators: [
    authFlowDecorator, // because batch-upsert is calling authenticateSocketIo
    onDoneDecorator,
    DeliberationContextDecorator,
    mockBatchUpsertDeliberationDataRoute, // Mock fetch for batch-upsert HTTP endpoint
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') cb({ error: 'could not send email' })
      else cb({ error: '' })
    }),
    buildApiDecorator('set-user-info', (info, cb) => {
      if (!info.email) cb({ error: 'email address not valid' })
      else cb({ error: '' })
    }),
    buildApiDecorator('batch-upsert-deliberation-data', (batchData, cb) => {
      // This is for socket-based batch-upsert (authenticated users in rerank)
      cb({ success: true, points: 1, whys: 1, ranks: 3 })
    }),
  ],
}

export const Empty = {
  args: {},
}

export const NoEmail = {
  args: {
    defaultValue: { lastRound: 1, dturn: { group_size: 5, finalRound: 1 }, user: { id: '123456' }, userId: '123456' },
    round: 0,
  },
  decorators: [],
}

export const NoEmailSuccess = {
  args: {
    defaultValue: { lastRound: 1, participants: 40, dturn: { group_size: 5, finalRound: 1 }, user: { id: '123456' }, userId: '123456' },
    round: 1,
  },
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
    defaultValue: { lastRound: 1, participants: 40, dturn: { group_size: 5, finalRound: 1 }, user: { id: '123456' }, userId: '123456' },
    round: 1,
  },
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
    defaultValue: { lastRound: 1, participants: 40, dturn: { group_size: 5, finalRound: 1 }, user: { id: '123456' }, userId: '123456' },
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
    defaultValue: { lastRound: 2, participants: 40, dturn: { group_size: 5, finalRound: 1 }, roundCompleteData: round1Complete, user: { id: '123456', email: 'user@email.com' } },
    round: 0,
  },
}
export const CanContinueToNextRoundOnDone = {
  args: {
    defaultValue: { lastRound: 2, participants: 40, dturn: { group_size: 5, finalRound: 2 }, roundCompleteData: round1Complete, user: { id: '123456', email: 'user@email.com' } },
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
    defaultValue: { lastRound: 1, participants: 41, dturn: { group_size: 5, finalRound: 1 }, roundCompleteData: round0Incomplete, user: { id: '123456', email: 'user@email.com' } },
    round: 0,
  },
}

export const CanNotContinueToNextRound = {
  args: {
    defaultValue: { lastRound: 0, participants: 40, dturn: { group_size: 5, finalRound: 1 }, roundCompleteData: round0Complete, user: { id: '123456', email: 'user@email.com' } },
    round: 0,
  },
}

export const DiscussionFinished = {
  args: {
    defaultValue: { discussionId: '123456', lastRound: 1, participants: 40, dturn: { group_size: 5, finalRound: 1 }, roundCompleteData: round1Complete, user: { id: '123456', email: 'user@email.com' } },
    round: 1,
  },
  decorators: [
    buildApiDecorator('get-conclusion', (discussionId, cb) => {
      cb({
        point: { _id: '123', subject: 'Conclusion Point', description: 'This is the conclusion of the discussion.' },
        mosts: [
          { _id: '1', text: 'Most Why 1' },
          { _id: '2', text: 'Most Why 2' },
        ],
        leasts: [
          { _id: '3', text: 'Least Why 1' },
          { _id: '4', text: 'Least Why 2' },
        ],
      })
    }),
  ],
}

// New test cases for Phase 4: Late Sign-Up temporary user flow

export const TemporaryUserRound1Complete = {
  args: {
    defaultValue: {
      discussionId: '123456',
      user: { id: 'temp-user-123' }, // Has ID but no email (temporary user)
      userId: 'temp-user-123',
      lastRound: 1,
      dturn: { group_size: 5, finalRound: 1 },
      roundCompleteData: round0Complete,
      pointById: { 1: { _id: '1', subject: 'Test Point', description: 'Test Description', userId: 'temp-user-123' } },
      myWhyByCategoryByParentId: { most: { 1: { _id: '2', subject: 'Why', description: 'Because', userId: 'temp-user-123', category: 'most' } } },
      postRankByParentId: { 1: { _id: '3', category: 'most', parentId: '1', userId: 'temp-user-123' } },
    },
    user: { id: 'temp-user-123' }, // Has ID but no email (temporary user)
    round: 0,
  },
}

export const TemporaryUserBatchUpsertSuccess = {
  args: {
    defaultValue: {
      discussionId: '123456',
      user: { id: 'temp-user-123' }, // Has ID but no email (temporary user)
      userId: 'temp-user-123',
      lastRound: 1,
      dturn: { group_size: 5, finalRound: 1 },
      roundCompleteData: round0Complete,
      pointById: { 1: { _id: '1', subject: 'Test Point', description: 'Test Description', userId: 'temp-user-123' } },
      myWhyByCategoryByParentId: { most: { 1: { _id: '2', subject: 'Why', description: 'Because', userId: 'temp-user-123', category: 'most' } } },
      postRankByParentId: { 1: { _id: '3', category: 'most', parentId: '1', userId: 'temp-user-123' } },
    },
    round: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify the temporary user prompt message
    const promptMessage = canvas.getByText(/You've completed Round 1/)
    expect(promptMessage).toBeInTheDocument()

    // Enter email
    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'success@email.com')

    // Click save button
    const saveButton = canvas.getByText('Save and Continue')
    expect(saveButton).toBeInTheDocument()
    await userEvent.click(saveButton)

    // Verify success message appears (HTTP route mock in middleware.js returns success)
    // The batch-upsert now uses fetch to /api/batch-upsert-deliberation-data
    await waitFor(
      () => {
        const successMessage = canvas.getByText(/Success! Your data has been saved/)
        expect(successMessage).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  },
}

export const TemporaryUserBatchUpsertFailure = {
  args: {
    defaultValue: {
      discussionId: '123456',
      userId: 'temp-user-123',
      user: { id: 'temp-user-123' }, // Has ID but no email (temporary user)
      lastRound: 1,
      dturn: { group_size: 5, finalRound: 1 },
      roundCompleteData: round0Complete,
      pointById: { 1: { _id: '1', subject: 'Test Point', description: 'Test Description', userId: 'temp-user-123' } },
      myWhyByCategoryByParentId: { most: { 1: { _id: '2', subject: 'Why', description: 'Because', userId: 'temp-user-123', category: 'most' } } },
      postRankByParentId: { 1: { _id: '3', category: 'most', parentId: '1', userId: 'temp-user-123' } },
    },
    round: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Enter email that will trigger failure (not blank, not success@email.com)
    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'fail@email.com')

    // Click save button
    const saveButton = canvas.getByText('Save and Continue')
    await userEvent.click(saveButton)

    // Wait for error message
    await waitFor(() => {
      const errorMessage = canvas.getByText(/Failed to save data|Email validation failed/i)
      expect(errorMessage).toBeInTheDocument()
    })

    // Verify button is re-enabled for retry
    expect(saveButton).not.toBeDisabled()
  },
}

export const TemporaryUserInvalidEmail = {
  args: {
    defaultValue: {
      discussionId: '123456',
      user: { id: 'temp-user-123' },
      userId: 'temp-user-123',
      lastRound: 1,
      dturn: { group_size: 5, finalRound: 1 },
      roundCompleteData: round0Complete,
    },
    round: 0,
  },
  play: async ({ canvasElement }) => {
    // Small delay to ensure Storybook context is fully initialized before running test
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = within(canvasElement)

    // Enter invalid email
    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'invalid-email')

    // Click save button
    const saveButton = canvas.getByText('Save and Continue')
    await userEvent.click(saveButton)

    // Wait for validation error
    await waitFor(() => {
      const errorMessage = canvas.getByText('email address not valid')
      expect(errorMessage).toBeInTheDocument()
    })
  },
}
