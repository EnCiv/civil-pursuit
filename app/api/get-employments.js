'use strict';

import Employment from '../models/employment';

function getEmployments (cb) {
  Employment.find().then(cb).catch(this.error.bind(this));
}

export default getEmployments;
