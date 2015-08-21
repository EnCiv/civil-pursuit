'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _libUtilRandomString = require('../../../lib/util/random-string');

var _libUtilRandomString2 = _interopRequireDefault(_libUtilRandomString);

function makePasswordResettable(email) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      Promise.all([(0, _libUtilRandomString2['default'])(8), (0, _libUtilRandomString2['default'])(8)]).then(function (results) {
        try {
          (function () {
            var _results = _slicedToArray(results, 2);

            var key = _results[0];
            var token = _results[1];

            _this.update({ email: email }, {
              activation_key: key,
              activation_token: token
            }).exec().then(function (number) {
              try {
                if (!number) {
                  var error = new Error('No such email');

                  error.code = 'DOCUMENT_NOT_FOUND';

                  throw error;
                }

                ok({ key: key, token: token });
              } catch (error) {
                ko(error);
              }
            }, ko);
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

exports['default'] = makePasswordResettable;
module.exports = exports['default'];