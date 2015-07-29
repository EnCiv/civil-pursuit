'use strict';

import UserModel from '../models/user';

function setEducation (event, educationId) {
  try {
    UserModel
      .setEducation(this.synuser.id, educationId)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setEducation;
