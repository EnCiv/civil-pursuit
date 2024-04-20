import React from 'react'
import Footer from '../app/components/footer'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import Common from './common'
import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'

export default {
  component: Footer,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export const Empty = () => {
  return <Footer />
}
