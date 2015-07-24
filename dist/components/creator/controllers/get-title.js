'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getTitle(url) {
  var _this = this;

  return new Promise(function (ok, ko) {
    _this.publish('get url title', url).subscribe(function (pubsub, title) {
      ok(title);
      pubsub.unsubscribe();
    });
  });
}

exports['default'] = getTitle;
module.exports = exports['default'];