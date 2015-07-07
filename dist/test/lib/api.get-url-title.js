'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _libAppGetUrlTitle = require('../../lib/app/get-url-title');

var _libAppGetUrlTitle2 = _interopRequireDefault(_libAppGetUrlTitle);

var urls = [{
  url: 'http://example.com',
  title: 'Example Domain'
}];

function getUrlTitleTest() {
  return new Promise(function (ok, ko) {
    var i = 0;

    (0, _libAppGetUrlTitle2['default'])(urls[i].url).then(function (title) {
      try {
        title.should.be.exactly(urls[i].title);
        ok(title);
      } catch (error) {
        ko(error);
      }
    }, ko);
  });
}

exports['default'] = getUrlTitleTest;
module.exports = exports['default'];