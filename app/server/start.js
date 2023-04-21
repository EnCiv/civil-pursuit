#!/usr/bin/env node

'use strict';

import "@babel/polyfill";
import { EventEmitter }         from    'events';
import Mungo                    from    'mungo';
import sequencer                from    'promise-sequencer';
import Server                   from    './server';
import AppError                 from    '../models/app-error';

import log4js                   from 'log4js';
import mongologger from './util/mongo-logger'
import DB                       from '../lib/util/db';

log4js.configure({
  appenders: {
    browserMongoAppender: { type: mongologger, source: 'browser' },
    err: { type: 'stderr' },
    nodeMongoAppender: { type: mongologger, source: 'node' },
  },
  categories: {
    browser: { appenders: ['err', 'browserMongoAppender'], level: 'debug' },
    node: { appenders: ['err', 'nodeMongoAppender'], level: 'debug' },
    default: { appenders: ['err'], level: 'debug' },
  },
})

if (!global.bslogger) {
  // bslogger stands for browser socket logger - not BS logger.
  global.bslogger = log4js.getLogger('browser')
}

if (!global.logger) {
  global.logger = log4js.getLogger('node')
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
            .on('error', error => { console.error("Mungo connection error", {error}); return( ko );}) // don't use logger here because it won't work if db not working
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
              .on('error', (error)=>{emitter.emit(error); ko()} )
              .on('message', (message)=>{emitter.emit(message); ok()});
          }
          catch ( error ) {
            console.error('HTTP server caught error on start',error);
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
      if ( error && error.stack ) {
        console.log("start:", error.stack.red);
      }
      else {
        console.log("start:", error);
      }
      AppError.throwError(error);
      // process.exit(8);
    });
}
