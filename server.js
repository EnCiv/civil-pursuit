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
      res.locals.email = req.signedCookies.synuser.email;
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

    Log[LOG](format('[%s] %d %s %s',
      req.signedCookies.synuser ? req.signedCookies.synuser.email : 'visitor',
      res.statusCode, req.method, req.url));

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
    SCREEN 1: HOME
  */

  app.get('/', function (req, res) {
    res.render('pages/home');
  });

  /*  
    SCREEN 2: CREATE
  */

  app.get('/create/:topic',

    mustBeIn,

    function (req, res) {
      res.render('pages/create', {
        page: 'create',
        topic: req.params.topic
      });
    });

  /*  
    SCREEN 3: EVALUATE
  */

  app.get('/evaluate/:evaluation',

    mustBeIn,

    function (req, res) {
      res.render('pages/evaluate', {
        evaluation: req.params.evaluation
      });
  });

  /*  
    SCREEN 4: SUMMARY
  */

  app.get('/summary/:entry',

    function (req, res) {
      res.render('pages/summary', {
        entry: req.params.entry,
        back: req.get('Referer')
      });
    });

  /*  
    SCREEN 5: MY ENTRIES
  */

  app.get('/list/:topic/me',

    mustBeIn,

    function (req, res) {
      res.render('pages/list', {
        topic: req.params.topic,
        me: true
      });  
    });

  /*  
    SCREEN 6: ALL ENTRIES
  */

  app.get('/list/:topic',

    function (req, res) {
      res.render('pages/list', {
        topic: req.params.topic
      });  
    });

  /*  
    EDIT AND GO AGAIN
  */

  app.get('/edit/:entry?', mustBeIn, function (req, res, next) {
    res.render('pages/create', {
      entry: req.params.entry
    });
  });

  /* ACCESS POINTS */
  /* ------------------------------------------------------------------------ */

  /*
    CREATE EVALUATION
  */

  app.get('/evaluate/topic/:topic',

    mustBeIn,

    function (req, res, next) {

      require('async').parallel({
        
        topic: function (cb) {
          
          require('./models/Topic')

            .findOne({ slug: req.params.topic })

            .exec(cb);
        },

        user: function (cb) {
          
          require('./models/User')

            .findOne({ email: res.locals.email })

            .exec(cb);
        }
      },

      function (error, found) {
        if ( error ) {
          return next(error);
        }

        if ( ! found.topic ) {
          return next(new Error('Topic not found'));
        }

        if ( ! found.user ) {
          return next(new Error('User not found'));
        }

        require('./models/Evaluation')
          .create({ user: found.user._id, topic: found.topic._id },
            function (error, created) {
              if ( error ) {
                return next(error);
              }

              res.redirect('/evaluate/' + created._id);
            });
      });
    });

  /*  
    SIGN (IN|UP|OUT) or 
  */

  app.all('/sign/:dir?', require('./routes/sign'));

  /*  
    MONSON API
  */

  var mongoose = require('mongoose');

  mongoose.connect(process.env.MONGOHQ_URL);

  var monson = require('monson')(mongoose);

  app.use('/json', monson.express.bind(monson));

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