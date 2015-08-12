'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _secretJson = require('../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

var _utilRun = require('../util/run');

var _utilRun2 = _interopRequireDefault(_utilRun);

function getUrlTitle(url) {
  return new Promise(function (ok, ko) {
    var req = {
      url: url,
      timeout: 1000 * 8,
      headers: {
        'User-Agent': _secretJson2['default']['user agent']
      }
    };
    (0, _request2['default'])(req, function (error, response, body) {
      if (error) {
        return ko(error);
      }

      if (response.statusCode === 200 || response.statusCode >= 300 && response.statusCode < 400) {
        (function () {

          var title = undefined;

          body.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/<title>(.+)<\/title>/, function (matched, _title) {

            title = (0, _string2['default'])(_title).decodeHTMLEntities().s;
          });

          ok(title);
        })();
      } else {
        ko(new Error('Got status code ' + response.statusCode));
      }
    });
  });
}

exports['default'] = getUrlTitle;
module.exports = exports['default'];