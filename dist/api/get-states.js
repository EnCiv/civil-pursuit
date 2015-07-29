'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsState = require('../models/state');

var _modelsState2 = _interopRequireDefault(_modelsState);

function getStates(event) {
  var _this = this;

  try {
    _modelsState2['default'].find().lean().exec().then(function (states) {
      try {
        _this.ok(event, states);
      } catch (error) {
        _this.error(error);
      }
    }, function (error) {
      _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getStates;
module.exports = exports['default'];