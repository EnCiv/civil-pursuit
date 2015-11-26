'use strict';

import sequencer                from '../lib/util/sequencer';
import db                       from '../test/db';
import user                     from '../test/models/user';

let tests = 0, passed = 0, failed = 0;
const begin = Date.now();

console.log();

sequencer(
  [
    db,
    user
  ]
  .map(test => () => new Promise((ok, ko) => {
    test().then(results => {
      tests += results.tests;
      passed += results.passed;
      failed += results.failed;
      ok();
    }, ko);
  }))
).then(
  () => {
    const time = Date.now() - begin;
    console.log();
    console.log('  ----------------------------------------------------------');
    console.log(' ', `${tests} tests in ${time} ms`.bold, `${passed} passed`.green, `${failed} failed`.red);
    console.log('  ----------------------------------------------------------');
    process.exit(failed);
  }
);
