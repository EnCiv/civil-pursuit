'use strict';

import UserModel from '../models/user';

function setEmployment (event, employmentId) {
  try {
    UserModel
      .setEmployment(this.synuser.id, employmentId)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setEmployment;
