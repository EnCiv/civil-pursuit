! function () {

  'use strict';

  function getIntro (socket, pronto, monson) {
    
    socket.on('get intro', function (cb) {
      
      monson.get('models/Item.findOne?type=Intro')

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (intro) {
          socket.emit('got intro', intro);
        });

    });

  }

  module.exports = getIntro;

} ();
