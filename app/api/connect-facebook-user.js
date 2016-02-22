'use strict';

import User from '../models/user';

function connectFacebookUser (fbUser) {
  User
    .findOne({ facebook : fbUser.id })
    .then(user => {
      if ( ! user ) {
        User.create({

        });
      }
    });
}

export default connectFacebookUser;
