module.exports = (function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var source        =   require('vinyl-source-stream');
  var config        =   require('../config.json');

  return (function browserifyApp () {
    return browserify(path.join(process.cwd(), config.files['app js']))
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(config.dirs['dist js']));
  });

})();
