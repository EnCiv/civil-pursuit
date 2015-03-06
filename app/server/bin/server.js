#!/usr/bin/env node
! function () {
  
  'use strict';

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var src         =   require(require('path').join(process.cwd(), 'src'));

  var pronto      =   require('prontojs');

  var when        =   pronto.when;

  src('models/Config')
    .find()
    .lean()
    .exec(function (error, config) {
      if ( error ) {
        throw error;
      }

      var server = pronto();

      server.inject('synapp', src('config'));

      server.inject('config', config[0]);

      server.on('listening', function (service) {
        src('io')(server);
      })

      server.on('error', function (error) {
        console.log('erroooooooooor', error);
      });

      ! function _cookies () {
        server.cookie(src('config').secret);

        server.app.use(require('cookie-parser')(src('config').secret));
      }();

      ! function _session () {
        var session       =   require('express-session');

        server.app.use(session({
          secret:             src('config').secret,
          resave:             true,
          saveUninitialized:  true
        }));
      }();

      ! function _passport () {
        var passport    =   require('passport');
        
        server.open(passport.initialize());

        passport.serializeUser(function(user, done) {
          done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
          src('models/User').findById(id, done);
        });

        ! function _twitter () {
          require('../routes/twitter')(server.app, src('config'), passport);
        }();

        ! function _facebook () {
          require('../routes/facebook')(server.app, src('config'), passport);
        }();
      }();

      ! function _initPipeLine () {
        server.open(function synMiddleware_preRouter (req, res, next) {
          req.user = req.signedCookies.synuser;
          next();
        }, when('/*'));
      }();

      src('server/lib/routes')(server);

    });

} ();
