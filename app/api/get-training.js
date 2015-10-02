'use strict';

import TrainingModel      from '../models/training';
import cookieParser       from 'cookie-parser';

function getTraining (event) {
  try {
    const req = {
      "headers"     :   {
        "cookie"    :   this.request.headers.cookie
      }
    };

    cookieParser()(req, null, () => {});

    const cookie = req.cookies.synapp;

    if ( cookie.training ) {
      this.ok(event, []);
    }

    else {
      TrainingModel
        .find()
        .sort({ step : 1 })
        .exec()
        .then(
          instructions => {
            this.ok(event, instructions);
          },
          this.error.bind(this)
        );
    }
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getTraining;
