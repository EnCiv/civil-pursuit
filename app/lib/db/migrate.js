! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function migrate (cb) {
    var async =  require('async');
    var cp = require('child_process');

    async.eachSeries(['v2', 'v3', 'v4'],
      function (v, next) {
        var spawn = cp.spawn('node', ['migrations/' + v])
          .on('error', next)
          .on('exit', function (code) {
            if ( code === 0 ) {
              return next(null, v);
            }
            next(new Error('Failed to migrate to ' + v + ', got: ' + code));
          });

        spawn.stdout.on('data', function (data) {
          console.log(data.toString());
        });
      },
      cb);
  }

  module.exports = migrate;

} ();
