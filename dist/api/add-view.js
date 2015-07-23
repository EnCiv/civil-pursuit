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

      var changed = {
        views: item.views,
        popularity: item.getPopularity()
      };

      _this.emit('Item changed', item._id, changed);

      _this.broadcast.emit('Item changed', item._id, changed);
    }, function (error) {
      _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = addView;
module.exports = exports['default'];