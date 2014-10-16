module.exports = function (app, synapp, Log, SynappError, passport) {
  return function (req, res, next) {
    if ( ! app.locals.FacebookStrategy ) {
      app.locals.FacebookStrategy = require('passport-facebook').Strategy;

      var callback;

      if ( req.hostname === 'localhost' ) {
        callback = require('util').format("http://%s:%d%s",
          req.hostname, app.get('port'), synapp.facebook['callback url']);
      }

      else {
        callback = require('util').format("http://%s%s",
          req.hostname, synapp.facebook['callback url']);
      }

      passport.use(
        new app.locals.FacebookStrategy({
          clientID:       synapp.facebook['app id'],
          clientSecret:   synapp.facebook['app secret'],
          callbackURL:    callback
        },
        
        function (accessToken, refreshToken, profile, done) {
          Log.OK('Got response from Facebook');

          var email = profile.id + '@facebook.com';

          var User = require('../models/User');

          User.findOne({ email: email }, function (error, user) {
            if ( error ) {
              Log.KO('Something bad happened while looking for user', error.format()); 

              return done(error);
            }

            if ( user ) {
              req.session.email =   email;
              req.session.id    =   user._id;

              Log.OK('User found');

              return done(null, user);
            }

            User.create({ email: email, password: profile.id + Date.now() },
              function (error, user) {
                if ( error ) {
                  Log.KO('Could not sign up user', error.format());

                  if ( error.message && /duplicate/.test(error.message) ) {
                    return done(SynappError.DuplicateUser());
                  }
                  
                  return next(error);
                }

                req.session.email   =   email;
                req.session.id      =   user._id;

                Log.OK('User created', user);
                
                done(null, user);

              });
          });
        }
      ));
    }

    next();
  };
};
