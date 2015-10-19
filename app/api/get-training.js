'use strict';

import Training           from '../models/training';
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
      Training
        .find({}, { sort : { step : 1 } })
        .then(
          instructions => {
            this.ok(event, instructions);
          },
          this.error.bind(this)
        );
    }

    else {
      this.ok(event, []);
    }
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getTraining;
