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

var _synLibUtilExpressPretty = require('syn/lib/util/express-pretty');

var _synLibUtilExpressPretty2 = _interopRequireDefault(_synLibUtilExpressPretty);

var _synRoutesTwitter = require('syn/routes/twitter');

var _synRoutesTwitter2 = _interopRequireDefault(_synRoutesTwitter);

var _synRoutesFacebook = require('syn/routes/facebook');

var _synRoutesFacebook2 = _interopRequireDefault(_synRoutesFacebook);

var _synRoutesInitPipeline = require('syn/routes/init-pipeline');

var _synRoutesInitPipeline2 = _interopRequireDefault(_synRoutesInitPipeline);

var _synRoutesRenderPage = require('syn/routes/render-page');

var _synRoutesRenderPage2 = _interopRequireDefault(_synRoutesRenderPage);

var _synRoutesItem = require('syn/routes/item');

var _synRoutesItem2 = _interopRequireDefault(_synRoutesItem);

var _synRoutesSignIn = require('syn/routes/sign-in');

var _synRoutesSignIn2 = _interopRequireDefault(_synRoutesSignIn);

var _synRoutesSignUp = require('syn/routes/sign-up');

var _synRoutesSignUp2 = _interopRequireDefault(_synRoutesSignUp);

var _synRoutesSignOut = require('syn/routes/sign-out');

var _synRoutesSignOut2 = _interopRequireDefault(_synRoutesSignOut);

var _synModelsUser = require('syn/models/user');

var _synModelsUser2 = _interopRequireDefault(_synModelsUser);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _synLibUtilPrintTime = require('syn/lib/util/print-time');

var _synLibUtilPrintTime2 = _interopRequireDefault(_synLibUtilPrintTime);

var _synApi = require('syn/api');

var _synApi2 = _interopRequireDefault(_synApi);

var HttpServer = (function (_EventEmitter) {
  function HttpServer() {
    _classCallCheck(this, HttpServer);

    _get(Object.getPrototypeOf(HttpServer.prototype), 'constructor', this).call(this);

    console.log('new server');

    this.on('message', function (message, info) {
      console.log(message, info);
    }).on('request', _synLibUtilExpressPretty2['default']).on('response', function (res) {
      (0, _synLibUtilExpressPretty2['default'])(res.req, res);
    });

    this.app = (0, _express2['default'])();

    this.set();

    this.parsers();

    this.cookies();

    this.session();

    this.passport();

    this.twitterMiddleware();

    this.facebookMiddleware();

    this.initPipeLine();

    this.signers();

    this.router();

    this['static']();

    this.notFound();

    this.error();

    this.start();
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
        _synModelsUser2['default'].findById(id, done);
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
        secret: _synConfigJson2['default'].secret,
        resave: true,
        saveUninitialized: true
      }));
    }
  }, {
    key: 'signers',
    value: function signers() {
      this.app.all('/sign/in', _synRoutesSignIn2['default'], this.setUserCookie, function (req, res) {
        res.json({
          'in': true,
          id: req.user._id
        });
      });

      this.app.all('/sign/up', _synRoutesSignUp2['default'], this.setUserCookie, function (req, res) {
        res.json({
          up: true,
          id: req.user._id
        });
      });

      this.app.all('/sign/out', _synRoutesSignOut2['default']);
    }
  }, {
    key: 'setUserCookie',
    value: function setUserCookie(req, res, next) {
      res.cookie('synuser', { email: req.user.email, id: req.user._id }, _synConfigJson2['default'].cookie);

      next();
    }
  }, {
    key: 'facebookMiddleware',
    value: function facebookMiddleware() {
      new _synRoutesFacebook2['default'](this.app);
    }
  }, {
    key: 'twitterMiddleware',
    value: function twitterMiddleware() {
      new _synRoutesTwitter2['default'](this.app);
    }
  }, {
    key: 'initPipeLine',
    value: function initPipeLine() {
      this.app.use(_synRoutesInitPipeline2['default'].bind(this));
    }
  }, {
    key: 'router',
    value: function router() {
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
      var _this = this;

      this.app.use(function (err, req, res, next) {

        if (!err.stack) {
          console.log('bug', err);
        }

        console.log('error', err.stack.split(/\n/));
        _this.emit('error', err);

        res.locals.error = err.stack.split(/\n/);
        req.page = 'error';

        next();
      }, this.renderPage.bind(this));
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.server = _http2['default'].createServer(this.app);

      this.server.on('error', function (error) {
        _this2.emit('error', error);
      });

      this.server.listen(this.app.get('port'), function () {
        _this2.emit('message', 'Server is listening', {
          port: _this2.app.get('port'),
          env: _this2.app.get('env')
        });

        _this2.emit('listening');

        new _synApi2['default'](_this2).on('error', function (error) {
          return _this2.emit('error', error);
        });
      });
    }
  }]);

  return HttpServer;
})(_events.EventEmitter);

HttpServer.prototype.renderPage = _synRoutesRenderPage2['default'];
HttpServer.prototype.itemRoute = _synRoutesItem2['default'];

exports['default'] = HttpServer;
module.exports = exports['default'];