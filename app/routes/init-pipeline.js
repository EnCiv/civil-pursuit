'use strict';

import { Domain } from 'domain';

function initPipeLine (req, res, next) {

  try {
    req.user = req.cookies.synuser;

    if ( typeof req.user === 'string' ) {
      req.user = JSON.parse(req.user);
    }

    this.emit('request', req);

    // Forcing item
    require('../models/item');

    next();
  }

  catch ( error ) {
    next(error);
  }

}

export default initPipeLine;
