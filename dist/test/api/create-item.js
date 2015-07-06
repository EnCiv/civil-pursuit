'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _synApiCreateItem = require('syn/api/create-item');

var _synApiCreateItem2 = _interopRequireDefault(_synApiCreateItem);

var CreateItemTest = (function () {
  function CreateItemTest() {
    _classCallCheck(this, CreateItemTest);
  }

  _createClass(CreateItemTest, null, [{
    key: 'main',
    value: function main() {
      return Promise.all([CreateItemTest.missingSubjectThrowsError()]);
    }
  }, {
    key: 'missingSubjectThrowsError',
    value: function missingSubjectThrowsError() {
      return new Promise(function (ok, ko) {
        try {
          (function () {
            var state = null;

            var event = 'create item';

            var mock = {

              error: function error(_error) {
                ok(_error);
                state = true;
              },

              ok: function ok(event) {
                state = false;
                ko(new Error('Script did not throw'));
              }

            };

            _synApiCreateItem2['default'].apply(mock, [event, {}]);

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
  }]);

  return CreateItemTest;
})();

exports['default'] = CreateItemTest.main;
module.exports = exports['default'];