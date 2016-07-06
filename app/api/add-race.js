'use strict';

import User from '../models/user';

function addRace (raceId, cb) {
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
              .addRace(raceId)
              .save()
              .then(this.ok.bind(this, cb), this.error.bind(this));
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

export default addRace;
