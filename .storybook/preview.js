// https://github.com/EnCiv/civil-pursuit/issues/80

// IMPORTANT: Mock superagent BEFORE any other imports that use it
// This ensures use-auth gets the mocked version
import superagent from 'superagent'

// Store original post method
const originalPost = superagent.post

// Global registry for test state (set by decorators)
window.__superagentMockRegistry = {}

// Patch superagent.post globally
superagent.post = function (url) {
  console.log('🔍 [preview.js] superagent.post called with url:', url)
  
  if (url === '/tempid') {
    console.log('🔄 [preview.js] Intercepting superagent.post("/tempid")')
    
    // Get testState from the registry (set by authFlowDecorator)
    const testState = window.__superagentMockRegistry.testState
    
    if (!testState) {
      console.error('❌ [preview.js] testState not found in registry - mock cannot track call')
    }
    
    // Return a mock request object that implements the fluent API
    const mockRequest = {
      send: function (data) {
        console.log('📤 [preview.js] superagent.send() called with:', data)
        if (testState) {
          testState.tempidRequestData = data
        }
        return this
      },
      end: function (callback) {
        console.log('✅ [preview.js] superagent.end() called, simulating /tempid response')
        if (testState) {
          testState.tempidCalled = true
        }
        
        // Simulate successful server response
        const response = {
          status: 200,
          text: JSON.stringify({ userId: 'temp-user-123' }),
          body: { userId: 'temp-user-123' },
          ok: true,
        }
        if (testState) {
          testState.tempidResponse = response.body
        }
        console.log('✅ [preview.js] /tempid mock returned:', response.body)
        
        // Call the callback with (err, res)
        setTimeout(() => {
          if (callback) {
            callback(null, response)
          }
        }, 100)
        
        return this
      },
      set: function () {
        return this
      },
      type: function () {
        return this
      },
      accept: function () {
        return this
      },
      timeout: function () {
        return this
      },
      retry: function () {
        return this
      },
    }
    
    return mockRequest
  }
  
  // For non-/tempid URLs, call the original post method
  console.log('🔍 [preview.js] Non-/tempid URL, calling original post')
  return originalPost.call(superagent, url)
}

console.log('✅ [preview.js] Superagent mock installed globally')

import { ThemeProvider } from 'react-jss'
import React from 'react'
import Theme from '../app/components/theme'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
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
