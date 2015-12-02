'use strict';

import colors from 'colors';

function describe ( descriptor, stories, options = {} ) {
  return new Promise((ok, ko) => {
    try {
      let tab = options.tab || '';
      let tests = 0;
      let passed = 0;
      let failed = 0;
      let begin = Date.now();

      if ( ! tab ) {
        console.log();
        console.log('  ' + descriptor.blue.bold);
      }
      else {
        console.log('  ' + tab + descriptor.bold);
      }

      let cursor = 0;

      const run = () => {
        if ( stories[cursor] ) {
          try {
            if ( typeof stories[cursor] !== 'object' ) {
              if ( typeof stories[cursor] !== 'function' ) {
                throw new Error('Must be an object');
              }
            }

            const start = Date.now();

            let promise;

            let isNested = false;

            const storyDescriptor = Object.keys(stories[cursor])[0];

            let story = stories[cursor][storyDescriptor];

            if ( story instanceof Describer ) {
              story = story.func();
            }

            if ( Array.isArray(story) ) {
              promise = describe(storyDescriptor, story, { tab : tab + '|_'.grey });

              isNested = true;
            }

            else {
              promise = new Promise((ok, ko) => {
                story(ok, ko);
              });
            }

            promise.then(
              p => {
                try {
                  if ( ! isNested ) {
                    tests ++;
                    passed ++;

                    const end = Date.now() - start;

                    let time;

                    if ( end < 50 ) {
                      time = `(${end.toString()} ms)`.white;
                    }

                    else if ( end < 250 ) {
                      time = `(${end.toString()} ms)`.yellow;
                    }

                    else {
                      time = `(${end.toString()} ms)`.red;
                    }

                    console.log('  ' + tab + '|_'.grey + '✔'.green.bold + ' ' + storyDescriptor.grey + ' ' + time);
                  }

                  else {
                    tests += p.tests;
                    passed += p.passed;
                    failed += p.failed;
                  }

                  cursor ++;
                  run();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              error => {
                try {
                  tests ++;
                  failed ++;

                  const end = Date.now() - start;

                  let time;

                  if ( end < 50 ) {
                    time = `(${end.toString()} ms)`.grey;
                  }

                  else if ( end < 250 ) {
                    time = `(${end.toString()} ms)`.yellow;
                  }

                  else {
                    time = `(${end.toString()} ms)`.red;
                  }

                  console.log('  ' + tab + '  ' + '✖'.red.bold + ' ' + storyDescriptor.red.italic + ' ' + time);

                  if ( error.stack ) {
                    console.log(error.stack.yellow);
                  }

                  cursor ++;
                  run();
                }
                catch ( error ) {
                  ko(error);
                }
              }
            );
          }
          catch ( error ) {
            ko(error);
          }
        }
        else {
          ok({ tests, passed, failed, time : Date.now() - begin });
        }
      };

      run();
    }
    catch ( error ) {
      ko(error);
    }
  });
}

class Describer {
  constructor (func) {
    this.func = func;
  }
}

describe.Describer = Describer;

export default describe;


// describe ( 'Test' , [
//   {
//     'should be testable' : ok => ok(),
//   },
//
//   {
//     'should throw error' : (ok, ko) => ko(new Error('Oh no!'))
//   },
//
//   {
//     'Test 2' : [
//       {
//         'should be testable' : ok => ok(),
//       },
//
//       {
//         'should be promisable' : ok => ok(),
//       },
//
//       {
//         'should throw error' : (ok, ko) => ko(new Error('Oh no!'))
//       }
//     ]
//   }
// ]).then(
//   results => {
//     console.log();
//     console.log(`${results.tests} tests in ${results.time} ms`.bold, `${results.passed} passed`.green, `${results.failed} failed`.red);
//   }
// );
