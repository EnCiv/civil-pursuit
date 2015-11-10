'use strict';

import path from 'path';
import fs from 'fs';
import Mungo from 'mungo';

if ( process.title === 'node' ) {
  process.title = 'syn-e2e';
}

const usage = `syn-e2e <name>|<special> <options...>

name

- command name

special

- --list show all commands

options

- user=<user>
- password=<password>
- vendor=<vendor>
- viewport=<width>x<height>`;

const ERROR = error => {
  if ( error.stack ) {
    console.log(error.stack);
  }
  else {
    console.log(error);
  }
  process.exit(8);
}

let name, special;

const options = {
  end : true,
  port : 3012
}

process.argv.forEach((argv, index) => {
  if ( index === 2 ) {
    if ( /^\-\-/.test(argv) ) {
      special = argv.replace(/^\-\-/, '');
    }
    else {
      name = argv;
    }
  }
});

if ( name ) {
  const E2E = require(path.join(__dirname, `../lib/test/e2e/${name}`));
  Mungo.connect(process.env.MONGOHQ_URL).on('connected', () => {
    E2E.run(options).then(
      props => {
        console.log(props);
        Mungo.disconnect();
      },
      ERROR
    );
  });
}
else if ( special ) {
  switch ( special ) {
    default :
      console.log(usage);
      break;

    case 'list' :
      fs.readdir(path.resolve(__dirname, '../lib/test/e2e'), (error, files) => {
        if ( error ) {
          return ERROR(error);
        }
        files.forEach(file => {
          console.log(file.replace(/\.js$/, ''));
        });
      });
      break;
  }
}
else {
  console.log(usage);
}
