'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _events = require('events');

var _domain = require('domain');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport2 = require('passport');

var _passport3 = _interopRequireDefault(_passport2);

var _libUtilExpressPretty = require('./lib/util/express-pretty');

var _libUtilExpressPretty2 = _interopRequireDefault(_libUtilExpressPretty);

var _routesTwitter = require('./routes/twitter');

var _routesTwitter2 = _interopRequireDefault(_routesTwitter);

var _routesFacebook = require('./routes/facebook');

var _routesFacebook2 = _interopRequireDefault(_routesFacebook);

var _routesInitPipeline = require('./routes/init-pipeline');

var _routesInitPipeline2 = _interopRequireDefault(_routesInitPipeline);

var _routesRenderPage = require('./routes/render-page');

var _routesRenderPage2 = _interopRequireDefault(_routesRenderPage);

var _routesItem = require('./routes/item');

var _routesItem2 = _interopRequireDefault(_routesItem);

var _routesSignIn = require('./routes/sign-in');

var _routesSignIn2 = _interopRequireDefault(_routesSignIn);

var _routesSignUp = require('./routes/sign-up');

var _routesSignUp2 = _interopRequireDefault(_routesSignUp);

var _routesSignOut = require('./routes/sign-out');

var _routesSignOut2 = _interopRequireDefault(_routesSignOut);

var _modelsUser = require('./models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _configJson = require('../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _libUtilPrintTime = require('./lib/util/print-time');

var _libUtilPrintTime2 = _interopRequireDefault(_libUtilPrintTime);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var HttpServer = (function (_EventEmitter) {
  function HttpServer() {
    var _this = this;

    _classCallCheck(this, HttpServer);

    _get(Object.getPrototypeOf(HttpServer.prototype), 'constructor', this).call(this);

    console.log('new server');

    this.on('message', function (message, info) {
      console.log(message, info);
    }).on('request', _libUtilExpressPretty2['default']).on('response', function (res) {
      (0, _libUtilExpressPretty2['default'])(res.req, res);
    });

    try {
      process.nextTick(function () {
        _this.app = (0, _express2['default'])();

        _this.set();

        _this.parsers();

        _this.cookies();

        _this.session();

        _this.passport();

        _this.twitterMiddleware();

        _this.facebookMiddleware();

        _this.initPipeLine();

        _this.signers();

        _this.router();

        _this['static']();

        _this.notFound();

        _this.error();

        _this.start();
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  _inherits(HttpServer, _EventEmitter);

  _createClass(HttpServer, [{
    key: 'set',
    value: function set() {
      this.app.set('port', process.env.PORT || 3012);

      if (this.app.get('env') === 'development') {
        this.app.locals.pretty = true;
      }
    }
  }, {
    key: 'passport',
    value: function passport() {
      _passport3['default'].serializeUser(function (user, done) {
        done(null, user._id);
      });

      _passport3['default'].deserializeUser(function (id, done) {
        _modelsUser2['default'].findById(id, done);
      });

      this.app.use(_passport3['default'].initialize());
    }
  }, {
    key: 'parsers',
    value: function parsers() {
      this.app.use(_bodyParser2['default'].urlencoded({ extended: true }), _bodyParser2['default'].json(), _bodyParser2['default'].text());
    }
  }, {
    key: 'cookies',
    value: function cookies() {
      this.app.use((0, _cookieParser2['default'])());
    }
  }, {
    key: 'session',
    value: function session() {
      this.app.use((0, _expressSession2['default'])({
        secret: _configJson2['default'].secret,
        resave: true,
        saveUninitialized: true
      }));
    }
  }, {
    key: 'signers',
    value: function signers() {
      this.app.all('/sign/in', _routesSignIn2['default'], this.setUserCookie, function (req, res) {
        res.json({
          'in': true,
          id: req.user._id
        });
      });

      this.app.all('/sign/up', _routesSignUp2['default'], this.setUserCookie, function (req, res) {
        res.json({
          up: true,
          id: req.user._id
        });
      });

      this.app.all('/sign/out', _routesSignOut2['default']);
    }
  }, {
    key: 'setUserCookie',
    value: function setUserCookie(req, res, next) {
      res.cookie('synuser', { email: req.user.email, id: req.user._id }, _configJson2['default'].cookie);

      next();
    }
  }, {
    key: 'facebookMiddleware',
    value: function facebookMiddleware() {
      new _routesFacebook2['default'](this.app);
    }
  }, {
    key: 'twitterMiddleware',
    value: function twitterMiddleware() {
      new _routesTwitter2['default'](this.app);
    }
  }, {
    key: 'initPipeLine',
    value: function initPipeLine() {
      this.app.use(_routesInitPipeline2['default'].bind(this));
    }
  }, {
    key: 'router',
    value: function router() {
      this.timeout();
      this.getLandingPage();
      this.getTermsOfServicePage();
      this.getItemPage();
      this.getPage();

      this.app.get('/error', function (req, res, next) {
        next(new Error('Test error > next with error'));
      });

      this.app.get('/error/synchronous', function (req, res, next) {
        throw new Error('Test error > synchronous error');
      });

      this.app.get('/error/asynchronous', function (req, res, next) {
        process.nextTick(function () {
          throw new Error('Test error > asynchronous error');
        });
      });
    }
  }, {
    key: 'timeout',
    value: function timeout() {
      this.app.use(function (req, res, next) {
        setTimeout(function () {
          if (!res.headersSent) {
            next(new Error('Test error > timeout'));
          }
        }, 1000 * 60);
        next();
      });
    }
  }, {
    key: 'getPage',
    value: function getPage() {
      this.app.get('/page/:page', this.renderPage.bind(this));
    }
  }, {
    key: 'getLandingPage',
    value: function getLandingPage() {
      this.app.get('/', this.renderPage.bind(this));
    }
  }, {
    key: 'getTermsOfServicePage',
    value: function getTermsOfServicePage() {
      this.app.get('/page/terms-of-service', function (req, res, next) {
        req.page = 'terms of service';
        _fs2['default'].createReadStream('TOS.md').on('error', next).on('data', function (data) {
          if (!this.data) {
            this.data = '';
          }
          this.data += data.toString();
        }).on('end', function () {
          res.locals.TOS = this.data;
          next();
        });
      }, this.renderPage.bind(this));
    }
  }, {
    key: 'getItemPage',
    value: function getItemPage() {
      this.app.get('/item/:item_short_id/:item_slug', this.itemRoute.bind(this), this.renderPage.bind(this));
    }
  }, {
    key: 'static',
    value: function _static() {
      this.app.use('/assets/', _express2['default']['static']('assets'));
      this.app.use('/css/', _express2['default']['static']('dist/css'));
      this.app.use('/js/pages/', _express2['default']['static']('dist/pages/'));
    }
  }, {
    key: 'notFound',
    value: function notFound() {
      this.app.use(function notFound(req, res, next) {
        res.status(404);
        req.page = 'not-found';
        next();
      }, this.renderPage.bind(this));
    }
  }, {
    key: 'error',
    value: function error() {
      var _this2 = this;

      this.app.use(function (err, req, res, next) {

        if (!err.stack) {
          console.log('bug', err);
        }

        console.log('error', err.stack.split(/\n/));
        _this2.emit('error', err);

        res.locals.error = err.stack.split(/\n/);
        req.page = 'error';

        next();
      }, this.renderPage.bind(this));
    }
  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      this.server = _http2['default'].createServer(this.app);

      this.server.on('error', function (error) {
        _this3.emit('error', error);
      });

      this.server.listen(this.app.get('port'), function () {
        _this3.emit('message', 'Server is listening', {
          port: _this3.app.get('port'),
          env: _this3.app.get('env')
        });

        _this3.emit('listening');

        new _api2['default'](_this3).on('error', function (error) {
          return _this3.emit('error', error);
        });
      });
    }
  }]);

  return HttpServer;
})(_events.EventEmitter);

HttpServer.prototype.renderPage = _routesRenderPage2['default'];
HttpServer.prototype.itemRoute = _routesItem2['default'];

exports['default'] = HttpServer;
module.exports = exports['default'];