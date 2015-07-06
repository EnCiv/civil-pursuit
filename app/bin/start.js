#!/usr/bin/env node

'use strict';

import colors     from   'colors';
import fs         from   'fs';
import path       from   'path';
import domain     from   'domain';
import mongoose   from   'mongoose';
import symlink    from   '../lib/app/symlink';

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

symlink()
  .then(
    () => {
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      console.log('SYMLINK OK')
      readMe().then(
        () => connectToMongoose().then(
          () => {
            try {
              console.log('connecting to server 22');
              var Server = require('../server');
              new Server()
                .on('error', parseError)
                .on('message', message => console.log('message', message));
            }
            catch ( error ) {
              parseError(error);
            }
          },
          parseError
        ),
        parseError
      )
    },
    parseError
  );
