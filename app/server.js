! function () {
  
  'use strict';

  function getConfig (done) {
    require('syn/models/Config')
      .findOne()
      .lean()
      .exec(function (error, config) {
        if ( error ) {
          return done(error);
        }
        httpServer(config, done);
      });
  }

  function httpServer (config, done) {

    if ( ! config ) {
      return getConfig(done);
    }
    
    var http                =   require('http');
    var express             =   require('express');
    var printIt             =   require('syn/lib/util/express-pretty'); 
    var app                 =   express();
    var bodyParser          =   require('body-parser');
    var cookieParser        =   require('cookie-parser');
    var session             =   require('express-session');
    var passport            =   require('passport');
    var EventEmitter        =   require('events').EventEmitter;
    var time                =   require('syn/lib/util/print-time');

    var config              =   require('syn/config.json');
    var User                =   require('syn/models/User');
    var API                 =   require('syn/api');

    /** Routes */

    var renderView          =   require('syn/routes/render-view').bind(app);
    var renderPage          =   require('syn/routes/render-page').bind(app);
    var initPipeLine        =   require('syn/routes/init-pipeline').bind(app);
    var itemRoute           =   require('syn/routes/item').bind(app);
    var TwitterRoute        =   require('syn/routes/twitter').bind(app);
    var FacebookRoute       =   require('syn/routes/facebook').bind(app);
    var DevRoute            =   require('syn/routes/dev').bind(app);
    var SignInRoute         =   require('syn/routes/sign-in');
    var SignUpRoute         =   require('syn/routes/sign-up');
    var SignOutRoute        =   require('syn/routes/sign-out');
    var SetUserCookieRoute  =   require('syn/routes/set-user-cookie');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  APP ARTE
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.arte                =   new EventEmitter()

      .on('error', function (error) {
        console.log(error.stack.split(/\n/));
      })

      .on('message', function (message, info) {
        console.log(time().join(':').cyan, message.cyan.bold,
          JSON.stringify(info || '', null, 2).grey);
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  CONFIGURE APPS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.set('port',              process.env.PORT || 3012);

    if (app.get('env') === 'development') {
      app.locals.pretty = true;
    }

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, done);
    });

    app.use(
      bodyParser.urlencoded({ extended: true }),
      
      bodyParser.json(),
      
      bodyParser.text(),
      
      cookieParser(),
      
      session({
        secret:             config.secret,
        resave:             true,
        saveUninitialized:  true
      }),
      
      passport.initialize(),
      
      initPipeLine
    );

    TwitterRoute(config, passport);

    FacebookRoute(config, passport);

    if ( app.get('env') === 'development' ) {
      app.get(['/dev/', '/dev/View/:view'], DevRoute, renderPage);
    }

    app

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  LANDING PAGE
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .get('/', renderPage)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  PAGE
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .get('/page/:page', renderPage)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  VIEW
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .get('/views/:component', renderView)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  ITEM PAGE
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .get('/item/:item_short_id/:item_slug', itemRoute, renderPage)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  PROFILE
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .get('/profile', function getPage (req, res, next) {
        res.locals.page = 'profile';
        res.superRender('pages/profile.jade');
      })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  SIGN IN
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .all('/sign/in',
        SignInRoute,
        SetUserCookieRoute,
        function (req, res) {
          res.json({
            in: true,
            id: req.user._id
          });
        })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  SIGN UP
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .all('/sign/up', 
        SignUpRoute,
        SetUserCookieRoute,
        function (req, res) {
          res.json({
            up: true,
            id: req.user._id
          });
        })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  SIGN OUT
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .all('/sign/out', SignOutRoute)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  DIST
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .use(
        express.static('app/dist'))

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  ROUTE ERROR
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .use(function onRouteError (err, req, res, next) {
        console.log('error', err.stack.split(/\n/));
        app.arte.emit('error', err);
      })

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //  NOT FOUND
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      .use(
        
        function notFound (req, res, next) {
          res.status(404);
          req.page = 'NotFound';
          next();
        },

        renderPage)

    var server = http.createServer(app);

    server.listen(app.get('port'), function () {
      app.arte.emit('message', 'Server is listening', {
        port    :   app.get('port'),
        env     :   app.get('env')
      });
      API(app, server);
    });
  }

  module.exports = httpServer;

} ();
