'use strict';

import randomString from 'syn/lib/util/random-string';

function generateShortId (_ok, _ko) {
  return new Promise((ok, ko) => {

    if ( _ok ) {
      ok = _ok;
      ko = _ko;
    }

    try {
      let ItemModel = this.constructor;

      randomString(5)
        .then(
          str => {
            ItemModel
              .findOne({ id : str })
              .lean()
              .exec()
              .then(
                item => {
                  if ( ! item ) {
                    ok(id);
                  }
                  else {
                    generateShortId(ok, ko);
                  }
                },
                ko
              );
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
