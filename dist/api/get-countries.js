'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsCountry = require('../models/country');

var _modelsCountry2 = _interopRequireDefault(_modelsCountry);

function getCountries(event) {
  var _this = this;

  try {
    _modelsCountry2['default'].find().lean().exec().then(function (countries) {
      try {
        _this.ok(event, countries);
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

exports['default'] = getCountries;
module.exports = exports['default'];