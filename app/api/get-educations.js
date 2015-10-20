'use strict';

import Education from '../models/education';

function getEducations (event) {
  try {
    Education
      .find()
      .then(
        educations => {
          try {
            this.ok(event, educations);
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

export default getEducations;
