#!/usr/bin/env node

'use strict';

import colors         from   'colors';
import fs             from   'fs';
import path           from   'path';
import { Domain }     from   'domain';
import mongoose       from   'mongoose';
import Server         from   '../server';
import ItemModel      from '../models/item';
import TypeModel      from '../models/type';

if ( process.env.NODE_ENV === 'production' ) {
  process.title = 'synappprod';
}

else {
  process.title = 'synappdev';
}

function parseError(error) {
  console.log(error.stack.split(/\n/));
}

function readMe () {
  return new Promise((ok, ko) => {
    let README$path = path.resolve(__dirname, '../..', 'README.md');

    fs.createReadStream(README$path)
      .on('error', ko)
      .on('data', data => {
        let bits = data.toString().split(/---/);
        console.log(bits[1].yellow);
      })
      .on('end', ok);
  });
}

function connectToMongoose () {
  return new Promise(function(ok, ko) {
    if ( ! process.env.MONGOHQ_URL ) {
      return ko(new Error('Missing MongoDB URL'));
    }

    mongoose.connect(process.env.MONGOHQ_URL);

    mongoose.connection.on('connected', function () {
      console.log('Connected to MongoDB ' + process.env.MONGOHQ_URL);
      ok();
    });
  });
}

readMe().then(
  () => connectToMongoose().then(
    () => {
      try {
        TypeModel
          .findOne({ name : 'Intro' })
          .exec()
          .then(
            type => {
              try {
                if ( ! type ) {
                  throw new Error('Intro type not found');
                }
                ItemModel
                  .findOne({ type })
                  .exec()
                  .then(
                    intro => {
                      try {
                        if ( ! intro ) {
                          throw new Error('Intro not found');
                        }
                        intro
                          .toPanelItem()
                          .then(
                            intro => new Server({ intro })
                              .on('error', parseError)
                              .on('message', message => console.log('message', message)),
                            error => parseError(error)
                          )
                      }
                      catch ( error ) {
                        parseError(error);
                      }
                    },
                    error => parseError(error)
                  );
              }
              catch ( error ) {
                parseError(error);
              }
            },
            error => parseError(error)
          )

      }
      catch ( error ) {
        parseError(error);
      }
    },
    parseError
  ),
  parseError
);
