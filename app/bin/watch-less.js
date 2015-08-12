'use strict';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import colors from 'colors';

let file = path.resolve(__dirname, '../../assets/less/index.less');

let dir = path.dirname(file);

function c (event, filename) {
  console.log(event, filename, new Date());
  exec('npm run less', (error, stdout, stderr) => {
    if ( error ) {
      error.stack.split(/\n/).forEach(line => console.log(line.red));
    }
    if ( stdout ) {
      console.log(stdout.blue);
    }
    if ( stderr ) {
      console.log(stderr.yellow);
    }
  });
}

fs.watch(dir, c);

for ( let d of ['elements', 'lib'] ) {
  fs.watch(path.join(dir, d), c);
}
