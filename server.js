#!/usr/bin/env node

// this script will self destruct in 30 seconds //

/* CEREMONY */
/* ------------------------------------------------------------------------ */

/*  
  PROCESS TITLE
*/
process.title = 'synapphtml5';

/*  
  MODULES
*/

var format    = require('util').format;

var path      = require('path');

var Log       = require('String-alert')({ prefix: 'synapp' });

var domain    = require('domain').create();

/* 123 DOMAIN */
/* ------------------------------------------------------------------------ */

domain.on('error', function (error) {
  Log.ERROR(error.message, error.format());
});

domain.run(function () {

  /* CONFIG */
  /* ------------------------------------------------------------------------ */

  /*  
    SYNAPP
  */

  var synapp = require('./config/config.json');

  /*
    CLOUDINARY
  */

  process.env.CLOUDINARY_URL = synapp.cloudinary.url;

  /*  
    EXPRESS
  */

  var express = require('express');

  var app = express();

  /*  
    MIDDLEWARES
  */

  var cookieParser  = require('cookie-parser');

  var bodyParser    = require('body-parser');

  var multipart     = require('connect-multiparty');

  var serveFavicon  = require('serve-favicon');

  /*  
    PARSERS
  */

  // parse application/x-www-form-urlencoded
  
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  
  app.use(bodyParser.json());

  // multi-parts
  
  app.use(multipart({
    uploadDir: synapp.tmp
  }));

  // accept plain text

  app.use(function(req, res, next){
  if (req.is('text/*')) {
    req.body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.body += chunk });
    req.on('end', next);
  } else {
    next();
  }
});

  /*  
    SETTINGS
  */

  var config = {
    'view engine'   :   'jade',
    'views'         :   'views2',
    'port'          :   process.env.PORT || 3012
  };

  for ( var middleware in config ) {
    app.set(middleware, config[middleware]);
  }

  /*  
    APP LOCALS
  */

  app.locals.pretty = true;

  app.locals.synapp = synapp;

  app.locals.back = '/';

  /*  
    COOKIES
  */

  app.locals.secret = synapp.secret;

  app.use(cookieParser(app.locals.secret));

  /*  
    PRE
  */

  app.use(function (req, res, next) {
    res.locals.req = req;

    res.locals.isSignedIn = req.signedCookies.synuser;

    if ( res.locals.isSignedIn ) {

      if ( ! req.signedCookies.synuser._id ) {
        res.clearCookie('synuser');
        res.locals.isSignedIn = false;
      }

      else {
        res.locals.email  = req.signedCookies.synuser.email;
        res.locals._id    = req.signedCookies.synuser._id;
      }
    }

    next();
  });

  /*  
    LOG
  */

  app.use(function (req, res, next) {
    var LOG = 'INFO';

    switch ( res.statusCode ) {
      case 200:
        LOG = 'SUCCESS';
        break;
    }

    /*Log[LOG](format('[%s] %d %s %s',
      req.signedCookies.synuser ? req.signedCookies.synuser.email : 'visitor',
      res.statusCode, req.method, req.url));*/

    next();
  });

  /*  
    FAVICON
  */

  app.use(serveFavicon(path.join(__dirname, 'public/images/favicon.png')));

  /*  
    ROUTERS
  */

  var mustBeIn = require('./routes/must-be-in');

  /* ENTRY POINTS */
  /* ------------------------------------------------------------------------ */

  /*  
    TERMS OF SERVICE
  */

  app.get('/terms-of-service', function (req, res) {
    res.render('pages/terms-of-service');
  });

  /*  
    NAVIGATOR
  */

  app.get('/', function (req, res) {
    res.render('pages/navigator');
  });

  /*  
    CREATOR
  */

  app.get('/create/:type/:parent?',

    mustBeIn,

    function (req, res) {
      res.render('pages/editor', {
        type: req.params.type,
        parent: req.params.parent
      });
    });

  /*  
    EDITOR
  */

  app.get('/edit/:item',

    mustBeIn,

    function (req, res) {

      res.render('pages/editor', {
        item: req.params.item
      });
    });

  /*  
    EVALUATOR
  */

  app.get('/evaluate/:item',

    mustBeIn,

    function (req, res) {
      res.render('pages/evaluator', {
        item: req.params.item
      });
  });

  /*  
    DETAILS
  */

  app.get('/details/:item',

    function (req, res) {
      res.render('pages/details', {
        item: req.params.item,
        back: req.get('Referer')
      });
    });

  /* ACCESS POINTS */
  /* ------------------------------------------------------------------------ */

  /*  
    SIGN (IN|UP|OUT) or 
  */

  app.all('/sign/:dir?', require('./routes/sign'));

  /*  
    MONSON API
  */

  var mongoose = require('mongoose');

  mongoose.connect(process.env.MONGOHQ_URL);

  var monson = require('monson');

  app.use('/json/:model',
    function (req, res, next) {

      // PERMISSIONS - MUST BE SIGNED IN

      if ( ! res.locals.isSignedIn ) {
        if ( req.method === 'POST' || req.method === 'PUT' ) {
          return next(require('./lib/error').Unauthorized());
        }
      }

      // PERMISSIONS - PROTECTING USER MODEL

      if ( req.params.model === 'User' ) {
        return next(require('./lib/error').Unauthorized());
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

  /*  
    UPLOAD IMAGE
  */

  app.all('/tools/upload', require('./routes/upload'));

  /*  
    GET URL TITLE
  */

  app.post('/tools/get-title', require('./routes/get-title'));


  /*  
    DUMP
  */

  app.all('/tools/dump', require('./routes/dump'));

  /* MIDDLEWARES */
  /* ------------------------------------------------------------------------ */

  /*  
    STATIC ROUTER
  */

  app.use(express.static(require('path').join(__dirname, 'public')));

  /*  
    ERROR
  */

  app.use(require('./routes/error'));

  /* SERVER */
  /* ------------------------------------------------------------------------ */

  var server = require('http').createServer(app);

  /*  
    LISTEN
  */

  server.listen(app.get('port'), function () {
    Log.OK(format('Listening on port %d', app.get('port')));
  });

  /*  
    ERROR
  */

  server.on('error', function (error) {
    Log.ERROR(error.format());
  });

  domain.add(server);
});