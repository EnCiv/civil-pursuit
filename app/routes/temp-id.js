'use strict';

import User            from '../models/user';
import Discussion      from '../models/discussion';

function tempId (req, res, next) {

  try {

    let { email, password, facebook } = req.body;

    logger.info({signUp: req.body});

    //console.info("sign-up", { email, password, facebook });
    //console.info("sign-up detail", req, res);

    if ( facebook ) {
      password = facebook + 'synapp';
    }

    /**
    if ( ! email ) {
      res.statusCode = 400;
      res.json({ error: 'Missing email' });
    }

    else if ( ! password ) {
      res.statusCode = 400;
      res.json({ error: 'Missing password' });
    }

    else */
    if(true) {
      User
        .create(req.body)
        .then(
          user => {
            try {
              req.user = user;
              if(!user.email) {
                req.tempid=password; // in temp login, the password is a key that will be stored in the browsers cookie.  
                return next();
              }

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

export default tempId;
