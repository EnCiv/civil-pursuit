'use strict';

import User from '../models/user';

function getUserInfo (cb) {
  User.findById(this.synuser.id)
    .then(user => cb(user.toJSON()))
    .catch(this.error.bind(this));
}


export default getUserInfo;
