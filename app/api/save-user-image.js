'use strict';

import User from '../models/user';

function saveUserImage (event, image) {
  try {
    User
      .saveImage(this.synuser.id, image)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default saveUserImage;
