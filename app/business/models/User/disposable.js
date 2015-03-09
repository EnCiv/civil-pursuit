! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function disposable (cb) {
    var disposableUser = {
      "email":        Math.random().toString() + process.pid.toString() + Date.now().toString() + '@synaccord.com',
      "password":     "1234"
    };

    this.create(disposableUser, cb);
  }

  module.exports = disposable;

} ();
