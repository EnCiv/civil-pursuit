'use strict';

import UserModel from '../models/user';

function setRegisteredVoter (event, isRegistered) {
  try {
    UserModel
      .setRegisteredVoter(this.synuser.id, isRegistered)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setRegisteredVoter;
