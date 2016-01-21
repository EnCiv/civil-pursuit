'use strict';

import Country from '../models/country';

function getCountries (cb) {
  Country.find().limit(false)
    .then(cb)
    .catch(this.error.bind(this));
}

export default getCountries;
