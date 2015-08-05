#!/usr/bin/env node

'use strict';

import colors         from   'colors';
import fs             from   'fs';
import path           from   'path';
import { Domain }     from   'domain';
import mongoose       from   'mongoose';
import Server         from   '../server';
import DiscussionModel          from '../models/discussion';

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

        DiscussionModel
          .findOne()
          .exec()
          .then(
            discussion => {

              console.log('DISCUSSION', discussion);

              new Server(discussion)
                .on('error', parseError)
                .on('message', message => console.log('message', message));
            },
            console.log.bind(console)
          );


      }
      catch ( error ) {
        parseError(error);
      }
    },
    parseError
  ),
  parseError
);
