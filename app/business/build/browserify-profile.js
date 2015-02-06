! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var source        =   require('vinyl-source-stream');
  var config        =   require('../config.json');

  exports.task      =   function browserifyApp () {
    return browserify(path.join(process.cwd(), 'app/web/js/pages/Profile.js'))
      .bundle()
      .pipe(source('profile.js'))
      .pipe(gulp.dest(config.dirs['dist js']));
  };

}();
