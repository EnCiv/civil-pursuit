#!/usr/bin/env node
'use strict';

!(function appBinTest() {

  'use strict';

  var domain = require('domain').create();

  require('colors');

  require('babel/register')({ modules: 'common', stage: 1 });

  var printTime = require('syn/lib/util/print-time');

  var test;

  function time() {
    return printTime().join(':');
  }

  function onError(error) {
    console.log(time().magenta, '✖'.red.bold, ' Test error'.red, test.name);

    if (error.stack) {
      error.stack.split(/\n/).forEach(function (line) {
        console.log(line.yellow);
      });
    } else {
      console.log(error);
    }

    console.log(time().magenta, '✖ Test failed'.bgRed.bold, test.name.grey);

    if (test.driver) {
      test.driver.pause(10000);
      test.driver.saveScreenshot('/tmp/snaphsot.png');
      test.driver.end(function () {
        process.exit(1);
      });
    }
  }

  domain.on('error', onError);

  domain.run(function () {

    function formatName(name) {
      for (var i = name.length; i < 20; i++) {
        name += ' ';
      }

      return name;
    }

    var script = process.argv[2];

    var viewport, session;

    for (var i = 2; i < process.argv.length; i++) {
      var splits = process.argv[i].split('=');

      if (splits[0] === 'viewport') {
        viewport = splits[1];
      }

      if (splits[0] === 'session') {
        session = splits[1];
      }
    }

    var Test = require('../../' + script);

    test = new Test({ viewport: viewport, session: session });

    var done = false;

    process.on('exit', function () {
      if (!done) {
        console.log((time() + ' ✖ Test failed ' + test._name).bgRed.bold);
        process.exit(1);
      }
    });

    var mongoose = require('mongoose');

    mongoose.connect(process.env.MONGOHQ_URL);

    // mongoose.connection.on('connected', console.log.bind(console, 'connected'))

    console.log(time().bgMagenta + 'BIN'.bgBlue.bold + test._name.bgCyan.bold);

    test.run().on('error', onError).on('ready', function () {
      time().bgMagenta + 'READY'.bgGreen.bold + test.name.bgCyan.bold;
    }).on('ok', function (assertion, step, total) {
      console.log(time().bgMagenta + ' ✔ '.bgGreen.bold + formatName(test.name).bgGreen.bold + (step + 1 + '/' + total).bgBlack.bold + (' ' + assertion + ' ').bgYellow.black.bold);
    }).on('ok from', function (assertion, test, step, total) {
      console.log(time().bgMagenta + ' ✔ '.bgGreen.bold + formatName(test).bgGreen.bold + (step + 1 + '/' + total).bgBlack.bold + (' ' + assertion + ' ').bgYellow.black.bold);
    }).on('ko', function (assertion) {
      console.log(time().bgMagenta + ' ✖ '.bgGreen.bold + formatName(test.name).bgGreen.bold + (' ' + assertion + ' ').bgYellow.black.bold);
    }).on('ko from', function (assertion, test) {
      console.log(time().bgMagenta + ' ✖ '.bgGreen.bold + formatName(test.name).bgGreen.bold + (' ' + assertion + ' ').bgYellow.black.bold);
    }).on('skip', function (assertion) {
      console.log(time().bgMagenta + ' * '.bgMagenta.bold + formatName(test.name).bgGreen.bold + 'SKIP'.bgBlack.bold + (' ' + assertion + ' ').bgYellow.black.bold);
    }).on('skip from', function (assertion, test) {
      console.log(time().bgMagenta + ' * '.bgMagenta.bold + formatName(test).grey.bold + 'SKIP'.bgBlack.bold + (' ' + assertion + ' ').bold.grey);
    })

    // .on('ko', function (assertion) {
    //   console.log(time().magenta, '✖'.red.bold, assertion.red, test._name.grey);
    // })

    .on('done', function () {
      done = true;
      var str = (time() + ' ✔ test done ' + test._name + '\t').bgGreen.bold;

      console.log(str.green.italic);
      console.log(str);
      console.log(str.green.italic);
      test.driver.pause(3000);
      test.driver.end(function () {
        process.exit(0);
      });
    });
  });
})();
// .on('message', function (message) {
//   var args = [];
//   for ( var arg in arguments ) {
//     if ( +arg ) {
//       args.push(arguments[arg]);
//     }
//   }
//   console.log.apply(console, [
//     time().magenta,
//     '*'.bold.blue,
//     formatName(test._name).blue.bold,
//     message.bgBlue.bold].concat(args.map(function (arg) {
//       if ( typeof arg === 'string' ) {
//         arg = arg.grey;
//       }
//       return arg;
//     })));
// })

// .on('message from', function (test, message) {
//   var args = [];
//   for ( var arg in arguments ) {
//     if ( +arg > 1 ) {
//       args.push(arguments[arg]);
//     }
//   }
//   console.log.apply(console, [
//     time().magenta,
//     '*'.bold.blue,
//     formatName(test).blue.bold,
//     message.bgBlue.bold].concat(args.map(function (arg) {
//       if ( typeof arg === 'string' ) {
//         arg = arg.blue;
//       }
//       return arg;
//     })));
// });