'use strict';

import UserModel from '../models/user';

function setCitizenship (event, countryId, position) {
  try {
    UserModel
      .setCitizenship(this.synuser.id, countryId, position)
      .then(
        user  => {
          this.ok(event, user);
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setCitizenship;
