! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var source        =   require('vinyl-source-stream');
  var config        =   require('../config.json');

  exports.task      =   function browserifyDashboard () {
    return browserify(path.join(process.cwd(), config.files['dashboard js']))
      .bundle()
      .pipe(source('dashboard.js'))
      .pipe(gulp.dest(config.dirs['dist js']));
  };

}();
