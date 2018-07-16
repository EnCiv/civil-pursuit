'use strict';

import User from '../models/user';

function getUserInfo (user, cb) {
  if ( ! cb && typeof user === 'function' ) {
    if(!(this.synuser && this.synuser.id)) {
      return cb({});
    }
    cb = user;
    user = { _id : this.synuser.id };
  }

  User.findOne(user)
    .then(user => user ? cb(user.toJSON()) : cb({}))
    .catch(this.error.bind(this));
}


export default getUserInfo;
