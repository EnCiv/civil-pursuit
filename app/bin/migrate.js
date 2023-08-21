'use strict';

import fs             from 'fs';
import path           from 'path';
import { exec }       from 'child_process';
import colors         from 'colors';
import Mungo          from 'mungo';
import sequencer      from 'promise-sequencer';
import Config         from '../models/config';

Mungo.verbosity = 0;

function migrate (...models) {
  return new Promise((ok, ko) => {
    try {

      const stack = [];

      if ( ! Mungo.connections.length ) {
        stack.push(() => new Promise((ok, ko) => {
          Mungo.connect(process.env.MONGODB_URI)
            .on('error', ko)
            .on('connected', ok);
        }));
      }

      sequencer(stack).then(

        () => {

          fs.readdir(path.resolve(__dirname, '../models'), (error, files) => {

            try {
              if ( error ) {
                throw error;
              }

              if ( models.length ) {
                files = files.filter(file => models.indexOf(file) > -1);
              }

              let promises = files
                .map(file => () => new Promise((ok, ko) => {
                  try {
                    let model = require(
                      path.resolve(__dirname, `../models/${file}`)
                    ).default;
                    // console.log({ model });
                    console.info("migrate model", file);
                    model.migrate().then(ok, ko);
                  }
                  catch ( error ) {
                    ko(error);
                  }
              }));

              sequencer(promises)
                .then(ok, ko);
            }
            catch ( error ) {
              ko(error);
            }

          });
        },
        ko
      );

    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default migrate;

if ( process.argv[1] === __filename || process.argv[1] === __filename.replace(/\.js$/, '') ) {
  const args = process.argv.filter((arg, index) => index >= 2);
  migrate(...args)
    .then(
      () => {
        console.log('Migrated OK!');
        Mungo.disconnect();
      },
      error => {
        console.log(error.stack);
        process.exit(8);
      }
    );
}
