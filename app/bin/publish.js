#!/usr/bin/env node

! function () {
  
  'use strict';

  console.time('publish');

  require('colors');

  var cp = require('child_process');

  var test = 'app/bin/test.js';

  var deployMessage = process.argv[2];

  var tests = [
    // { name: 'gulp build-prod' },

    { name: 'git commit -am "' + deployMessage.replace(/\s/g, '-') +'"', ok: [0, 1, 8792, 7182] },

    { name: [test, 'test/lib'].join(' ') },
    { name: [test, 'test/models/User'].join(' ') },
    { name: [test, 'test/models/Config'].join(' ') },
    { name: [test, 'test/models/Country'].join(' ') },
    { name: [test, 'test/models/Error'].join(' ') },
    { name: [test, 'test/models/Feedback'].join(' ') },
    { name: [test, 'test/models/Criteria'].join(' ') },
    { name: [test, 'test/models/Vote'].join(' ') },
    { name: [test, 'test/models/Type'].join(' ') },
    
    // { name: [test, 'models/test/Item'].join(' ') },
    
    // { name: [test, 'io/add-view'].join(' ') },
    // { name: [test, 'io/promote'].join(' ') },
    // { name: [test, 'io/add-race'].join(' ') },
    // { name: [test, 'io/remove-race'].join(' ') },
    // { name: [test, 'io/set-marital-status'].join(' ') },
    // { name: [test, 'io/change-user-name'].join(' ') },
    // { name: [test, 'io/change-user-name'].join(' ') },
    // { name: [test, 'io/set-citizenship'].join(' ') },
    // { name: [test, 'io/set-birthdate'].join(' ') },
    // { name: [test, 'io/set-gender'].join(' ') },
    // { name: [test, 'io/set-registered-voter'].join(' ') },
    // { name: [test, 'io/set-party'].join(' ') },
    
    // { name: [test, 'web/login'].join(' ') },
    // { name: [test, 'web/reference-opens-in-a-new-window'].join(' ') },
    // { name: [test, 'web/item-image-display'].join(' ') },

    // { name: [test, 'web/driver/create-topic'].join(' ') },
    // { name: [test, 'web/driver/promote'].join(' ') },

    { name: 'git push heroku master' }
  ];

  require('async').eachSeries(tests,
    function (test, cb) {
      var action = test;

      console.log("\n", ('⌛ ' + action.name).bgBlue.bold, "\n");

      var chunks = test.name.split(/\s/);

      var cmd = chunks.shift();

      cp

        .spawn(cmd, chunks, { stdio: 'inherit' })

        .on('exit', function (status) {

          var ok = test.ok || [0];

          if ( ok.indexOf(status) > -1 ) {

            console.log("\n", ('✔ ' + action.name).bgGreen.bold, "\n");

            cb();

          }

          else {
            console.log('exit: ' + status);
            throw new Error(action.name);
          }

        });
    },

    function (error) {
      console.log(arguments);
      console.timeEnd('publish');
    });

} ();
