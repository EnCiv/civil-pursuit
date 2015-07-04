'use strict';

import fs             from 'fs';
import path           from 'path';
import { format }     from 'util';
import { exec }       from 'child_process';

const ROOT = path.resolve(__dirname, '../../..');
const PAGES = path.join(ROOT, 'dist/pages');

function browserifyPages () {
  return new Promise((ok, ko) => {

    // Scan pages directory

    fs.readdir(PAGES, (error, files) => {
      if ( error ) {
        return ko(error);
      }

      // Filter out pages without controllers

      let promises = files.map(file => new Promise((ok, ko) => {
        let _file = path.join(PAGES, file);
        fs.stat(path.join(_file, 'bundle.js'), error => ok(error ? null : _file));
      }));

      Promise
        .all(promises)
        .then(
          results => {
            results = results.filter(r => r);

            // Browserify

            let promises = results.map(file => new Promise((ok, ko) => {
              console.log('uglifying', file)
              let cmd = format('uglifyjs %s -o %s', path.join(file, 'bundle.js'), path.join(file, 'bundle.min.js'));
              exec(cmd, (error, stdout, stderr) => {
                if ( error ) {
                  return ko(error);
                }
                ok();
              });
            }));

            Promise
              .all(promises)
              .then(ok, ko);
          },
          ko
        );

    });
  });
}

export default browserifyPages;

if ( /uglify-pages\.js$/.test(process.argv[1]) ) {
  browserifyPages()
    .then(
      () => console.log('uglified'),
      error => console.log(error.stack.split(/\n/))
    );
}

