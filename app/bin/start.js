#!/usr/bin/env node
! function () {
  
  'use strict';

  require("babel/register")({ modules: 'common' });

  require('colors');

  var symlink       =   require('../lib/app/symlink');
  var httpServer    =   require('../server');
  var migrations    =   require('../lib/db/migrate.js');
  var async         =   require('async');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  function onError(error) {
    console.log('server error', error);
    error.stack.split(/\n/).forEach(console.log.bind(console));
  }

  var domain = require('domain').create();
  
  domain
    
    .on('error', onError)
  
    .run(function () {

      symlink(domain.intercept(function () {
        console.log('Symlink OK!');
        migrations(domain.intercept(function () {
          console.log('Migrations OK!');
          httpServer(null, console.log.bind(console));  
        }))
      }));

    });

} ();
