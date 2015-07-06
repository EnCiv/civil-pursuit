'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsFeedback = require('../models/feedback');

var _modelsFeedback2 = _interopRequireDefault(_modelsFeedback);

function insertFeedback(event, feedback) {
  var _this = this;

  try {
    if (!('user' in feedback)) {
      feedback.user = this.synuser.id;
    }

    _modelsFeedback2['default'].create(feedback).then(function (inserted) {
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