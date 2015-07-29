'use strict';

function setEducation (userId, educationId) {
  return new Promise((ok, ko) => {
    try {
      this
        .findById(userId)
        .exec()
        .then(
          user => {
            try {
              if ( ! user ) {
                throw new Error('User not found ' + userId);
              }
              user.education = educationId;
              user.save(error => {
                if ( error ) {
                  return ko(error);
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

export default setEducation;
