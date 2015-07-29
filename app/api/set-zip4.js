'use strict';

import UserModel from '../models/user';

function setZip4 (event, zip4) {
  try {
    UserModel
      .findById(this.synuser.id)
      .exec()
      .then(
        user => {
          try {
            user.zip4 = zip4;

            user.save(error => {
              try {
                if ( error ) {
                  throw error;
                }
                this.ok(event, user);
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
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setZip4;
