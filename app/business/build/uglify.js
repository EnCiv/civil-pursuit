! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var config        =   require('../config.json');
  var uglify        =   require('gulp-uglifyjs');
  var rename        =   require("gulp-rename");

  module.exports = function uglifyApp () {

    return gulp.src(path.join(process.cwd(), config.files['app js compiled']))

      .pipe(uglify())

      .pipe(rename(function (path) {
        path.extname = '.min.js';
      }))

      .pipe(
        gulp.dest(
          config.dirs['dist js']
          )
        );
  };

}();
