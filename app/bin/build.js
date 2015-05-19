#!/usr/bin/env node

! function () {
  
  'use strict';

  var path        =   require('path');
  var fs          =   require('fs');
  var util        =   require('util');
  var cp          =   require('child_process');
  var Domain      =   require('domain').Domain;

  var async       =   require('async');
  var S           =   require('string');

  var minifyCss   =   require('syn/lib/build/minify');
  var lessToCss   =   require('syn/lib/build/less-to-css');
  var browserify  =   require('syn/lib/build/browserify');
  
  var root        =   path.resolve(require.resolve('syn/server'), '../../');
  var app         =   path.join(root,   'app');
  var node_modules=   path.join(root,   'node_modules');
  var node_bin    =   path.join(node_modules, '.bin');
  var dist        =   path.join(app,    'dist');
  var css         =   path.join(dist,   'css');
  var js          =   path.join(dist,   'js');
  var less        =   path.join(app,    'less');
  var pages       =   path.join(app,    'pages');

  function indexCss (done) {
    async.series([
      lessToCss.bind(null, less + '/synapp.less', css + '/index.css'),
      minifyCss.bind(null, css + '/index.css', css + '/index.min.css')
      ], done);
  }

  function browserifyPageControllers (done) {
    fs.readdir(pages, function (error, files) {
      if ( error ) {
        return done(error);
      }
      async.each(files, function (page, done) {
        var view;

        var ctrl = path.join(pages, page, 'Controller.js');

        fs.stat(ctrl, function (error, stat) {
          if ( error ) {
            return done();
          }

          cp.exec(util.format('%s [ -t babelify --modules common --stage 1] %s -o %s',
            path.join(node_bin, 'browserify'), ctrl,
              path.join(js, 'page-' + S(page).humanize().slugify().s + '.js')),
            done);
        });

      }, done);
    });
  }

  function uglifyPageControllers (done) {
    fs.readdir(pages, function (error, files) {
      if ( error ) {
        return done(error);
      }
      async.each(files, function (page, done) {
        var view;

        var ctrl = path.join(js, 'page-' + S(page).humanize().slugify().s + '.js');

        fs.stat(ctrl, function (error, stat) {
          if ( error ) {
            return done();
          }

          cp.exec(util.format('%s %s -o %s',
            path.join(node_bin, 'uglifyjs'), ctrl,
              path.join(js, 'page-' + S(page).humanize().slugify().s + '.min.js')),
            done);
        });

      }, done);
    });
  }

  async.parallel([
    indexCss,
    browserifyPageControllers,
    uglifyPageControllers
  ], function () {
    console.log(arguments);
  });

} ();
