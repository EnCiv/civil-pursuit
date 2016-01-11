'use strict';

import path         from 'path';
import fs           from 'fs';
import Mungo        from 'mungo';
import WebDriver    from '../lib/app/webdriver';
import db           from 'syn/../../dist/test/run/3-db/0.connect';
import reset        from 'syn/../../dist/test/run/3-db/1.reset';
import http         from 'syn/../../dist/test/run/6-http/0.server';
import api          from 'syn/../../dist/test/run/8-socket-api/0.api';
import sequencer    from 'sequencer';

Mungo.verbosity = 0;

if ( process.title === 'node' ) {
  process.title = 'syntest';
}

const usage = `syntest

# Show all available tests

syntest ls

# Run a specific test

syntest 9 join

name

- command name

special

- ls show all commands

options

- user=<user>
- password=<password>
- vendor=<vendor>
- viewport=<width>x<height>`;

const ERROR = error => {
  if ( error.stack ) {
    console.log(error.stack.red);
  }
  else {
    console.log(error);
  }
  process.exit(8);
}

let name, special;

const base = '../test/run';

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

const httpOptions = {};

if ( name ) {

  if ( name === 'ls') {
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
  }

  else {
    const [ a, b, number, file ] = process.argv;

    list().then(
      results => {
        results.forEach(result => {
          if ( result.number === number ) {
            result.files.forEach(resultFile => {
              if ( resultFile.name === file ) {
                console.log(resultFile.path);

                let test;

                try {
                  test = require(resultFile.path);
                }
                catch ( error ) {
                  return ERROR(error);
                }

                if ( typeof test !== 'function' ) {
                  return ERROR(new Error(resultFile.name + ' is not a function'));
                }

                const run = () => {
                  test(options)
                    .then(
                      props => {
                        try {
                          console.log();
                          if ( props.passed === props.tests ) {
                            console.log(JSON.stringify(props).bgGreen.bold);
                          }
                          else {
                            console.log(JSON.stringify(props).bgRed.bold);
                          }
                        }
                        catch ( error ) {
                          console.log(props);
                        }

                        const promises = [];

                        if ( Mungo.connections.length ) {
                          promises.push(Mungo.disconnect());
                        }

                        if ( httpOptions.server ) {
                          promises.push(new Promise((ok, ko) => {
                            httpOptions.server.server.close();
                            ok();
                          }))
                        }

                        if ( options.driver ) {
                          promises.push(new Promise((ok, ko) => {
                            options.driver.client.end(error => {
                              if ( error ) {
                                ko(error);
                              }
                              else {
                                ok();
                              }
                            });
                          }));
                        }


                        Promise.all(promises).then(
                          () => {
                            process.exit(0);
                          },
                          error => {
                            ERROR(error);
                            process.exit(1);
                          }
                        );
                      },
                      ERROR
                    );
                };

                const stackOfPromises = [];

                if ( +(result.number) > 3 ) {
                  stackOfPromises.push(
                    () => db(),
                    () => sequencer([
                      () => reset(),
                      stats => new Promise((ok, ko) => {
                        if ( ! stats.failed ) {
                          ok();
                        }
                        else {
                          ko(new Error('Could not reset'));
                        }
                      })
                    ])
                  );
                }

                if ( +(result.number) > 5 ) {
                  stackOfPromises.push(
                    () => http(httpOptions)
                  );
                }

                if ( +(result.number) > 6 ) {
                  stackOfPromises.push(
                    () => api(options)
                  );
                }

                if ( result.number === '9' ) {
                  stackOfPromises.push(() => new Promise((ok, ko) => {
                    options.driver = new WebDriver()
                      .on('error', ko)
                      .on('ready', ok);
                  }));
                }

                sequencer(stackOfPromises).then(run, ERROR);

              }
            });
          }
        });
      },
      ERROR
    );

  }
}

else {
  console.log(usage);
}
