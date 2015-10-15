'use strict';

'use stict';

var child_process = require('child_process');
var fs = require('fs');

var options = '--modules common --stage 1 --ignore app/lib/mung/node_modules';

function transpile(cb) {
  console.log('transpiling app directory');
  child_process.exec('babel app/ ' + options + ' --out-dir dist/', function (error) {
    if (error) {
      throw error;
    }
    console.log('transpiled!');

    if (cb) cb();
  });
}

function watch() {
  console.log('watching');

  console.log('building');

  copyMigrations(function () {
    console.log('built!');

    console.log('watching app');

    fs.watch('app/', { recursive: true }, function (event, filename) {
      console.log(event, filename);
    });
  });
}

function build(cb) {
  console.log('building');

  transpile(copyMigrations);

  if (cb) cb();
}

function copyMigrations(cb) {
  console.log('copying migrations');

  fs.readdir('app/models', function (error, models) {
    if (error) {
      throw error;
    }

    var i = 0;

    function sequence() {
      i++;

      if (i === models.length) {
        console.log('copied migrations!');

        if (cb) cb();
      }
    }

    models.forEach(function (model) {
      fs.readdir('app/models/' + model + '/fixtures', function (error, fixtures) {
        if (error) {
          return sequence();
        }

        var i2 = 0;

        function sequence2() {
          i2++;

          if (i2 === fixtures.length) {
            sequence();
          }
        }

        fs.mkdir('dist/models/' + model + '/fixtures', function (error) {
          fixtures.forEach(function (fixture) {
            child_process.exec('cp app/models/' + model + '/fixtures/' + fixture + ' dist/models/' + model + '/fixtures/' + fixture, function (error) {
              if (error) throw error;
              sequence2();
            });
          });
        });
      });
    });
  });
}

if (process.argv[2] === 'hot') {
  watch();
} else {
  build();
}