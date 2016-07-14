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

Mungo.verbosity = 1;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function start (emitter = false) {

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
            .on('error', ko)
            .on('connected', ok);
        }),

        // Get intro type

        () => Type.findOne({ name : 'Intro' }),

        // Exit if no type found

        type => new Promise((ok, ko) => {
          if ( ! type ) {
            return ko(new Error('Intro type not found'));
          }
          ok(type);
        }),

        // Find intro item

        type => Item.findOne({ type }),

        // Exit if no item found

        intro => new Promise((ok, ko) => {
          if ( ! intro ) {
            return ko(new Error('Intro item not found'));
          }
          ok(intro);
        }),

        intro => intro.toPanelItem(null), //user unknown at start

        intro => new Promise((ok, ko) => {
          try {
            new Server({ intro })
              .on('listening', status => {
                emitter.emit('message', 'HTTP server is listening'.green, status);
              })
              .on('error', emitter.emit.bind(emitter, 'error') )
              .on('message', emitter.emit.bind(emitter, 'message'));
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
