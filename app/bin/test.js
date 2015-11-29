'use strict';

import sequencer                from '../lib/util/sequencer';
import getUrlTitle              from '../test/lib/app/get-url-title';
import db                       from '../test/db';
import user                     from '../test/models/user';
import appError                 from '../test/models/app-error';
import type                     from '../test/models/type';
import item                     from '../test/models/item';
import http                     from '../test/http';
import socket                   from '../test/socket';
import e2e                      from '../test/e2e';
import stopE2e                  from '../test/e2e-stop';

let tests = 0, passed = 0, failed = 0;
const begin = Date.now();

console.log();

sequencer(
  [
    // getUrlTitle,
    db,
    appError,
    user,
    type,
    item,
    http,
    socket,
    e2e,
    stopE2e
  ]
  .map(test => props => new Promise((ok, ko) => {
    test(props).then(results => {
      tests += results.tests;
      passed += results.passed;
      failed += results.failed;
      ok();
    }, ko);
  }))
).then(
  () => {
    const time = Date.now() - begin;

    let duration = '';

    if ( time < 1000 ) {
      duration = time + 'ms';
    }

    else if ( time < (1000 * 60) ) {
      duration = time / 1000 + 's';
    }

    else if ( time < (1000 * (60 * 60)) ) {
      duration = time / 1000 / 60 + 'minutes';
    }

    console.log();
    console.log('  ----------------------------------------------------------');
    console.log(' ', `${tests} tests in ${duration}`.bold, `${passed} passed`.green, `${failed} failed`.red);
    console.log('  ----------------------------------------------------------');
    process.exit(failed);
  }
);
