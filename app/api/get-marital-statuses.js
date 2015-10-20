'use strict';

import MaritalStatus from '../models/marital-status';

function getMaritalStatuses (event) {
  try {
    MaritalStatus
      .find()
      .then(
        MaritalStatuses => {
          try {
            this.ok(event, MaritalStatuses);
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

export default getMaritalStatuses;
