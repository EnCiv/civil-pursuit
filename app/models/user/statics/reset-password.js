'use strict';

import { Domain } from 'domain';
import encrypt from '../../../lib/util/encrypt';

function resetPassword (key, token, password) {
  return new Promise((ok, ko) => {
    try {
      encrypt(password)
        .then(
          hash => this
            .update(
              { activation_key: key, activation_token: token },
              { password : hash, activation_key : null, activation_token : null }
              )
            .exec()
            .then(ok, ko),
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default resetPassword;
