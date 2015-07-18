'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function isHarmony() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      if (!_this.parent) {
        return ok(false);
      }

      var TypeModel = _this.constructor;

      TypeModel.findById(_this.parent).exec().then(function (parent) {
        try {
          if (!parent.harmony.length) {
            return ok(false);
          }
          ok(parent.harmony.indexOf(_this._id) > -1);
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = isHarmony;
module.exports = exports['default'];