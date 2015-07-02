'use strict';

function identify (email,  password) {
  return new Promise((ok, ko) => {
    try {
      this
        .findOne({ email : email })
        .then(
          user => {
            try {
              if ( ! user ) {
                throw new Error('User not found ' + email);
              }

              this
                .isPasswordValid(password, user.password)
                .then(
                  isValid => {
                    if ( ! isValid ) {
                      throw new Error('Wrong password');
                    }
                    ok(user);
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
