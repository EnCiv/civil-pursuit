! function () {

  'use strict';

  var runSequence       =   require('run-sequence');
  var spawn             =   require('syn/lib/util/spawn');

  exports.dependencies  =   ['build-dev'];

  exports.task          =   function (cb) {
    runSequence(
      'minify-css-reset',
      'minify-css-toolkit',
      'minify-css-goal-progress',
      'minify-css',
      'uglify-home',
      'uglify-terms-of-service',
      'uglify-profile',
      'uglify-reset-password',
      function (error) {
        if ( error ) {
          return cb(error);
        }
        // spawn('npm', ['test'], cb);
        cb();
      });
  };

}();
