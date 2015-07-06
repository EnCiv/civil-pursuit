'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _domain = require('domain');

var _synLibUtilRandomString = require('syn/lib/util/random-string');

var _synLibUtilRandomString2 = _interopRequireDefault(_synLibUtilRandomString);

function makePasswordResettable(email) {
  var _this = this;

  return new Promise(function (ok, ko) {

    var promises = [new Promise(function (ok, ko) {
      (0, _synLibUtilRandomString2['default'])(8).then(ok, ko);
    }), new Promise(function (ok, ko) {
      (0, _synLibUtilRandomString2['default'])(8).then(ok, ko);
    })];

    Promise.all(promises).then(function (results) {
      var _results = _slicedToArray(results, 2);

      var key = _results[0];
      var token = _results[1];

      var d = new _domain.Domain().on('error', error);

      _this.update({ email: email }, {
        activation_key: key,
        activation_token: token
      }).exec(d.intercept(function (number) {
        if (!number) {
          var _error = new Error('No such email');

          _error.code = 'DOCUMENT_NOT_FOUND';

          throw _error;
        }

        ok({ key: results.key, token: results.token });
      }));
    }, ko);
  });
}

exports['default'] = makePasswordResettable;
module.exports = exports['default'];