#!/usr/bin/env node

! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var Test  = src('lib/Test');

  var suite = {};

  var args = process.argv

    .filter(function (arg, i) {
      return i > 1;
    })

    .map(function (arg) {

      var b = arg;

      if ( /^models\//.test(arg) ) {
        b = arg.replace(/^models\//, 'app/business/models/test/');
      }

      suite[arg] = src(b);

      return arg;

    });

  require('mongoose').connect(process.env.MONGOHQ_URL);

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
