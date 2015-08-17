'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function incrementView(itemId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {

      _this.findById(itemId).exec().then(function (item) {
        try {
          if (!item) {
            throw new Error('No such item');
          }

          item.views++;

          item.save(function (error) {
            if (error) {
              ko(error);
            }
            ok(item);
          });
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = incrementView;
module.exports = exports['default'];