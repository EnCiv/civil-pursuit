'use strict';

import UserModel from '../models/user';

function getUserInfo (event) {
  try {
    UserModel
      .findById(this.synuser.id)
      .lean()
      .exec()
      .then(
        user => {
          try {
            delete user.password;
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
