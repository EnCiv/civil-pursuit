'use strict';

function identify (email,  password) {
  return new Promise((ok, ko) => {
    try {
      this
        .findOne({ email })
        .then(
          user => {
            try {
              if ( ! user ) {
                throw new Error('User not found');
              }

              this
                .isPasswordValid(password, user.password)
                .then(
                  isValid => {
                    try {
                      if ( ! isValid ) {
                        throw new Error('Wrong password');
                      }
                      ok(user);
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko(error);
            }
          }
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default identify;
