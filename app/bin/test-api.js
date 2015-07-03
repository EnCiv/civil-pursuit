#!/usr/bin/env node

'use strict';

import mongoose   from 'mongoose';
import fs         from 'fs';
import path       from 'path';
import S          from 'string';
import colors     from 'colors';

mongoose.connect(process.env.MONGOHQ_URL);

let action = process.argv[2];

let mock = {};

fs
  .readdir(path.join(__dirname, '../test/api'), (error, files) => {

    if ( error ) {
      throw error;
    }
    
    let promises = files.map(file => new Promise((ok, ko) => {
      console.log(file.grey);
      let action = require(path.join(__dirname, '../test/api', file));
      action().then(
        (...args) => ok({ [file] : args }),
        ko
      );
    }));

    Promise
      .all(promises)
      .then(
        results => {
          console.log('API OK'.green, results);
          process.exit(0);
        },
        error => {
          error.stack.split(/\n/).forEach(line => console.log(line.red));
          process.exit(1);
        }
      );

  });


