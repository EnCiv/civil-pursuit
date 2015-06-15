#!/usr/bin/env node
! function () {
  
  'use strict';

  require('colors');
  var fs        =   require('fs');
  var path      =   require('path');
  var domain    =   require('domain');
  var babel     =   require('babel/register');
  var Promise   =   require('promise');
  var mongoose  =   require('mongoose');
  var Log       =   require('../lib/app/Log');
  var symlink   =   require('../lib/app/symlink');

  babel({
    modules   :   'common',
    stage     :   1,
    // ignore    :   /node_modules\/[^(cinco)]/
  });

  var log = new Log('bin/start');

  function parseError(error) {
    return error.stack.split(/\n/);
  }

  function readMe () {
    return new Promise(function(ok, ko) {
      log.loading('Loading README');

      var README$path = path.resolve(__dirname, '../..', 'README.md');

      fs.createReadStream(README$path)
        .on('error', ko)
        .on('data', function (data) {
          var bits = data.toString().split(/---/);
          console.log(bits[1].yellow);
        })
        .on('end', function () {
          log.success('Loading README');
          ok();
        });
    });
  }

  function createSymLink () {
    return new Promise(function(ok, ko) {
      log.loading('Symlink library');

      symlink(function (error) {
        if ( error ) {
          load.error(error);
          return ko(error);
        }

        log.success('Symlink library');

        ok();
      });
    });
  }

  function connectToMongoose () {
    return new Promise(function(ok, ko) {
      log.loading('Connecting to MongoDB ' + process.env.MONGOHQ_URL);

      if ( ! process.env.MONGOHQ_URL ) {
        return ko(new Error('Missing MongoDB URL'));
      }

      mongoose.connect(process.env.MONGOHQ_URL);

      mongoose.connection.on('connected', function () {
        log.success('Connecting to MongoDB ' + process.env.MONGOHQ_URL);
        ok();
      });
    });
  }

  function startHttpServer () {
    return new Promise(function (ok, ko) {
      var Server = require('../server');

      log.loading('Starting HTTP server');
      
      new Server()
        .on('listening', function () {
          log.success('Starting HTTP server');
          ok();
        });
      });
  }

  readMe().then(
    function () {
      createSymLink().then(
        function () {
          connectToMongoose().then(
            function () {
              startHttpServer().then(
                function () {console.log('Synapp started')},
                ko
              );
            },
            function (error) {
              console.log(parseError(error));
              throw error;
            }
          );
        },
        function (error) {
          console.log(parseError(error));
          throw error;
        }
      );
    },

    function (error) {
      console.log(parseError(error));
      throw error;
    }
  );



    

  // function start () {
  //   console.log('     ' +
  //     '/                               \\'.bold.bgBlue.underline);
  //   console.log('     ' +
  //     '|        S Y N A P P            |'.bold.bgBlue.underline);
  //   console.log('     ' +
  //     '\\                               /'.bold.bgBlue);

  //   console.log(README.yellow);

  //   function onError(error) {
  //     console.log('server error caught in start script', parseError(error));
  //     error.stack.split(/\n/).forEach(console.log.bind(console));
  //     // logError(error);
  //   }

  //   var d = domain.create().on('error', onError);
    
  //   d.run(function () {

  //     log.loading('Connecting to MongoDB ' + process.env.MONGOHQ_URL);

  //     mongoose.connect(process.env.MONGOHQ_URL);

  //     mongoose.connection.on('connected', function () {
  //       log.success('Connecting to MongoDB ' + process.env.MONGOHQ_URL);
  //     });

  //     log.loading('Symlink library');

  //     symlink(d.intercept(function () {
  //       log.success('Symlink library');

  //       log.loading('DB Populate');

  //       var Populate = require('../lib/db/populate.js');

  //       new Populate().fill()

  //       log.success('DB Populate');

  //       log.loading('DB Migrations');

  //       var migrations    =   require('../lib/db/migrate.js');

  //       log.success('DB Migrations');
        

  //     }));
  //   });
  // }

} ();
