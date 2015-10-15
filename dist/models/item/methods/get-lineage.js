'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getLineage() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var Item = _this.constructor;

        var lineage = [];

        var _getLineage = function _getLineage(itemId) {
          Item.findById(itemId).then(function (item) {
            try {
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
            } catch (error) {
              ko(error);
            }
          }, ko);
        };

        _getLineage(_this.parent);
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getLineage;
module.exports = exports['default'];