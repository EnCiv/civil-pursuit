'use strict';

import User            from '../models/user';
import Discussion      from '../models/discussion';

function signUp (req, res, next) {

  try {

    const { email, password } = req.body;

    console.log({ email, password });

    if ( ! email ) {
      res.statusCode = 400;
      res.json({ error: 'Missing email' });
    }

    else if ( ! password ) {
      res.statusCode = 400;
      res.json({ error: 'Missing password' });
    }

    else {
      User
        .create({ email, password })
        .then(
          user => {
            try {
              req.user = user;

              Discussion
                .findCurrent()
                .then(
                  discussion => {
                    try {
                      if ( ! discussion ) {
                        return next();
                      }

                      discussion
                        .push('registered', user)
                        .save()
                        .then(() => next(), next);
                    }
                    catch ( error ) {
                      next(error);
                    }
                  },
                  next
                );

            }
            catch ( error ) {
              next(error);
            }
          },
          error => {
            if ( /duplicate key/.test(error.message) ) {
              res.statusCode = 401;
              res.json({ error: `Email ${email} already in use`, message : error.message });
            }
            else {
              next(error);
            }
          }
        );
    }
  }

  catch ( error ) {
    next(error);
  }

}

export default signUp;
