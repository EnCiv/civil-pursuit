! function () {

  'use strict';

  var gulp          =   require('gulp');

  exports.task      =   function gulpWatchLess () {
    return gulp.watch('app/web/less/*.less', ['less']);
  };

}();
