'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fixturesState1Json = require('../../../../fixtures/state/1.json');

var _fixturesState1Json2 = _interopRequireDefault(_fixturesState1Json);

var V2 = (function () {
  function V2() {
    _classCallCheck(this, V2);
  }

  _createClass(V2, null, [{
    key: 'do',
    value: function _do() {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {
          _this.find({ __V: 2 }).then(function (states) {
            try {
              if (states.length) {
                return ok();
              }
              _this.create(_fixturesState1Json2['default'].map(function (state) {
                state.__V = 2;
                return state;
              })).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'undo',
    value: function undo() {
      return this.remove({ __V: 2 });
    }
  }]);

  return V2;
})();

exports['default'] = V2;
module.exports = exports['default'];