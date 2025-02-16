// https://github.com/EnCiv/civil-pursuit/issues/80

import { ThemeProvider } from 'react-jss'
import React from 'react'
import Theme from '../app/components/theme'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { levelDecorator } from '../stories/common'
import GlobalStyles from '../app/components/global-styles'
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
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      // if a story sets defaultViewport to sommething, it stickes to all other stories. So we set it to reset https://github.com/storybookjs/storybook/issues/27073#issuecomment-2225329662
      defaultViewport: 'reset',
    },
  },
  decorators: [
    Story => {
      document.getElementsByTagName('body')[0].style.width = '100%' // this is a hack to force full width even through index.css has a media query keeping it at 982
      return (
        <ThemeProvider theme={theme}>
          <div>
            <GlobalStyles />
            <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
            <Story />
          </div>
        </ThemeProvider>
      )
    },
    levelDecorator,
  ],
}

export default preview
