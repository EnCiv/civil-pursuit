'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsTraining = require('../models/training');

var _modelsTraining2 = _interopRequireDefault(_modelsTraining);

function getTraining(event) {
  var _this = this;

  try {
    _modelsTraining2['default'].find().exec().then(function (instructions) {
      _this.ok(event, instructions);
    }, this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getTraining;
module.exports = exports['default'];