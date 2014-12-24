! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var config        =   require('../config.json');
  var less          =   require('gulp-less');
  var rename        =   require("gulp-rename");

  module.exports = function gulpCompileLess () {
    return gulp.src(path.join(process.cwd(), config.files['app less']))
      .pipe(less({
        // paths: [
        //   path.join(__dirname, path_bower, 'boostrap/less')
        // ]
      }))
      .pipe(rename(function (path) {
        path.basename = 'index';
      }))
      .pipe(gulp.dest(config.dirs['dist css']));
  };

}();
