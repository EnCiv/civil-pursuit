'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsYoutubeView = require('../../components/youtube/view');

var _componentsYoutubeView2 = _interopRequireDefault(_componentsYoutubeView);

function YouTube(url) {
  var yt = new _componentsYoutubeView2['default']({ url: url, settings: { env: synapp.env } });
}

exports['default'] = YouTube;
module.exports = exports['default'];