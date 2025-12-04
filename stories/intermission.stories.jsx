// https://github.com/EnCiv/civil-pursuit/issues/137
// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md

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
  decorators: [
    onDoneDecorator,
    DeliberationContextDecorator,
    buildApiDecorator('send-password', (email, path, cb) => {
      if (email === 'fail@email.com') cb({ error: 'could not send email' })
      else cb({ error: '' })
    }),
    buildApiDecorator('set-user-info', (info, cb) => {
      if (!info.email) cb({ error: 'email address not valid' })
      else cb({ error: '' })
    }),
    buildApiDecorator('batch-upsert-deliberation-data', (batchData, cb) => {
      if (batchData.email === 'batch-fail@email.com') {
        cb({ error: 'Failed to save data. Please try again.' })
      } else {
        cb({ success: true, points: 1, whys: 1, ranks: 3 })
      }
    }),
  ],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export const Empty = {
  args: {},
}

export const NoEmail = {
  args: {
    defaultValue: { lastRound: 1, dturn: { finalRound: 1 } },
    user: {},
    round: 1,
  },
  decorators: [],
}

export const NoEmailSuccess = {
  args: {
    defaultValue: { lastRound: 1, dturn: { finalRound: 1 } },
    user: {},
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
    defaultValue: { lastRound: 1, dturn: { finalRound: 1 } },
    user: {},
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
    defaultValue: { lastRound: 1, dturn: { finalRound: 1 }, uInfo: uInfoRound0Incomplete },
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
    defaultValue: { lastRound: 2, dturn: { finalRound: 1 }, uInfo: uInfoRound1Complete, user: { id: '123456', email: 'user@email.com' } },

    round: 1,
  },
}
export const CanContinueToNextRoundOnDone = {
  args: {
    defaultValue: { lastRound: 2, dturn: { finalRound: 2 }, uInfo: uInfoRound1Complete, user: { id: '123456', email: 'user@email.com' } },
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
    defaultValue: { lastRound: 1, dturn: { finalRound: 1 }, uInfo: uInfoRound0Incomplete, user: { id: '123456', email: 'user@email.com' } },

    round: 0,
  },
}

export const CanNotContinueToNextRound = {
  args: {
    defaultValue: { lastRound: 0, dturn: { finalRound: 1 }, uInfo: uInfoRound0Complete, user: { id: '123456', email: 'user@email.com' } },

    round: 0,
  },
}

export const DiscussionFinished = {
  args: {
    defaultValue: { discussionId: '123456', lastRound: 1, dturn: { finalRound: 1 }, uInfo: uInfoRound1Complete, user: { id: '123456', email: 'user@email.com' } },
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
      dturn: { finalRound: 1 },
      uInfo: uInfoRound0Complete,
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
      dturn: { finalRound: 1 },
      uInfo: uInfoRound0Complete,
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
    await userEvent.type(emailInput, 'temp-user@email.com')

    // Click save button
    const saveButton = canvas.getByText('Save and Continue')
    expect(saveButton).toBeInTheDocument()
    await userEvent.click(saveButton)

    // Wait for batch-upsert API call (processing happens quickly)
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['batch-upsert-deliberation-data']).toHaveLength(1)
      const batchData = window.socket._socketEmitHandlerResults['batch-upsert-deliberation-data'][0][0]
      expect(batchData).toMatchObject({
        discussionId: '123456',
        round: 0,
        email: 'temp-user@email.com',
      })
      expect(batchData.data).toHaveProperty('myPointById')
      expect(batchData.data).toHaveProperty('myWhyByCategoryByParentId')
      expect(batchData.data).toHaveProperty('postRankByParentId')
    })

    // Verify success message appears (may take a moment after API completes)
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
      dturn: { finalRound: 1 },
      uInfo: uInfoRound0Complete,
      pointById: { 1: { _id: '1', subject: 'Test Point', description: 'Test Description', userId: 'temp-user-123' } },
      myWhyByCategoryByParentId: { most: { 1: { _id: '2', subject: 'Why', description: 'Because', userId: 'temp-user-123', category: 'most' } } },
      postRankByParentId: { 1: { _id: '3', category: 'most', parentId: '1', userId: 'temp-user-123' } },
    },
    round: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Enter email that will trigger failure
    const emailInput = canvas.getByPlaceholderText('Please provide your email')
    await userEvent.type(emailInput, 'batch-fail@email.com')

    // Click save button
    const saveButton = canvas.getByText('Save and Continue')
    await userEvent.click(saveButton)

    // Wait for error message
    await waitFor(() => {
      const errorMessage = canvas.getByText('Failed to save data. Please try again.')
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
      dturn: { finalRound: 1 },
      uInfo: uInfoRound0Complete,
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
