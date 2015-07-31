'use strict';

import { Domain }           from 'domain';
import UserModel            from '../models/user';
import DiscussionModel      from '../models/discussion';

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
      .create({ email, password }, d.bind((error, user) => {
        if ( error ) {
          return cb(error);
        }
        DiscussionModel
          .findOne()
          .exec()
          .then(
            discussion => {
              try {
                discussion.registered.push(user._id);
                discussion.save(error => {
                  if ( error ) {
                    cb(error);
                  }
                  cb(null, user);
                });
              }
              catch ( error ) {
                cb(error);
              }
            },
            cb
          );
      }));
  }

  catch ( error ) {
    next(error);
  }

}

export default signUp;
