'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var PageTitleAtomicTest = (function () {
  function PageTitleAtomicTest() {
    var title = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, PageTitleAtomicTest);

    this.title = title;
  }

  _createClass(PageTitleAtomicTest, [{
    key: 'test',
    value: function test(driver) {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {
          driver.getTitle().then(function (title) {
            try {
              title.should.be.exactly(_this.title);
              ok();
            } catch (error) {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return PageTitleAtomicTest;
})();

exports['default'] = PageTitleAtomicTest;

// new PageTitleAtomicTest('Error', {}, { prefix : true, title : 'Error' })
//   .test().then(console.log.bind(console, 'ok'), console.log.bind(console, 'ko'));
module.exports = exports['default'];