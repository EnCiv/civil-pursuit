! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  /**
   *  @function setCitizenship
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} country_id - The Country ID
   *  @arg {Number} position - 0 or 1
   */

  function setCitizenship (user_id, country_id, position) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setCitizenship(user_id, country_id, position, domain.intercept(function (item) {
        socket.emit('citizenship set', item);
      }));
    });

  }

  module.exports = setCitizenship;

} ();
