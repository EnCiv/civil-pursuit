'use strict';

import colors from 'colors';

function describe ( descriptor, stories, options = {} ) {
  return new Promise((ok, ko) => {
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
        if ( typeof stories[cursor] !== 'object' ) {
          throw new Error('Must be an object');
        }

        const start = Date.now();

        const storyDescriptor = Object.keys(stories[cursor])[0];

        let promise;

        let isNested = false;

        if ( Array.isArray(stories[cursor][storyDescriptor]) ) {
          promise = describe(storyDescriptor, stories[cursor][storyDescriptor], { tab : tab + '|_'.grey });

          isNested = true;
        }

        else {
          promise = new Promise((ok, ko) => {
            stories[cursor][storyDescriptor](ok, ko);
          });
        }

        promise.then(
          p => {
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
          },
          error => {
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
        );
      }
      else {
        ok({ tests, passed, failed, time : Date.now() - begin });
      }
    };

    run();
  });
}

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
