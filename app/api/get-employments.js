'use strict';

import Employment from '../models/employment';

function getEmployments (event) {
  try {
    Employment
      .find()
      .then(
        employments => {
          try {
            this.ok(event, employments);
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

export default getEmployments;
