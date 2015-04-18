! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function nightWatch (done) {

    var self = this;

    console.log('token', process.env.SYNTEST_TOKEN)

    var spawn = require('child_process')
      .spawn('nightwatch', ['--test', this.file], {
        env: process.env
      });

    spawn.on('error', done);

    spawn.on('exit', function (status) {
      if ( status === 0 ) {
        done();
      }
      else {
        done(new Error('Nightwatch returned status: ' + status));
      }
    });

    spawn.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    spawn.stderr.on('data', function (data) {
      console.log(data.toString());
    });
  }

  module.exports = nightWatch;

} ();
