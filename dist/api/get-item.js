'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

function getItemById(event, query) {
  var _this = this;

  try {
    _modelsItem2['default'].findOne(query).exec().then(function (item) {
      try {
        item.toPanelItem().then(function (item) {
          _this.ok(event, item);
        }, _this.error.bind(_this));
      } catch (error) {
        _this.error(error);
      }
    }, this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getItemById;
module.exports = exports['default'];