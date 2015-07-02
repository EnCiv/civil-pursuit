! function () {
  
  'use strict';

  function models__User__statics__setGender (user_id, gender, cb) {

    var domain = require('domain').create();
    
    domain
      
      .on('error', cb)
    
      .run(function () {
        var User = require('syn/models/user');

        process.nextTick(
          User.update.bind(User, { _id: user_id }, { gender: gender }, cb));
      });
  }

  module.exports = models__User__statics__setGender;

} ();
