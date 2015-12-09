'use strict';

import bcrypt       from 'bcryptjs';

function encrypt (str, num = 10) {
  return new Promise((ok, ko) => {
    try {
      bcrypt.genSalt(num, (error, salt) => {
        try {
          if ( error ) {
            throw error;
          }
          bcrypt.hash(str, salt, (error, hash) => {
            try {
              if ( error ) {
                throw error;
              }
              ok(hash);
            }
            catch ( error ) {
              ko(error);
            }
          });
        }
        catch ( error ) {
          ko(error);
        }
      });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default encrypt;
