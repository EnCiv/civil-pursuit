'use strict';

import randomString from '../../../lib/util/random-string';

function generateShortId (_ok, _ko) {
  return new Promise((ok, ko) => {
    if ( _ok ) {
      ok = _ok;
      ko = _ko;
    }

    try {
      let ItemModel = this;

      randomString(5)
        .then(
          str => {
            try {

              ItemModel
                .findOne({ id : str })
                .lean()
                .exec()
                .then(
                  item => {
                    try {
                      if ( ! item ) {
                        ok(str);
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
