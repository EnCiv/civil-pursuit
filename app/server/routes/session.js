! function () {

  'use strict';

  var cookieParser  =   require('cookie-parser');

  var bodyParser    =   require('body-parser');

  var session       =   require('express-session');

  var config        =   require('../../business/config.json');

  function sessionMiddleware (req, res, next) {
    cookieParser(config.secret)(req, res, next);
    session({
        secret: config.secret,
        resave: true,
        saveUninitialized: true
      })(req, res, next);

    next();
  }

  module.exports = sessionMiddleware;

} ();
