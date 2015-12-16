'use strict';

import generateRandomString from '../../../lib/util/random-string';

function lambda (options = {}) {
  return new Promise((ok, ko) => {
    try {
      const user = {};

      generateRandomString(15)
        .then(
          string => {
            user.email = `${string}@syn-test.com`;

            user.password = options.password || '.1234abcDEF?-@*';

            this.create(user).then(ok, ko);
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default lambda;
