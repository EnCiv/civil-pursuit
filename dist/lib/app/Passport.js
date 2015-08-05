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

var _publicJson = require('../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var _secretJson = require('../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _modelsDiscussion = require('../../models/discussion');

var _modelsDiscussion2 = _interopRequireDefault(_modelsDiscussion);

var Passport = (function () {
  function Passport(service, app) {
    _classCallCheck(this, Passport);

    try {
      this.app = app;
      this.user = null;
      this.service = service;

      var routes = _publicJson2['default'].routes;

      var env = process.env.SYNAPP_ENV;

      this.CALLBACK_URL = _secretJson2['default'][service][env]['callback url'];
      this.SIGNIN_ROUTE = routes['sign in with ' + service];
      this.OK_ROUTE = routes['sign in with ' + service + ' OK'];

      this.app.get(this.SIGNIN_ROUTE, this.serviceStrategy.bind(this), _passport2['default'].authenticate(service));

      this.app.get(this.CALLBACK_URL, this.callback.bind(this));

      this.app.get(this.OK_ROUTE, this.ok.bind(this));
    } catch (error) {
      this.app.emit('error', error);
    }
  }

  _createClass(Passport, [{
    key: 'associate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function associate(req, res, next, user, done) {
      try {
        if (user) {
          this.user = user;

          _modelsDiscussion2['default'].findOne().exec().then(function (discussion) {
            try {
              if (discussion.registered.some(function (registered) {
                return registered.toString() === user._id.toString();
              })) {
                return done(null, user);
              }

              discussion.registered.push(user._id);

              discussion.save(function (error) {
                if (error) {
                  return next(error);
                }
                done(null, user);
              });
            } catch (error) {
              next(error);
            }
          }, next);
        } else {
          this.createUser(req, res, next, done);
        }
      } catch (error) {
        this.app.emit('error', error);
        next(error);
      }
    }
  }, {
    key: 'access',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function access(req, res, next, accessToken, refreshToken, profile, done) {
      var _this = this;

      try {
        this.profile = profile;
        this.email = '' + this.profile.id + '@' + this.service + '.com';

        _modelsUser2['default'].findOne({ email: this.email }).exec().then(function (user) {
          _this.associate(req, res, next, user, done);
        }, next);
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: 'createUser',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function createUser(req, res, next, done) {
      var _this2 = this;

      try {
        (function () {
          var d = new _domain.Domain().on('error', next);

          d.run(function () {
            _modelsUser2['default'].create({ email: _this2.email, password: _this2.profile.id + Date.now() }, d.bind(function (error, user) {
              try {
                if (error) {
                  if (error.message && /duplicate/.test(error.message)) {
                    return done(new Error('Duplicate user'));
                  }

                  return next(error);
                }

                _this2.user = user;

                _modelsDiscussion2['default'].findOne().exec().then(function (discussion) {
                  try {
                    discussion.registered.push(user._id);
                    discussion.save(function (error) {
                      if (error) {
                        next(error);
                      }
                      done(null, user);
                    });
                  } catch (error) {
                    next(error);
                  }
                }, next);
              } catch (error) {
                next(error);
              }
            }));
          });
        })();
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: 'serviceStrategy',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function serviceStrategy(req, res, next) {
      try {
        this.strategy(req, res, next);
        next();
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: 'redirect',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function redirect(req, res, next, error, user, info) {
      if (error) {
        return next(error);
      }
      res.redirect(this.OK_ROUTE);
    }
  }, {
    key: 'callback',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function callback(req, res, next) {
      _passport2['default'].authenticate(this.service, this.redirect.bind(this, req, res, next))(req, res, next);
    }
  }, {
    key: 'ok',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function ok(req, res, next) {
      res.cookie('synuser', {
        email: this.user.email,
        id: this.user.id
      }, _secretJson2['default'].cookie);

      res.redirect('/page/profile');
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Passport;
})();

exports['default'] = Passport;
module.exports = exports['default'];