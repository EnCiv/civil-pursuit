'use strict'

import React from 'react'
import { clientMain } from 'civil-client'
import { JssProvider } from 'react-jss'
import App from '../components/app'

// Must mirror createStableGenerateId in civil-server's server-react-render.js
// so client and server produce identical JSS class names for the same component tree.
// The server resets its counter per request; the client counter is 0 on fresh page load.
let _jssCounter = 0
const generateId = (rule, sheet) => {
  const prefix = (sheet && sheet.options && sheet.options.classNamePrefix) || ''
  return `${prefix}${rule.key}-${_jssCounter++}`
}

function AppWithJss(props) {
  return (
    <JssProvider generateId={generateId}>
      <App {...props} />
    </JssProvider>
  )
}

clientMain(AppWithJss)
