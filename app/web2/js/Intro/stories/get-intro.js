! function () {
  
  'use strict';

  function getIntro () {

    var app = this;

    var Socket = app.importer.emitter('socket');

    Socket.once('connect',
      function onceSocketConnect () {
        if ( ! app.model('intro') ) {
          
          Socket.emit('get intro');

          Socket.on('got intro', function (intro) {
            app.model('intro', intro);
          });

          app.watch.on('update intro', function (intro) {
            app.render('intro', intro);
          });
          
          }
    });

  }

  module.exports = getIntro;

}();
