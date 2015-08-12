'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _libWebDriver = require('../lib/web-driver');

var _libWebDriver2 = _interopRequireDefault(_libWebDriver);

function runStory(event, stories) {
  var _this = this;

  try {
    (function () {
      var driver = new _libWebDriver2['default']().on('error', function (error) {
        return _this.error(error);
      }).on('ready', function () {
        try {
          var url = undefined;

          var promises = stories.map(function (story) {
            return new Promise(function (ok, ko) {
              _this.emit('running story', story._id);
              driver.client.url('http://localhost:3012' + story.driver.page.url).then(function () {
                var Unit = require('../test/web/atomic/' + story.unit.atom);

                new (_bind.apply(Unit, [null].concat(_toConsumableArray(story.unit.params))))().test().then(function () {
                  _this.emit('ok story', story._id);
                  ok();
                }, function (error) {
                  _this.emit('ko story', story._id);
                  ko(error);
                });
              });
            });
          });

          Promise.all(promises).then(function (ok) {}, function (ko) {
            driver.client.end();
          });
        } catch (error) {
          _this.error(error);
        }
      });
    })();
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = runStory;
module.exports = exports['default'];