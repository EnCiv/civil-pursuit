#!/usr/bin/env node

'use strict';

import { EventEmitter }   from    'events';
import colors             from    'colors';
import Mungo              from    'mungo';
import Server             from    '../server';
import Item               from    '../models/item';
import Type               from    '../models/type';
import sequencer          from    '../lib/util/sequencer';

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

    const connectToDB = props => new Promise((ok, ko) => {
      try {
        Mungo.connect(process.env.MONGOHQ_URL)
          .on('error', ko)
          .on('connected', ok);
      }
      catch ( error ) {
        ko(error);
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const getIntroType = props => new Promise((ok, ko) => {
      try {
        Type
          .findOne({ name : 'Intro' })
          .then(
            type => {
              try {
                if ( ! type ) {
                  throw new Error('Intro type not found');
                }
                props.intro = { type };
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const getIntroItem = props => new Promise((ok, ko) => {
      try {
        Item
          .findOne( props.intro )
          .then(
            item => {
              try {
                if ( ! item ) {
                  throw new Error('Intro item not found');
                }
                item
                  .toPanelItem()
                  .then(
                    item => {
                      try {
                        props.intro.item = item;
                        ok()
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const startServer = props => new Promise((ok, ko) => {
      try {
        new Server({ intro : props.intro.item })
          .on('listening', status => {
            console.log('HTTP server is listening'.green, status);
          })
          .on('error', error => {
            console.log('HTTP error'.red.bold, error.stack.yellow);
          })
          .on('message', console.log.bind(console));
      }
      catch ( error ) {
        ko(error);
      }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    sequencer([
      connectToDB,
      getIntroType,
      getIntroItem,
      startServer
    ])
      .then(
        emitter.emit.bind(emitter, 'message', 'started'),
        emitter.emit.bind(emitter, 'error')
      );
  }
  catch ( error ) {
    emitter.emit('error', error);
  }
}

const file = process.argv[1];

if ( file === __filename || file === __filename.replace(/\.js$/, '') ) {
  start()
    .on('message', message => console.log(message))
    .on('error', error => {console.log(error.stack.red); process.exit(8)});
}
