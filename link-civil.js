#!/usr/bin/env node
'use strict'
// Creates Windows junction points so local civil-* repos can be tested without npm publish.
// Run via: node link-civil.js
//
// Environment variables for custom paths (relative to this repo or absolute):
//   CIVIL_SERVER_PATH   - path to civil-server repo (default: ../civil-server-update)
//   CIVIL_CLIENT_PATH   - path to civil-client repo (default: ../civil-client)
//
// Example .bashrc setup:
//   export CIVIL_SERVER_PATH="../civil-server-update"
//   export CIVIL_CLIENT_PATH="../civil-client"
//
// Junctions created:
//   enciv-home/node_modules/civil-server  -> ${CIVIL_SERVER_PATH}
//   enciv-home/node_modules/civil-client  -> ${CIVIL_CLIENT_PATH}
//   ${CIVIL_SERVER_PATH}/node_modules/react      -> enciv-home/node_modules/react
//   ${CIVIL_SERVER_PATH}/node_modules/react-dom  -> enciv-home/node_modules/react-dom
//   ${CIVIL_SERVER_PATH}/node_modules/react-jss  -> enciv-home/node_modules/react-jss
//   ${CIVIL_CLIENT_PATH}/node_modules/react      -> enciv-home/node_modules/react
//   ${CIVIL_CLIENT_PATH}/node_modules/react-dom  -> enciv-home/node_modules/react-dom

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const homeDir = __dirname
const homeNm = path.join(homeDir, 'node_modules')

// Get repo paths from environment or use defaults
const serverDir = path.resolve(homeDir, process.env.CIVIL_SERVER_PATH || '../civil-server-update')
const clientDir = path.resolve(homeDir, process.env.CIVIL_CLIENT_PATH || '../civil-client')

const serverNm = path.join(serverDir, 'node_modules')
const clientNm = path.join(clientDir, 'node_modules')

function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (e) {
    // ignore — rmdir fails when directory doesn't exist, that's fine
  }
}

function validatePath(dir, name) {
  if (!fs.existsSync(dir)) {
    console.error(`ERROR: ${name} directory not found at: ${dir}`)
    console.error(`Set ${name.toUpperCase().replace(/-/g, '_')}_PATH environment variable to correct path`)
    process.exit(1)
  }
  const packageJson = path.join(dir, 'package.json')
  if (!fs.existsSync(packageJson)) {
    console.error(`ERROR: package.json not found in ${name} at: ${dir}`)
    process.exit(1)
  }
}

// Handle --unlink flag early
if (process.argv.includes('--unlink')) {
  console.log('Unlinking civil repos...')
  ;[path.join(homeNm, 'civil-server'), path.join(homeNm, 'civil-client')].forEach(j => run(`rmdir /s /q "${j}"`))
  console.log('✓ Unlinked. Run "npm install" to restore packages from npm/GitHub')
  process.exit(0)
}

// Validate all repo paths exist
console.log('Validating repository paths...')

validatePath(serverDir, 'civil-server')
validatePath(clientDir, 'civil-client')

console.log(`Using repos:`)
console.log(`  civil-server:  ${serverDir}`)
console.log(`  civil-client:  ${clientDir}`)
console.log('')

// Remove existing junctions before recreating them
console.log('Removing existing junctions...')
;[
  path.join(homeNm, 'civil-server'),
  path.join(homeNm, 'civil-client'),
  path.join(serverNm, 'react'),
  path.join(serverNm, 'react-dom'),
  path.join(serverNm, 'react-jss'),
  path.join(clientNm, 'react'),
  path.join(clientNm, 'react-dom'),
].forEach(j => run(`rmdir /s /q "${j}"`))

// Create junctions: enciv-home/node_modules/* -> local repos
console.log('Creating junctions to local repos...')
run(`mklink /j "${path.join(homeNm, 'civil-server')}" "${serverDir}"`)
run(`mklink /j "${path.join(homeNm, 'civil-client')}" "${clientDir}"`)

// Create junctions so all repos share enciv-home's React instances
// This prevents "multiple copies of React" errors
console.log('Creating React shared junctions...')
const reactPkgs = ['react', 'react-dom', 'react-jss']
reactPkgs.forEach(pkg => {
  run(`mklink /j "${path.join(serverNm, pkg)}" "${path.join(homeNm, pkg)}"`)
  // civil-client doesn't use react-jss
  if (pkg !== 'react-jss') {
    run(`mklink /j "${path.join(clientNm, pkg)}" "${path.join(homeNm, pkg)}"`)
  }
})

console.log('')
console.log('✓ civil-server, and civil-client linked successfully')
console.log('')
console.log('Next steps:')
console.log('  1. Make sure you have run "npm run transpile" in each linked repo')
console.log('  2. Rebuild this project: npm run packbuild')
console.log('  3. To unlink and restore npm packages: node link-civil.js --unlink && npm install')
