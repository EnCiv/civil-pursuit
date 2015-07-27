'use strict';

function setGender (userId, gender) {
  return new Promise((ok, ko) => {
    try {
      this
        .findById(userId)
        .exec()
        .then(
          user => {
            try {
              if ( ! user  ) {
                throw new Error('No such user ' + userId);
              }
              user.gender = gender;
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
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default setGender;
