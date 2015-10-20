'use strict';

import StateModel from '../models/state';

function getStates (event) {
  try {
    StateModel
      .find({}, { limit : false })
      .then(
        states => {
          try {
            this.ok(event, states);
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

export default getStates;
