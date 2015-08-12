'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libAppGetUrlTitle = require('../lib/app/get-url-title');

var _libAppGetUrlTitle2 = _interopRequireDefault(_libAppGetUrlTitle);

var _libUtilRun = require('../lib/util/run');

var _libUtilRun2 = _interopRequireDefault(_libUtilRun);

function socketGetUrlTitle(event, url) {
  var _this = this;

  (0, _libUtilRun2['default'])(function (d) {
    (0, _libAppGetUrlTitle2['default'])(url).then(function (title) {
      return _this.ok(event, title);
    }, function (error) {
      if (error.code === 'ETIMEDOUT') {
        _this.ok(event, { error: 'time out' });
      } else {
        _this.error(error);
      }
    });
  }, function (error) {
    return _this.emit('error', error);
  });
}

exports['default'] = socketGetUrlTitle;
module.exports = exports['default'];