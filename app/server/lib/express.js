/**
 * Provides the base Widget class...
 *
 * @module widget
 */

require('colors');

module.exports = function synappExpress (listen, isTest) {

  'use strict';

  /** */

  var app;

  /** HTTP server */

  var server;

  /** Dependencies */

  var format          =   require('util').format;

  var path            =   require('path');

  var domain          =   require('domain').create();

  var SynappError     =   require('./error');

  var express         =   require('express');

  function logSystemMessage (message) {
    var d = new Date();

    console.log(
      ('[' + d.getHours() + ':' + d.getMinutes() +']').grey,
      '*'.magenta.bold,
      'system'.grey,
      message);
  }

  /** Domain */

  domain.on('error', function (error) {
    logSystemMessage({ error: {
      message: error.message,
      name: error.name,
      stack: error.stack.split(/\n/)
    }});
  });

  domain.run(function () {

    /** Environment variables */

    process.env.SYNAPP_PATH = require('path').resolve(__dirname, '../../..');

    var synapp = require(path.join(process.env.SYNAPP_PATH,
      'app/business/config.json'));

    process.env.CLOUDINARY_URL = synapp.cloudinary.url;

    /** Express */

    app = express();

    /** Middlewares */

    var cookieParser  =   require('cookie-parser');

    var bodyParser    =   require('body-parser');

    var multipart     =   require('connect-multiparty');

    var serveFavicon  =   require('serve-favicon');

    var flash         =   require('connect-flash');

    var session       =   require('express-session');

    var passport      =   require('passport');

    var monson        =   require('monson')(
      isTest ? process.env.MONGOHQ_URL_TEST : process.env.MONGOHQ_URL,
      { base: path.join(__dirname, '../../business') });

    var staticRouter  =   require('../routes/static');

    /** Parsers */

    // parse application/x-www-form-urlencoded
    
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    
    app.use(bodyParser.json());

    // multi-parts
    
    app.use(multipart({
      uploadDir: synapp.tmp
    }));

    // accept plain text

    app.use(function (req, res, next){
      if ( req.is('text/*') ) {
        req.body = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) { req.body += chunk });
        req.on('end', next);
      } else {
        next();
      }
    });

    /** Express app settings */

    var config = {
      'view engine'   :   'jade',
      'views'         :   path.join(process.env.SYNAPP_PATH, 'app/web/views'),
      'port'          :   +process.env.PORT || 3012
    };

    for ( var middleware in config ) {
      app.set(middleware, config[middleware]);
    }

    /** Express app locals */

    if ( app.get('env') === 'development' ) {
      app.locals.pretty = true;
    }

    app.locals.synapp = synapp;

    app.locals.back = '/';

    app.locals.monson = monson;

    app.locals.logSystemMessage = logSystemMessage;

    /** Cookies */

    app.locals.secret = synapp.secret;

    app.use(cookieParser(app.locals.secret));

    app.get('/test22', function (req, res, next) {
      res.json({
        request: {
          cookies: req.signedCookies
        }
      });
    });

    /** Session */

    app.use(session({
      secret: synapp.secret, resave: true, saveUninitialized: true }));

    /** Passport */

    app.use(passport.initialize());
    app.use(flash());

    passport.serializeUser(function(user, done) {
      logSystemMessage({ 'serializing user': user.email });

      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    /** Pre router */

    app.use(require('../routes/pre-router'));

    /** Favicon */

    app.use(serveFavicon(path.join(path.dirname(__dirname),
      '../web/images/favicon.png')));

    /** Routes */

    var mustBeIn = require('../routes/must-be-in');

    /** ENTRY POINTS */

    /** TERMS OF SERVICE */

    app.get('/terms-of-service', function route_termsOfService (req, res) {
      res.render('pages/terms-of-service');
    });

    /** NAVIGATOR */

    app.get('/', function route_navigator (req, res) {

      var extra = {};

      if ( req.query.failed ) {
        switch ( req.query.failed ) {
          case 'nodup':
            extra.signUpDuplicateError = true; 
            break;
        }
      }

      res.render('pages/navigator', extra);

      res.locals.logResponse();
    });

    ////////////////////////////////////////////////////////////////////////////
    
    // v0.4
    
    ////////////////////////////////////////////////////////////////////////////

    app.get('/v0.4', function route_navigator (req, res) {

      var extra = {};

      if ( req.query.failed ) {
        switch ( req.query.failed ) {
          case 'nodup':
            extra.signUpDuplicateError = true; 
            break;
        }
      }

      res.render('pages/v04', extra);
    });

    /**  ACCESS POINTS */

    /** PARTIALS */

    app.get('/templates/:template', function (req, res, next) {
      res.render('templates/' + req.params.template);

      res.locals.logResponse();
    });

    /** SIGN OUT */

    app.all('/sign/up', require('../routes/sign').up(app, synapp));

    /** SIGN IN */

    app.all('/sign/in', require('../routes/sign').in(app, synapp));

    /** SIGN OUT */

    app.all('/sign/out', require('../routes/sign').out(app, synapp));

    /** MONSON API */

    app.use('/models/:model',
      require('../routes/api')(),
      monson.express);

    /** UPLOAD IMAGE */

    app.all('/tools/upload', require('../routes/upload'));

    /** GET URL TITLE */

    app.post('/tools/get-title', require('../routes/get-title'));

    /** FACEBOOK AUTH */

    (function facebook () {
      app.get('/auth/facebook',
        require('../routes/facebook')(app, synapp, SynappError, passport),
        passport.authenticate('facebook'));

      app.get(synapp.facebook['callback url'],
        passport.authenticate('facebook', {
          successRedirect: '/fb/ok',
          failureRedirect: '/?fb=ko'
        }));

      app.get('/fb/ok', function (req, res) {
        res.cookie('synuser', { email: req.session.email, id: req.session.userid }, synapp.cookie);

        // Log.INFO('Cookie set', req.session);

        res.redirect('/');
      });
    }) ();

    /** TWITTER AUTH */

    require('../routes/twitter')(app, synapp, SynappError, passport);

    /** DUMP DATABASE */

    app.all('/tools/dump', require('../routes/dump'));

    /** MIDDLEWARES */

    /** STATIC ROUTER */

    var static_routes = {
      '/bower/': 'app/web/bower_components', 
      '/dist/': 'app/web/dist', 
      '/images/': 'app/web/images',
      '/js/': 'app/web/angular'
    };

    for ( var static_route in static_routes ) {
      app.use(static_route,

        staticRouter(static_routes[static_route]),

        express.static(path.join(process.env.SYNAPP_PATH,
          static_routes[static_route]))
      );
    }

    /** ERROR */

    app.use(require('../routes/error')(app));

    /** NOT FOUND */

    app.use(require('../routes/not-found')(app));

    /** SERVER */

    server = require('http').createServer(app);

    if ( listen ) {
  
      /** LISTEN */

      server.listen(app.get('port'), function () {
        logSystemMessage({
          'http server': {
            'is listening on port': app.get('port'),
            env: app.get('env')
          }
        });
      });

      /** SERVER ERROR */

      server.on('error', function (error) {
        console.error(error.format());
      });

      /** SOCKET IO */

      require('./io')(server, app);

      domain.add(server);
    }
  });

  return { app: app, server: server };
};
