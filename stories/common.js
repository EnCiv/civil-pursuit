// https://github.com/EnCiv/civil-pursuit/issues/80

import React, { useState, useCallback, useContext } from 'react'
import { DeliberationContext, DeliberationContextProvider } from '../app/components/deliberation-context'
import { fn } from '@storybook/test'

export const socketEmitDecorator = Story => {
  useState(() => {
    if (!window.socket) window.socket = {}
    if (!window.socket._socketEmitHandlers) window.socket._socketEmitHandlers = {}
    if (!window.socket._socketEmitHandlerResults) window.socket._socketEmitHandlerResults = []
    window.socket.emit = (handle, ...args) => {
      if (window.socket._socketEmitHandlers[handle]) window.socket._socketEmitHandlers[handle](...args)
      else console.error('socketEmitDecorator: no handle found', handle, ...args)
    }
  })
  return <Story />
}

export const DeliberationContextDecorator = (Story, context) => {
  const { defaultValue, ...otherArgs } = context.args
  return (
    <DeliberationContextProvider defaultValue={defaultValue}>
      <DeliberationData>
        <Story {...otherArgs} />
      </DeliberationData>
    </DeliberationContextProvider>
  )
}
const DeliberationData = props => {
  const { data, upsert } = useContext(DeliberationContext)
  return (
    <>
      {props.children}
      {Object.keys(data).length > 0 ? (
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }}>
          <div>
            {' '}
            DeliberationContext:{' '}
            <span id="deliberation-context-data" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 4)}
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}

export function deliberationContextData() {
  return JSON.parse(document.getElementById('deliberation-context-data').innerHTML)
}

import { Level } from 'react-accessible-headings'

export const outerStyle = { maxWidth: 980, margin: 'auto' }

export const outerDiv = <div id="story" style={outerStyle}></div>

export const dummyEvent = {
  preventDefaults: () => {},
  stopPropagation: () => {},
  nativeEvent: { stopImmediatePropagation: () => {} },
}

var FakeEmitter = []
export function outerSetup() {
  window.socket = {
    on: (...args) => console.info('socket.io.on', ...args),
    off: (...args) => console.info('socket.io.off', ...args),
    emit: (...args) => FakeEmitter.push(args),
  }
  window.logger = {
    info: console.info,
    error: console.error,
    trace: () => {},
  }
  window.Synapp = { fontSize: 13 }
}

export function asyncSleep(mSec) {
  return new Promise((ok, ko) => setTimeout(() => ok(), mSec))
}

export function asyncEvent(node, eventName) {
  var p = new Promise((ok, ko) => {
    const listener = e => {
      node.removeEventListener(eventName, listener), ok(e)
    }
    node.addEventListener(eventName, listener)
  })
  node[eventName]()
  return p
}

export function getAsyncSemaphore() {
  var result = {}
  result.p = new Promise((ok, ko) => {
    result.ok = ok
    result.ko = ko
  })
  result.p.catch(err => console.error('getAsyncSemaphore catch'))
  return result
}

export function RenderStory(props) {
  return (
    <div
      style={outerStyle}
      ref={e => {
        e && setTimeout(() => props.testFunc(e))
      }}
    />
  )
}

export function onDoneDecorator(Story, context) {
  // attach an onDone argument that functions like mock.fn but also set's state to cause a rerender
  const [count, setCount] = useState(0)
  if (!context.args.onDone) {
    const mockFn = fn()
    const onDone = (...args) => {
      const result = mockFn(...args)
      setCount(count => count + 1)
      return result
    }
    Object.assign(onDone, mockFn)
    onDone.mock = mockFn.mock // most important part wasn't picked up by assign
    onDone.mockFn = mockFn // might be handy someday
    context.args.onDone = onDone
  }
  return (
    <>
      <Story />
      {count ? (
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }}>
          <div>
            {' '}
            onDone:{' '}
            <span title="onDoneResult" id="onDoneResult" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({ count, onDoneResult: context.args.onDone.mock.calls.at(-1)?.[0] }, null, 4)}
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}
export function onDoneResult() {
  return JSON.parse(document.getElementById('onDoneResult').innerHTML)
}

export function onBackDecorator(Story, context) {
  const [result, setResult] = useState({ count: 0 })
  const onBack = useCallback(res => {
    setResult({ count: result.count + 1, onBackResult: res })
  })
  context.args.onBack = onBack
  return (
    <>
      <Story />

      {result.count ? (
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }}>
          <div>
            {' '}
            onBack:{' '}
            <span title="onBackResult" id="onBackResult" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 4)}
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}
export function onBackResult() {
  return JSON.parse(document.getElementById('onBackResult').innerHTML)
}

// Create the level adjustment decorator
export const levelDecorator = (Story, context) => {
  return (
    <Level>
      <Story {...context} />
    </Level>
  )
}

export default {
  RenderStory: RenderStory,
  getAsyncSemaphore: getAsyncSemaphore,
  asyncEvent: asyncEvent,
  asyncSleep: asyncSleep,
  outerSetup: outerSetup,
  dummyEvent: dummyEvent,
  outerStyle: outerStyle,
  outerDiv: outerDiv,
}
