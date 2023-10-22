import '../assets/css/index.css'
import '../assets/css/normalize.css'
import React from 'react'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    Story => (
      <>
        <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
        <Story />
      </>
    ),
  ],
}

export default preview
