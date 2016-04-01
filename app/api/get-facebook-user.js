'use strict';

import User from '../models/user';
import superagent from 'superagent';

function getFacebookUser (fbUser, cb) {
  User
    .findOne({ facebook : fbUser.id })
    .then(user => {
      if ( ! user ) {
        User
          .create({
            email : fbUser.email,
            password : fbUser.id + 'synapp',
            facebook : fbUser.id
          })
          .then(cb, cb);
      }
    });
}


export default getFacebookUser;
