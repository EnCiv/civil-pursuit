! function () {

  'use strict';

  function spawn (cmd, args, then) {

    var cp = require('child_process').spawn(cmd, args);

    cp.on('error', then);

    cp.on('exit', function (code) {
      if ( typeof code === 'number' && ! code ) {
        return then();
      }
      then(new Error('Got code ' + code));
    });

    cp.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    cp.stderr.on('data', function (data) {
      console.log(data.toString());
    });
  }

  module.exports = spawn;

} ()
