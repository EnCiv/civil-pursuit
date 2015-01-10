! function () {

  'use strict';

  function getEvaluation (socket, pronto, monson) {
    
    socket.on('get evaluation', function (item, cb) {
      
      var url = 'models/Item.evaluate/' + item._id;

      monson.get(url)

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (evaluation) {
          pronto.emit('message', 'socket got evaluation from monson');
          socket.emit('got evaluation', evaluation);
        });
    });

  }

  module.exports = getEvaluation;

} ();
