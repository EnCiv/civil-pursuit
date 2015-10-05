'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsTraining = require('../models/training');

var _modelsTraining2 = _interopRequireDefault(_modelsTraining);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

function getTraining(event) {
  var _this = this;

  try {
    var req = {
      'headers': {
        'cookie': this.request.headers.cookie
      }
    };

    (0, _cookieParser2['default'])()(req, null, function () {});

    var cookie = req.cookies.synapp;

    if (cookie.training) {
      _modelsTraining2['default'].find().sort({ step: 1 }).exec().then(function (instructions) {
        _this.ok(event, instructions);
      }, this.error.bind(this));
    } else {
      this.ok(event, []);
    }
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getTraining;
module.exports = exports['default'];