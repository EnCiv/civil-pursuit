! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var config        =   require('syn/config.json');
  var minifyCSS     =   require('gulp-minify-css');
  var rename        =   require("gulp-rename");

  exports.task      =   function gulpMinifyCSS () {
    return gulp.src('app/dist/css/normalize.css')
      .pipe(minifyCSS())
      .pipe(rename(function (path) {
        path.extname = '.min.css';
      }))
      .pipe(gulp.dest('app/dist/css'));
  };

}();
