'use strict';

import crypto from 'crypto';

function randomString (size) {
  return new Promise((ok, ko) => {
    crypto.randomBytes(48, (ex, buf) => {
      try {
        let token = buf.toString('base64');

        let str = '';

        let i = 0;

        while ( str.length < size ) {
          if ( token[i] !== '/' && token[i] !== '+') {
            str += token[i];
          }

          i++;
        }

        ok(str);
      }
      catch ( error ) {
        ko(error);
      }
    });
  });
}

export default randomString;
