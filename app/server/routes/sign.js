(function () {

  'use strict';

  function signIn (app, synapp) {
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

  exports.in = signIn;

  function signOut (app, synapp) {
    function middleware (req, res, next) {
      res.clearCookie('synuser');
      res.statusCode = 301;
      res.locals.logResponse();
      res.redirect('/');
    }

    return middleware;
  }

  exports.out = signOut;

  function signUp (app, synapp) {
    
    return (function middleware (req, res, next) {
      
      app.locals.monson.post('/models/User', {
        email: req.body.email,
        password: req.body.password
      },
      
      function (error, created) {
        
        if ( error ) {
          return next(error);
        }
        
        res.cookie('synuser',
          { email: req.body.email, id: created._id },
          synapp.cookie);
        
        res.json(created);
      });
    });
  }

  exports.up = signUp;

}) ();
