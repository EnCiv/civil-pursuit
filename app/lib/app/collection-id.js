'use strict';

import randomString from '../util/random-string';

function generateShortId (Model) {
  return new Promise((ok, ko) => {
    try {
      randomString(5)
        .then(
          id => {
            try {

              Model
                .findOne({ id })
                .then(
                  item => {
                    try {
                      if ( ! item ) {
                        ok(id);
                      }
                      else {
                        generateShortId(ok, ko);
                      }
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default generateShortId;
