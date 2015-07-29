'use strict';

import UserModel from '../models/user';

function setMaritalStatus (event, statusId) {
  try {
    UserModel
      .setMaritalStatus(this.synuser.id, statusId)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setMaritalStatus;
