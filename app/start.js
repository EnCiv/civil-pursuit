#!/usr/bin/env node

'use strict'
import path from 'path'
import { theCivilServer, Iota } from 'civil-server'
import iotas from '../iotas.json'
import App from './components/app'
import inviteUsersBackJob from './jobs/invite-users-back'

Iota.preload(iotas)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
  try {
    const server = new theCivilServer()
    server.App = App
    await server.earlyStart()
    server.routesDirPaths.push(path.resolve(__dirname, './routes'))
    server.socketAPIsDirPaths.push(path.resolve(__dirname, './socket-apis'))
    server.serverEventsDirPaths.push(path.resolve(__dirname, './events'))
    await server.start()
    logger.info('started')
    setTimeout(inviteUsersBackJob, 10000) // wait 10 seconds then run job, that will schedule next runs
  } catch (error) {
    logger.error('error on start', error)
  }
}

start()
