'use strict';

function sequencer (pipeline = [], locals = {}, afterEach) {
  return new Promise((ok, ko) => {
    try {
      let cursor = 0;

      let run = () => {
        try {
          if ( pipeline[cursor] ) {
            pipeline[cursor](locals).then(
              () => {
                try {
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
            ok(locals);
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
