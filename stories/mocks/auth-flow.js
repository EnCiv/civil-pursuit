// https://github.com/EnCiv/civil-pursuit/issues/102
// Storybook decorators and utilities for testing authentication flows

import React, { useContext } from 'react'
import DeliberationContext from '../../app/components/deliberation-context'
import { buildApiDecorator } from '../common'

/**
 * Higher-order component that adds upsert from DeliberationContext to testState in props if provided.
 *
 * Takes a Template component and returns a new component that:
 * - Extracts `testState` from props
 * - Provides access to `upsert` from DeliberationContext via `testState.upsert`
 * - Renders the Template with remaining props
 *
 * - `Template` - React component to wrap (typically a render function like AnswerStepTemplate)
 *
 * Returns a new component that adds upsert from DeliberationContext to testState in props if provided.
 */
export function withAuthTestState(Template) {
  return function WrappedComponent(props) {
    const { testState, ...otherProps } = props
    const { data, upsert } = useContext(DeliberationContext)

    if (testState) {
      testState.upsert = upsert
    } else {
      console.warn('⚠️ testState not found in props for withAuthTestState wrapper')
    }

    return <Template {...otherProps} />
  }
}

/**
 * Decorator that mocks the authentication flow for testing useAuth.methods.skip()
 *
 * This decorator:
 * 1. Initializes `testState` in args if not present
 * 2. Mocks socket methods (close, removeListener) to simulate reconnection
 * 3. Intercepts superagent POST to /tempid endpoint
 * 4. Updates context with new user after tempid response
 *
 * Usage:
 * ```
 * decorators: [
 *   socketEmitDecorator,
 *   DeliberationContextDecorator,
 *   authFlowDecorator,
 * ]
 * ```
 *
 * Test State:
 * - `testState.tempidCalled` - boolean, set to true when /tempid is intercepted
 * - `testState.tempidRequestData` - object, the data sent to /tempid
 * - `testState.tempidResponse` - object, the response body from /tempid
 * - `testState.upsert` - function, injected by withAuthTestState to update DeliberationContext
 */
export const authFlowDecorator = (Story, context) => {
  // Initialize testState in args if not present
  if (!context.args.testState) {
    context.args.testState = {
      tempidCalled: false,
      tempidResponse: null,
      tempidRequestData: null,
    }
  }

  // Get test state from args (shared between decorator and play function)
  const testState = context.args.testState

  if (!window.socket) window.socket = {} // was really expecting this to be setup by socketEmitDecorator
  if (!window.socket.close)
    window.socket.close = () => {
      if (window.socket._onHandlers?.connect) setTimeout(window.socket._onHandlers.connect, 1000)
      else console.error('No connect handler registered')
    }
  if (!window.socket.removeListener)
    window.socket.removeListener = (handle, func) => {
      // useAuth closes and reconnects the socket to authenticate the user after /tempid
      // then it calls removeListener and that's our queue to set the new user.id in args and the DeliberationContext
      if (handle === 'connect')
        setTimeout(() => {
          context.args.user = { id: 'temp-user-123' }
          console.log('✅ args updated with new user after tempid:', context.args.user)
          if (context.args.testState.upsert) {
            context.args.testState.upsert({ user: { ...context.args.user }, userId: context.args.user.id })
            console.log('✅ User set in DeliberationContext via upsert:', context.args.user)
          } else console.error('testState.upsert not yet available to set user in context')
        }, 100)
    }

  // Import superagent and wrap its post method
  React.useEffect(() => {
    // Dynamically import and wrap superagent
    const setupSuperagentMock = async () => {
      try {
        // Get the superagent module that useAuth is using
        const superagent = await import('superagent')

        // Wrap the post method
        // we will not actually call superagent.post because we are running in Storybook the middleware routes are not supported
        superagent.default.post = function (url) {
          if (url === '/tempid') {
            console.log('🔄 Intercepted superagent.post("/tempid")')

            // Return a mock request object that implements the fluent API
            const mockRequest = {
              send: function (data) {
                console.log('📤 superagent.send() called with:', data)
                testState.tempidRequestData = data
                return this
              },
              end: function (callback) {
                console.log('✅ superagent.end() called, simulating /tempid response')
                testState.tempidCalled = true

                // Simulate successful server response
                const response = {
                  status: 200,
                  text: JSON.stringify({ userId: 'temp-user-123' }),
                  body: { userId: 'temp-user-123' },
                  ok: true,
                }
                testState.tempidResponse = response.body
                console.log('✅ /tempid mock returned:', response.body)

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
        }

        console.log('✅ Superagent mock installed')
      } catch (error) {
        console.error('❌ Failed to setup superagent mock:', error)
      }
    }
    setupSuperagentMock()
  }, [])
  return <Story />
}

/**
 * Standard set of decorators for testing authentication flow
 *
 * Includes:
 * - send-password API mock (for password reset)
 * - authFlowDecorator (intercepts /tempid and manages socket reconnection)
 */
export const authFlowDecorators = [
  buildApiDecorator('send-password', (email, href, cb) => {
    if (email === 'success@email.com') setTimeout(() => cb({ error: '' }), 1000)
    else setTimeout(() => cb({ error: 'User not found' }), 1000)
  }),
  authFlowDecorator,
]
