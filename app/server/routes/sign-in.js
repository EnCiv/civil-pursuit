(function () {

  'use strict';

  function signIn (app) {
    function middleware (req, res, next) {
      app.locals.monson.get(
        '/models/User.identify/' + req.body.email + '/' + req.body.password,
        
        function onIdentify (error, user) {
          if ( error ) {
            return next(error);
          }
          else if ( user ) {
            res.cookie('synuser', { email: user.email, id: user._id }, synapp.cookie);
            res.locals.logResponse();
            res.json({ in: true });
          }
          else {
            next(new Error('No such user'));
          }
        });
    }

    return middleware;
  }

  exports.signIn = sign;

}) ();
