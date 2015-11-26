'use strict';

import colors from 'colors';

function describe ( descriptor, stories, options = {} ) {
  return new Promise((ok, ko) => {
    let tab = options.tab || '';

    console.log(tab + descriptor);

    let cursor = 0;

    const run = () => {
      if ( stories[cursor] ) {
        if ( typeof stories[cursor] !== 'object' ) {
          throw new Error('Must be an object');
        }

        const storyDescriptor = Object.keys(stories[cursor])[0];

        let promise;

        let isNested = false;

        if ( Array.isArray(stories[cursor][storyDescriptor]) ) {
          promise = describe(storyDescriptor, stories[cursor][storyDescriptor], { tab : tab + '  ' });

          isNested = true;
        }

        else {
          promise = new Promise((ok, ko) => {
            stories[cursor][storyDescriptor](ok, ko);
          });
        }

        promise.then(
          () => {
            if ( ! isNested ) {
              console.log(tab + '  ' + '✔'.green.bold + ' ' + storyDescriptor);
            }
            cursor ++;
            run();
          },
          error => {
            console.log(tab + '  ' + '✖'.red.bold + ' ' + storyDescriptor.red.italic);

            if ( error.stack ) {
              console.log(error.stack.yellow);
            }

            cursor ++;
            run();
          }
        );
      }
      else {
        ok();
      }
    };

    run();
  });
}

export default describe;

//
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
//       }
//     ]
//   }
// ]);
