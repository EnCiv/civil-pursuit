'use strict';

import MaritalStatus from '../models/marital-status';

function getMaritalStatuses (cb) {
  MaritalStatus.find().then(cb).catch(this.error.bind(this));
}

export default getMaritalStatuses;
