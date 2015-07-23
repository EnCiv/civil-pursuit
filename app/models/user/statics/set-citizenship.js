'use strict';

import mongoose from 'mongoose';

function setCitizenship (userId, countryId, position) {
  return new Promise((ok, ko) => {
    try {
      this
        .findById(userId)
        .exec()
        .then(
          user => {
            try {
              if ( ! user ) {
                throw new Error('No such user ' + userId);
              }

              user.citizenship.set(position, countryId);

              user.save(error => {
                try {
                  if ( error ) {
                    throw error;
                  }
                  ok(user);
                }
                catch ( error ) {
                  ko(error);
                }
              });


            }
            catch ( error ) {
              ko(error);
            }
          }
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default setCitizenship;
