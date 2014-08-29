#!/usr/bin/env node

var format = require('util').format;

var colors = require('colors');

/** Function to print log messages -------------------------------------------------------------  */
function printLog (message, level, debug) {
  var symbol,
    color,
    _debug = '';

  switch ( level ) {
    case 'info':
    default:
      symbol = 'ℹ';
      color = 'cyan';
      break;

    case 'error':
      symbol = '❌';
      color = 'red';
      break;

    case 'warning':
      symbol = '❢';
      color = 'yellow';
      break;

    case 'success':
      symbol = '✔';
      color = 'green';
      break;
  }

  if ( debug ) {
    _debug = JSON.stringify(debug, null, 2).grey;
  }

  console.log(' %s %s %s %s',
    'synapp' + ' http'.grey, symbol[color], message[color], _debug);
}

String.prototype.Info = function (debug) {
  printLog(this, 'info', debug);
};

String.prototype.Error = function (debug) {
  printLog(this, 'error', debug);
};

String.prototype.Warning = function (debug) {
  printLog(this, 'warning', debug);
};

String.prototype.Success = function (debug) {
  printLog(this, 'success', debug);
};

String.prototype.format = function () {
  return require('util').format.apply(null, [this.toString()].concat(
    Array.prototype.slice.call(arguments)));
};

var domain = require('domain').create();

domain.on('error', function (error) {
  error.message.Error({
    name: error.name,
    message: error.message,
    stack: error.stack.split(/\n/)
  });
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

    res.locals.isSignedIn = req.signedCookies.synuser;

    next();
  });

  /* ======== LOGGER  ======== */


  app.use(function (req, res, next) {
    var method = 'Info';

    switch ( res.statusCode ) {
      case 200:
        method = 'Success';
        break;
    }

    format('%d %s %s', res.statusCode, req.method, req.url)[method]();

    next();
  });

  /* ======== SIGN  ======== */

  app.all('/sign/:dir?', require('./routes/sign'));

  /* ======== API  ======== */

  require('monson')(app, {
    mongodb: {
      env: 'MONGOHQ_URL'
    }
  });

  app.all('/json/:Model', function (req, res, next) {
    res.json(res.locals.monson);
  });

  /* ======== IMAGES  ======== */

  app.get('/images', function (req, res, next) {
    require('fs').readdir(require('path').join(__dirname, 'public/images'),
      function (error, files) {
        if ( error ) {
          throw error;
        }
        res.json(files);
      });
  });

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
    format('Listening on port %d', app.get('port')).Success();
  });

  server.on('error', function (error) {
    error.message.Error();
  });

  domain.add(server);
});