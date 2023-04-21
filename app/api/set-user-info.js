'use strict';

import User from '../models/user';

function setUserInfo (set, cb) {
  try {
    User
      .updateById(this.synuser.id, set)
      .then(
        user => cb && cb(user && user.toJSON()),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setUserInfo;
