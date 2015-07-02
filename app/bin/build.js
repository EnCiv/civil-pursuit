#!/usr/bin/env node

! function () {
  
  // 'use strict';

  var path        =   require('path');
  var fs          =   require('fs');
  var util        =   require('util');
  var cp          =   require('child_process');
  var Domain      =   require('domain').Domain;

  var async       =   require('async');
  var S           =   require('string');

  var minifyCss   =   require('syn/lib/build/minify');
  var lessToCss   =   require('syn/lib/build/less-to-css');
  var browserify  =   require('browserify');
  var babelify    =   require('babelify');

  var paths       =   { root: path.resolve(require.resolve('syn/server'), 'syn/') };
  
  paths.app           =   path.join(paths.root,   'app');
  paths.node_modules  =   path.join(paths.root,   'node_modules');
  paths.node_bin      =   path.join(paths.node_modules, '.bin');
  paths.dist          =   path.join(paths.app,    'dist');
  paths.css           =   path.join(paths.dist,   'css');
  paths.js            =   path.join(paths.dist,   'js');
  paths.less          =   path.join(paths.app,    'less');
  paths.pages         =   path.join(paths.app,    'pages');

  function indexCss (done) {
    async.series([
      lessToCss
        .bind(null, paths.less + '/synapp.less', paths.css + '/index.css'),
      minifyCss
        .bind(null, paths.css + '/index.css', paths.css + '/index.min.css')
      ], done);
  }

  function browserifyPages (pages, done) {

    console.log('>> received request to browserify pages', pages);

    fs.readdir(paths.pages, function (error, files) {
      if ( error ) {
        return done(error);
      }

      if ( pages.length ) {
        files = files.filter(function (file) {
          return pages.indexOf(file) > -1;
        });
      }

      console.log('>> will now browserify these pages', files);

      async.each(files, function (page, done) {
        var view;

        var source = path.join(paths.pages, page, 'Controller.js');
        var dest = fs.createWriteStream(path.join(
          paths.js, 'page-' + S(page).humanize().slugify().s + '.js'
        ));

        console.log('>> will now stat', source);

        fs.stat(source, function (error, stat) {
          if ( error ) {
            console.log('>> skipping -- controller not found', source);
            return done();
          }

          console.log('>> file found', source);

          browserifyFile(source, dest, done);
        });

      }, done);
    });
  }

  function browserifyFile (source, dest, done) {
    console.log('>> will now browserify', source, 'to', dest.path);
    browserify({
      entries     :   [source],
      transform   :   [babelify.configure({ modules: 'common', stage: 1 })],
      debug       :   false,
      fullPaths   :   false
    })
    .bundle()
    .pipe(dest)
    .on('end', done);
  }

  function uglifyPageControllers (done) {
    fs.readdir(paths.pages, function (error, files) {
      if ( error ) {
        return done(error);
      }
      async.each(files, function (page, done) {
        var view;

        var ctrl = path.join(paths.js, 'page-' + S(page).humanize().slugify().s + '.js');

        fs.stat(ctrl, function (error, stat) {
          if ( error ) {
            return done();
          }

          cp.exec(util.format('%s %s -o %s',
            path.join(paths.node_bin, 'uglifyjs'), ctrl,
              path.join(paths.js, 'page-' + S(page).humanize().slugify().s + '.min.js')),
            done);
        });

      }, done);
    });
  }

  var commands = {
    'css'                 :   indexCss,
    'browserify-pages'    :   browserifyPages,
    'uglify-pages'        :   uglifyPageControllers
  };

  if ( process.argv[2] === '--help' || process.argv.length === 2 ) {
    var md = require('path').resolve(__dirname, 'syn/doc/Build.md');
    return require('fs').createReadStream(md).pipe(process.stdout);
  }

  var args = process.argv
    // only take user arguments
    .filter(function (arg,i) { return i >= 2; })

    // catch single commands
    .map(function (arg, i, args) {
      if ( arg === 'browserify' ) {
        var file = args[(i+1)];
        var output = args[(i+2)] || process.stdout;

        if ( ! file ) {
          console.log('browserify needs a file');
        }
        else {
          arg = {
            'browserify'  : browserifyFile.bind(null, file, output)
          };
        }
      }
      return arg;
    })
    // map strings with command
    .map(function (arg) {
      if ( typeof arg === 'string' ) {
        return commands[arg];
      }
      return arg;
    })
    .filter(function (arg) {
      return arg;
    });

  if ( ! args.length ) {
    args = commands;
  }

  args = args.map(function (arg) {
    if ( arg.name === 'browserifyPages' ) {
      var pages = process.argv
        .filter(function (arg, i) { return i > 2 });

      function browserifyPagesWrapper (done) {
        this.fn(this.pages, done);
      }

      return browserifyPagesWrapper.bind({ pages: pages, fn: arg });
    }
    return arg;
  });

  console.log('Now building', args);


  async.parallel(args, function () { console.log(arguments) });

} ();
