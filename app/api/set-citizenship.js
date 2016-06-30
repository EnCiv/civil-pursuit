'use strict';

import User from '../models/user';

function setCitizenship (event, countryId, position) {
  console.info("setCitizenship:", event, countryId, position);
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
                this.error.bind(this),
                console.info("setCitizenship completed.")
              );
          }
          catch ( error ) {
            this.error(error);
            console.info("setCitizenship error 24");
          }
        },
        error => { this.error(error);
                    console.info("setCitizenship error 28"); 
                }
      );
  }
  catch ( error ) {
    this.error(error);
    console.info("setCitizenship error 34");
  }
}

export default setCitizenship;
