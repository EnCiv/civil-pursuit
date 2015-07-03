'use strict';

import bcrypt       from 'bcrypt';
import { Domain }   from 'domain';

function encrypt (str) {
  return new Promise((ok, ko) => {
    try {
      let d = new Domain().on('error', ko);

      bcrypt.genSalt(10, d.intercept(salt => {
        bcrypt.hash(str, salt, d.intercept(hash => {
          ok(hash);
        }));
      }));
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default encrypt;
