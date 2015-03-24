#!/usr/bin/env node
! function () {
  
  'use strict';

  require('colors');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var src = require(require('path').join(process.cwd(), 'src'));

  src('models/Config')
    .findOne()
    .lean()
    .exec(function (error, config) {
      
      if ( error ) {
        throw error;
      }

      var express = require('express');
      var app = express();
      var bodyParser = require('body-parser');
      var cookieParser = require('cookie-parser');
      var session = require('express-session');
      var passport = require('passport');
      // var cache = require('express-redis-cache')();

      ! function emitter () {

        app.arte = new (require('events').EventEmitter)();

        app.arte.on('error', function (error) {
          console.log(error.stack.split(/\n/));
        });

        app.arte.on('message', function (message) {
          console.log(message);
        });

        app.arte.on('request', function (req) {

          var d = new Date();

          var hours = d.getHours();

          if ( hours < 10 ) {
            hours = '0' + hours;
          }

          var minutes = d.getMinutes();

          if ( minutes < 10 ) {
            minutes = '0' + minutes;
          }

          var seconds = d.getMinutes();

          if ( seconds < 10 ) {
            seconds = '0' + seconds;
          }

          var user = 'visitor'.magenta;

          if ( req.cookies && req.cookies.synuser ) {
            var isIn = req.cookies.synuser;

            if ( typeof isIn === 'string' ) {
              isIn = JSON.parse(isIn);
            }

            user = isIn.email.blue;
          }

          console.log([hours, minutes, seconds].join(':').cyan, user, '...'.grey, req.method.grey, req.url.grey);
        });

        app.arte.on('response', function (res) {

          var d = new Date();

          var hours = d.getHours();

          if ( hours < 10 ) {
            hours = '0' + hours;
          }

          var minutes = d.getMinutes();

          if ( minutes < 10 ) {
            minutes = '0' + minutes;
          }

          var seconds = d.getMinutes();

          if ( seconds < 10 ) {
            seconds = '0' + seconds;
          }

          var user = 'visitor'.magenta;

          if ( res.req.cookies && res.req.cookies.synuser ) {
            var isIn = res.req.cookies.synuser;

            if ( typeof isIn === 'string' ) {
              isIn = JSON.parse(isIn);
            }

            user = isIn.email.blue;
          }

          var color = 'grey';

          if ( res.statusCode.toString().substr(0, 1) === '3' ) {
            color = 'cyan';
          }

          else if ( res.statusCode.toString().substr(0, 1) === '4' ) {
            color = 'yellow';
          }

          console.log([hours, minutes, seconds].join(':').cyan, user, res.statusCode.toString()[color], res.req.method[color], res.req.url[color]);
        });

      } ();

      ! function configureApp () {

        app.set('port', process.env.PORT || 3012);
        app.set('view engine', 'jade');
        app.set('views', 'app/web/views');

        if (app.get('env') === 'development') {
          app.locals.pretty = true;
        }

      } ();

      ! function usePassport () {

        passport.serializeUser(function(user, done) {
          done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
          src('models/User').findById(id, done);
        });

      } ();

      ! function routesAndMiddlewares () {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.text());

        app

          /**   Cookies   */

          .use(
            // cookieParser(src('config').secret))
            cookieParser())

          /**   Session   */

          .use(
            session({
              secret:             src('config').secret,
              resave:             true,
              saveUninitialized:  true
            }))

          /**   Passport  */

          .use(passport.initialize())

          .use(function initPipeLine (req, res, next) {

            src.domain(next, function (domain) {
              req.user            =   req.cookies.synuser;

              if ( typeof req.user === 'string' ) {
                req.user = JSON.parse(req.user);
              }

              res.locals.req      =   req;
              res.locals.synapp   =   src('config');
              res.locals.config   =   config;
              res.locals.protocol =   process.env.SYNAPP_PROTOCOL || 'http';
              res.locals.package  =   src('package.json');

              res.superRender     =   function superRender (tpl, options) {
                res.render(tpl, options);
                app.arte.emit('response', res);
              };

              app.arte.emit('request', req);

              console.log('user', req.user)

              next();
            });

          });

        ! function thirdParties () {

          require('../routes/twitter').apply(app, [src('config'), passport]);
          require('../routes/facebook').apply(app, [src('config'), passport]);

        } ();

        app

          .get('/',
            // cache.route('synapp:homepage', (1000 * 60 * 60)),
            function landingPage (req, res, next) {
              res.superRender('pages/index.jade')
            })

          .get('/partial/:partial', function getPartial (req, res, next) {
            res.superRender('partials/' + req.params.partial);
          })

          .get('/page/:page', function getPage (req, res, next) {
            res.locals.page = req.params.page || 'index';
            res.superRender('pages/' + req.params.page + '.jade');
          })

          /** Item's page */

          .get('/item/:item_id/:item_slug',
            require('../routes/item'),
            function renderItem (req, res, next) {
              res.superRender('pages/item.jade');
            })

          .all('/sign/in', require('../routes/sign-in'))

          .all('/sign/up', require('../routes/sign-up'))

          .all('/sign/out', require('../routes/sign-out'))

          .use(express.static('app/web/dist'))

          .use(function onRouteError (err, req, res, next) {
            console.log('error', err.stack.split(/\n/));
            app.arte.emit('error', err);
          })

          .use(function notFound (req, res, next) {
            res.status(404);
            res.superRender('pages/not-found.jade');
          })

        ;

      } ();

      
      ! function startServer () {

        var server;

        if ( process.env.SYNAPP_PROTOCOL === 'https' ) {
          if ( app.get('env') === 'development' ) {
            var hskey = require('fs').readFileSync(require('path').join(process.cwd(), 'synaccord-key.pem'));
            var hscert = require('fs').readFileSync(require('path').join(process.cwd(), 'synaccord-cert.pem'));

            var options = {
              key: hskey,
              cert: hscert
            };

            server = require('https').createServer(options, app);
          }
        }

        else {
          server = require('http').createServer(app);
        }

        server.listen(app.get('port'), function () {
          console.log("Server is listening on port: " + app.get('port'));
          src('io')(app, server);
        });

      } ();

    });

} ();
