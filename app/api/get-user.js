'use strict';

import UserModel from '../models/user';

function getUser (event, query) {
  try {
    UserModel
      .findOne(query)
      .then(
        user => {
          try {
            this.ok(event, user.toJSON());
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

export default getUser;
