'use strict';

import User from '../models/user';

function getUserInfo (user, cb) {
  try {
    if ( ! cb && typeof user === 'function' ) {
      cb = user;
    }
    if(!(this.synuser && this.synuser.id)) {
      return cb({});
    }
    user = { _id : this.synuser.id };

    User.findOne(user)
      .then(user => user ? cb(user.toJSON()) : cb({}))
      .catch(this.error.bind(this));
  }
  catch(error) {
    this.error(error);
  }
}


export default getUserInfo;
