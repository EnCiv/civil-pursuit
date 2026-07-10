'use strict'
// CJS transform wrapper for @storybook/test-runner v0.24+
//
// Problem: playwright/transform.js uses ESM syntax (import/export default).
// When Jest's bundled @jest/transform requires it as CJS, the result has
// processAsync under .default, not at top-level. assertSyncTransformer()
// then fails because it checks transformer.process (top-level sync fn).
//
// Fix: export process (sync via spawnSync) and processAsync (direct) at
// the top level of a proper CJS module.

const { spawnSync } = require('child_process')
const path = require('path')

// Absolute path to the test-runner dist so the worker subprocess can require it
const testRunnerDist = path.resolve('./node_modules/@storybook/test-runner/dist/index.js')

// Inline worker code executed in a subprocess per-file.
// Jest caches the transform output so this only runs once per story file.
const WORKER_CODE = `
'use strict'
var chunks = []
process.stdin.on('data', function(c) { chunks.push(c) })
process.stdin.on('end', function() {
  var payload = JSON.parse(Buffer.concat(chunks).toString())
  var transformPlaywright = require(${JSON.stringify(testRunnerDist)}).transformPlaywright
  transformPlaywright(payload.src, payload.filename)
    .then(function(code) {
      process.stdout.write(JSON.stringify({ code: code || payload.src }))
    })
    .catch(function() {
      process.stdout.write(JSON.stringify({ code: payload.src }))
    })
})
`

function transformSync(src, filename) {
  var result = spawnSync(process.execPath, ['-e', WORKER_CODE], {
    input: JSON.stringify({ src, filename }),
    encoding: 'utf8',
    timeout: 30000,
    cwd: process.cwd(),
  })
  if (result.error || result.status !== 0) {
    return { code: src }
  }
  try {
    return JSON.parse(result.stdout)
  } catch (e) {
    return { code: src }
  }
}

module.exports = {
  // Synchronous path: required by assertSyncTransformer when story files
  // are loaded via require() in the Jest worker thread.
  process: transformSync,

  // Async path: used when Jest loads via import() (--experimental-vm-modules).
  async processAsync(src, filename) {
    var transformPlaywright = require(testRunnerDist).transformPlaywright
    var code = await transformPlaywright(src, filename)
    return { code: code || src }
  },
}
