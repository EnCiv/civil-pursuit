'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

function addView(event, itemId) {
  var _this = this;

  try {
    _modelsItem2['default'].incrementView(itemId).then(function (item) {
      _this.ok(event, item.views);

      item.toPanelItem().then(function (item) {
        console.log('item changed', item);
        _this.emit('item changed ' + item._id, item);
        _this.broadcast.emit('item changed ' + item._id, item);
      });
    }, function (error) {
      _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = addView;
module.exports = exports['default'];