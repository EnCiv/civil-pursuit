'use strict';

function identify (email,  password) {
  return new Promise((ok, ko) => {
    console.log('identifying', email, password)
    try {
      this
        .findOne({ email : email })
        .exec()
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
