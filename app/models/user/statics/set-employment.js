'use strict';

function setEmployment (userId, employmentId) {
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
              user.employment = employmentId;
              user.save(error => {
                if ( error ) {
                  ko(error);
                }
                ok(user);
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

export default setEmployment;
