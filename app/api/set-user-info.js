'use strict';

import User from '../models/user';

function setUserInfo (set, cb) {
  console.info("setUserInfo",set);
  try {
    User
      .updateById(this.synuser.id, set)
      .then(
        user => cb(user.toJSON()),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setUserInfo;
