var gulp        = require('gulp');
var gutil       = require('gulp-util');
var less        = require('gulp-less');
var watchify    = require('watchify');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var path        = require('path');
var watch       = require('gulp-watch');
var concat      = require('gulp-concat');
var minifyCSS   = require('gulp-minify-css');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('less', function () {
  gulp.src('public/less/synaccord.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'public/bower_components/boostrap/less')
      ]
    }))
    .pipe(gulp.dest('public/css'))
    .on('end', function () {
      gulp.src('public/css/synaccord.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/dist'));
    });
});

gulp.task('browserify', function () {
  var bundler = watchify(browserify(path.join(__dirname, 'public/js/angular/synapp/index.js'), watchify.args));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/dist'));
  }

  return rebundle();
});

gulp.task('watch', function () {
  gulp.watch('public/less/*.less', ['less']);
});

var uglify      = require('gulp-uglifyjs');

gulp.task('bootstrapjs', function () {

  gulp.src('./public/bower_components/bootstrap/**/{tooltip,transition,collapse}.js')

    .pipe(concat('bootstrap.js'))

    .pipe(uglify())

    .pipe(gulp.dest('./public/dist'));
});
