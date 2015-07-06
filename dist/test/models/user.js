'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _libUtilRandomString = require('../../lib/util/random-string');

var _libUtilRandomString2 = _interopRequireDefault(_libUtilRandomString);

var TestUserModel = (function () {
  function TestUserModel() {
    _classCallCheck(this, TestUserModel);
  }

  _createClass(TestUserModel, null, [{
    key: 'main',
    value: function main() {
      return new Promise(function (ok, ko) {
        Promise.all([TestUserModel.create(), TestUserModel.disposable()]).then(ok, ko);
      });
    }
  }, {
    key: 'isUser',
    value: function isUser(user) {
      console.log(user);
      return new Promise(function (ok, ko) {
        try {
          user.should.be.an.Object;

          // _id

          user.should.have.property('_id');

          user._id.constructor.name.should.be.exactly('ObjectID');

          // email

          user.should.have.property('email').which.is.a.String;

          // password

          user.should.have.property('password').which.is.a.String;

          ok();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'create',
    value: function create() {
      return new Promise(function (ok, ko) {
        try {
          (function () {
            var state = null;

            setTimeout(function () {
              if (state === null) {
                ko(new Error('Script timed out: create'));
              }
            }, 2500);

            (0, _libUtilRandomString2['default'])(15).then(function (str) {
              try {
                var user = {
                  email: str + '@syntest.com',
                  password: '1234'
                };

                _modelsUser2['default'].create(user).then(function (user) {
                  try {
                    TestUserModel.isUser(user).then(function () {
                      state = true;
                      ok(user);
                    }, function (error) {
                      state = false;
                      ko(error);
                    });
                  } catch (error) {
                    state = false;
                    ko(error);
                  }
                }, function (error) {
                  state = false;
                  ko(error);
                });
              } catch (error) {
                state = false;
                ko(error);
              }
            }, function (error) {
              state = false;
              ko(error);
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'disposable',
    value: function disposable() {
      return new Promise(function (ok, ko) {
        try {
          (function () {
            var state = null;

            setTimeout(function () {
              if (state === null) {
                ko(new Error('Script timed out: disposable'));
              }
            }, 2500);

            _modelsUser2['default'].disposable().then(function (user) {
              try {
                TestUserModel.isUser(user).then(function () {
                  state = true;
                  ok(user);
                }, function (error) {
                  state = false;
                  ko(error);
                });
              } catch (error) {
                state = false;
                ko(error);
              }
            }, function (error) {
              state = false;
              ko(error);
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return TestUserModel;
})();

exports['default'] = TestUserModel;
module.exports = exports['default'];