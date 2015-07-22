'use strict';

import UserModel from '../models/user';

function saveUserImage (event, image) {
  try {
    UserModel
      .saveImage(this.synuser.id, image)
      .then(
        user => socket.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default saveUserImage;
