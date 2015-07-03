'use strict';

import { Domain }   from 'domain';
import UserModel    from 'syn/models/user';

function signUp (req, res, next) {

  try {

    let { email, password } = req.body;

    let d = new Domain().on('error', next);

    let cb = (error, user) => {
      if ( error ) {
        if ( /duplicate key/.test(error.message) ) {
          res.statusCode = 401;
          res.json({ error: 'username exists' });
        }
        else {
          next(error);
        }
      }

      else {
        req.user = user;

        next();
      }
    }

    UserModel
      .create({ email, password }, d.bind(cb));
  }
  
  catch ( error ) {
    next(error);
  }

}

export default signUp;
