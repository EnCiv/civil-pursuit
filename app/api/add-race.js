'use strict';

import UserModel from '../models/user';

function addRace (event, raceId) {
  try {
    UserModel
      .addRace(this.synuser.id, raceId)
      .then(
        user => {
          this.ok(event, user);
        },
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default addRace;
