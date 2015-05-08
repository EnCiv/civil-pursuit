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

    async.each(['v2', 'v3', 'v4'],
      function (v, next) {
        cp.spawn('node', ['app/models/migrations/' + v])
        .on('error', next)
        .on('exit', function (code) {
          if ( code === 0 ) {
            return next(null, v);
          }
          next(new Error('Failed to migarte to v' + v + ', got: ' + code));
        });
      },
      cb);
  }

  module.exports = migrate;

} ();
