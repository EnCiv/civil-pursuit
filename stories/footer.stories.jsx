import React from 'react'
import Footer from '../app/components/footer'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import Common from './common'
import { userEvent, within, expect } from '@storybook/test'

export default {
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export const StandardFooter = () => {
  return <Footer />
}

export const MobileFooter = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const DarkMode = {
  args: {
    mode: 'dark',
  },
}

export const DarkModeMobile = {
  args: {
    mode: 'dark',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}
