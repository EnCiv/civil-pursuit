'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _routesSignUp = require('../../routes/sign-up');

var _routesSignUp2 = _interopRequireDefault(_routesSignUp);

var _libUtilRandomString = require('../../lib/util/random-string');

var _libUtilRandomString2 = _interopRequireDefault(_libUtilRandomString);

var _testModelsUser = require('../../test/models/user');

var _testModelsUser2 = _interopRequireDefault(_testModelsUser);

var TestSignUpRoute = (function () {
  function TestSignUpRoute() {
    _classCallCheck(this, TestSignUpRoute);
  }

  _createClass(TestSignUpRoute, null, [{
    key: 'main',
    value: function main() {
      return new Promise(function (ok, ko) {
        try {

          (0, _libUtilRandomString2['default'])(15).then(function (str) {
            try {
              (function () {
                var response = undefined;
                var next = function next(error) {
                  try {
                    if (error) {
                      return ko(error);
                    }
                    _testModelsUser2['default'].isUser(req.user).then(ok, ko);
                  } catch (error) {
                    ko(error);
                  }
                };
                var res = {
                  json: function json(obj) {
                    response = JSON.parse(obj);
                  }
                };
                var req = {
                  body: {
                    email: str + '@syntest.com',
                    password: '1234'
                  }
                };

                (0, _routesSignUp2['default'])(req, res, next);
              })();
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return TestSignUpRoute;
})();

exports['default'] = TestSignUpRoute;
module.exports = exports['default'];