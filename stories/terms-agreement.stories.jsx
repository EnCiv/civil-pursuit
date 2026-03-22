// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md

import React, { useState } from 'react'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import TermsAgreement from '../app/components/terms-agreement'

export default {
  component: TermsAgreement,
  args: {},
}

// Wrapper component to provide stateful mock useAuth for interactive tests
const TermsAgreementWrapper = ({ initialAgree = false, error = '', info = '', success = '', onDone }) => {
  const [agree, setAgree] = useState(initialAgree)

  const mockUseAuth = {
    state: { agree, error, info, success },
    methods: { onChangeAgree: setAgree },
  }

  return <TermsAgreement {...mockUseAuth} onDone={onDone} />
}

export const Unchecked = {
  render: () => <TermsAgreementWrapper />,
}

export const Checked = {
  render: () => <TermsAgreementWrapper initialAgree={true} />,
}

export const WithError = {
  render: () => <TermsAgreementWrapper error="Please agree to our terms of service" />,
}

export const WithInfo = {
  render: () => <TermsAgreementWrapper info="Creating your temporary account..." />,
}

export const WithSuccess = {
  render: () => <TermsAgreementWrapper success="Welcome aboard!" />,
}

export const TestCheckboxToggle = {
  render: () => <TermsAgreementWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')

    // Initially unchecked
    expect(checkbox.checked).toBe(false)

    // Check the checkbox
    await userEvent.click(checkbox)

    // Verify checkbox is now checked (state was updated)
    await waitFor(() => {
      expect(checkbox.checked).toBe(true)
    })

    // Uncheck the checkbox
    await userEvent.click(checkbox)

    // Verify checkbox is now unchecked
    await waitFor(() => {
      expect(checkbox.checked).toBe(false)
    })
  },
}

export const TestLinksExist = {
  render: () => <TermsAgreementWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check Terms of Service link
    const termsLink = canvas.getByText('Terms of Service')
    expect(termsLink).toBeTruthy()
    expect(termsLink.getAttribute('href')).toBe('https://enciv.org/terms')
    expect(termsLink.getAttribute('target')).toBe('_blank')

    // Check Privacy Policy link
    const privacyLink = canvas.getByText('Privacy Policy')
    expect(privacyLink).toBeTruthy()
    expect(privacyLink.getAttribute('href')).toBe('https://enciv.org/privacy')
    expect(privacyLink.getAttribute('target')).toBe('_blank')
  },
}

export const TestStatusBoxVisibility = {
  render: () => <TermsAgreementWrapper error="Test error message" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Error message should be visible
    const errorMessage = canvas.getByText('Test error message')
    expect(errorMessage).toBeTruthy()
  },
}
