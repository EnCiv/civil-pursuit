#!/usr/bin/env node

! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'fs',
    'async',
    'mongoose',
    'syn/lib/util/ls',
    'syn/lib/Test',
    'syn/lib/util/to-human',
    'colors'
  ];

  function onError(error) {
    throw error;
  }

  function run (test, domain, path, fs, async, mongoose, ls, Test, toHuman) {

    var tests = [];

    test = test.trim().replace(/\/?/, '');

    var TEST_BASE = path.resolve(__dirname, '../../');
    var TEST_DIR = path.join(TEST_BASE, 'test');
    var TEST_PATH = path.join(TEST_BASE, test);

    if ( ! test ) {
      throw new Error('Missing test');
    }

    function recursive (dir) {

      var files = fs.readdirSync(dir);

      files.forEach(function (file) {

        if ( /\.js$/.test(file) ) {
          tests.push(require(path.join(dir, file)));
        }

        else {
          recursive(path.join(dir, file));
        }

      });
    }

    fs.stat(TEST_PATH, domain.intercept(function (stat) {
        
      if ( stat.isFile() ) {
        Test([require(TEST_PATH)], function (error) {
          if ( error ) {
            error.stack.split(/\n/).forEach(function (line) {
              console.log(line.yellow);
            });
          }
          else {
            console.log(' ✔ Test OK!'.bgGreen.bold);
          }
        });
      }

      else if ( stat.isDirectory() ) {

        recursive(TEST_PATH);

        Test(tests, function (error) {
          if ( error ) {
            error.stack.split(/\n/).forEach(function (line) {
              console.log(line.yellow);
            });
          }
          else {
            console.log(' ✔ Test OK!'.bgGreen.bold);
          }
        });
      }

    }));

  }

  di(onError, deps, run.bind(null, process.argv[2]));
    

} ();
