#!/usr/bin/env node

'use strict';

import "babel-polyfill";
import { EventEmitter }         from    'events';
import colors                   from    'colors';
import Mungo                    from    'mungo';
import sequencer                from    'promise-sequencer';
import Server                   from    '../server';
import Item                     from    '../models/item';
import Type                     from    '../models/type';
import AppError                 from    '../models/app-error';

import log4js                   from 'log4js';
import log4js_extend            from 'log4js-extend';
import mongoAppender            from 'log4js-node-mongodb';
import DB                       from '../lib/util/db';

log4js.addAppender(
    mongoAppender.appender({connectionString: process.env.MONGOHQ_URL}),
    'node'
);

log4js.addAppender(
    mongoAppender.appender({connectionString: process.env.MONGOHQ_URL}),
    'browser'
);

if(!global.bslogger){  // used by socketlogger - doesn't include extend because that would always be the same
  global.bslogger=log4js.getLogger('browser');
  global.bslogger.setLevel("INFO");
}

log4js_extend(log4js, {
  path: __dirname,
  format: "{at:{n:@name,f:@file,l:@line.@column}}"
});

if(!global.logger) {
  global.logger = log4js.getLogger('node');
  global.logger.setLevel("INFO");
}



Mungo.verbosity = 1;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function start (emitter = false) {
  var verbose=false;

  logger.info({emitter});

  if ( ! emitter ) {
    emitter = new EventEmitter();
    process.nextTick(() => {
      start(emitter);
    });
    return emitter;
  }

  try {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if ( process.env.NODE_ENV === 'production' ) {
      process.title = 'synappprod';
    }

    else {
      process.title = 'synappdev';
      verbose=true;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if ( ! process.env.MONGOHQ_URL ) {
      throw new Error('Missing MONGOHQ_URL');
    }

    if ( ! process.env.SYNAPP_ENV ) {
      throw new Error('Missing SYNAPP_ENV');
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    sequencer
      ([

        // Connect to MongoDB

        () => new Promise((ok, ko) => {
          Mungo.connect(process.env.MONGOHQ_URL)
            .on('error', error => { logger.error("Mungo connection error", {error}); return( ko );})
            .on('connected', ok);
        }),

        ()=>DB.connect(process.env.MONGOHQ_URL),
        
        () => new Promise((ok, ko) => {
          try {
            new Server(verbose)
              .on('listening', status => {
                logger.info('HTTP server is listening', {status});
                return ok();
              })
              .on('error', ()=>{emitter.emit( 'error'); ko()} )
              .on('message', ()=>{emitter.emit('message'); ok()});
          }
          catch ( error ) {
            ko(error);
          }
        })

      ])

      .then(emitter.emit.bind(emitter, 'message', 'started'))

      .catch(emitter.emit.bind(emitter, 'error'))



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }
  catch ( error ) {
    emitter.emit('error', error);
  }
}

const file = process.argv[1];

if ( file === __filename || file === __filename.replace(/\.js$/, '') ) {
  start()
    .on('message', (...messages) => console.log("start", ...messages))
    .on('error', error => {
      logger.error({error});
      console.log('Start: Error'.bgRed);
      if ( error.stack ) {
        console.log("start:", error.stack.red);
      }
      else {
        console.log("start:", error);
      }
      AppError.throwError(error);
      // process.exit(8);
    });
}
