'use strict';

import User from '../models/user';

function addRace (event, raceId) {
  try {
    User
      .updateById(this.synuser.id, { $push : { race : raceId } })
      .then(
        this.ok.bind(this, event),
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default addRace;
