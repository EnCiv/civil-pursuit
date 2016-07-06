'use strict';

import User from '../models/user';

function removeRace (raceId, cb) {
  try {
    User
      .findById(this.synuser.id)
      .removeRace(raceId)
      .save()
      .then(cb, this.error.bind(this));
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeRace;
