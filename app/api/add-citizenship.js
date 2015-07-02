'use strict';

import UserModel from 'syn/models/user';

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
    UserModel.addCitizenship(user_id, country_id, domain.intercept(function (item) {
      socket.emit('citizenship added', item);
    }));
  });

}

module.exports = addCitizenship;
