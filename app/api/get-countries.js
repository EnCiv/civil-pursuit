'use strict';

import CountryModel from '../models/country';

function getCountries (event) {
  try {
    CountryModel
      .find()
      .lean()
      .exec()
      .then(
        countries => {
          try {
            this.ok(event, countries);
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

export default getCountries;
