'use strict';

import fs             from 'fs';
import path           from 'path';
import { exec }       from 'child_process';
import colors         from 'colors';
import Mungo          from 'mungo';
import sequencer      from 'promise-sequencer';
import migrate        from './migrate';

function reset (...models) {

  const dir = path.resolve(__dirname, '../models/');

  return sequencer([

    // Connect to MongoDB if no connection alive

    () => new Promise((ok, ko) => {
      if ( ! Mungo.connections.length ) {
        Mungo.connect(process.env.MONGODB_URI)
          .on('error', ko)
          .on('connected', ok);
      }
      else {
        ok();
      }
    }),

    // get models from Model directory

    () => sequencer.promisify(fs.readdir, [dir]),

    // Trim down to argument models
    // Get Models from files

    files => new Promise((ok, ko) => {

      // Trim down

      if ( models.length ) {
        files = files.filter(file => models.indexOf(file) > -1);
      }

      // Require models from files

      models = files.map(file => require(path.join(dir, file)).default);

      models.forEach(model => console.log(`Resetting ${model.name}`));

      ok(models);
    }),

    // Empty each model

    models => new Promise((ok, ko) => {
      Promise
        .all(models.map(model => model.remove()))
        .then(() => {
          console.log('RESET OK!');
          ok(models)
        })
        .catch(ko);
    }),

    // Migrate each model

    models => migrate(...models)

  ]);

}

export default reset;

if ( process.argv[1] === __filename || process.argv[1] === __filename.replace(/\.js$/, '') ) {
  const args = process.argv.filter((arg, index) => index >= 2);
  reset(...args)
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
