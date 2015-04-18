! function () {

  'use strict';

  

  var Item        =   require('syn/models/Item');

  function getIntro () {
    
    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      socket.app.arte.emit('message', { socket: 'get intro' });

      Item

        .findOne({ type: 'Intro' })

        .lean()

        .exec(domain.intercept(function (intro) {
          socket.emit('got intro', intro);
        }));
    });

  }

  module.exports = getIntro;

} ();
