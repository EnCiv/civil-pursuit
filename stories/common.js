// https://github.com/EnCiv/civil-pursuit/issues/80

import React, { useState, useCallback, useContext } from 'react'
import { DeliberationContext, DeliberationContextProvider } from '../app/components/deliberation-context'
import { fn } from '@storybook/test'
import { Level } from 'react-accessible-headings'

// usage: {decorators: [buildApiDecorator('handle', result)]}
// where handle is the name of the socket emit handler and result is the result to return
// if result is a function, it will be called with the arguments passed to the socket emit handler
// if result is not a function, it will be returned as is
export const buildApiDecorator = (handle, result) => {
  return Story => {
    useState(() => {
      // execute this code once, before the component is initially rendered
      setupSocketEmitHandlers()
      window.socket._socketEmitHandlerResults[handle] = []
      window.socket._socketEmitHandlers[handle] = (...args) => {
        const cb = args.pop() // call back is the last argument
        window.socket._socketEmitHandlerResults[handle].push(args)
        setTimeout(() => {
          if (typeof result === 'function') {
            args.push(cb)
            result(...args)
          } else cb(result)
        })
      }
    })
    return <Story />
  }
}

// use buildApiDecorator instead
function setupSocketEmitHandlers() {
  // caution! every story that runs with this decorator will rewrite the socket variable
  // you'd think each story is separate but they all run in the same window
  if (window.socket && window.socket._socketEmitHandlers) return
  if (!window.socket) window.socket = {}
  window.socket._socketEmitHandlers = {}
  window.socket._socketEmitHandlerResults = []
  window.socket.emit = (handle, ...args) => {
    if (window.socket._socketEmitHandlers[handle]) window.socket._socketEmitHandlers[handle](...args)
    else console.error('socketEmitDecorator: no handle found', handle, ...args)
  }
  window.socket.on = (handle, fn) => {
    if (!window.socket._onHandlers) window.socket._onHandlers = {}
    if (!window.socket._onHandlers[handle]) console.info('socketEmitDecorator window.socket.on adding handler', handle)
    else console.info('socketEmitDecorator window.socket.on replacing handler', handle)
    window.socket._onHandlers[handle] = fn
  }
  if (!window.logger) window.logger = console
}

export const socketEmitDecorator = Story => {
  useState(() => {
    setupSocketEmitHandlers()
  })
  return <Story />
}

export const DeliberationContextDecorator = (Story, context) => {
  const { defaultValue, ...otherArgs } = context.args
  useState(() => window.localStorage.clear()) // clear localStorage to start fresh for each story
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
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}>
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
  // do not use the format  function Answer({ className = '', intro = '', question = {}, whyQuestion = '', onDone=()=>{}, myAnswer, myWhy, ...otherProps })
  // instead use function Answer(props) {const { className = '', intro = '', question = {}, whyQuestion = '', onDone = () => {}, myAnswer, myWhy, ...otherProps } = props
  // because storybook initializes context.args in unexpected ways
  const [count, setCount] = useState(0)
  // can't useMemo because it will get cleared when you change the file and reload
  const [onDone] = useState(() => {
    const mockFn = fn()
    const onDone = (...args) => {
      const result = mockFn(...args)
      setCount(count => count + 1)
      return result
    }
    Object.assign(onDone, mockFn)
    onDone.mock = mockFn.mock // most important part wasn't picked up by assign
    onDone.mockFn = mockFn // might be handy someday
    return onDone
  })
  // context.args might get recreated if react reuses the component
  if (context.args.onDone !== onDone) {
    context.args.onDone = onDone
  }
  return (
    <>
      <Story />
      {count ? (
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}>
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
  const el = document.getElementById('onDoneResult')
  if (!el) {
    console.warn('[onDoneResult] No onDoneResult element found yet')
    return { count: 0 } // safe default
  }
  try {
    return JSON.parse(el.innerHTML)
  } catch (e) {
    console.error('[onDoneResult] Failed to parse innerHTML:', el.innerHTML, e)
    return { count: 0 }
  }
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
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}>
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
  // The CivilPursuit component renders it's own initial Level
  if (context?.component?.name === 'CivilPursuit') return <Story {...context} />
  else
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
