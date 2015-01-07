module.exports = (function () {

  'use strict';

  /**  Facebook
   *
   *  @function
   *  @description Route to handle Facebook login
   *  @return {Function} middleware
   *  @arg {Object} app - Express app 
   *  @arg {Object} synapp - Configuration
   *  @arg {Passport} passport
   */

  return (function facebookPassport (app, synapp, passport) {

    var callback_url = synapp.facebook['callback url'];

    var synappUser;
    
    function strategyMiddleware (req, res, next) {

      function onAccessToken (accessToken, refreshToken, profile, done) {

        function associateUser (error, user) {

          if ( error ) {
            return done(error);
          }

          else if ( user ) {
            synappUser = user;

            res.locals.logMessage({ 'facebook user has a synapp account': user.email });

            done(null, user);
          }

          else {
            app.locals.monson.post('models/User',
              { email: email, password: profile.id + Date.now() },
              createUser);
          }
        }

        function createUser (error, user) {
          if ( error ) {
            app.locals.logSystemError(error);

            if ( error.message && /duplicate/.test(error.message) ) {
              return done(new Error('Duplicate user'));
            }
            
            return next(error);
          }

          synappUser = user;
          
          done(null, user);
        }

        res.locals.logMessage({ 'got response from facebook': profile.id });

        var email = profile.id + '@facebook.com';

        app.locals.monson.get('models/User.findOne?email=' + email,
            associateUser);

      }

      if ( ! app.locals.FacebookStrategy ) {
        app.locals.FacebookStrategy = require('passport-facebook').Strategy;

        var callback;

        if ( req.hostname === 'localhost' ) {
          callback = require('util').format("http://%s:%d%s",
            req.hostname, app.get('port'), synapp.facebook['callback url']);
        }

        else {
          callback = require('util').format("http://%s%s",
            req.hostname, synapp.facebook['callback url'])
        }

        passport.use(
          new app.locals.FacebookStrategy({
            clientID:       synapp.facebook['app id'],
            clientSecret:   synapp.facebook['app secret'],
            callbackURL:    synapp.facebook['callback url']
          },
          
          onAccessToken
        ));
      }

      next();
    }

    function callbackMiddleware (req, res, next) {

      function redirect (error, user, info) {
        if ( error ) {
          return next(error);
        }
        app.locals.logSystemMessage({
          user: user,
          info: info,
          reqUser: req.user
        });
        res.redirect('/sign/facebook/ok');
      }

      passport.authenticate('facebook', redirect)(req, res, next);
    }

    function okMiddleware (req, res, next) {
      app.locals.logSystemMessage({ 'ok user': synappUser });

      res.cookie('synuser', {
          email: synappUser.email,
          id: synappUser.id
        }, synapp.cookie);

      res.redirect('/');
    }

    app.get(synapp.public.routes['sign in with Facebook'],
      strategyMiddleware,
      passport.authenticate('facebook'));

    app.get(callback_url, callbackMiddleware);

    app.get(synapp.public.routes['sign in with Facebook OK'], okMiddleware);
  });

})();
