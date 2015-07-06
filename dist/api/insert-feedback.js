'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synModelsFeedback = require('syn/models/feedback');

var _synModelsFeedback2 = _interopRequireDefault(_synModelsFeedback);

function insertFeedback(event, feedback) {
  var _this = this;

  try {
    if (!('user' in feedback)) {
      feedback.user = this.synuser.id;
    }

    _synModelsFeedback2['default'].create(feedback).then(function (inserted) {
      return _this.ok(event, inserted);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = insertFeedback;
module.exports = exports['default'];