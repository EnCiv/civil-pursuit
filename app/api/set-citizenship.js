'use strict';

import User from '../models/user';

function setCitizenship (event, countryId, position) {
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
                this.ok.bind(this, event),
                this.error.bind(this)
              );
          }
          catch ( error ) {
            this.error(error);
          }
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setCitizenship;
