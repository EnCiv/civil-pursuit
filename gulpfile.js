! function () {

  'use strict';

  var gulp          =   require('gulp');
  var buildersDir   =   './app/build';

  var tasks         =   [
    'browserify-home',
    'browserify-test',
    'browserify-terms-of-service',
    'browserify-profile',
    'browserify-reset-password',
    'build-dev',
    'build-prod',
    'less',
    'less-dashboard',
    'minify-css',
    'minify-css-dashboard',
    'uglify-home',
    'uglify-test',
    'uglify-terms-of-service',
    'uglify-reset-password',
    'uglify-profile',
    'watchify-profile',
    'watchify-reset-password',
    'watchify-home',
    'watchify-test',
    'watch-less',
    // 'generate-site-map',
    'semver-minor'];

  tasks.forEach(function (task) {
    var t = require(buildersDir + '/' + task);
    gulp.task(task, t.dependencies, t.task);
  });

  gulp.task('default', tasks.filter(function (task) {
    return task !== 'watchify';
  }));

  module.exports = gulp;

}();
