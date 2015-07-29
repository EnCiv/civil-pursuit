'use strict';

function setParty (userId, partyId) {
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
              user.party = partyId;
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

export default setParty;
