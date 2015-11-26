'use strict';

import fs             from 'fs';
import path           from 'path';
import { exec }       from 'child_process';
import colors         from 'colors';
import Mungo          from 'mungo';
import migrate        from './migrate';

function reset () {
  return new Promise((ok, ko) => {
    try {

      Mungo.connect(process.env.MONGOHQ_URL).on('connected', () => {

        fs.readdir(path.resolve(__dirname, '../models'), (error, files) => {
          if ( error ) {
            throw error;
          }

          let promises = files
            .map(file => new Promise((ok, ko) => {
              try {
                let model = require(path.resolve(__dirname, `../models/${file}`));

                model.remove({}, { limit  : false }).then(() => {
                  ok();
                }, ko);
              }
              catch ( error ) {
                ko(error);
              }
          }));

          Promise
            .all(promises)
            .then(
              results => {
                console.log('Migrating');
                migrate().then(ok, ko);
              },
              ko
            );

        });

      });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default reset;

if ( process.argv[1] === __filename || process.argv[1] === __filename.replace(/\.js$/, '') ) {
  reset()
    .then(
      () => {
        Mungo.disconnect();
      },
      error => {
        console.log(error.stack);
        process.exit(8);
      }
    );
}
