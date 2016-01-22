'use strict';

import User from '../models/user';

function saveUserImage (image, cb) {
  try {
    User
      .saveImage(this.synuser.id, image)
      .then(
        cb,
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default saveUserImage;
