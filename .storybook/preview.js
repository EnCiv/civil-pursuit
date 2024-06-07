import { ThemeProvider } from 'react-jss'
import '../assets/css/index.css'
import '../assets/css/normalize.css'
import React from 'react'
import Theme from '../app/components/theme'

const theme = Theme

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
    Story => {
      document.getElementsByTagName('body')[0].style.width = '100%' // this is a hack to force full with even through index.css has a media query keeping it at 982
      return (
        <ThemeProvider theme={theme}>
          <div>
            <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],
}

export default preview
