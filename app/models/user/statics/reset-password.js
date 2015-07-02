'use strict';

import { Domain } from 'domain';
import encrypt from 'syn/lib/util/encrypt';

function resetPassword (key, token, password) {
  return new Promise((ok, ko) => {
    let d = new Domain().on('error', ko);

    encrypt(password)
      .then(
        hash => this
          .update(
            { activation_key: key, activation_token: token },
            { password: hash }
            )
          .exec(d.intercept(number => {
            if ( ! number ) {
              throw new Error('No such key/token');
            }
          })),
        ko
      );
  });
}

export default resetPassword;
