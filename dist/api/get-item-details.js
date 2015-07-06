'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

function getItemDetails(event, itemId) {
  var _this = this;

  try {
    _synModelsItem2['default'].getDetails(itemId).then(function (details) {
      return _this.ok(event, details);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getItemDetails;
module.exports = exports['default'];