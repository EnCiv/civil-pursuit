! function () {

  'use strict';

  function saveUserImage (socket, pronto, monson, domain) {
    
    socket.on('save user image', function (user, image) {
      
      var url = 'models/User.saveImage/' + user + '/' + image;

      monson.get(url)

        .on('error', domain.bind(function (error) {
          socket.emit('could not save user image', error);
        }))

        .on('success', function (item) {
          socket.emit('saved user image', item);
        });
      
    });
  
  }

  module.exports = saveUserImage;

} ();
