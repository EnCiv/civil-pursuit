'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getOpposite() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var TypeModel = _this.constructor;
        console.log('Check if type is harmony', _this.name);
        _this.isHarmony().then(function (yes) {
          try {
            console.log('Type is harmony?', yes);
            if (!yes) {
              throw new Error('Is not harmony');
            }
            TypeModel.findById(_this.parent).exec().then(function (parent) {
              try {
                if (!parent) {
                  throw new Error('Harmony parent not found');
                }

                var opposite = parent.harmony.filter(function (type) {
                  return !type.equals(_this._id);
                });
                TypeModel.findById(opposite).exec().then(ok, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          } catch (error) {
            ko;
          }
        }, ko);
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getOpposite;
module.exports = exports['default'];