'use strict';

import Race from '../models/race';

function getRaces (event) {
  try {
    Race
      .find()
      .then(
        races => {
          try {
            this.ok(event, races);
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

export default getRaces;
