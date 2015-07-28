'use strict';

import UserModel from '../models/user';

function removeCitizenship (event, citizenship) {
  try {
    UserModel
      .unsetCitizenship(this.synuser.id, citizenship)
      .then(
        user => { this.ok(event, user) },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default removeCitizenship;
