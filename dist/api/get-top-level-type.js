'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _secretJson = require('../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

var _modelsType = require('../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

function getTopLevelType(event) {
  var _this = this;

  try {
    _modelsType2['default'].findOne({ name: _secretJson2['default']['top level item'] }).then(function (type) {
      return _this.ok(event, type);
    }, this.error.bind(this));
  } catch (error) {
    this.error('error');
  }
}

exports['default'] = getTopLevelType;
module.exports = exports['default'];