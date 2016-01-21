'use strict';

import Education from '../models/education';

function getEducations (cb) {
  Education.find().then(cb).catch(this.error.bind(this));
}

export default getEducations;
