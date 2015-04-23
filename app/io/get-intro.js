! function () {

  'use strict';

  

  var Item        =   require('syn/models/Item');
  var Type        =   require('syn/models/Type');

  function getIntro () {
    
    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.emit('error', error);
    });
    
    domain.run(function () {

      socket.app.arte.emit('message', { socket: 'get intro' });

      Type
        
        .find({ name: 'Intro' })

        .exec()
        
        .then(function (Intro) {

          Item

            .findOne({ type: Intro._id })

            .exec()

            .then(function (intro) {

              intro.toPanelItem(domain.intercept(function (intro) {
                socket.emit('got intro', intro);
              }));

              
            });

        });
    });

  }

  module.exports = getIntro;

} ();
