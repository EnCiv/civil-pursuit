'use strict';

import User        from '../../models/user';
import Discussion  from '../../models/discussion';

function signIn (req, res, next) {

  logger.info({signIn: req.body});

  try {

    let { email, password, facebook } = req.body;

    if ( facebook ) {
      password = facebook + 'synapp';
    }

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
        .identify(email, password)
        .then(
          user => {
            req.user = user.toJSON();
            //onsole.info("sign-in user",user);

            // were we passed updated info in the signin
            var p1=new Promise((ok,ko)=>{
              var newInfo=Object.assign({},req.body);
              delete newInfo.email;
              delete newInfo.password;
              delete newInfo.facebook;
              if(Object.keys(newInfo).length) {
              // yes, newInfo
                User
                  .updateById(user._id, newInfo)
                  .then(
                    user => ok(user),
                    error => ko(error)
                  );
              } else ok(user);
            })
            .then(user=>{
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
                )
            }, next);
          },
          error => {
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
  }

  catch ( error ) {
    next(error);
  }
}

export default signIn;
