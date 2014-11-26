module.exports = function (app, synapp, SynappError, passport) {
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
          console.log('Got response from Facebook');

          var email = profile.id + '@facebook.com';

          var User = require('../../business/models/User');

          User.findOne({ email: email }, function (error, user) {
            if ( error ) {
              console.error('Something bad happened while looking for user', error.format()); 

              return done(error);
            }

            if ( user ) {
              req.session.email =   email;
              req.session.id    =   user._id;

              console.log('User found');

              return done(null, user);
            }

            User.create({ email: email, password: profile.id + Date.now() },
              function (error, user) {
                if ( error ) {
                  console.error('Could not sign up user', error.format());

                  if ( error.message && /duplicate/.test(error.message) ) {
                    return done(SynappError.DuplicateUser());
                  }
                  
                  return next(error);
                }

                req.session.email   =   email;
                req.session.id      =   user._id;

                console.log('User created', user);
                
                done(null, user);

              });
          });
        }
      ));
    }

    next();
  };
};
