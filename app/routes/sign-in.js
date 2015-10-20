'use strict';

import User        from '../models/user';
import Discussion  from '../models/discussion';

function signIn (req, res, next) {

  try {

    let { email, password } = req.body;

    User
      .identify(email, password)
      .then(
        user => {
          req.user = user;

          Discussion
            .findCurrent()
            .then(
              discussion => {
                try {
                  if ( discussion ) {
                    const alreadyRegistered = discussion.registered.some(registered => registered.equals(user._id))

                    if ( alreadyRegistered ) {
                      return next();
                    }

                    discussion
                      .push('registered', user._id)
                      .save()
                      .then(
                        () => next(),
                        next
                      );
                  }
                  else {
                    next();
                  }
                }
                catch (error) {
                  next(error);
                }
              },
              next
            );

          next();
        },
        error => {
          console.log('error', error)

          if ( /^User not found/.test(error.message) ) {
            res.statusCode = 404;
            res.json({ 'user not found': email });
          }
          else if ( /^Wrong password/.test(error.message) ) {
            res.statusCode = 401;
            res.json({ 'user not found': email });
          }
          else {
            next(error);
          }
        }
      );
  }

  catch ( error ) {
    next(error);
  }
}

export default signIn;
