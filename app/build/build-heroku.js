! function () {

  'use strict';

  var gulp              =   require('gulp');
  var path              =   require('path');
  var browserify        =   require('browserify');
  var source            =   require('vinyl-source-stream');
  var config            =   require('../config.json');
  var spawn             =   require('')

  exports.dependencies  =   ['build-prod'];

  exports.task          =   function pushToHeroku (cb) {
    spawn('git', ['commit', '-am', 'Pushing to Heroku'],
      function (error) {
        if ( error ) {
          return cb(error);
        }

        spawn('git', ['push', 'bitbucket', 'master'], function (error) {
          if ( error ) {
            return cb(error);
          }

          spawn('git', ['push', 'heroku', 'master'], cb);
        });
      })
  };

}();
