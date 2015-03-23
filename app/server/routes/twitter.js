! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function twitterMiddlewares (synapp, passport) {

    var app = this;

    var email;

    var callback_url = synapp.twitter[process.env.SYNAPP_ENV]['callback url'];

    var synappUser;

    var User = src('models/User');

    /**  Define strategy
     *
     *  @function
     *  @description Define the passport strategy for Twitter
     *  @return void{}
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Call next() middleware in stack 
     */

    function strategyMiddleware (req, res, next) {

      /**  On Access Token
       *
       *  @function
       *  @description Behavior to be triggered upon receiving access token from Twitter
       *  @return void
       *  @arg {Object} accessToken -  
       *  @arg {Object} refreshToken -  
       *  @arg {Object} profile -  
       *  @arg {Function} done -  
       */

      function onAccessToken (accessToken, refreshToken, profile, done) {

        /**  Associate User
         *
         *  @function
         *  @description Associate Twitter account with Synapp account
         *  @return void{}
         *  @arg {Error} error - Eventual error 
         *  @arg {Object} user - Eventual found user 
         */

        function associateUser (error, user) {

          if ( error ) {
            return done(error);
          }

          else if ( user ) {
            synappUser = user;

            done(null, user);
          }

          else {
            User
              .create({ email: email, password: profile.id + Date.now() },
                createUser);
          }
        }

        /**  Create User
         *
         *  @function
         *  @description Create user if there is no associated account
         *  @return void
         *  @arg {Error} error - Eventual error 
         *  @arg {Object} user - Eventual found user 
         */

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

        /**  Main
         *
         *  @function
         *  @description Main function
         *  @return void
         */

        function main () {
          email = profile.id + '@twitter.com';

          User.findOne({ email: email }, associateUser);
        }

        main();
      }

      function main () {
        if ( ! app.locals.TwitterStrategy ) {
          app.locals.TwitterStrategy = require('passport-twitter').Strategy;

          var callback;

          if ( req.hostname === 'localhost' ) {
            callback = require('util').format("http://%s:%d%s",
              req.hostname, app.get('port'), synapp.twitter[process.env.SYNAPP_ENV]['callback url']);
          }

          else {
            callback = require('util').format("http://%s%s",
              req.hostname, synapp.twitter[process.env.SYNAPP_ENV]['callback url'])
          }

          passport.use(
            new app.locals.TwitterStrategy({
              consumerKey:       synapp.twitter[process.env.SYNAPP_ENV]['key'],
              consumerSecret:   synapp.twitter[process.env.SYNAPP_ENV]['secret'],
              callbackURL:    callback
            },
            
            onAccessToken
          ));
        }

        next();
      }

      main();
    }

    /**  Callback middleware
     *
     *  @function
     *  @description The callback middleware
     *  @return void
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Call next() middleware in stack  
     */

    function callbackMiddleware (req, res, next) {
      /**  Redirect middleware
       *
       *  @function
       *  @description Previous to last middleware, redirect to OK
       *  @return void
       *  @arg {Error} error? - Eventual error
       *  @arg {Object} user? - Eventual user
       *  @arg {Object} info? - Eventual user info
       */

      function redirectMiddleware (error, user, info) {
        if ( error ) {
          return next(error);
        }

        res.redirect('/sign/twitter/ok');
      }

      function main () {
        passport.authenticate('twitter', redirectMiddleware)(req, res, next);
      }

      main();
    }

    /**  OK Middleware
     *
     *  @function
     *  @description Last middleware, the OK Middleware
     *  @return void
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Call next() middleware in stack 
     */

    function okMiddleware (req, res, next) {

      res.cookie('synuser', {
          email: synappUser.email,
          id: synappUser.id
        }, synapp.cookie);

      res.redirect('/');
    }

    /**  Apply routes
     *
     *  @function
     *  @description Attach routes to Express app
     *  @return void{}
     */

    function applyRoutes () {
      app.get(synapp.public.routes['sign in with Twitter'],
        strategyMiddleware,
        passport.authenticate('twitter'));

      app.get(callback_url, callbackMiddleware);

      app.get(synapp.public.routes['sign in with Twitter OK'], okMiddleware);
    }

    /** Apply routes */

    applyRoutes();
  
  }

  module.exports = twitterMiddlewares;

} ();
