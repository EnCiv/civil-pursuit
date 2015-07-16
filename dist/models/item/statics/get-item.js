'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getItemById(id) {
  var _this = this;

  return new Promise(function (ok, ko) {
    var ItemModel = _this;

    ItemModel.findOne({ id: id }).exec().then(function (item) {
      if (!item) {
        return ok();
      }

      item.toPanelItem().then(ok(item), ko);
    });
  });
}

exports['default'] = getItemById;
module.exports = exports['default'];