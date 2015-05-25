! function () {
  
  'use strict';

  require('colors');

  require("babel/register")({ modules: 'common', stage: 1 });

  var printTime = require('syn/lib/util/print-time');

  function time () {
    return printTime().join(':');
  }

  var script = process.argv[2];

  var Test = require('../../' + script);

  var test = new Test();

  test
    .run()
    
    .on('error', function (error) {
      console.log(time().magenta, '✖'.red.bold, ' Test error'.red, this._name, error.stack.split(/\n/));
      console.log(time().magenta, '✖ Test failed'.bgRed.bold, test._name.grey);
      process.exit(1);
    })
    
    .on('ok', function (assertion) {
      console.log(time().magenta, '✔'.green.bold, test._name, assertion.green);
    })
    
    .on('ko', function (assertion) {
      console.log(time().magenta, '✖'.red.bold, assertion.red, test._name.grey);
    })
    
    .on('done', function () {
      console.log()
      console.log()
      console.log((time() + ' ✔ test done ' + test._name + "\t").bgGreen.bold);
      console.log()
      console.log()
    })
    
    .on('message', function (message) {
      var args = [];
      for ( var arg in arguments ) {
        if ( +arg ) {
          args.push(arguments[arg]);
        }
      }
      console.log.apply(console, [time().magenta, '*'.bold.blue, test._name, message.blue].concat(args));
    });

} ();

