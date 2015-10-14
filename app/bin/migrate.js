'use strict';

import fs             from 'fs';
import path           from 'path';
import { exec }       from 'child_process';
import colors         from 'colors';
import Mung           from '../lib/mung';


function migrate () {
  return new Promise((ok, ko) => {
    try {

      Mung.connect(process.env.MONGOHQ_URL).on('connected', () => {


        fs.readdir(path.resolve(__dirname, '../models'), (error, files) => {
          if ( error ) {
            throw error;
          }


          let promises = files
            .map(file => new Promise((ok, ko) => {
              try {
                let model = require(path.resolve(__dirname, `../models/${file}`));



                model.migrate().then(() => {
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

                 ok();
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

export default migrate;

if ( process.argv[1] === __filename || process.argv[1] === __filename.replace(/\.js$/, '') ) {
  migrate()
    .then(
      () => {
        Mung.disconnect();
      },
      error => {
        console.log(error.stack);
        process.exit(8);
      }
    );
}
