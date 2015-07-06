'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsYoutubeView = require('syn/components/youtube/view');

var _synComponentsYoutubeView2 = _interopRequireDefault(_synComponentsYoutubeView);

function YouTube(url) {
  var yt = new _synComponentsYoutubeView2['default']({ url: url, settings: { env: synapp.env } });
}

exports['default'] = YouTube;
module.exports = exports['default'];