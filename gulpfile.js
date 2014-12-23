(function () {

  'use strict';

  var gulp          =   require('gulp');

  gulp.task('browserify', require('./app/business/build/browserify'));

})();

// var gulp          =   require('gulp');
// var gutil         =   require('gulp-util');
// var less          =   require('gulp-less');
// var watchify      =   require('watchify');
// var browserify    =   require('browserify');
// var source        =   require('vinyl-source-stream');
// var path          =   require('path');
// var watch         =   require('gulp-watch');
// var concat        =   require('gulp-concat');
// var minifyCSS     =   require('gulp-minify-css');
// var rename        =   require("gulp-rename");
// var runSequence   =   require('run-sequence');
// var uglify        =   require('gulp-uglifyjs');
// var shell         =   require('gulp-shell');

// var path_bower    =   'app/web/bower_components';
// var path_less     =   'app/web/less';
// var path_dist     =   'app/web/dist';
// var path_angular  =   'app/web/angular';
// var path_ngapp    =   path.join(path_angular, 'synapp')

// function spawn (cmd, args, then) {

//   var cp = require('child_process').spawn(cmd, args);

//   cp.on('error', then);

//   cp.on('exit', function (code) {
//     if ( typeof code === 'number' && ! code ) {
//       return then();
//     }
//     then(new Error('Got code ' + code));
//   });

//   cp.stdout.on('data', function (data) {
//     console.log(data.toString());
//   });

//   cp.stderr.on('data', function (data) {
//     console.log(data.toString());
//   });
// }

// /*
//  *  COMPILE LESS
//  *  ============
// */

// gulp.task('less', function gulpCompileLess () {
//   return gulp.src(path.join(path_less, 'synapp.less'))
//     .pipe(less({
//       paths: [
//         path.join(__dirname, path_bower, 'boostrap/less')
//       ]
//     }))
//     .pipe(gulp.dest(path.join(path_dist, 'css')));
// });

// /*
//  *  MINIFY CSS
//  *  ==========
// */

// gulp.task('min-css', function gulpMinifyCSS () {
//   return gulp.src(path.join(path_dist, 'css/synapp.css'))
//     .pipe(minifyCSS())
//     .pipe(rename(function (path) {
//       path.extname = '.min.css';
//     }))
//     .pipe(gulp.dest(path.join(path_dist, 'css')));
// });

// /*
//  *  MINIFY C3 CSS
//  *  =============
// */

// gulp.task('min-css-c3', function gulpMinifyC3CSS () {
//   return gulp.src(path.join(path_bower, 'c3/c3.css'))
//     .pipe(minifyCSS())
//     .pipe(rename(function (path) {
//       path.extname = '.min.css';
//     }))
//     .pipe(gulp.dest(path.join(path_dist, 'css')));
// });

// /*
//  *  CONCAT BOOTSTRAP
//  *  ================
// */

// gulp.task('concat-bs', function concatBsJS () {

//   return gulp.src(path.join(path_bower,
//     'bootstrap/**/{tooltip,transition,collapse,modal,dropdown}.js'))

//     .pipe(concat('bootstrap.js'))

//     .pipe(gulp.dest(path.join(path_dist, 'js')));
// });

// /*
//  *  UGLIFY BOOTSTRAP
//  *  ================
// */

// gulp.task('ugly-bs', function uglifyBs (cb) {
//   return gulp.src(path.join(path_dist, 'js/bootstrap.js'))

//     .pipe(uglify())

//     .pipe(rename(function (path) {
//       path.extname = '.min.js';
//     }))

//     .pipe(gulp.dest(path.join(path_dist, 'js')));
// });

// /*
//  *  BROWSERIFY APP
//  *  ==============
// */

// gulp.task('browserifyApp', function browserifyApp () {
//   return browserify(path.join(__dirname, path_ngapp, 'index.js'))
//     .bundle()
//     //Pass desired output filename to vinyl-source-stream
//     .pipe(source('bundle.js'))
//     // Start piping stream to tasks!
//     .pipe(gulp.dest(path.join(path_dist, 'js')));
// });

// /*
//  *  UGLIFY APP
//  *  ==========
// */

// gulp.task('ugly-app', function uglifyApp () {

//   return gulp.src(path.join(path_dist, 'js/bundle.js'))

//     .pipe(uglify())

//     .pipe(rename(function (path) {
//       path.extname = '.min.js';
//     }))

//     .pipe(gulp.dest(path.join(path_dist, 'js')));
// });

// ////////////////////////////////////////////////////////////////////////////////
// //    WATCHERS
// ////////////////////////////////////////////////////////////////////////////////

// /*
//  *  WATCHIFY APP
//  *  ============
// */

// gulp.task('watchifyApp', function watchifyApp () {
//   var bundler = watchify(browserify(path.join(__dirname, path_ngapp, 'index.js'),
//     watchify.args));

//   bundler.on('update', rebundle);

//   function rebundle() {
//     return bundler.bundle()
//       // log errors if they happen
//       .on('error', gutil.log.bind(gutil, 'Browserify Error'))
//       .pipe(source('bundle.js'))
//       .pipe(gulp.dest(path.join(path_dist, 'js')));
//   }

//   return rebundle();
// });

// /*
//  *  WATCH LESS
//  *  ==========
// */

// gulp.task('watch-less', function watchLess () {
//   gulp.watch('app/web/less/*.less', ['less']);
// });

// /*
//  *  ALL WATCHERs
//  *  ============
// */

// gulp.task('watch', ['less', 'watch-less', 'watchifyApp'], function watch () {
// });

// ////////////////////////////////////////////////////////////////////////////////
// //    BUILDERS
// ////////////////////////////////////////////////////////////////////////////////

// /*
//  *  BUILD
//  *  =====
// */

// gulp.task('build', ['less', 'concat-bs', 'browserifyApp'], function (cb) {
//   cb();
// });

// /*
//  *  BUILD PROD
//  *  ==========
// */

// gulp.task('build-prod', ['build'], function (cb) {
//   runSequence('min-css', 'min-css-c3', 'ugly-bs', 'ugly-app', function (error) {
//     if ( error ) {
//       return cb(error);
//     }
//     spawn('npm', ['test'], cb)
//   });
// });

// ////////////////////////////////////////////////////////////////////////////////
// //    ROUTINES
// ////////////////////////////////////////////////////////////////////////////////

// gulp.task('push-to-heroku', ['build-prod'], function pushToHeroku (cb) {
//   spawn('git', ['commit', '-am', 'Pushing to Heroku'],
//     function (error) {
//       if ( error ) {
//         return cb(error);
//       }

//       spawn('git', ['push', 'bitbucket', 'master'], function (error) {
//         if ( error ) {
//           return cb(error);
//         }

//         spawn('git', ['push', 'heroku', 'master'], cb);
//       });
//     })
// });


// ///////////////////////////////////////////////////////////

// // gulp.task('default', function() {
// //   // place code for your default task here
// // });





// // var uglify      = require('gulp-uglifyjs');



// // // js docs

// // var shell = require('gulp-shell');

// // gulp.task('docs', shell.task([ 
// //   'node_modules/jsdoc/jsdoc.js '+ 
// //     '-c node_modules/angular-jsdoc/conf.json '+   // config file
// //     '-t node_modules/angular-jsdoc/template '+    // template file
// //     '-d build/docs '+                             // output directory
// //     '-r '+                                        // recursive
// //     'public/js/angular/synapp models'             // source code directory
// // ]));
