#!/usr/bin/env node

! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  if ( process.argv[2] === 'ls' ) {
    console.log('Models');
    console.log('IO');
    console.log('Web');

    return;
  }

  var Test  = src('lib/Test');

  var suite = {};

  var nightwatch = src('test/nightwatch');

  var args = process.argv

    .filter(function (arg, i) {
      return i > 1;
    })

    .map(function (arg) {

      var b = arg;

      if ( /^models\//.test(arg) ) {
        b = arg.replace(/^models\//, 'app/business/models/test/');
      }

      else if ( /^io\//.test(arg) ) {
        b = arg.replace(/^io\//, 'app/server/lib/io/test/');
      }

      else if ( /^web\//.test(arg) ) {
        suite[arg] = nightwatch.bind({ file: arg.replace(/^web\//, 'app/web/test/') });

        return arg;
      }

      suite[arg] = src(b);

      return arg;

    });

  require('mongoose').connect(process.env.MONGOHQ_URL);

  // return console.log(suite);

  require('mongoose').connection.on('connected', function () {
    new Test.suite('Running test from command line', suite, function (error) {
      
      if ( error ) {
        console.log('FAIL');
      }
      else {
        console.log('WIN');

        process.exit(0);
      }

    });
  });

} ();
