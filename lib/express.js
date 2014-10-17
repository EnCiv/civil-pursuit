/**
 * Provides the base Widget class...
 *
 * @module widget
 */

module.exports = function synappExpress (listen) {
  var app, server;

  /** *******************************************************************************************  **/
  /** Process
  /** *******************************************************************************************  **/

  process.title = 'synapphtml5';

  /** *******************************************************************************************  **/
  /** Dependencies
  /** *******************************************************************************************  **/

  var format          =   require('util').format;

  var path            =   require('path');

  var Log             =   require('String-alert')({ prefix: 'synapp' });

  var domain          =   require('domain').create();

  var SynappError     =   require('../lib/error');

  /** *******************************************************************************************  **/
  /** Domain
  /** *******************************************************************************************  **/

  domain.on('error', function (error) {
    Log.ERROR(error.message, error.format());
  });

  domain.run(function () {

    /** *****************************************************************************************  **/
    /** Config
    /** *****************************************************************************************  **/

    var synapp = require('../config/config.json');

    process.env.CLOUDINARY_URL = synapp.cloudinary.url;

    /** *****************************************************************************************  **/
    /** Express
    /** *****************************************************************************************  **/

    var express = require('express');

    app = express();

    /** *****************************************************************************************  **/
    /** Middlewares
    /** *****************************************************************************************  **/

    var cookieParser  =   require('cookie-parser');

    var bodyParser    =   require('body-parser');

    var multipart     =   require('connect-multiparty');

    var serveFavicon  =   require('serve-favicon');

    var flash         =   require('connect-flash');

    var session       =   require('express-session');

    var passport      =   require('passport');

    /** *****************************************************************************************  **/
    /** Parsers
    /** *****************************************************************************************  **/

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

    /** *****************************************************************************************  **/
    /** Express settings
    /** *****************************************************************************************  **/

    var config = {
      'view engine'   :   'jade',
      'views'         :   'views',
      'port'          :   process.env.PORT || 3012
    };

    for ( var middleware in config ) {
      app.set(middleware, config[middleware]);
    }

    /** *****************************************************************************************  **/
    /** Locals
    /** *****************************************************************************************  **/

    app.locals.pretty = true;

    app.locals.synapp = synapp;

    app.locals.back = '/';

    /** *****************************************************************************************  **/
    /** Cookies
    /** *****************************************************************************************  **/

    app.locals.secret = synapp.secret;

    app.use(cookieParser(app.locals.secret));

    /** *****************************************************************************************  **/
    /** Session
    /** *****************************************************************************************  **/

    app.use(session({ secret: synapp.secret, resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(flash());

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    /** *****************************************************************************************  **/
    /** Pre middleware
    /** *****************************************************************************************  **/

    app.use(function (req, res, next) {
      res.locals.req = req;

      res.locals.isSignedIn = req.signedCookies.synuser;

      if ( res.locals.isSignedIn ) {

        if ( ! req.signedCookies.synuser.id ) {
          res.clearCookie('synuser');
          res.locals.isSignedIn = false;
        }

        else {
          res.locals.email  = req.signedCookies.synuser.email;
          res.locals._id    = req.signedCookies.synuser.id;
        }
      }

      if ( req.session ) {
        console.log('yes session', req.session, req.signedCookies.syn_sid);
      }

      next();
    });

    /** *****************************************************************************************  **/
    /** Logger
    /** *****************************************************************************************  **/

    app.use(function (req, res, next) {
      var LOG = 'INFO';

      switch ( res.statusCode ) {
        case 200:
          LOG = 'SUCCESS';
          break;
      }

      Log[LOG](format('[%s] %d %s %s',
        req.signedCookies.synuser ? req.signedCookies.synuser.email : 'visitor',
        res.statusCode, req.method, req.url));

      next();
    });

    /** *****************************************************************************************  **/
    /** Favicon
    /** *****************************************************************************************  **/

    app.use(serveFavicon(path.join(path.dirname(__dirname), 'public/images/favicon.png')));

    /** *****************************************************************************************  **/
    /** Routes
    /** *****************************************************************************************  **/

    var mustBeIn = require('../routes/must-be-in');

    /** *****************************************************************************************  **/
    /**                                                                                            **/
    /**                                   ENTRY POINTS                                             **/ 
    /**                                                                                            **/
    /** *****************************************************************************************  **/

    /** *****************************************************************************************  **/
    /** TERMS OF SERVICE
    /** *****************************************************************************************  **/

    app.get('/terms-of-service', function route_termsOfService (req, res) {
      res.render('pages/terms-of-service');
    });

    /** *****************************************************************************************  **/
    /** NAVIGATOR
    /** *****************************************************************************************  **/

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
    });

    /** *****************************************************************************************  **/
    /** CREATOR
    /** *****************************************************************************************  **/

    app.get('/create/:type/:parent?',

      mustBeIn,

      function route_creator (req, res) {
        res.render('pages/editor', {
          type: req.params.type,
          parent: req.params.parent
        });
      });

    /** *****************************************************************************************  **/
    /** EDITOR
    /** *****************************************************************************************  **/

    app.get('/edit/:item',

      mustBeIn,

      function route_editor (req, res) {

        res.render('pages/editor', {
          item: req.params.item
        });
      });

    /** *****************************************************************************************  **/
    /** EVALUATOR
    /** *****************************************************************************************  **/

    app.get('/evaluate/:item',

      mustBeIn,

      function route_evaluator (req, res) {
        res.render('pages/evaluator', {
          item: req.params.item
        });
    });

    /** *****************************************************************************************  **/
    /** DETAILS
    /** *****************************************************************************************  **/

    app.get('/details/:item',

      function route_details (req, res) {
        res.render('pages/details', {
          item: req.params.item,
          back: req.get('Referer')
        });
      });

    /** *****************************************************************************************  **/
    /**                                                                                            **/
    /**                                   ACCESS POINTS                                            **/ 
    /**                                                                                            **/
    /** *****************************************************************************************  **/

    /** *****************************************************************************************  **/
    /** SIGN IN / SIGN UP / SIGN OUT
    /** *****************************************************************************************  **/

    app.all('/sign/:dir?', require('../routes/sign'));

    /** *****************************************************************************************  **/
    /** MONSON API
    /** *****************************************************************************************  **/

    var mongoose = require('mongoose');

    mongoose.connect(process.env.MONGOHQ_URL);

    var monson = require('monson');

    app.use('/json/:model',
      function (req, res, next) {

        // PERMISSIONS - MUST BE SIGNED IN

        if ( ! res.locals.isSignedIn ) {
          if ( req.method === 'POST' || req.method === 'PUT' ) {
            return next(SynappError.Unauthorized());
          }
        }

        // PERMISSIONS - PROTECTING USER MODEL

        if ( req.params.model === 'User' ) {
          return next(SynappError.Unauthorized());
        }

        // ADD USER

        if ( req.method === 'POST' || req.method === 'PUT' ) {

          if ( Array.isArray(req.body) ) {
            req.body = req.body.map(function (i) {
              i.user = req.signedCookies.synuser.id;
              return i;
            })
          }

          else {
            req.body.user = req.signedCookies.synuser.id;
          }
        }

        next();
        
      },

      monson.express(mongoose));

    /** *****************************************************************************************  **/
    /** UPLOAD IMAGE
    /** *****************************************************************************************  **/

    app.all('/tools/upload', require('../routes/upload'));

    /** *****************************************************************************************  **/
    /** GET URL TITLE
    /** *****************************************************************************************  **/

    app.post('/tools/get-title', require('../routes/get-title'));

    /** *****************************************************************************************  **/
    /** FACEBOOK AUTH
    /** *****************************************************************************************  **/

    app.get('/auth/facebook',
      require('../routes/facebook')(app, synapp, Log, SynappError, passport),
      passport.authenticate('facebook'));

    app.get(synapp.facebook['callback url'],
      passport.authenticate('facebook', {
        successRedirect: '/fb/ok',
        failureRedirect: '/?fb=ko'
      }));

    app.get('/fb/ok', function (req, res) {
      res.cookie('synuser', { email: req.session.email, id: req.session.id }, synapp.cookie);

      Log.INFO('Cookie set', req.session);

      res.redirect('/');
    });

    /** *****************************************************************************************  **/
    /** TWITTER AUTH
    /** *****************************************************************************************  **/

    app.get('/auth/twitter',
      require('../routes/twitter')(app, synapp, Log, SynappError, passport),
      passport.authenticate('twitter'));

    app.get(synapp.twitter['callback url'],
      passport.authenticate('twitter', {
        successRedirect: '/tw/ok',
        failureRedirect: '/?tw=ko'
      }));

    app.get('/tw/ok', function (req, res) {
      res.cookie('synuser', { email: req.session.email, id: req.session.id }, synapp.cookie);

      Log.INFO('Cookie set', req.session);

      res.redirect('/');
    });

    /** *****************************************************************************************  **/
    /** DUMP DATABASE
    /** *****************************************************************************************  **/

    app.all('/tools/dump', require('../routes/dump'));

    /** *****************************************************************************************  **/
    /**                                                                                            **/
    /**                                   MIDDLEWARES                                              **/ 
    /**                                                                                            **/
    /** *****************************************************************************************  **/

    /** *****************************************************************************************  **/
    /** STATIC ROUTER
    /** *****************************************************************************************  **/

    app.use(express.static(require('path').join(path.dirname(__dirname), 'public')));

    /** *****************************************************************************************  **/
    /** ERROR
    /** *****************************************************************************************  **/

    app.use(require('../routes/error'));

    /* SERVER */
    /* ------------------------------------------------------------------------ */

    server = require('http').createServer(app);

    if ( listen ) {
  
      /** ***************************************************************************************  **/
      /** LISTEN
      /** ***************************************************************************************  **/

      server.listen(app.get('port'), function () {
        Log.OK(format('Listening on port %d', app.get('port')));
      });

      /** ***************************************************************************************  **/
      /** SERVER ERROR
      /** ***************************************************************************************  **/

      server.on('error', function (error) {
        Log.ERROR(error.format());
      });

      domain.add(server);
    }
  });

  return [app, server];
};
