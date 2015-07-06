! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function removeCitizenship
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} country_id - The Country ID
   */

  function removeCitizenship (user_id, country_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.removeCitizenship(user_id, country_id, domain.intercept(function (item) {
        socket.emit('citizenship removed', item);
      }));
    });

  }

  module.exports = removeCitizenship;

} ();
