! function () {

  'use strict';

  var runSequence       =   require('run-sequence');
  var spawn             =   require('../utils/spawn');

  exports.dependencies  =   ['build-dev'];

  exports.task          =   function (cb) {
    runSequence('minify-css', 'uglify', function (error) {
      if ( error ) {
        return cb(error);
      }
      // spawn('npm', ['test'], cb);
      cb();
    });
  };

}();
