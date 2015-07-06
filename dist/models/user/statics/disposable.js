'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function createDisposableUser() {
  var _this = this;

  return new Promise(function (ok, ko) {
    var email = Math.random().toString() + process.pid.toString() + Date.now().toString() + '@synaccord.com';

    var disposable = {
      email: email,
      password: '1234'
    };

    _this.create(disposable).then(ok, ko);
  });
}

exports['default'] = createDisposableUser;
module.exports = exports['default'];