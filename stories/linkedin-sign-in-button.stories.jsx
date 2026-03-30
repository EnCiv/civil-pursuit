// https://github.com/EnCiv/civil-pursuit/blob/main/docs/linkedin-oauth-spec.md
import React from 'react'
import LinkedInSignInButton from '../app/components/linkedin-sign-in-button'

export default {
  title: 'LinkedInSignInButton',
  component: LinkedInSignInButton,
}

export const Default = {
  args: { returnPath: '/tournament/test' },
}

export const CustomLabel = {
  args: { returnPath: '/tournament/test', children: 'Continue with LinkedIn' },
}

export const Disabled = {
  args: { returnPath: '/tournament/test', disabled: true },
}
