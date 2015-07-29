'use strict';

function removeRace (userId, raceId) {
  return new Promise((ok, ko) => {
    try {
      this
        .findById(userId)
        .exec()
        .then(
          user => {
            try {
              user.race.pull(raceId);

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

export default removeRace;
