#!/usr/bin/env node
! function () {
  
  'use strict';

  require("babel/register")({
    modules   :   'common',
    stage     :   1,
    ignore    :   /node_modules\/[^(cinco)]/
  });

  var Log = require('../lib/app/Log');

  var log = new Log('bin/start');

  require('colors');

  var hello;

  function parseError(error) {
    return error.stack.split(/\n/);
  }

  require('fs').createReadStream(require('path').resolve(__dirname, '../..', 'README.md'))
    .on('data', function (data) {
      if ( ! hello ) {
        var bits = data.toString().split(/---/);
       hello = bits[1];

       start();
      }
    });

  var symlink       =   require('../lib/app/symlink');
  
  var async         =   require('async');


  function start () {
    console.log('     ' +
      '/                               \\'.bold.bgBlue.underline);
    console.log('     ' +
      '|        S Y N A P P            |'.bold.bgBlue.underline);
    console.log('     ' +
      '\\                               /'.bold.bgBlue);

    console.log(hello.yellow);

    require('mongoose').connect(process.env.MONGOHQ_URL);

    function onError(error) {
      console.log('server error caught in start script', parseError(error));
      error.stack.split(/\n/).forEach(console.log.bind(console));
      // logError(error);
    }

    var domain = require('domain').create();
    
    domain
      
      .on('error', onError)
    
      .run(function () {
        log.loading('Symlink library');

        symlink(domain.intercept(function () {
          log.success('Symlink library');

          var migrations    =   require('../lib/db/migrate.js');
          var Server        =   require('../server');
          
          log.loading('Migrations library');
          
          migrations(domain.intercept(function () {
            log.success('Migrations OK');

            log.loading('Starting HTTP server');
            
            new Server()
              .on('listening', function () {
                log.success('Starting HTTP server')
              });

            // fork.on('message', function (message) {
            //   console.log('oh message', message)
            // })

          }))
        }));

      });
  }

} ();
