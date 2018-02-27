'use strict';

import User from '../models/user';

function setCitizenship ( countryId, position, cb) {
  try {
    User
      .findById(this.synuser.id)
      .then(
        user  => {
          try {
            user
              .setCitizenship(position, countryId)
              .save()
              .then(
                this.ok.bind(this, cb),
                this.error.bind(this)
              );
          }
          catch ( error ) {
            this.error(error);
            console.error("setCitizenship error 24");
          }
        },
        error => { this.error(error);
                    console.error("setCitizenship error 28"); 
                }
      );
  }
  catch ( error ) {
    this.error(error);
    console.errof("setCitizenship error 34");
  }
}

export default setCitizenship;
