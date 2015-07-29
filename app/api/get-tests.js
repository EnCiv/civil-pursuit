'use strict';

import TestModel from '../models/test';

function getTests (event) {
  try {
    TestModel
      .find()
      .exec()
      .then(
        tests => this.ok(event, tests),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getTests;
