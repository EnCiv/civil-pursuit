'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsTest = require('../models/test');

var _modelsTest2 = _interopRequireDefault(_modelsTest);

function getTests(event) {
  var _this = this;

  try {
    _modelsTest2['default'].find().exec().then(function (tests) {
      return _this.ok(event, tests);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getTests;
module.exports = exports['default'];