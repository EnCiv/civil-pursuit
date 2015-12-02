'use strict';

import sequencer                from '../lib/util/sequencer';
import getUrlTitle              from '../test/lib/app/get-url-title';
import db                       from '../test/db';
import user                     from '../test/models/user';
import appError                 from '../test/models/app-error';
import config                   from '../test/models/config';
import type                     from '../test/models/type';
import item                     from '../test/models/item';
import feedback                 from '../test/models/feedback';
import discussion               from '../test/models/discussion';
import vote                     from '../test/models/vote';
import training                 from '../test/models/training';
import http                     from '../test/http';
import api                      from '../test/api';
import addRace                  from '../test/api/add-race';
import addView                  from '../test/api/add-view';
import createItem               from '../test/api/create-item';
import getCountries             from '../test/api/get-countries';
import getDiscussion            from '../test/api/get-discussion';
import getEducations            from '../test/api/get-educations';
import e2e                      from '../test/e2e';
import join                     from '../test/e2e/join';
import stopE2e                  from '../test/e2e-stop';

let tests = 0, passed = 0, failed = 0;
const begin = Date.now();

console.log();

sequencer(
  [
    getUrlTitle,
    db,
    appError,
    config,
    user,
    type,
    item,
    feedback,
    vote,
    discussion,
    training,
    http,
    api,
    addRace,
    addView,
    createItem,
    getCountries,
    // getDiscussion,
    getEducations,
    e2e,
    join,
    stopE2e
  ]
  .map(test => props => new Promise((ok, ko) => {
    try {
      test(props).then(results => {
        tests += results.tests;
        passed += results.passed;
        failed += results.failed;
        ok();
      }, ko);
    }
    catch ( error ) {
      ko(error);
    }
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
    console.log('   ----------------------------------------------------------');
    console.log('  ', `${tests} tests in ${duration}`.bold, `${passed} passed`.green, `${failed} failed`.red);
    console.log('   ----------------------------------------------------------');

    if ( failed ) {
      console.log('  ', '                                                          '.bgRed);
      console.log('  ', `                  TEST FAILED   (x${failed})                      `.bgRed.bold);
      console.log('  ', '                                                          '.bgRed);
    }

    else {
      console.log('  ', '                                                          '.bgGreen);
      console.log('  ', `                       ALL TESTS PASSED                   `.bgGreen.bold);
      console.log('  ', '                                                          '.bgGreen);
    }

    process.exit(failed);
  }
);
