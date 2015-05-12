! function () {

  'use strict';

  function signUp (req, res, next) {

    var domainRun = require('syn/lib/util/domain-run');
    var User = require('syn/models/User');

    domainRun(function (domain) {

      User
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

    }, next);
  }

  module.exports = signUp;

} ();
