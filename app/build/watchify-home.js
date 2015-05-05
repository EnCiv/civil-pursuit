! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var watchify      =   require('watchify');
  var source        =   require('vinyl-source-stream');
  var gutil         =   require('gulp-util');
  var config        =   require('../config.json');

  exports.task      =   function watchifyApp () {
    var bundler = watchify(
      browserify(
        path.join(process.cwd(), 'app/js/pages/Home.js'),
        watchify.args));

    bundler.on('update', rebundle);

    function rebundle() {
      return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('home.js'))
        .pipe(gulp.dest(config.dirs['dist js']));
    }

    return rebundle();
  };

}();
