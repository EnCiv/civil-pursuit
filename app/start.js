#!/usr/bin/env node

'use strict'

import { theCivilServer, Iota } from 'civil-server'
import iotas from '../iotas.json'
import App from './components/app'

Iota.preload(iotas)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
  try {
    const server = new theCivilServer()
    server.App = App
    await server.earlyStart()
    await server.start()
    logger.info('started')
  } catch (error) {
    logger.error('error on start', error)
  }
}

start()
