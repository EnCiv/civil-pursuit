'use strict';

import encrypt from 'syn/lib/util/encrypt';

function preSave (next) {
  try {
    if ( ! this.isNew ) {
      return next();
    }

    this.email = this.email.toLowerCase();

    let d = new Domain().on('error', next);

    encrypt(this.password).then(
      hash => {
        this.password = hash;
        next();
      },
      next
    );

  }
  catch ( error ) {
    next(error);
  }
}

export default preSave;
