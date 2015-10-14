'use strict';

import encrypt from '../../../lib/util/encrypt';

function encryptPassword (doc) {
  return new Promise((ok, ko) => {
    try {
      encrypt(doc.password).then(
        hash => {
          try {
            doc.set('password', hash);
            ok();
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

export default encryptPassword;
