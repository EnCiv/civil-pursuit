'use strict';

function setCitizenship (userId, countryId, position) {
  return new Promise((ok, ko) => {
    this
      .findById(userId)
      .exec()
      .then(
        user => {
          if ( ! user ) {
            return ko(new Error('No such user ' + userId));
          }

          user.citizenship[position] = countryId;

          user.save(error => {
            if ( error ) {
              return ko(error);
            }
            ok(user);
          });
        }
      );
  });
}

export default setCitizenship;
