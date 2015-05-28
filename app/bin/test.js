#!/usr/bin/env node

! function appBinTest () {
  
  'use strict';

  require('colors');

  require("babel/register")({ modules: 'common', stage: 1 });

  var printTime = require('syn/lib/util/print-time');

  function time () {
    return printTime().join(':');
  }

  function formatName (name) {
    for ( var i = name.length; i < 20; i ++ ) {
      name += ' ';
    }

    return name;
  }

  var script = process.argv[2];

  var Test = require('../../' + script);

  var test = new Test();

  var done = false;

  process.on('exit', function () {
    if ( ! done ) {
      console.log((time() + ' ✖ Test failed ' + test._name).bgRed.bold);
      process.exit(1);
    }
  });

  var mongoose = require('mongoose');

  mongoose.connect(process.env.MONGOHQ_URL);

  console.log('Running test', test._name);

  test
    .run()
    
    .on('error', function (error) {
      console.log(time().magenta, '✖'.red.bold, ' Test error'.red, this._name, error.stack.split(/\n/));
      console.log(time().magenta, '✖ Test failed'.bgRed.bold, test._name.grey);
      process.exit(1);
    })
    
    .on('ok', function (assertion, step, total) {
      console.log(
        time().magenta,
        '✔'.green.bold,
        formatName(test._name).green.bold,
        ((step + 1) + '/' + total).bgGreen.bold,
        assertion.green);
    })

    .on('ok from', function (assertion, test, step, total) {
      console.log(
        time().magenta,
        '✔'.green.bold,
        formatName(test).green.bold,
        ((step + 1) + '/' + total).bgGreen.bold,
        assertion.green);
    })
    
    .on('ko', function (assertion) {
      console.log(time().magenta, '✖'.red.bold, assertion.red, test._name.grey);
    })
    
    .on('done', function () {
      done = true;
      console.log()
      console.log()
      console.log((time() + ' ✔ test done ' + test._name + "\t").bgGreen.bold);
      console.log()
      console.log()
      test._driver.client.end(function () {
        process.exit(0);
      });
    })
    
    .on('message', function (message) {
      var args = [];
      for ( var arg in arguments ) {
        if ( +arg ) {
          args.push(arguments[arg]);
        }
      }
      console.log.apply(console, [
        time().magenta,
        '*'.bold.blue,
        formatName(test._name).blue.bold,
        message.bgBlue.bold].concat(args.map(function (arg) {
          if ( typeof arg === 'string' ) {
            arg = arg.blue;
          }
          return arg;
        })));
    })

    .on('message from', function (test, message) {
      var args = [];
      for ( var arg in arguments ) {
        if ( +arg > 1 ) {
          args.push(arguments[arg]);
        }
      }
      console.log.apply(console, [
        time().magenta,
        '*'.bold.blue,
        formatName(test).blue.bold,
        message.bgBlue.bold].concat(args.map(function (arg) {
          if ( typeof arg === 'string' ) {
            arg = arg.blue;
          }
          return arg;
        })));
    });

} ();

