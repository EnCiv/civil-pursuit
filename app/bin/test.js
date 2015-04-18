#!/usr/bin/env node

! function () {
  
  'use strict';

  if ( process.argv[2] === 'ls' ) {
    console.log('Models');
    console.log('IO');
    console.log('Web');

    return;
  }

  var Test  = require('syn/lib/Test');

  var suite = {};

  var nightwatch = require('syn/lib/nightwatch');

  var args = process.argv

    .filter(function (arg, i) {
      return i > 1;
    })

    .map(function (arg) {

      suite[arg] = require('syn/' + arg);

      return arg;

    });

  require('mongoose').connect(process.env.MONGOHQ_URL);

  // console.log(suite);

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
