'use strict';

import UserModel from '../models/user';

function removeRace (event, raceId) {
  try {
    UserModel
      .removeRace(this.synuser.id, raceId)
      .then(
        user => this.ok(event, user),
        error => this.emit('error', error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeRace;
