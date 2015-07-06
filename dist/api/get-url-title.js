'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilGetUrlTitle = require('syn/lib/util/get-url-title');

var _synLibUtilGetUrlTitle2 = _interopRequireDefault(_synLibUtilGetUrlTitle);

var _synLibUtilRun = require('syn/lib/util/run');

var _synLibUtilRun2 = _interopRequireDefault(_synLibUtilRun);

function socketGetUrlTitle(event, url) {
  var _this = this;

  (0, _synLibUtilRun2['default'])(function (d) {
    (0, _synLibUtilGetUrlTitle2['default'])(url).then(function (title) {
      return _this.ok(event, title);
    }, function (error) {
      return _this.error(error);
    });
  }, this.error.bind(this));
}

exports['default'] = socketGetUrlTitle;
module.exports = exports['default'];