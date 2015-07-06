'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getLineage() {
  var _this = this;

  return new Promise(function (ok, ko) {
    var ItemModel = _this.constructor;

    var lineage = [];

    var _getLineage = function _getLineage(itemId) {
      ItemModel.findById(itemId).exec().then(function (item) {
        if (!item) {
          return ok(lineage);
        }
        lineage.push(item);
        if (item.parent) {
          _getLineage(item.parent);
        } else {
          lineage.reverse();
          ok(lineage);
        }
      }, ko);
    };

    _getLineage(_this.parent);
  });
}

exports['default'] = getLineage;
module.exports = exports['default'];