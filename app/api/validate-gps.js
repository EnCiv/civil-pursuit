'use strict';

import UserModel from '../models/user';

function validateGPS (event, lng, lat) {
  try {
    UserModel
      .findById(this.synuser.id)
      .exec()
      .then(
        user => {
          try {
            user.gps = [lng, lat];
            user['gps validated'] = Date.now();

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

export default validateGPS;
