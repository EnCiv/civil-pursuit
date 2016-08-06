'use strict';

import User from '../models/user';

function removeRace (raceId, cb) {
  try {
    User
      .findById(this.synuser.id)
      .then(
        user => {
          try {
            if ( ! user ) {
              throw new Error(`No such user with id ${this.synuser.id}`);
            }
            let user2= user.removeRace(raceId);
            user2.save()
              .then(cb, this.error.bind(this));
          }
          catch ( error ) {
            this.error(error);
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeRace;
