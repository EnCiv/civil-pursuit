! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var source        =   require('vinyl-source-stream');

  exports.task      =   function browserifyApp () {
    return browserify(path.join(process.cwd(), 'app/pages/Home/Controller.js'))
      .bundle()
      .pipe(source('home.js'))
      .pipe(gulp.dest('app/dist/js'));
  };

}();
