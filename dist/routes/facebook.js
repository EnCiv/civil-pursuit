'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _domain = require('domain');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _configJson = require('../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _libAppPassport = require('../lib/app/Passport');

var _libAppPassport2 = _interopRequireDefault(_libAppPassport);

var Facebook = (function (_Passport) {
  function Facebook(app) {
    _classCallCheck(this, Facebook);

    _get(Object.getPrototypeOf(Facebook.prototype), 'constructor', this).call(this, 'facebook', app);
  }

  _inherits(Facebook, _Passport);

  _createClass(Facebook, [{
    key: 'strategy',
    value: function strategy(req, res, next) {
      if (!this.app.locals.FacebookStrategy) {
        this.app.locals.FacebookStrategy = _passportFacebook.FacebookStrategy;

        var callbackURL = this.CALLBACK_URL;

        if (req.hostname === 'localhost') {
          callbackURL = _util2['default'].format('http://%s:%d%s', req.hostname, app.get('port'), callbackURL);
        } else {
          callbackURL = _util2['default'].format('http://%s%s', req.hostname, callbackURL);
        }

        var _strategy = app.locals.FacebookStrategy;

        _passport2['default'].use(new _strategy({
          clientID: _configJson2['default'].facebook['app id'],
          clientSecret: _configJson2['default'].facebook['app secret'],
          callbackURL: callbackURL
        }, this.access.bind(this, req, res, next)));
      }
    }
  }]);

  return Facebook;
})(_libAppPassport2['default']);

exports['default'] = Facebook;
module.exports = exports['default'];