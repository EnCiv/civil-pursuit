'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _apiGetIntro = require('../../api/get-intro');

var _apiGetIntro2 = _interopRequireDefault(_apiGetIntro);

function getIntroTest() {
  return new Promise(function (_ok, ko) {
    try {
      (function () {

        var state = null;

        var event = 'get intro';

        var mock = {

          error: function error(_error) {
            ko(_error);
            state(false);
          },

          ok: function ok(event, intro) {
            state = true;
            _ok(intro);
          }

        };

        _apiGetIntro2['default'].apply(mock, [event]);

        setTimeout(function () {
          if (state === null) {
            ko(new Error('Script timed out'));
          }
        }, 2500);
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getIntroTest;
module.exports = exports['default'];