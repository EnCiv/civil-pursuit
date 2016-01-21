'use strict';

import Training           from '../models/training';
import cookieParser       from 'cookie-parser';

function getTraining (cb) {
  try {
    const req = {
      "headers"     :   {
        "cookie"    :   this.request.headers.cookie
      }
    };

    cookieParser()(req, null, () => {});

    const cookie = req.cookies.synapp;

    if ( cookie && cookie.training ) {
      Training
        .find({}, { sort : { step : 1 } })
        .then(
          cb,
          this.error.bind(this)
        );
    }

    else {
      cb([]);
    }
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getTraining;
