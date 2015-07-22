'use strict';

import UserModel from '../models/user';

function setLastName (event, lastName) {
  try {
    UserModel
      .findById(this.synuser.id)
      .exec()
      .then(
        user => {
          try {
            if ( ! user ) {
              throw new Error('No such user: ' + this.synuser.id);
            }

            user.last_name = lastName;

            user.save(error => {
              try {
                if ( error ) {
                  throw error;
                }
                this.ok(event);
              }
              catch ( error ) {
                this.error(error);
              }
            });
          }
          catch ( error ) {
            this.error(error);
          }
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setLastName;
