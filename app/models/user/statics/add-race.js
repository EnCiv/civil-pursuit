'use strict';

import { Domain } from 'domain';

function addRace (userId, raceId) {
  return new Promise((ok, ko) => {
    let d = new Domain().on('error', ko);

    this
      .findById(userId)
      .exec(d.intercept(user => {
        if ( ! user ) {
          throw new Error('No such user: ' + userId);
        }

        let reduce = (hasRace, race) => {
          if ( race.toString() === raceId.toString() ) {
            hasRace = true;
          }

          return hasRace;
        }

        let hasRace = user.race.reduce(reduce, false);

        if ( hasRace ) {
          throw new Error('Already has race');
        }

        user.race.push(raceId);

        user.save(error => {
          if ( error ) {
            return ko(error);
          }
          ok(user);
        });
      }));
  });
}

export default addRace;
