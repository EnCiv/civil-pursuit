'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getParents() {
  var _this = this;

  return new Promise(function (ok, ko) {
    var parents = [];

    var TypeModel = _this.constructor;

    var type = _this;

    var getParent = function getParent(type) {
      TypeModel.findById(type.parent).exec().then(function (parent) {
        if (!parent) {
          return ok(parents);
        }

        parents.push(parent);

        if (parent.parent) {
          getParent(parent);
        } else {
          ok(parents);
        }
      }, ko);
    };

    if (!_this.parent) {
      return ok(null);
    }

    getParent(_this);
  });
}

exports['default'] = getParents;
module.exports = exports['default'];