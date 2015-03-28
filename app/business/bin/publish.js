#!/usr/bin/env node

! function () {
  
  'use strict';

  require('colors');

  var cp = require('child_process');

  var test = 'app/business/bin/test.js';

  var tests = [
    'gulp build-prod',

    'git commit -am "deploy"',

    [test, 'models/User'].join(' '),
    [test, 'models/User'].join(' '),
    
    [test, 'io/add-view'].join(' '),
    [test, 'io/promote'].join(' '),
    [test, 'io/add-race'].join(' '),
    [test, 'io/remove-race'].join(' '),
    [test, 'io/set-marital-status'].join(' '),
    [test, 'io/change-user-name'].join(' '),
    [test, 'io/change-user-name'].join(' '),
    [test, 'io/set-citizenship'].join(' '),
    [test, 'io/set-birthdate'].join(' '),
    [test, 'io/set-gender'].join(' '),
    [test, 'io/set-registered-voter'].join(' '),
    [test, 'io/set-party'].join(' '),
    
    [test, 'web/login'].join(' '),
    [test, 'web/create-topic'].join(' '),
    [test, 'web/reference-opens-in-a-new-window'].join(' '),

    'git push heroku master'
  ];

  require('async').eachSeries(tests,
    function (test, cb) {
      var action = test;

      console.log("\n", ('⌛ ' + action).bgCyan, "\n");

      var chunks = test.split(/\s/);

      var cmd = chunks.shift();

      cp

        .spawn(cmd, chunks, { stdio: 'inherit' })

        .on('exit', function (status) {

          if ( status === 0 ) {

            console.log("\n", ('✔ ' + action).bgGreen, "\n");

            cb();

          }

          else {
            throw new Error(action);
          }

        });
    },

    function (error) {
      console.log(arguments);
    });

} ();
