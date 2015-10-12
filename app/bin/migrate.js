'use strict';

import fs             from 'fs';
import path           from 'path';
import { exec }       from 'child_process';
import colors         from 'colors';
import Mung           from '../lib/mung';

console.log('Migrating database...');

Mung.connect(process.env.MONGOHQ_URL).on('connected', () => {

  console.log('Getting all models...');

  fs.readdir(path.resolve(__dirname, '../models'), (error, files) => {
    if ( error ) {
      throw error;
    }

    console.log('Got all models', files);

    let promises = files
      .map(file => new Promise((ok, ko) => {
        try {
          let model = require(path.resolve(__dirname, `../models/${file}`));

          console.log(model);

          if ( model.migrations ) {
            console.log('Migrating', model.name);
            model.migrate().then(() => {
              console.log('Migration OK', model.name);
              ok();
            }, ko);
          }
          else {
            ok();
          }
        }
        catch ( error ) {
          ko(error);
        }
    }));

    Promise
      .all(promises)
      .then(
        results => { Mung.disconnect()  },
        error => {
          console.log(error.stack);
          // throw error;
          process.exit(8);
        }
      );

  });

});
