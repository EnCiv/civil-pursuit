'use strict';

import UserModel from '../models/user';

function setBirthdate (event, birthdate) {
  try {
    UserModel
      .setBirthdate(this.synuser.id, birthdate)
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

export default setBirthdate;
