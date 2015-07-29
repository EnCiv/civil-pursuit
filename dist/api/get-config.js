'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsConfig = require('../models/config');

var _modelsConfig2 = _interopRequireDefault(_modelsConfig);

function getConfig(event) {
  var _this = this;

  try {
    _modelsConfig2['default'].findOne().lean().exec().then(function (config) {
      try {
        _this.ok(event, config);
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

exports['default'] = getConfig;
module.exports = exports['default'];