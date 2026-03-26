// https://github.com/EnCiv/civil-pursuit/issues/102
// Storybook decorators and utilities for testing authentication flows

import React, { useContext, useState } from 'react'
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

  const [_this] = useState(() => {
    const _this = {}
    // only set up socket mocks once
    if (!window.socket) window.socket = {} // was really expecting this to be setup by socketEmitDecorator

    // Always re-register these handlers to ensure the current context is used
    // This fixes test isolation issues when switching between stories without reload
    window.socket.close = () => {
      // Cancel any previously pending connect timer before scheduling a new one.
      // Without this, a timer queued by the PREVIOUS story (e.g. from Intermission's
      // second authenticateSocketIo call during batch-upsert) can fire after Storybook
      // switches stories and hit the new story's removeListener mock, injecting a user
      // into the wrong context before that story's play function even starts.
      if (_this.connectTimeout) {
        console.log('🔄 socket.close: cancelling pending connect timer from previous close()')
        clearTimeout(_this.connectTimeout)
      }
      if (window.socket._onHandlers?.connect) {
        console.log('🔄 socket.close: scheduling connect handler in 1000ms')
        // Use an indirect call (() => _onHandlers.connect()) so the handler that is
        // current at fire-time is called, not the one captured when close() was called.
        _this.connectTimeout = setTimeout(() => {
          _this.connectTimeout = null
          console.log('🔄 socket.close timer fired: calling connect handler')
          window.socket._onHandlers.connect?.()
        }, 1000)
      } else console.error('No connect handler registered')
    }
    window.socket.removeListener = (handle, func) => {
      // useAuth closes and reconnects the socket to authenticate the user after /tempid
      // then it calls removeListener and that's our queue to set the new user.id in args and the DeliberationContext
      if (handle === 'connect' && !context.args.testState.authFlowUserSet) {
        console.log('🔄 Socket removeListener called for connect - simulating auth flow user update')
        _this.userAuthTimeout = setTimeout(() => {
          _this.userAuthTimeout = null
          context.args.user = { id: 'temp-user-123' }
          console.log('✅ args updated with new user after tempid:', context.args.user)
          if (context.args.testState.upsert) {
            context.args.testState.upsert({ user: { ...context.args.user }, userId: context.args.user.id })
            console.log('✅ User set in DeliberationContext via upsert:', context.args.user)
            // Set flag for tests to wait on
            setTimeout(() => (context.args.testState.authFlowUserSet = true), 0) // allow rerender after upsert before setting flag
          } else console.error('testState.upsert not yet available to set user in context')
          window.socket.removeListener = () => {} // restore removeListener to no-op after simulating the user update
        }, 100)
      }
    }
    return _this
  })

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
    return () => {
      if (typeof _this.userAuthTimeout === 'number') {
        clearTimeout(_this.userAuthTimeout)
        _this.userAuthTimeout = null
      }
      // Cancel any pending connect timer so it doesn't fire into the next story's removeListener.
      // This is the key guard against cross-story contamination: if the current story scheduled
      // a 1-second connect timer (via socket.close) and the story ends before that timer fires,
      // this cleanup prevents it from running after the next story has mounted.
      if (_this.connectTimeout) {
        console.log('🧹 authFlowDecorator cleanup: cancelling pending connect timer')
        clearTimeout(_this.connectTimeout)
        _this.connectTimeout = null
      }
      window.socket.removeListener = () => {} // clean up socket mock to prevent affecting other tests
    }
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
