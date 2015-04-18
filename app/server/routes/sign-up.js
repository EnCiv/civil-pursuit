! function () {

  'use strict';

  

  function signUp (req, res, next) {

    require('syn/lib/domain')(next, function (domain) {

      require('syn/models/User')

        .create({
          email       :   req.body.email,
          password    :   req.body.password
        }, domain.bind(function (error, user) {
          
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

        }));

    });
  }

  module.exports = signUp;

} ();
