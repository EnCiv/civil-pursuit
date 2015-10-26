'use strict';

import User from '../models/user';

function setUserInfo (event, set) {
  try {
    User
      .updateById(this.synuser.id, set)
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

export default setUserInfo;
