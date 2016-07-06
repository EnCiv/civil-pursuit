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
            user
              .removeRace(raceId)
              .save()
              .then(cb)
              .catch(error => this.emit('error', error));
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
