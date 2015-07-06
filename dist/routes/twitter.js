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

var _libAppPassport = require('../lib/app/Passport');

var _libAppPassport2 = _interopRequireDefault(_libAppPassport);

var _passportTwitter = require('passport-twitter');

var _passportTwitter2 = _interopRequireDefault(_passportTwitter);

var _configJson = require('../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var Twitter = (function (_Passport) {
  function Twitter(app) {
    _classCallCheck(this, Twitter);

    _get(Object.getPrototypeOf(Twitter.prototype), 'constructor', this).call(this, 'twitter', app);
  }

  _inherits(Twitter, _Passport);

  _createClass(Twitter, [{
    key: 'strategy',
    value: function strategy(req, res, next) {
      if (!this.app.locals.TwitterStrategy) {
        this.app.locals.TwitterStrategy = _passportTwitter2['default'].Strategy;

        var callback;

        if (req.hostname === 'localhost') {
          callback = require('util').format('http://%s:%d%s', req.hostname, this.app.get('port'), _configJson2['default'].twitter[process.env.SYNAPP_ENV]['callback url']);
        } else {
          callback = require('util').format('http://%s%s', req.hostname, _configJson2['default'].twitter[process.env.SYNAPP_ENV]['callback url']);
        }

        var _strategy = this.app.locals.TwitterStrategy;

        passport.use(new _strategy({
          consumerKey: _configJson2['default'].twitter[process.env.SYNAPP_ENV]['key'],
          consumerSecret: _configJson2['default'].twitter[process.env.SYNAPP_ENV]['secret'],
          callbackURL: callback
        }, this.access.bind(this, req, res, next)));
      }
    }
  }]);

  return Twitter;
})(_libAppPassport2['default']);

exports['default'] = Twitter;
module.exports = exports['default'];