'use strict';

import { spawn } from 'child_process';

// node dist/bin/test-browser test/web/pages/synchronous-error viewport=tablet vendor=firefox env=production || exit 1;

function runTest(event, test) {
  try {

    let env = process.env;
    env.SYNAPP_SELENIUM_TARGET = 'http://localhost:3012';

    let cp = spawn('node', [
      'dist/bin/test-browser',
      'test/web/pages/' + test.ref,
      'viewport=tablet',
      'vendor=firefox',
      'env=development'
    ], { env });

    cp
      .on('error', error => this.error(error))
      .on('exit', status => console.log('exit', status));

    cp.stdout.on('data', data => console.log({ out: data.toString() }));
    cp.stderr.on('data', data => console.log({ err: data.toString() }));
  } catch (e) {

  } finally {

  }
}

export default runTest;
