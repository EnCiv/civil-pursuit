#!/usr/bin/env node

var domain = require('domain').create();

domain.on('error', function (error) {
  console.log({ error: {
    name: error.name,
    message: error.message,
    stack: error.stack.split(/\n/)
  }});
});

domain.run(function () {

  /* ======== start express app ======== */

  var express = require('express');

  var app = express();

  /* ======== middlewares  ======== */

  var cookieParser = require('cookie-parser');

  var bodyParser = require('body-parser');

  var expressSession = require('express-session');

  /* ======== parsers  ======== */

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

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

    console.log(req.cookies, req.signedCookies);

    res.locals.isSignedIn = req.signedCookies.synuser;

    next();
  });

  /* ======== SIGN  ======== */

  app.all('/sign/:dir?', require('./routes/sign'));

  /* ======== API  ======== */

  app.all('/api/:section?', require('./routes/api'));

  /* ======== HOME  ======== */

  app.all('/', function (req, res) {
    res.render('pages/home');
  });

  /* ======== static router  ======== */

  app.use(express.static(require('path').join(__dirname, 'public')));

  /* ======== error  ======== */

  app.use(require('./routes/error'));

  /* ======== start server  ======== */

  var server = require('http').createServer(app);

  server.listen(app.get('port'), function () {
    console.log({ message: 'started', port: app.get('port'), pid: process.pid });
  });

  server.on('error', function (error) {
    console.log({ 'server error': 'error' });
  });

  domain.add(server);
});