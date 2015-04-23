! function () {
  
  'use strict';

  var Promise = require('promise');

  function createDisposableUser (cb) {

    var User = this;

    var q = new Promise(function (fulfill, reject) {

      var disposableUser  =   {
        "email"           :   Math.random().toString() + process.pid.toString() + Date.now().toString() + '@synaccord.com',
        "password"        :   "1234"
      };

      User

        .create(disposableUser)

        .then(fulfill, reject);

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  module.exports = createDisposableUser;

} ();
