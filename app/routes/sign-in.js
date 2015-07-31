'use strict';

import UserModel        from '../models/user';
import DiscussionModel  from '../models/discussion';

function signIn (req, res, next) {

  try {

    let { email, password } = req.body;

    UserModel
      .identify(email, password)
      .then(
        user => {
          req.user = user;

          DiscussionModel
            .findOne()
            .exec()
            .then(
              discussion => {
                try {
                  if ( discussion.registered.some(registered => registered.equals(user._id)) ) {
                    next();
                  }

                  discussion.registered.push(user._id);

                  discussion.save(error => {
                    if ( error ) {
                      return next(error);
                    }
                    next();
                  });
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
