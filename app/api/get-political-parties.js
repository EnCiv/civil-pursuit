'use strict';

import PoliticalParty from '../models/political-party';

function getPoliticalParties (event) {
  try {
    PoliticalParty
      .find()
      .then(
        politicalParties => {
          try {
            this.ok(event, politicalParties);
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

export default getPoliticalParties;
