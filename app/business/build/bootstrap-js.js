! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var source        =   require('vinyl-source-stream');
  var config        =   require('../config.json');

  exports.task      =   function bootstrapJS () {
    return browserify(path.join(process.cwd(), config.files['app js']))
      .bundle()
      .pipe(source('index.js'))
      .pipe(gulp.dest(config.dirs['dist js']));
  };

}();
