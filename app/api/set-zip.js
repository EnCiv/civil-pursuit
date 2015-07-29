'use strict';

import UserModel from '../models/user';

function setZip (event, zip) {
  try {
    UserModel
      .findById(this.synuser.id)
      .exec()
      .then(
        user => {
          try {
            user.zip = zip;

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

export default setZip;
