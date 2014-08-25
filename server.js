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

  /* ======== static router  ======== */

  app.use(express.static(require('path').join(__dirname, 'public')));

  /* ======== cookies & session  ======== */

  var secret = [process.pid, Math.random(), +new Date()].join();

  app.use(cookieParser(secret));

  /* ======== response locals  ======== */

  app.use(function (req, res, next) {
    res.locals.req = req;
    next();
  });

  /* ======== API  ======== */

  app.all('/api/:section?', require('./routes/api'));

  /* ======== HOME  ======== */

  app.all('/', function (req, res) {
    res.render('pages/home');
  });

  /* ======== start server  ======== */

  var server = require('http').createServer(app);

  server.listen(app.get('port'), function () {
    console.log({ message: 'started', port: app.get('port'), pid: process.pid });
  });

  server.on('error', function (error) {
    console.log({ 'server error': error });
  });
});