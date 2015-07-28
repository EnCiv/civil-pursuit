'use strict';

import UserModel from '../models/user';

function removeCitizenship (event, position) {
  try {
    UserModel
      .unsetCitizenship(this.synuser.id, position)
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
