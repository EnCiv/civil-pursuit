! function () {

  'use strict';

  

  var Item        =   require('syn/models/item');
  var Type        =   require('syn/models/type');

  function getIntro (event) {
    
    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.emit('error', error);
    });
    
    domain.run(function () {

      Type
        
        .findOne({ name: 'Intro' })

        .exec()
        
        .then(function (Intro) {

          Item

            .findOne({ type: Intro._id })

            .exec()

            .then(function (intro) {

              if ( ! intro ) {
                // console.
              }

              intro.toPanelItem(domain.intercept(function (intro) {
                socket.ok(event, intro);
              }));

              
            });

        });
    });

  }

  module.exports = getIntro;

} ();
