'use strict';

import User from '../models/user';

function getUserInfo (event) {
  try {
    User
      .findById(this.synuser.id)
      .then(
        user => {
          try {
            user = user.toJSON();
            this.ok(event, user);
          }
          catch ( error ) {
            this.error(error);
          }
        },
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getUserInfo;
