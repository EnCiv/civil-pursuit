'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function incrementView(itemId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findByIdAndUpdate(itemId, { $inc: { 'views': 1 } }, function (error, item) {
        try {
          if (error) {
            throw error;
          }
          if (!item) {
            throw new Error('Item not found: ' + itemId);
          }
          ok(item);
        } catch (error) {
          ko(error);
        }
      });
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = incrementView;
module.exports = exports['default'];