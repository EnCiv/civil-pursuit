'use strict';

import path         from 'path';
import fs           from 'fs';
import Mungo        from 'mungo';
import WebDriver    from '../lib/app/webdriver';
import db           from '../test/3-db/0.connect';
import reset        from '../test/3-db/1.reset';

if ( process.title === 'node' ) {
  process.title = 'syn-e2e';
}

const usage = `syntest <name>|<special> <options...>

# Show all available tests

syntest --list

# Run a specific test

syntest 9 join

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

const base = '../test';

const options = {
  end : true,
  port : 13012
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
  else if ( index > 2 ) {
    const bits = argv.split('=');
    options[bits[0]] = bits[1];
  }
});

function list () {
  return new Promise((ok, ko) => {
    fs.readdir(path.resolve(__dirname, base), (error, dirs) => {
      if ( error ) {
        return ko(error);
      }
      const promises = dirs
        .filter(dir => ! /^\./.test(dir))
        .map(dir => new Promise((ok, ko) => {
          fs.readdir(path.resolve(__dirname, base, dir), (error, files) => {
            if ( error ) {
              return ko(error);
            }

            files = files.map(file => ({
              path : path.join(__dirname, base, dir, file),
              file,
              name : file.replace(/\.js$/, '')
            }));

            ok({ dir, files });
          });
        }));

      Promise.all(promises).then(
        results => {
          ok(results.map(result => {
            const paths = result.dir.split('-');
            const number = paths.shift();

            result.number = number;

            result.name = paths.join(' ');

            return result;
          }));
        },
        ko
      );
    });
  });
}

if ( name ) {
  // const E2E = require(path.join(__dirname, `${base}/${name}`));
  Mungo.connect(process.env.MONGOHQ_URL).on('connected', () => {

    const [ a, b, number, file ] = process.argv;

    console.log({ number, file });

    list().then(
      results => {
        results.forEach(result => {
          if ( result.number === number ) {
            result.files.forEach(resultFile => {
              if ( resultFile.name === file ) {
                const test = require(resultFile.path);

                const run = () => {
                  test(options)
                    .then(
                      props => {
                        console.log(props);
                        Mungo.disconnect();
                      },
                      ERROR
                    );
                };

                const promises = [];

                if ( +(result.number) > 3 ) {
                  promises.push(
                    new Promise((ok, ko) => {
                      db().then(ok, ko);
                    }),

                    new Promise((ok, ko) => {
                      reset().then(ok, ko);
                    })
                  );
                }

                if ( result.number === '9' ) {
                  promises.push(new Promise((ok, ko) => {
                    options.driver = new WebDriver()
                      .on('error', ko)
                      .on('ready', ok);
                  }));
                }

                Promise.all(promises).then(run, ERROR);

              }
            });
          }
        });
      },
      ERROR
    );

    // console.log('e2e', name, options);
    //
    // E2E.run(options).then(

    // );
  });
}
else if ( special ) {
  switch ( special ) {
    default :
      console.log(usage);
      break;

    case 'list' :
      list().then(
        results => {
          results.forEach(result => {
            console.log();
            console.log(result.name.yellow.bold);
            console.log();

            result.files.forEach(file => console.log('  ', `#${result.number}`.bold.blue, '    ', file.name));
          });
        },
        ERROR
      );
      break;
  }
}
else {
  console.log(usage);
}
