'use strict';

function sequencer (pipeline = [], locals = {}, afterEach) {
  return new Promise((ok, ko) => {
    try {
      let cursor = 0;

      const results = [];

      const run = () => {
        try {
          if ( pipeline[cursor] ) {
            pipeline[cursor](locals).then(
              result => {
                try {
                  results.push(result);

                  if ( afterEach ) {
                    afterEach();
                  }

                  cursor ++;

                  run();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
          }
          else {
            ok(results, locals);
          }
        }
        catch ( error ) {
          ko(error);
        }
      };

      run();
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default sequencer;
