'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

function createItem(event, item) {
  var _this = this;

  try {
    item.type = item.type._id;
    item.user = this.synuser.id;

    _modelsItem2['default'].insert(item, this).then(function (item) {
      try {
        item.toPanelItem().then(function (item) {
          _this.ok(event, item);
        }, function (error) {
          return _this.error(error);
        });
      } catch (error) {
        _this.error(error);
      }
    }, this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = createItem;
module.exports = exports['default'];