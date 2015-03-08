#!/usr/bin/env node

! function () {
  
  'use strict';

  require('colors');

  var cp = require('child_process');

  function t(message) {
    console.log()
    console.log(message)
    console.log()
  }

  /**
   *
   */

  function gulpBuildProd (cb) {
    var action = 'gulp build-prod';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('gulp', ['build-prod'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *
   */

  function gitPushHerokuMaster (cb) {
    var action = 'git push heroku master';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('git', ['push', 'heroku', 'master'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *
   */

  function synTestModelUser (cb) {
    var action = 'syn-test model user';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('app/business/bin/test.js', ['models/User'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *
   */

  function synTestModelItem (cb) {
    var action = 'syn-test model Item';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('app/business/bin/test.js', ['models/Item'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *
   */

  function synTestSocketAddView (cb) {
    var action = 'syn-test socket "add view"';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('app/business/bin/test.js', ['io/add-view'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *
   */

  function synTestSocketPromote (cb) {
    var action = 'syn-test socket "promote"';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('app/business/bin/test.js', ['io/promote'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  /**
   *    SOCKET "add race"
   */

  function synTestSocketAddRace (cb) {
    var action = 'syn-test socket "add race"';

    console.log("\n", ('⌛ ' + action).bgCyan, "\n");

    cp

      .spawn('app/business/bin/test.js', ['io/add-race'], { stdio: 'inherit' })

      .on('exit', function (status) {

        if ( status === 0 ) {

          console.log("\n", ('✔ ' + action).bgGreen, "\n");

          cb();

        }

        else {
          throw new Error(action);
        }

      });
  }

  require('async').series([
      gulpBuildProd,
      synTestModelUser,
      synTestModelItem,
      synTestSocketAddView,
      synTestSocketPromote,
      synTestSocketAddRace,
      gitPushHerokuMaster
    ],

    function (error) {

    });

} ();
