'use strict';

import UserModel from '../models/user';

function resetPassword (event, key, token, password) {
  try {
    UserModel
      .resetPassword(key, token, password)
      .then(
        () => this.ok(event),
        error => this.error(error)
      )
  }
  catch ( error ) {
    this.error(error);
  }
}

export default resetPassword;
