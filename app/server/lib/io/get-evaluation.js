! function () {

  'use strict';

  function getEvaluation (socket, pronto, monson, domain) {
    
    socket.on('get evaluation', function (item, cb) {
      
      var url = 'models/Item.evaluate/' + item._id;

      monson.get(url)

        .on('error', domain.intercept(function () {}))

        .on('success', function (evaluation) {
          pronto.emit('message', 'socket got evaluation from monson');
          socket.emit('got evaluation', evaluation);
        });
    });

  }

  module.exports = getEvaluation;

} ();
