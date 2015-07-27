'use strict';

import UserModel from '../models/user';

function setGender (event, gender) {
  try {
    UserModel
      .setGender(this.synuser.id, gender)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setGender;
