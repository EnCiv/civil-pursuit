! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  /**
   *  @function addCitizenship
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} country_id - The Country ID
   */

  function addCitizenship (user_id, country_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.addCitizenship(user_id, country_id, domain.intercept(function (item) {
        socket.emit('citizenship added', item);
      }));
    });

  }

  module.exports = addCitizenship;

} ();
