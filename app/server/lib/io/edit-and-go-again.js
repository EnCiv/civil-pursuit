! function () {

  'use strict';

  function editAndGoAgain (socket, pronto, monson, domain) {
    
    socket.on('edit and go again', function (item, cb) {
      
      var url = 'models/Item';

      monson.post(url, item)

        .on('error', domain.bind(function (error) {
          socket.emit('could not edit item', error);

          if ( typeof cb === 'function' ) {
            cb(error);
          }
        }))

        .on('success', function (item) {
          socket.emit('edited item', item);

          if ( typeof cb === 'function' ) {
            cb(null, item);
          }
        });
      
    });
  
  }

  module.exports = editAndGoAgain;

} ();
