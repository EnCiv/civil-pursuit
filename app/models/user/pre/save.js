'use strict';

import encrypt from 'syn/lib/util/encrypt';

function preSave (next) {
  try {

    if ( ! this.isNew ) {
      return next();
    }

    this.email = this.email.toLowerCase();

    encrypt(this.password).then(
      hash => {
        try {
          this.password = hash;
          next();
        }
        catch ( error ) {
          next(error);
        }
      },
      next
    );

  }
  catch ( error ) {
    next(error);
  }
}

export default preSave;
