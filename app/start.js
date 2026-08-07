#!/usr/bin/env node

'use strict'
import dns from 'dns'
import path from 'path'
import { theCivilServer, Iota } from 'civil-server'

// Node 20+ updated c-ares; on Windows it may use a loopback DNS (127.0.0.1 or ::1) from
// a VPN/Docker DNS proxy that doesn't handle SRV queries the way Node 20's c-ares expects,
// causing ECONNREFUSED when the MongoDB driver resolves mongodb+srv:// hostnames.
// Replace loopback DNS addresses with public DNS servers before connecting.
const GOOGLE_PUBLIC_DNS_PRIMARY = '8.8.8.8'
const GOOGLE_PUBLIC_DNS_SECONDARY = '8.8.4.4'
;(function fixLoopbackDNSForNode20() {
  const servers = dns.getServers()
  const nonLoopback = servers.filter(s => !s.startsWith('127.') && s !== '::1' && s !== '[::1]')
  if (nonLoopback.length < servers.length) {
    const fixed = nonLoopback.length > 0 ? nonLoopback : [GOOGLE_PUBLIC_DNS_PRIMARY, GOOGLE_PUBLIC_DNS_SECONDARY]
    console.warn('civil-pursuit: replaced loopback DNS with public DNS for Node 20 c-ares / mongodb+srv fix', {
      original: servers,
      using: fixed,
    })
    dns.setServers(fixed)
  }
})()
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
