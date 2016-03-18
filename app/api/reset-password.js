'use strict';

import User from '../models/user';

function resetPassword (key, token, password, cb) {
  try {
    User
      .resetPassword(key, token, password)
      .then(cb)
      .catch(error => this.error(error));
  }
  catch ( error ) {
    this.error(error);
  }
}

export default resetPassword;
