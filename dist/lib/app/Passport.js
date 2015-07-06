'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** Passport Helper
 *  
 *  @class              Passport
 *  @description        Helper for 3rd party signon with passport
*/

var _domain = require('domain');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configJson = require('../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var Passport = (function () {
  function Passport(service, app) {
    var _this = this;

    _classCallCheck(this, Passport);

    this.app = app;
    this.user = null;

    this.CALLBACK_URL = _configJson2['default'][service][process.env.SYNAPP_ENV]['callback url'];
    this.SIGNIN_ROUTE = _configJson2['default']['public'].routes['sign in with ' + service];
    this.OK_ROUTE = _configJson2['default']['public'].routes['sign in with ' + service + ' OK'];

    var d = new _domain.Domain().on('error', function (error) {
      return _this.app.emit('error', error);
    });

    d.run(function () {
      _this.app.get(_this.SIGNIN_ROUTE, _this.serviceStrategy.bind(_this), _passport2['default'].authenticate(service));

      _this.app.get(_this.CALLBACK_URL, _this.callback.bind(_this));

      _this.app.get(_this.OK_ROUTE, _this.ok.bind(_this));
    });
  }

  _createClass(Passport, [{
    key: 'associate',
    value: function associate(req, res, next, user, done) {
      var _this2 = this;

      var d = new _domain.Domain().on('error', function (error) {
        return _this2.app.emit('error', error);
      });

      d.run(function () {
        if (user) {
          _this2.user = user;
          done(null, user);
        } else {
          _this2.createUser(req, res, next, done);
        }
      });
    }
  }, {
    key: 'access',
    value: function access(req, res, next, accessToken, refreshToken, profile, done) {
      var _this3 = this;

      var d = new _domain.Domain().on('error', function (error) {
        return _this3.app.emit('error', error);
      });

      d.run(function () {
        _this3.profile = profile;
        _this3.email = _this3.profile.id + '@facebook.com';
        _modelsUser2['default'].findOne({ email: email }, _this3.associate.bind(_this3, req, res, next));
      });
    }
  }, {
    key: 'createUser',
    value: function createUser(req, res, next, done) {
      var _this4 = this;

      var d = new _domain.Domain().on('error', function (error) {
        return _this4.app.emit('error', error);
      });

      d.run(function () {
        _modelsUser2['default'].create({ email: _this4.email, password: _this4.profile.id + Date.now() }, d.bind(function (error, user) {
          if (error) {
            if (error.message && /duplicate/.test(error.message)) {
              return done(new Error('Duplicate user'));
            }

            return next(error);
          }

          _this4.user = user;

          done(null, user);
        }));
      });
    }
  }, {
    key: 'serviceStrategy',
    value: function serviceStrategy(req, res, next) {
      var _this5 = this;

      var d = new _domain.Domain().on('error', function (error) {
        return _this5.app.emit('error', error);
      });

      d.run(function () {
        _this5.strategy(req, res, next);
        next();
      });
    }
  }, {
    key: 'redirect',
    value: function redirect(req, res, next, error, user, info) {
      if (error) {
        return next(error);
      }
      res.redirect(this.OK_ROUTE);
    }
  }, {
    key: 'callback',
    value: function callback(req, res, next) {
      _passport2['default'].authenticate('facebook', this.redirect.bind(this, req, res, next))(req, res, next);
    }
  }, {
    key: 'ok',
    value: function ok() {
      res.cookie('synuser', {
        email: this.user.email,
        id: this.user.id
      }, _configJson2['default'].cookie);

      res.redirect('/');
    }
  }]);

  return Passport;
})();

exports['default'] = Passport;
module.exports = exports['default'];