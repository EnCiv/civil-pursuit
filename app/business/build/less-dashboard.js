! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var config        =   require('../config.json');
  var less          =   require('gulp-less');
  var rename        =   require("gulp-rename");

  exports.task      =   function gulpCompileLessDashboard () {
    return gulp.src(path.join(process.cwd(), config.files['dashboard less']))
      .pipe(less({
        // paths: [
        //   path.join(__dirname, path_bower, 'boostrap/less')
        // ]
      }))
      .pipe(rename(function (path) {
        path.basename = 'dashboard';
      }))
      .pipe(gulp.dest(config.dirs['dist css']));
  };

}();
