'use strict';

function setRegisteredVoter (userId, isRegisteredVoter) {
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
              user.registered_voter = isRegisteredVoter;
              user.save(error => {
                if ( error ) {
                  ko(error);
                }
                else {
                  ok(user);
                }
              });
            }
            catch ( error ) {

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

export default setRegisteredVoter;
