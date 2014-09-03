#!/usr/bin/env node

var format = require('util').format;

var path = require('path');

var Log = require('String-alert')({ prefix: 'synapp' });

var domain = require('domain').create();

domain.on('error', function (error) {
  Log.ERROR(error.message, error.format());
});

domain.run(function () {

  /* ======== start express app ======== */

  var express = require('express');

  var app = express();

  /* ======== middlewares  ======== */

  var cookieParser = require('cookie-parser');

  var bodyParser = require('body-parser');

  var multipart = require('connect-multiparty');

  /* ======== parsers  ======== */

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // aparse multi-parts
  app.use(multipart({
    uploadDir: '/tmp'
}));

  /* ======== app config  ======== */

  var config = {
    'view engine'   :   'jade',
    'views'         :   'views',
    'port'          :   process.env.PORT || 3012
  };

  for ( var middleware in config ) {
    app.set(middleware, config[middleware]);
  }

  app.locals.pretty = true;

  app.locals.started = false;

  /* ======== cookies & session  ======== */

  app.locals.secret = (process.pid + Math.random()).toString();

  app.use(cookieParser(app.locals.secret));

  /* ======== response locals  ======== */

  app.use(function (req, res, next) {
    res.locals.req = req;

    res.locals.isSignedIn = req.signedCookies.synuser;

    next();
  });

  /* ======== LOGGER  ======== */

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

  /* ======== SIGN  ======== */

  app.all('/sign/:dir?', require('./routes/sign'));

  /* ======== API  ======== */

  require('monson')(app, require('mongoose'), 'MONGOHQ_URL');

  /* ======== CREATE  ======== */

  app.get('/topics/:topic/create', function (req, res, next) {
    res.render('pages/create', {
      topic: req.params.topic
    });
  });

  /* ======== EVALUATE  ======== */

  app.get('/topics/:topic/evaluate', function (req, res, next) {
    res.render('pages/evaluate', {
      topic: req.params.topic
    });
  });

  /* ======== UPLOAD  ======== */

  app.all('/tools/upload', require('./routes/upload'));

  /* ======== GET TITLE  ======== */

  app.post('/tools/get-title', require('./routes/get-title'));

  /* ======== HOME  ======== */

  app.all('/', function (req, res) {
    res.render('pages/home');
  });

  /* ======== BACK OFFICE / DUMP  ======== */

  app.all('/back/dump', require('./routes/dump'));

  /* ======== static router  ======== */

  app.use(express.static(require('path').join(__dirname, 'public')));

  /* ======== error  ======== */

  app.use(require('./routes/error'));

  /* ======== start server  ======== */

  var server = require('http').createServer(app);

  server.listen(app.get('port'), function () {
    Log.OK(format('Listening on port %d', app.get('port')));
  });

  server.on('error', function (error) {
    Log.ERROR(error.format());
  });

  domain.add(server);
});