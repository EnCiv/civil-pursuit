'use strict';

import User from '../models/user';

function getUserInfo (user, cb) {

  if ( ! cb && typeof user === 'function' ) {
    cb = user;
    user = { _id : this.synuser.id };
  }

  User.findOne(user)
    .then(user => cb(user.toJSON()))
    .catch(this.error.bind(this));
}


export default getUserInfo;
